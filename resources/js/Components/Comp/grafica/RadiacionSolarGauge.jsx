import React from "react";

function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = ((angleDeg - 180) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(cx, cy, r, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, r, startAngle);
  const end = polarToCartesian(cx, cy, r, endAngle);
  const largeArc = endAngle - startAngle <= 180 ? 0 : 1;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`;
}

function lerp(a, b, t) { return a + (b - a) * t; }
function hexToRgb(hex) {
  const h = hex.replace("#", "");
  const bigint = parseInt(h.length === 3 ? h.split("").map(c => c + c).join("") : h, 16);
  return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
}
function rgbToHex({ r, g, b }) {
  const toHex = (v) => v.toString(16).padStart(2, "0");
  return `#${toHex(Math.round(r))}${toHex(Math.round(g))}${toHex(Math.round(b))}`;
}
function mixHex(c1, c2, t) {
  const a = hexToRgb(c1);
  const b = hexToRgb(c2);
  return rgbToHex({ r: lerp(a.r, b.r, t), g: lerp(a.g, b.g, t), b: lerp(a.b, b.b, t) });
}
function greenYellowRed(t) {
  const green = "#2AFF00";
  const yellow = "#FFE600";
  const red = "#FF2A00";
  if (t < 0.5) return mixHex(green, yellow, t / 0.5);
  return mixHex(yellow, red, (t - 0.5) / 0.5);
}

export default function SolarRadiationGauge({
  value = 150,
  max = 1200,
  width = 320,
  height = 220,
  title = "Radiación solar",
  ticksStep = 100,
  segmentsCount = 18,
  strokeWidth = 26,
  innerColor = "transparent",
}) {
  const cx = width / 2;
  const cy = height * 0.70;
  const r = Math.min(width, height) * 0.55;

  const angleForValue = (v) => (v / max) * 180;

  const clamped = Math.max(0, Math.min(max, value));
  const needleAngle = angleForValue(clamped);
  const needle = polarToCartesian(cx, cy, r * 0.82, needleAngle);

  const segments = Array.from({ length: segmentsCount }, (_, i) => {
    const from = (i * max) / segmentsCount;
    const to = ((i + 1) * max) / segmentsCount;
    const t = i / (segmentsCount - 1);
    return { from, to, color: greenYellowRed(t) };
  });

  const ticks = [];
  for (let t = 0; t <= max; t += ticksStep) ticks.push(t);

  return (
    <svg width={width} height={height} style={{ display: "block" }}>

      {/* Arcos */}
      {segments.map((s, i) => (
        <path
          key={i}
          d={arcPath(cx, cy, r, angleForValue(s.from), angleForValue(s.to))}
          stroke={s.color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="butt"
        />
      ))}

      {/* Hueco interior: ponlo en transparent para que se vea el fondo del div */}
      <circle cx={cx} cy={cy} r={r - strokeWidth / 2} fill={innerColor} />

      {/* Etiquetas */}
      {ticks.map((v, i) => {
        const a = angleForValue(v);
        const p = polarToCartesian(cx, cy, r + 18, a);
        const rot = a - 90;
        return (
          <text
            key={i}
            x={p.x}
            y={p.y}
            fontSize="10"
            fill="#555"
            textAnchor="middle"
            dominantBaseline="middle"
            transform={`rotate(${rot} ${p.x} ${p.y})`}
          >
            {v}
          </text>
        );
      })}

      {/* Aguja */}
      <line
        x1={cx}
        y1={cy}
        x2={needle.x}
        y2={needle.y}
        stroke="#5D5D5D"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <circle cx={cx} cy={cy} r="6" fill="#5D5D5D" />
    </svg>
  );
}
