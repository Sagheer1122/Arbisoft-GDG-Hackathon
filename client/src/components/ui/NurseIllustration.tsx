import React from 'react';

interface NurseIllustrationProps {
  className?: string;
  size?: number;
}

export const NurseIllustration: React.FC<NurseIllustrationProps> = ({ className = '', size = 240 }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Background Soft Purple Glow */}
      <div className="absolute w-56 h-56 bg-[#EDE9FE] rounded-full blur-2xl opacity-70 -z-10" />
      <svg
        width={size}
        height={size}
        viewBox="0 0 240 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-lg"
      >
        {/* Soft Background Circle */}
        <circle cx="120" cy="120" r="100" fill="#EDE9FE" />
        
        {/* Stethoscope around neck */}
        <path
          d="M85 130 C85 170, 155 170, 155 130"
          stroke="#3D2DA8"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="155" cy="125" r="7" fill="#5142C5" />

        {/* Nurse Uniform / Shoulders */}
        <path
          d="M60 210 C60 160, 180 160, 180 210 L180 220 L60 220 Z"
          fill="#5142C5"
        />
        <path
          d="M100 160 L120 185 L140 160 Z"
          fill="#FFFFFF"
        />

        {/* Neck */}
        <rect x="108" y="130" width="24" height="35" rx="6" fill="#FAD0C4" />

        {/* Face */}
        <circle cx="120" cy="105" r="38" fill="#FFDFC4" />

        {/* Hair */}
        <path
          d="M82 105 C82 65, 158 65, 158 105 C158 85, 145 75, 120 75 C95 75, 82 85, 82 105 Z"
          fill="#3D2DA8"
        />

        {/* Nurse Cap */}
        <path
          d="M92 68 C92 52, 148 52, 148 68 L144 76 L96 76 Z"
          fill="#FFFFFF"
        />
        {/* Red/Purple Cross on Cap */}
        <rect x="117" y="58" width="6" height="14" fill="#5142C5" rx="1" />
        <rect x="113" y="62" width="14" height="6" fill="#5142C5" rx="1" />

        {/* Eyes & Smile */}
        <circle cx="107" cy="103" r="3.5" fill="#16162A" />
        <circle cx="133" cy="103" r="3.5" fill="#16162A" />
        <path
          d="M112 118 Q120 125 128 118"
          stroke="#16162A"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        
        {/* Cheeks */}
        <circle cx="100" cy="112" r="5" fill="#FFB7B2" opacity="0.6" />
        <circle cx="140" cy="112" r="5" fill="#FFB7B2" opacity="0.6" />
      </svg>
    </div>
  );
};
