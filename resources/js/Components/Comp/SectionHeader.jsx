import React from "react";

export default function SectionHeader({ title, subtitle, right }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        <div className="text-white font-extrabold text-lg">{title}</div>
        {subtitle ? <div className="text-xs text-white/60 mt-0.5">{subtitle}</div> : null}
      </div>
      {right ? <div>{right}</div> : null}
    </div>
  );
}
