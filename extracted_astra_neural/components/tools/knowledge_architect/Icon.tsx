
import React from "react";
import { CourseBlockType } from "../../../types";

interface IconProps {
  name: CourseBlockType | string;
  size?: number;
  className?: string;
}

export const KAIcon: React.FC<IconProps> = ({ name, size = 18, className = "" }) => {
  const style = { width: size, height: size };
  
  // Minimalist geometric shapes representing abstract concepts for "The Core" aesthetic
  switch (name) {
    case "idea": // The Spark / Philosophy
      return (
        <svg style={style} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 2V4" />
          <path d="M12 20V22" />
          <path d="M4.93 4.93L6.34 6.34" />
          <path d="M17.66 17.66L19.07 19.07" />
          <path d="M2 12H4" />
          <path d="M20 12H22" />
          <path d="M4.93 19.07L6.34 17.66" />
          <path d="M17.66 6.34L19.07 4.93" />
        </svg>
      );
    case "ejemplo": // Evidence / Case Study
      return (
        <svg style={style} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
      );
    case "actividad": // Execution / Strategy
      return (
        <svg style={style} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      );
    case "test": // Validation / Audit
      return (
        <svg style={style} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <path d="M9 15l2 2 4-4" />
        </svg>
      );
    case "lock":
       return (
         <svg style={style} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
         </svg>
       );
    default:
      return <div style={style} />;
  }
};
