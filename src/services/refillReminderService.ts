import { Prescription, MedicineRefillReminder, Notification } from '../types';
import { StorageService } from '../lib/storage';

// Current reference date for calculations (defaults to current date or simulation 2026-09-29)
export const getReferenceDate = (): Date => {
  return new Date('2026-09-29T00:00:00');
};

/**
 * Calculates remaining days between reference date and next refill date
 */
export const calculateRemainingDays = (nextRefillDateStr: string, refDate: Date = getReferenceDate()): number => {
  const refillDate = new Date(`${nextRefillDateStr}T00:00:00`);
  const diffTime = refillDate.getTime() - refDate.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Formats standard message according to user specification:
 * - 7 days: "Your monthly medicine refill is due in 7 days."
 * - 3 days: "Your monthly medicine refill is due in 3 days."
 * - 1 day: "Your monthly medicine refill is due in 1 day."
 * - 0 days (On refill date): "Your monthly medicine refill is due today."
 */
export const getRefillReminderMessage = (remainingDays: number, medicineName?: string): string => {
  if (remainingDays === 0) {
    return 'Your monthly medicine refill is due today.';
  }
  if (remainingDays === 1) {
    return 'Your monthly medicine refill is due in 1 day.';
  }
  if (remainingDays === 3) {
    return 'Your monthly medicine refill is due in 3 days.';
  }
  if (remainingDays === 7) {
    return 'Your monthly medicine refill is due in 7 days.';
  }
  return `Your monthly medicine refill is due in ${remainingDays} days.`;
};

/**
 * Evaluates prescriptions and generates reminders for 7 days, 3 days, 1 day, and on refill date (0 days)
 */
export const generateRefillReminders = (patientId: string): MedicineRefillReminder[] => {
  const prescriptions = StorageService.getPrescriptions().filter(
    p => p.patientId === patientId && p.status === 'active'
  );

  const refDate = getReferenceDate();
  const reminders: MedicineRefillReminder[] = [];

  prescriptions.forEach(rx => {
    // If no explicit nextRefillDate, default based on start date or 30 days
    const refillDateStr = rx.nextRefillDate || '2026-10-02';
    const remainingDays = calculateRemainingDays(refillDateStr, refDate);

    // Reminder schedule triggers: 7 days, 3 days, 1 day, or On refill date (0 days)
    // We also include imminent refills (0 to 7 days)
    const isScheduleMatch = [7, 3, 1, 0].includes(remainingDays) || (remainingDays >= 0 && remainingDays <= 7);

    if (isScheduleMatch) {
      let urgency: 'low' | 'medium' | 'high' | 'critical' = 'low';
      if (remainingDays === 0) urgency = 'critical';
      else if (remainingDays === 1) urgency = 'high';
      else if (remainingDays <= 3) urgency = 'medium';

      reminders.push({
        id: `reminder-${rx.id}-${remainingDays}d`,
        prescriptionId: rx.id,
        patientId: rx.patientId,
        medicine: rx.medicine,
        dosage: rx.dosage,
        remainingDays,
        nextRefillDate: refillDateStr,
        prescribingDoctor: rx.doctorName,
        department: rx.department,
        message: getRefillReminderMessage(remainingDays, rx.medicine),
        urgency,
        status: (rx.refillStatus as any) || 'pending',
        createdAt: new Date().toISOString(),
      });
    }
  });

  // Sort reminders by remaining days ascending (0 days first)
  reminders.sort((a, b) => a.remainingDays - b.remainingDays);

  return reminders;
};

/**
 * Automatically ensures notifications exist in system for approaching refills
 */
export const syncRefillNotifications = (patientId: string, userId: string): void => {
  const reminders = generateRefillReminders(patientId);
  const existingNotifs = StorageService.getNotifications();

  reminders.forEach(reminder => {
    const notifKey = `refill-notif-${reminder.prescriptionId}-${reminder.remainingDays}d`;
    const alreadyExists = existingNotifs.some(n => n.id === notifKey);

    if (!alreadyExists) {
      const newNotif: Notification = {
        id: notifKey,
        userId,
        title: `Medicine Refill Reminder: ${reminder.medicine}`,
        message: `${reminder.message} (${reminder.dosage} prescribed by ${reminder.prescribingDoctor})`,
        type: 'prescription',
        read: false,
        timestamp: new Date().toISOString(),
        link: '/patient/prescriptions',
      };
      StorageService.addNotification(newNotif);
    }
  });
};

/**
 * Executes a refill request
 */
export const submitRefillRequest = (prescriptionId: string, patientName: string): boolean => {
  const prescriptions = StorageService.getPrescriptions();
  const targetRx = prescriptions.find(p => p.id === prescriptionId);
  if (!targetRx) return false;

  const updated: Prescription = {
    ...targetRx,
    refillStatus: 'requested',
    refillsRemaining: Math.max(0, (targetRx.refillsRemaining || 1) - 1),
  };

  StorageService.updatePrescription(updated);

  // Add system audit log
  StorageService.addAuditLog({
    id: `audit-${Date.now()}`,
    timestamp: new Date().toISOString(),
    userId: targetRx.patientId,
    userName: patientName,
    userRole: 'patient',
    action: 'PRESCRIPTION_REFILL_REQUEST',
    resource: `${targetRx.medicine} ${targetRx.dosage}`,
    ipAddress: '127.0.0.1',
    status: 'success',
    details: `Patient requested monthly refill for ${targetRx.medicine}. Routed to ${targetRx.doctorName} and Central Pharmacy.`,
  });

  // Create pharmacy confirmation notification
  StorageService.addNotification({
    id: `notif-refill-req-${Date.now()}`,
    userId: targetRx.patientId,
    title: `Refill Request Placed: ${targetRx.medicine}`,
    message: `Your refill request for ${targetRx.medicine} has been sent to ${targetRx.doctorName}. Estimated processing: 24 hours.`,
    type: 'prescription',
    read: false,
    timestamp: new Date().toISOString(),
  });

  return true;
};
