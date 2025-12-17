import React from "react";

export default function BrujulaViento({ deg = 210, size = 220 }) {
    return (
        <div className="flex items-center justify-center text-gray-900 dark:text-white">
            <svg width={size} height={size} viewBox="0 0 220 220">
                <circle
                    cx="110"
                    cy="110"
                    r="78"
                    fill="none"
                    stroke="currentColor"
                    strokeOpacity={0.25}
                    strokeWidth="6"
                />
                <circle
                    cx="110"
                    cy="110"
                    r="52"
                    fill="none"
                    stroke="currentColor"
                    strokeOpacity={0.18}
                    strokeWidth="6"
                />

                <text
                    x="110"
                    y="20"
                    textAnchor="middle"
                    fontSize="14"
                    fill="currentColor"
                    fillOpacity={0.65}
                    fontWeight="700"
                >
                    N
                </text>
                <text
                    x="200"
                    y="114"
                    textAnchor="middle"
                    fontSize="14"
                    fill="currentColor"
                    fillOpacity={0.65}
                    fontWeight="700"
                >
                    E
                </text>
                <text
                    x="110"
                    y="212"
                    textAnchor="middle"
                    fontSize="14"
                    fill="currentColor"
                    fillOpacity={0.65}
                    fontWeight="700"
                >
                    S
                </text>
                <text
                    x="20"
                    y="114"
                    textAnchor="middle"
                    fontSize="14"
                    fill="currentColor"
                    fillOpacity={0.65}
                    fontWeight="700"
                >
                    W
                </text>

                <g transform="translate(110 110)">
                    <path
                        d="M0,-60 L10,-10 L60,0 L10,10 L0,60 L-10,10 L-60,0 L-10,-10 Z"
                        fill="rgba(255,255,255,.35)"
                    />
                    <circle
                        cx="0"
                        cy="0"
                        r="10"
                        fill="rgba(15,23,42,.95)"
                        stroke="rgba(255,255,255,.25)"
                        strokeWidth="4"
                    />
                </g>

                <g transform={`translate(110 110) rotate(${deg})`}>
                    <path d="M0,10 L-8,40 L0,34 L8,40 Z" fill="#E53935" />
                </g>
            </svg>
        </div>
    );
}
