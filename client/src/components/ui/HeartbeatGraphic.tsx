import React from 'react';

interface HeartbeatGraphicProps {
  className?: string;
  color?: string;
}

export const HeartbeatGraphic: React.FC<HeartbeatGraphicProps> = ({
  className = '',
  color = '#5142C5',
}) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg
        width="160"
        height="40"
        viewBox="0 0 160 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 20 H40 L45 10 L52 32 L60 2 L68 26 L74 16 L80 20 H160"
          stroke={color}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="animate-pulse"
        />
      </svg>
    </div>
  );
};
