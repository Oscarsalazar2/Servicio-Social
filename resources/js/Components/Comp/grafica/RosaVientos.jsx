import React, { 
  useMemo, 
  useRef, 
  useEffect, 
  useState } from "react";

  
const datos_simulados = true;

const DIRS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
//Rangos de velocidad y colores de cada uno
const SPEED_BINS = [
  { key: "b0_10", label: "0-10 km/h", min: 0, max: 10, color: "#F4F46A" },
  { key: "b10_20", label: "10-20 km/h", min: 10, max: 20, color: "#FFD21A" },
  { key: "b20_30", label: "20-30 km/h", min: 20, max: 30, color: "#FF8A00" },
  { key: "b30_40", label: "30-40 km/h", min: 30, max: 40, color: "#FF1E1E" },
];

// Convierte grados a los 8 puntos cardinales
function degToDir8(deg) {
  const d = ((deg % 360) + 360) % 360;
  const idx = Math.round(d / 45) % 8;
  return DIRS[idx];
}
// Asigna la velocidad a un bin
function speedToBinKey(speedKmh) {
  for (const b of SPEED_BINS) if (speedKmh >= b.min && speedKmh < b.max) return b.key;
  return null;
}

function aggregateWindRose(samples, { normalize = false } = {}) {
  const base = DIRS.map((dir) => {
    const row = { dir };
    for (const b of SPEED_BINS) row[b.key] = 0;
    return row;
  });
  if (!Array.isArray(samples) || samples.length === 0) return base;

  
  const dirIndex = new Map(DIRS.map((d, i) => [d, i]));
  let total = 0;

  for (const s of samples) {
    const speed = Number(s?.speedKmh);
    const deg = Number(s?.directionDeg);
    if (!Number.isFinite(speed) || !Number.isFinite(deg) || speed < 0) continue;
//Convierte los grados a DIR y lo asigna al bin
    const dir = degToDir8(deg);
    const binKey = speedToBinKey(speed);
    if (!binKey) continue;

    base[dirIndex.get(dir)][binKey] += 1;
    total += 1;
  }

  if (!normalize || total === 0) return base;

  for (const row of base) {
    for (const b of SPEED_BINS) row[b.key] = (row[b.key] / total) * 100;
  }
  return base;
}
function generadorDatos() {
  const dirWeight = { N: 6, NE: 8, E: 18, SE: 22, S: 70, SW: 55, W: 10, NW: 7 };
  const binShare = { b0_10: 0.55, b10_20: 0.28, b20_30: 0.13, b30_40: 0.04 };
  const noise = (x) => x * (0.92 + Math.random() * 0.16);

  return DIRS.map((dir) => {
    const total = noise(dirWeight[dir] ?? 10);
    const row = { dir };
    for (const b of SPEED_BINS) row[b.key] = Math.round(total * (binShare[b.key] ?? 0));
    return row;
  });
}

// Convierte coordenadas polares a cartesianas
function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180; 
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(cx, cy, rOuter, rInner, startAngle, endAngle) {
  const a0 = polarToCartesian(cx, cy, rOuter, startAngle);
  const a1 = polarToCartesian(cx, cy, rOuter, endAngle);
  const b0 = polarToCartesian(cx, cy, rInner, endAngle);
  const b1 = polarToCartesian(cx, cy, rInner, startAngle);

  const largeArc = Math.abs(endAngle - startAngle) > 180 ? 1 : 0;
// Para hacer los sectores como rebanadas
  return [
    `M ${a0.x} ${a0.y}`,
    `A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${a1.x} ${a1.y}`,
    `L ${b0.x} ${b0.y}`,
    `A ${rInner} ${rInner} 0 ${largeArc} 0 ${b1.x} ${b1.y}`,
    "Z",
  ].join(" ");
}

function maxStack(data) {
  let m = 0;
  for (const row of data) {
    const s = SPEED_BINS.reduce((acc, b) => acc + (Number(row[b.key]) || 0), 0);
    m = Math.max(m, s);
  }
  return m || 10;
}


export default function WindRoseSVG({
  title = "Rosa de Viento",
  width: fixedWidth,        
  height: fixedHeight,      
  realSamples = [],
  normalizeReal = false,    // false conteos, true %
  maxWidth = 520,           // límite superior de ancho
}) {
  const containerRef = useRef(null);
//tamaño del SVG
  const [size, setSize] = useState({ w: fixedWidth ?? 640, h: fixedHeight ?? 420 });
// Modo oscuro y eso, es que no se que hice
  const [isDark, setIsDark] = useState(() => {
    return document.documentElement.classList.contains('dark') || 
           window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Detectar cambios de clase dark en el documento
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    // Detectar cambios de preferencia del sistema
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleMediaChange = (e) => {
      if (!document.documentElement.classList.contains('dark')) {
        setIsDark(e.matches);
      }
    };
    mediaQuery.addEventListener('change', handleMediaChange);

    //tenia errores con el tamaño
    const update = () => {
      const rawWidth = fixedWidth ?? el.clientWidth;
      const w = Math.min(rawWidth, maxWidth);
      const aspect = w < 480 ? 1 : 0.66;
      const h = fixedHeight ?? Math.max(260, Math.round(w * aspect));
      setSize({ w, h });
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      ro.disconnect();
      observer.disconnect();
      mediaQuery.removeEventListener('change', handleMediaChange);
    };
  }, [fixedWidth, fixedHeight, maxWidth]);

  const data = useMemo(() => {
    if (datos_simulados) return generadorDatos();
    return aggregateWindRose(realSamples, { normalize: normalizeReal });
  }, [realSamples, normalizeReal]);
//Para definir el radio máximo
  const maxVal = useMemo(
    () => (normalizeReal && !datos_simulados ? 100 : maxStack(data)),
    [data, normalizeReal]
  );


  const width = size.w;
  const height = size.h;

  const cx = width / 2;
  const cy = height / 2 + height * 0.05;
  const outerR = Math.min(width, height) * 0.33;
  const innerR = outerR * 0.10;
//Cantidad de anillos y las etiquetas con los valores
  const rings = 7;
  const ringValues = Array.from({ length: rings + 1 }, (_, i) => i * 10);
  const ringStep = (outerR - innerR) / rings;
  const sectorSize = 360 / 8;
  const valueToRadius = (v) => innerR + ((outerR - innerR) * v) / maxVal;


  const isSmall = width < 520;
  const titleFont = isSmall ? 14 : 16;
  const legendFont = isSmall ? 11 : 12;
  const dirFont = isSmall ? 11 : 12;
  const ringFont = isSmall ? 10 : 11;

  const legendItemWidth = isSmall ? 140 : 120;
  const legendRowHeight = 18;
  const legendCols = isSmall ? 2 : SPEED_BINS.length;
  const legendX = Math.max(8, cx - (legendItemWidth * Math.min(SPEED_BINS.length, legendCols)) / 2);
  const legendY = 8;

  
  return (
    //Recuadro
    <div className="rounded-2xl shadow-sm border p-4 bg-white/5 backdrop-blur border-white/10 dark:bg-slate-900/40 dark:border-white/10" style={{ boxSizing: "border-box" }}>
      <div
        ref={containerRef}
        style={{
          width: "100%",
          maxWidth,
          margin: "0 auto",
          boxSizing: "border-box",
        }}
      >
        {/*Titulo */}
        <div
          style={{
            fontWeight: 700,
            marginBottom: 8,
            fontSize: titleFont,
            lineHeight: 1.2,
            textAlign: "center",
            color: isDark ? "#f4f5f6ff" : "#1f2937",
          }}
        >
          {title}
        </div>

        <svg
          width="100%"
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="xMidYMid meet"
          style={{ display: "block" }}
        >
        {/* Representación de los colores para cada bin de velocidad */}
        <g transform={`translate(${legendX}, ${legendY})`}>
          {SPEED_BINS.map((b, i) => {
            const col = i % legendCols;
            const row = Math.floor(i / legendCols);
            const x = col * legendItemWidth;
            const y = row * legendRowHeight;

            return (
              <g key={b.key} transform={`translate(${x}, ${y})`}>
                <rect x="0" y="0" width="18" height="10" rx="2" fill={b.color} />
                <text x="24" y="10" fontSize={legendFont} fill="#444">
                  {b.label}
                </text>
              </g>
            );
          })}
        </g>
{/* Definición del clip para limitar el dibujo al círculo exterior 
        <defs>
          <clipPath id="roseClip">
            <circle cx={cx} cy={cy} r={outerR} />
          </clipPath>
        </defs>*/}

          {/* Visualizacion de los datos (columnas coloreadas) */}
        <g clipPath="url(#roseClip)" pointerEvents="none">
          {data.map((row, i) => {
            const centerAngle = i * sectorSize;
            const start = centerAngle - sectorSize / 2;
            const end = centerAngle + sectorSize / 2;

            let acc = 0;
            return SPEED_BINS.map((b) => {
              const v = Number(row[b.key]) || 0;
              const r0 = valueToRadius(acc);
              const r1 = valueToRadius(acc + v);
              acc += v;

              if (r1 <= r0 + 0.001) return null;

              return (
                <path
                  key={`${row.dir}-${b.key}`}
                  d={arcPath(cx, cy, r1, r0, start, end)}
                  fill={b.color}
                  stroke="none"
                  opacity="1"
                />
              );
            });
          })}
        </g>
        {/* Lineas del circulo y etiquetas */}
        <g>
          {Array.from({ length: rings + 1 }, (_, i) => {
            const r = innerR + i * ringStep;
            return (
              <circle
                key={i}
                cx={cx}
                cy={cy}
                r={r}
                fill="none"
                stroke="#D9D9D9"
                strokeWidth={isSmall ? 0.8 : 1}
              />
            );
          })}
          
          {DIRS.map((d, i) => {
            const angle = i * sectorSize;
            const p = polarToCartesian(cx, cy, outerR, angle);
            return (
              <line
                key={d}
                x1={cx}
                y1={cy}
                x2={p.x}
                y2={p.y}
                stroke="#D9D9D9"
                strokeWidth={isSmall ? 0.8 : 1}
              />
            );
          })}

          <g>
            {ringValues.map((v, i) => {
              const r = innerR + i * ringStep;
              return (
                <text
                  key={v}
                  x={cx - 6}
                  y={cy - r + 4}
                  fontSize={ringFont}
                  fill="#9AA0A6"
                  textAnchor="end"
                  
                >
                  {v}
                </text>
              );
            })}
          </g>
          
          {DIRS.map((d, i) => {
            const angle = i * sectorSize;
            const p = polarToCartesian(cx, cy, outerR + (isSmall ? 14 : 18), angle);
            return (
              <text
                key={d}
                x={p.x}
                y={p.y}
                fontSize={dirFont}
                fill="#666"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {d}
              </text>
            );
          })}
        </g>
        {/* Centro del círculo */}
        <circle cx={cx} cy={cy} r={isSmall ? 1 : 1.2} fill="#777" />
      </svg>
  
    </div>
    </div>
  );
}