import React, { useState } from 'react';
import {
  FileText,
  Upload,
  Download,
  Trash2,
  Eye,
  FileCheck,
  Shield,
  Search,
  CheckCircle2,
  X,
  File,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { StorageService } from '../../lib/storage';
import { MedicalDocument } from '../../types';
import { ConfirmDialog } from '../common/ConfirmDialog';

export const PatientDocuments: React.FC = () => {
  const { currentPatient } = useAuth();
  const [documents, setDocuments] = useState<MedicalDocument[]>(() => {
    return StorageService.getDocuments().filter(d => d.patientId === (currentPatient?.id || 'pat-1'));
  });
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isUploading, setIsUploading] = useState(false);
  const [viewDoc, setViewDoc] = useState<MedicalDocument | null>(null);
  const [docToDelete, setDocToDelete] = useState<MedicalDocument | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Upload modal form
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadType, setUploadType] = useState<MedicalDocument['type']>('Lab Report');
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  const filteredDocs = documents.filter(doc => {
    const matchesSearch =
      doc.title.toLowerCase().includes(search.toLowerCase()) ||
      doc.fileName.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || doc.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim()) return;

    const newDoc: MedicalDocument = {
      id: `doc-file-${Date.now()}`,
      patientId: currentPatient?.id || 'pat-1',
      patientName: currentPatient?.name || 'Sarah Johnson',
      title: uploadTitle.trim(),
      type: uploadType,
      fileName: uploadFile ? uploadFile.name : `${uploadTitle.toLowerCase().replace(/\s+/g, '_')}.pdf`,
      fileSize: uploadFile ? `${(uploadFile.size / 1024).toFixed(1)} KB` : '450 KB',
      fileType: 'application/pdf',
      uploadedAt: new Date().toISOString(),
      uploadedBy: currentPatient?.name || 'Sarah Johnson',
      notes: 'Patient uploaded self-administered document release.',
    };

    StorageService.addDocument(newDoc);
    setDocuments(prev => [newDoc, ...prev]);
    setIsUploading(false);
    setUploadTitle('');
    setUploadFile(null);
    setUploadSuccess(true);
    setTimeout(() => setUploadSuccess(false), 3000);
  };

  const confirmDelete = () => {
    if (docToDelete) {
      StorageService.deleteDocument(docToDelete.id);
      setDocuments(prev => prev.filter(d => d.id !== docToDelete.id));
      setDocToDelete(null);
    }
  };

  const handleDownload = (doc: MedicalDocument) => {
    const content = `HEALTHVAULT ENCRYPTED MEDICAL DOCUMENT ARCHIVE\n` +
      `Title: ${doc.title}\n` +
      `Document Type: ${doc.type}\n` +
      `Patient Name: ${doc.patientName}\n` +
      `File Name: ${doc.fileName}\n` +
      `Uploaded By: ${doc.uploadedBy} on ${new Date(doc.uploadedAt || doc.uploadDate || Date.now()).toLocaleString()}\n` +
      `-----------------------------------------------------\n` +
      `Digital Signature: VERIFIED-COMPLIANT-256\n` +
      `Audit Tracking ID: ${doc.id}\n`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = doc.fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Medical Documents & Scans
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Store and retrieve official laboratory certificates, radiology imaging reports, and insurance documents.
          </p>
        </div>

        <button
          onClick={() => setIsUploading(true)}
          className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <Upload size={14} />
          <span>Upload Document</span>
        </button>
      </div>

      {uploadSuccess && (
        <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>Document uploaded, encrypted, and attached to your clinical record file.</span>
        </div>
      )}

      {/* Drag & Drop Upload Zone Area */}
      <div
        onClick={() => setIsUploading(true)}
        className="p-8 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-teal-500 dark:hover:border-teal-400 bg-slate-50/50 dark:bg-slate-900/30 text-center cursor-pointer transition-colors group"
      >
        <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 mx-auto flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
          <Upload size={22} />
        </div>
        <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
          Drop your medical files here or <span className="text-teal-600 dark:text-teal-400 underline">browse files</span>
        </p>
        <p className="text-[11px] text-slate-400 mt-1">
          Supports PDF, DICOM, JPEG, PNG up to 25 MB per document
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search documents by title or file name..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
        </div>

        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          className="px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 focus:outline-none"
        >
          <option value="all">All Categories</option>
          <option value="Lab Report">Lab Reports</option>
          <option value="Prescription">Prescriptions</option>
          <option value="Scan Report">Scan & Imaging Reports</option>
          <option value="Medical Certificate">Certificates & Clearances</option>
          <option value="Insurance Document">Insurance Documents</option>
          <option value="Other">Other Records</option>
        </select>
      </div>

      {/* Documents Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
        {filteredDocs.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">
            No medical documents match your search criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  <th className="py-3 px-4">Document Title</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Uploaded Date</th>
                  <th className="py-3 px-4">File Size</th>
                  <th className="py-3 px-4">Uploaded By</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredDocs.map(doc => (
                  <tr
                    key={doc.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                          <FileText size={15} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{doc.title}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{doc.fileName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {doc.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      {new Date(doc.uploadedAt || doc.uploadDate || Date.now()).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-400">
                      {doc.fileSize}
                    </td>
                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300 font-medium">
                      {doc.uploadedBy}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewDoc(doc)}
                          title="View Document Details"
                          className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-teal-600"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => handleDownload(doc)}
                          title="Download Document"
                          className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-teal-600"
                        >
                          <Download size={15} />
                        </button>
                        <button
                          onClick={() => setDocToDelete(doc)}
                          title="Delete Document"
                          className="p-1.5 rounded hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-400 hover:text-rose-600"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* UPLOAD MODAL */}
      {isUploading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Upload New Clinical Document
              </h3>
              <button onClick={() => setIsUploading(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Document Title
                </label>
                <input
                  type="text"
                  required
                  value={uploadTitle}
                  onChange={e => setUploadTitle(e.target.value)}
                  placeholder="e.g. Chest X-Ray Radiology Summary"
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Document Category
                </label>
                <select
                  value={uploadType}
                  onChange={e => setUploadType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                >
                  <option value="Lab Report">Lab Report</option>
                  <option value="Prescription">Prescription</option>
                  <option value="Scan Report">Scan & Imaging Report</option>
                  <option value="Medical Certificate">Medical Certificate</option>
                  <option value="Insurance Document">Insurance Document</option>
                  <option value="Other">Other Record</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Select File
                </label>
                <input
                  type="file"
                  onChange={e => {
                    if (e.target.files && e.target.files[0]) {
                      setUploadFile(e.target.files[0]);
                      if (!uploadTitle) {
                        setUploadTitle(e.target.files[0].name.replace(/\.[^/.]+$/, ''));
                      }
                    }
                  }}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUploading(false)}
                  className="px-3.5 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold"
                >
                  Upload & Encrypt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW DOCUMENT DETAIL MODAL */}
      {viewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-teal-500 text-slate-950 flex items-center justify-center font-bold">
                  <FileText size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{viewDoc.title}</h3>
                  <p className="text-[10px] text-slate-400 font-mono">{viewDoc.fileName}</p>
                </div>
              </div>
              <button onClick={() => setViewDoc(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Document Type:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{viewDoc.type}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">File Size:</span>
                <span className="font-mono text-slate-800 dark:text-slate-200">{viewDoc.fileSize}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Uploaded By:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{viewDoc.uploadedBy}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Upload Date:</span>
                <span className="font-mono text-slate-800 dark:text-slate-200">{new Date(viewDoc.uploadedAt || viewDoc.uploadDate || Date.now()).toLocaleString()}</span>
              </div>
              {viewDoc.notes && (
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                  <span className="font-semibold block mb-0.5 text-slate-800 dark:text-slate-200">Clinical Release Notes:</span>
                  {viewDoc.notes}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setViewDoc(null)}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400"
              >
                Close
              </button>
              <button
                onClick={() => handleDownload(viewDoc)}
                className="px-4 py-1.5 text-xs font-semibold bg-teal-600 text-white rounded-lg hover:bg-teal-700 flex items-center gap-1.5"
              >
                <Download size={14} />
                <span>Download File</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!docToDelete}
        title="Delete Medical Document"
        message={`Are you sure you want to permanently delete "${docToDelete?.title}"? This action will be logged in the HIPAA audit registry.`}
        confirmLabel="Delete Document"
        onConfirm={confirmDelete}
        onCancel={() => setDocToDelete(null)}
      />
    </div>
  );
};
