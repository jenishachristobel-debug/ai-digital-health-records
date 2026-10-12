import React from 'react';

interface EKGLineProps {
  className?: string;
  height?: number;
  color?: string;
  opacity?: number;
}

export const EKGLine: React.FC<EKGLineProps> = ({
  className = '',
  height = 40,
  color = '#0d9488', // Teal-600 default
  opacity = 0.45,
}) => {
  return (
    <div className={`w-full overflow-hidden pointer-events-none select-none ${className}`}>
      <svg
        viewBox="0 0 1000 60"
        className="w-full h-full preserve-3d"
        style={{ height: `${height}px`, opacity }}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 30 L120 30 L135 15 L145 48 L155 8 L168 40 L178 28 L190 30 L320 30 L335 15 L345 48 L355 8 L368 40 L378 28 L390 30 L520 30 L535 15 L545 48 L555 8 L568 40 L578 28 L590 30 L720 30 L735 15 L745 48 L755 8 L768 40 L778 28 L790 30 L920 30 L935 15 L945 48 L955 8 L968 40 L978 28 L1000 30"
          stroke={color}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="animate-ekg-flow"
        />
      </svg>
    </div>
  );
};
