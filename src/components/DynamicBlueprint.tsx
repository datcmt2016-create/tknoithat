import React, { useEffect, useId, useRef, useState } from 'react';

interface DynamicBlueprintProps {
  length: number | string; // Dài (cm)
  width: number | string; // Rộng (cm)
  height: number | string; // Cao (cm)
  name: string; // Tên sản phẩm
  itemName?: string; // Tên tùy chọn / phiên bản (vd: "Sofa góc L")
  categoryId?: string; // Danh mục, dùng khi tên sản phẩm chưa đủ để nhận diện
  code?: string;
  className?: string;
}

// Bảng màu giấy kỹ thuật + Japandi
const C = {
  paper: '#FBF4E4',
  gridMinor: '#C9B99A',
  gridMajor: '#B59F78',
  line: '#5A3F29',
  fill: '#EAD8B8',
  cush: '#F6ECD8',
  inner: '#8A6A4A',
  dark: '#B89B73',
  dim: '#A0522D',
  text: '#3B2A1C',
  muted: '#7A6650'
};

const MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
const SERIF = "'Playfair Display', Georgia, serif";

// ---------------------------------------------------------------------------
// Nhận diện loại sản phẩm
// ---------------------------------------------------------------------------
export type FurnitureKind =
  | 'sofa' | 'bed' | 'daybed' | 'table' | 'chair'
  | 'cabinet' | 'shelf' | 'nightstand' | 'generic';

const norm = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd');

export const classifyProduct = (name: string, categoryId?: string): FurnitureKind => {
  const n = norm(name);
  if (/daybed|tam nang/.test(n)) return 'daybed';
  if (/(^|\s)(den|tham|tuong)(\s|$)/.test(n)) return 'generic';
  if (/sofa|armchair/.test(n)) return 'sofa';
  if (/(tab|tu) dau giuong/.test(n)) return 'nightstand';
  if (/giuong/.test(n)) return 'bed';
  if (/ke sach/.test(n)) return 'shelf';
  if (/ke (tivi|tv)|buffet|dao bep|(^|\s)tu(\s|$)/.test(n)) return 'cabinet';
  if (/(^|\s)ban(\s|$)/.test(n)) return 'table';
  if (/(^|\s)ghe(\s|$)/.test(n)) return 'chair';
  switch (categoryId) {
    case 'cat-sofa': return 'sofa';
    case 'cat-ban': return 'table';
    case 'cat-ghe': return 'chair';
    case 'cat-giuong': return 'bed';
    case 'cat-tu-ke':
    case 'cat-bep': return 'cabinet';
    default: return 'generic';
  }
};

interface Flags {
  seats: number; // số chỗ ngồi / khối đệm
  isL: boolean; // sofa góc chữ L
  doors: number; // số cánh tủ
  tiers: number; // số tầng kệ
  pedestal: boolean; // bàn có tủ phụ
  swivel: boolean; // ghế xoay văn phòng
  bar: boolean; // ghế bar
  stone: boolean; // mặt đá
  glass: boolean; // cánh kính
}

const parseFlags = (kind: FurnitureKind, name: string, itemName: string, A: number): Flags => {
  const n = norm(`${name} ${itemName}`);
  const straight = /thang/.test(norm(itemName)); // phiên bản băng thẳng của dòng sofa góc
  const isL = kind === 'sofa' && !straight && /(^|\s)l(\s|-|$)|goc|l-shape|modul/.test(n);
  const explicit = n.match(/(\d)\s*(cho|khoi)/);
  const seats = explicit
    ? Math.min(5, Math.max(1, parseInt(explicit[1], 10)))
    : Math.min(4, Math.max(1, Math.round(A / 75)));
  const doorsMatch = n.match(/(\d+)\s*canh/);
  const tiersMatch = n.match(/(\d+)\s*tang/);
  const doors = doorsMatch ? Math.min(8, Math.max(1, parseInt(doorsMatch[1], 10))) : A >= 160 ? 4 : A >= 90 ? 2 : 1;
  return {
    seats,
    isL,
    doors,
    tiers: tiersMatch ? Math.min(8, Math.max(2, parseInt(tiersMatch[1], 10))) : 4,
    pedestal: /tu phu/.test(n),
    swivel: /xoay|cong thai/.test(n),
    bar: /ghe bar|(^|\s)bar(\s|$)/.test(n),
    stone: /(^|\s)da(\s|$)|cam thach|carrara|calacatta/.test(n),
    glass: /kinh/.test(n)
  };
};

// ---------------------------------------------------------------------------
// Nét vẽ cơ bản
// ---------------------------------------------------------------------------
interface Ctx {
  uid: string;
  s: number; // px / cm
  A: number; // cm, chiều ngang của mặt đứng chính và mặt bằng
  B: number; // cm, chiều ngang mặt đứng cạnh / chiều dọc mặt bằng
  H: number;
  f: Flags;
}

interface Box { x: number; y: number; w: number; h: number }

const Part = ({
  x, y, w, h, fill = C.fill, rx = 0, sw = 1.4, hatch, uid
}: Box & { fill?: string; rx?: number; sw?: number; hatch?: boolean; uid?: string }) =>
  w > 0.5 && h > 0.5 ? (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={rx} fill={fill} />
      {hatch && uid && <rect x={x} y={y} width={w} height={h} rx={rx} fill={`url(#hatch${uid})`} />}
      <rect x={x} y={y} width={w} height={h} rx={rx} fill="none" stroke={C.line} strokeWidth={sw} />
    </g>
  ) : null;

const Ln = ({ x1, y1, x2, y2, sw = 0.9, c = C.inner, dash, op }: {
  x1: number; y1: number; x2: number; y2: number; sw?: number; c?: string; dash?: string; op?: number;
}) => <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={c} strokeWidth={sw} strokeDasharray={dash} opacity={op} />;

const Shape = ({ d, fill = C.fill, sw = 1.4, hatch, uid }: { d: string; fill?: string; sw?: number; hatch?: boolean; uid?: string }) => (
  <g>
    <path d={d} fill={fill} />
    {hatch && uid && <path d={d} fill={`url(#hatch${uid})`} />}
    <path d={d} fill="none" stroke={C.line} strokeWidth={sw} strokeLinejoin="round" />
  </g>
);

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

// ---------------------------------------------------------------------------
// SOFA / ARMCHAIR
// ---------------------------------------------------------------------------
const sofaFront = (b: Box, c: Ctx) => {
  const { x, y, w, h } = b;
  const { s, uid, f, A } = c;
  const legH = Math.max(6, h * 0.11);
  const bodyH = h - legH;
  const aw = Math.max(8, Math.min(w * 0.1, 18 * s));
  const armTop = y + bodyH * 0.32;
  const seatTop = y + bodyH * 0.55;
  const baseH = Math.max(6, bodyH * 0.13);
  const baseY = y + bodyH - baseH;
  const armR = !f.isL;
  const n = f.isL ? Math.max(1, f.seats - 1) : f.seats;
  const x0 = x + aw;
  const x1 = armR ? x + w - aw : x + w;
  const cw = (x1 - x0) / n;
  const lw = Math.max(4, w * 0.018);
  const legXs = [x + aw * 0.4, x + w - aw * 0.4 - lw];
  if (A >= 200) legXs.splice(1, 0, x + w * 0.36, x + w * 0.64 - lw);
  const backTop = y + bodyH * 0.05;
  return (
    <g>
      {legXs.map((lx, i) => <Part key={i} x={lx} y={y + bodyH} w={lw} h={legH} fill={C.dark} sw={1.1} />)}
      <Part x={x + aw * 0.5} y={y} w={(armR ? x + w - aw * 0.5 : x + w) - (x + aw * 0.5)} h={seatTop - y + 2} rx={6} uid={uid} hatch />
      {Array.from({ length: n }, (_, i) => (
        <Part key={`b${i}`} x={x0 + i * cw + 1.5} y={backTop} w={cw - 3} h={seatTop - backTop} rx={5} fill={C.cush} sw={1.1} />
      ))}
      <Part x={x} y={baseY} w={w} h={baseH} uid={uid} hatch />
      {Array.from({ length: n }, (_, i) => (
        <Part key={`s${i}`} x={x0 + i * cw + 0.5} y={seatTop} w={cw - 1} h={baseY - seatTop} rx={3} fill={C.cush} sw={1.2} />
      ))}
      <Part x={x} y={armTop} w={aw} h={baseY + baseH - armTop} rx={Math.min(aw / 2, 7)} uid={uid} hatch />
      {armR && <Part x={x + w - aw} y={armTop} w={aw} h={baseY + baseH - armTop} rx={Math.min(aw / 2, 7)} uid={uid} hatch />}
    </g>
  );
};

const sofaSide = (b: Box, c: Ctx) => {
  const { x, y, w, h } = b;
  const { uid, f } = c;
  const legH = Math.max(6, h * 0.11);
  const bodyH = h - legH;
  const baseH = Math.max(6, bodyH * 0.13);
  const baseY = y + bodyH - baseH;
  const seatTop = y + bodyH * 0.55;
  const armTop = y + bodyH * 0.32;
  const backX = x + w * 0.66;
  const lw = Math.max(4, w * 0.045);
  // Lưng tựa: mặt trước hơi nghiêng ra sau, mặt sau bo cong
  const back =
    `M ${backX - w * 0.02} ${seatTop} L ${x + w * 0.72} ${y + 3} Q ${x + w * 0.73} ${y} ${x + w * 0.78} ${y} ` +
    `L ${x + w * 0.92} ${y} Q ${x + w} ${y} ${x + w} ${y + bodyH * 0.26} L ${x + w} ${baseY + baseH} ` +
    `L ${backX - w * 0.02} ${baseY + baseH} Z`;
  return (
    <g>
      <Part x={x + w * 0.08} y={y + bodyH} w={lw} h={legH} fill={C.dark} sw={1.1} />
      <Part x={x + w * 0.86 - lw} y={y + bodyH} w={lw} h={legH} fill={C.dark} sw={1.1} />
      <Shape d={back} uid={uid} hatch />
      <Part x={x} y={baseY} w={w} h={baseH} uid={uid} hatch />
      {f.isL ? (
        <Part x={x + 1} y={seatTop} w={w * 0.66} h={baseY - seatTop} rx={4} fill={C.cush} sw={1.2} />
      ) : (
        <g>
          <Part x={x} y={armTop} w={w * 0.68} h={baseY - armTop} rx={7} uid={uid} hatch />
          <rect
            x={x + w * 0.07} y={armTop + (baseY - armTop) * 0.2} width={w * 0.5} height={(baseY - armTop) * 0.6}
            rx={4} fill="none" stroke={C.inner} strokeWidth={0.8}
          />
        </g>
      )}
    </g>
  );
};

const sofaTop = (b: Box, c: Ctx) => {
  const { x, y, w, h } = b;
  const { s, uid, f, A, B } = c;
  const aw = Math.max(8, Math.min(w * 0.1, 18 * s));
  const depthCm = f.isL ? Math.min(95, B) : B;
  const seatDepth = Math.round(depthCm * 0.61);
  const dm = f.isL ? Math.min(h, depthCm * s) : h; // chiều sâu dãy chính
  const chaiseW = f.isL ? Math.min(w * 0.4, Math.min(95, A * 0.35) * s) : 0;
  const bt = Math.min(25 * s, dm * 0.28);
  const n = f.isL ? Math.max(1, f.seats - 1) : f.seats;
  const zx0 = x + aw;
  const zx1 = f.isL ? x + w - chaiseW : x + w - aw;
  const cw = (zx1 - zx0) / n;
  const outline = f.isL
    ? `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x + w - chaiseW} ${y + h} L ${x + w - chaiseW} ${y + dm} L ${x} ${y + dm} Z`
    : null;
  const note = `Mặt ngồi sâu ${seatDepth}cm`;
  const showNote = cw >= 84 && dm - bt >= 26;
  return (
    <g>
      {outline ? <Shape d={outline} uid={uid} hatch /> : <Part x={x} y={y} w={w} h={h} rx={5} uid={uid} hatch />}
      {/* lưng tựa */}
      <Ln x1={x + aw} y1={y + bt} x2={f.isL ? x + w : x + w - aw} y2={y + bt} c={C.line} sw={1} />
      {/* tay vịn */}
      <Ln x1={x + aw} y1={y + bt} x2={x + aw} y2={y + dm} c={C.line} sw={1} />
      {!f.isL && <Ln x1={x + w - aw} y1={y + bt} x2={x + w - aw} y2={y + h} c={C.line} sw={1} />}
      {/* khối nệm ngồi */}
      {Array.from({ length: n }, (_, i) => (
        <Part key={i} x={zx0 + i * cw + 1.5} y={y + bt + 2} w={cw - 3} h={dm - bt - 5} rx={4} fill={C.cush} sw={1.1} />
      ))}
      {f.isL && chaiseW > 6 && (
        <Part x={x + w - chaiseW + 1.5} y={y + bt + 2} w={chaiseW - 3.5} h={h - bt - 5} rx={4} fill={C.cush} sw={1.1} />
      )}
      {showNote && (
        <text
          x={zx0 + cw / 2} y={y + bt + (dm - bt) / 2 + 3} textAnchor="middle" fontSize={9.5}
          fontFamily={MONO} fill={C.muted} opacity={0.75}
        >{note}</text>
      )}
    </g>
  );
};

// ---------------------------------------------------------------------------
// GIƯỜNG / DAYBED
// ---------------------------------------------------------------------------
const bedFront = (b: Box, c: Ctx, hasHead: boolean) => {
  const { x, y, w, h } = b;
  const { uid } = c;
  const legH = Math.max(6, h * (hasHead ? 0.1 : 0.25));
  const frameH = Math.max(8, h * (hasHead ? 0.16 : 0.32));
  const mattH = Math.max(8, h * (hasHead ? 0.18 : 0.3));
  const frameY = y + h - legH - frameH;
  const mattY = frameY - mattH;
  const lw = Math.max(5, w * 0.03);
  return (
    <g>
      {hasHead && (
        <g>
          <Part x={x} y={y} w={w} h={h - legH} rx={7} uid={uid} hatch />
          {[1, 2, 3, 4, 5].map((i) => (
            <Ln key={i} x1={x + (w * i) / 6} y1={y + 8} x2={x + (w * i) / 6} y2={mattY - 4} sw={0.8} />
          ))}
          <rect x={x + 6} y={y + 6} width={w - 12} height={Math.max(0, mattY - y - 10)} rx={5} fill="none" stroke={C.inner} strokeWidth={0.8} />
          <Part x={x + w * 0.08} y={mattY - mattH * 0.85} w={w * 0.38} h={mattH} rx={6} fill={C.cush} sw={1.2} />
          <Part x={x + w * 0.54} y={mattY - mattH * 0.85} w={w * 0.38} h={mattH} rx={6} fill={C.cush} sw={1.2} />
        </g>
      )}
      <Part x={x + w * 0.02} y={mattY} w={w * 0.96} h={mattH} rx={4} fill={C.cush} sw={1.3} />
      <Ln x1={x + w * 0.02} y1={mattY + mattH * 0.42} x2={x + w * 0.98} y2={mattY + mattH * 0.42} sw={0.8} dash="5 3" />
      <Part x={x} y={frameY} w={w} h={frameH} uid={uid} hatch />
      <Part x={x + w * 0.05} y={y + h - legH} w={lw} h={legH} fill={C.dark} sw={1.1} />
      <Part x={x + w * 0.95 - lw} y={y + h - legH} w={lw} h={legH} fill={C.dark} sw={1.1} />
    </g>
  );
};

const bedSide = (b: Box, c: Ctx, hasHead: boolean) => {
  const { x, y, w, h } = b;
  const { uid } = c;
  const legH = Math.max(6, h * (hasHead ? 0.1 : 0.25));
  const frameH = Math.max(8, h * (hasHead ? 0.16 : 0.32));
  const mattH = Math.max(8, h * (hasHead ? 0.18 : 0.3));
  const frameY = y + h - legH - frameH;
  const mattY = frameY - mattH;
  const hbw = hasHead ? Math.max(8, w * 0.06) : 0;
  const fbw = Math.max(5, w * 0.025);
  const lw = Math.max(5, w * 0.03);
  return (
    <g>
      {hasHead && <Part x={x} y={y} w={hbw} h={h - legH} rx={4} uid={uid} hatch />}
      <Part x={x} y={frameY} w={w} h={frameH} uid={uid} hatch />
      <Part x={x + hbw} y={mattY} w={w - hbw - (hasHead ? fbw : 0)} h={mattH} rx={4} fill={C.cush} sw={1.3} />
      {hasHead && (
        <g>
          <Part x={x + hbw + 2} y={mattY - mattH * 0.8} w={Math.max(10, w * 0.14)} h={mattH * 0.9} rx={6} fill={C.cush} sw={1.2} />
          <Part x={x + w - fbw} y={mattY - 2} w={fbw} h={mattH + frameH * 0.3} rx={2} uid={uid} hatch />
        </g>
      )}
      <Ln x1={x + hbw + w * 0.2} y1={mattY + mattH * 0.4} x2={x + w - fbw - 3} y2={mattY + mattH * 0.4} sw={0.8} dash="5 3" />
      <Part x={x + w * 0.04} y={y + h - legH} w={lw} h={legH} fill={C.dark} sw={1.1} />
      <Part x={x + w * 0.96 - lw} y={y + h - legH} w={lw} h={legH} fill={C.dark} sw={1.1} />
    </g>
  );
};

const bedTop = (b: Box, c: Ctx, hasHead: boolean) => {
  const { x, y, w, h } = b;
  const { uid } = c;
  const hb = hasHead ? Math.max(6, h * 0.045) : 0;
  const pillowH = Math.min(h * 0.14, 46);
  return (
    <g>
      <Part x={x} y={y} w={w} h={h} rx={4} uid={uid} hatch />
      {hasHead && <Part x={x} y={y} w={w} h={hb} rx={3} uid={uid} hatch />}
      <Part x={x + 4} y={y + hb + 3} w={w - 8} h={h - hb - 7} rx={4} fill={C.cush} sw={1.2} />
      {hasHead ? (
        <g>
          <Part x={x + w * 0.07} y={y + hb + 8} w={w * 0.4} h={pillowH} rx={6} fill={C.paper} sw={1.1} />
          <Part x={x + w * 0.53} y={y + hb + 8} w={w * 0.4} h={pillowH} rx={6} fill={C.paper} sw={1.1} />
          <Ln x1={x + 4} y1={y + h * 0.42} x2={x + w - 4} y2={y + h * 0.42} sw={1} c={C.line} dash="6 3" />
          <Ln x1={x + 4} y1={y + h * 0.45} x2={x + w - 4} y2={y + h * 0.45} sw={0.7} />
        </g>
      ) : (
        <Part x={x + 8} y={y + 8} w={Math.max(12, w * 0.16)} h={h - 16} rx={5} fill={C.paper} sw={1.1} />
      )}
    </g>
  );
};

// ---------------------------------------------------------------------------
// TỦ / KỆ
// ---------------------------------------------------------------------------
const cabinetFront = (b: Box, c: Ctx) => {
  const { x, y, w, h } = b;
  const { uid, f, s } = c;
  const plinth = clamp(h * 0.06, 5, 14);
  const bodyH = h - plinth;
  const topT = h < 130 ? Math.max(4, Math.min(3 * s, 9)) : 0;
  const m = 3;
  const n = f.doors;
  const areaX = x + m;
  const areaY = y + topT + m;
  const areaW = w - 2 * m;
  const areaH = bodyH - topT - 2 * m;
  const dw = areaW / n;
  const hh = clamp(h * 0.14, 8, 40);
  const hy = h > 150 ? y + h * 0.5 - hh / 2 : areaY + areaH * 0.3;
  return (
    <g>
      <Part x={x} y={y} w={w} h={bodyH} uid={uid} hatch />
      <Part x={x + w * 0.03} y={y + bodyH} w={w * 0.94} h={plinth} fill={C.dark} sw={1.1} />
      {topT > 0 && <Ln x1={x} y1={y + topT} x2={x + w} y2={y + topT} c={C.line} sw={1} />}
      {Array.from({ length: n }, (_, i) => {
        const dx = areaX + i * dw;
        return (
          <g key={i}>
            <Part x={dx + 0.5} y={areaY} w={dw - 1} h={areaH} rx={1.5} fill={C.cush} sw={1.1} />
            {dw > 34 && (
              <rect
                x={dx + 5} y={areaY + 5} width={dw - 10} height={Math.max(0, areaH - 10)}
                fill="none" stroke={C.inner} strokeWidth={0.7}
              />
            )}
            {f.glass && (
              <g stroke={C.inner} strokeWidth={0.8} opacity={0.6}>
                <line x1={dx + dw * 0.2} y1={areaY + areaH * 0.5} x2={dx + dw * 0.6} y2={areaY + areaH * 0.1} />
                <line x1={dx + dw * 0.3} y1={areaY + areaH * 0.7} x2={dx + dw * 0.85} y2={areaY + areaH * 0.2} />
              </g>
            )}
            <rect
              x={i % 2 === 0 ? dx + dw - 7 : dx + 4.5} y={hy} width={2.6} height={hh}
              rx={1.2} fill={C.line}
            />
          </g>
        );
      })}
    </g>
  );
};

const cabinetSide = (b: Box, c: Ctx) => {
  const { x, y, w, h } = b;
  const { uid, s } = c;
  const plinth = clamp(h * 0.06, 5, 14);
  const bodyH = h - plinth;
  const front = Math.max(4, w * 0.06);
  const hh = clamp(h * 0.14, 8, 40);
  const topT = Math.max(4, Math.min(3 * s, 9));
  return (
    <g>
      <Part x={x} y={y} w={w} h={bodyH} uid={uid} hatch />
      <Part x={x + w * 0.06} y={y + 4} w={w * 0.88} h={bodyH - 8} rx={1} fill={C.cush} sw={0.9} />
      <Part x={x} y={y} w={front} h={bodyH} fill={C.fill} sw={1.2} />
      <rect x={x + front * 0.3} y={h > 150 ? y + h * 0.5 - hh / 2 : y + bodyH * 0.3} width={2.4} height={hh} rx={1.2} fill={C.line} />
      <Part x={x + w * 0.04} y={y + bodyH} w={w * 0.92} h={plinth} fill={C.dark} sw={1.1} />
      {h < 130 && <Ln x1={x} y1={y + topT} x2={x + w} y2={y + topT} c={C.line} sw={1} />}
    </g>
  );
};

const cabinetTop = (b: Box, c: Ctx) => {
  const { x, y, w, h } = b;
  const { uid, f } = c;
  const n = f.doors;
  const front = Math.max(4, h * 0.06);
  const dw = (w - 4) / n;
  return (
    <g>
      <Part x={x} y={y} w={w} h={h} uid={uid} hatch />
      <rect x={x + 4} y={y + 4} width={w - 8} height={Math.max(0, h - 8)} fill="none" stroke={C.inner} strokeWidth={0.8} />
      <Ln x1={x + 4} y1={y + 4} x2={x + w - 4} y2={y + 4} c={C.line} sw={1} />
      {Array.from({ length: n }, (_, i) => (
        <Part key={i} x={x + 2 + i * dw + 0.5} y={y + h - front} w={dw - 1} h={front} fill={C.cush} sw={1} />
      ))}
    </g>
  );
};

// Sách xếp trên kệ (giả ngẫu nhiên nhưng cố định)
const books = (x: number, y: number, w: number, h: number, seed: number) => {
  const out: React.ReactNode[] = [];
  let bx = x + 3;
  let i = 0;
  const limit = x + w * (0.35 + ((seed * 7) % 4) * 0.08);
  while (bx < limit) {
    const bw = 3 + ((i * 5 + seed * 3) % 4);
    const bh = h * (0.55 + (((i * 11 + seed * 5) % 5) * 0.09));
    out.push(
      <rect key={i} x={bx} y={y + h - bh} width={bw} height={bh} fill={i % 3 === 0 ? C.inner : C.dark} stroke={C.line} strokeWidth={0.6} opacity={0.8} />
    );
    bx += bw + 0.6;
    i++;
  }
  return out;
};

const shelfFront = (b: Box, c: Ctx) => {
  const { x, y, w, h } = b;
  const { uid, f, s } = c;
  const t = Math.max(4, w * 0.025);
  const bt = Math.max(3, Math.min(2.5 * s, 8));
  const inner = h - 2 * t;
  const tier = inner / f.tiers;
  return (
    <g>
      <Part x={x} y={y} w={w} h={h} uid={uid} hatch />
      <Part x={x + t} y={y + t} w={w - 2 * t} h={inner} fill="#F1E4CB" sw={0.9} />
      {Array.from({ length: f.tiers }, (_, i) => {
        const ty = y + t + i * tier;
        return tier > 26 ? <g key={i}>{books(x + t + 2, ty + 2, w - 2 * t - 4, tier - bt - 2, i + 1)}</g> : null;
      })}
      {Array.from({ length: f.tiers - 1 }, (_, i) => (
        <Part key={i} x={x + t} y={y + t + (i + 1) * tier - bt / 2} w={w - 2 * t} h={bt} sw={1.2} />
      ))}
    </g>
  );
};

const shelfSide = (b: Box, c: Ctx) => {
  const { x, y, w, h } = b;
  const { uid, f, s } = c;
  const t = Math.max(4, h * 0.02);
  const bt = Math.max(3, Math.min(2.5 * s, 8));
  const tier = (h - 2 * t) / f.tiers;
  return (
    <g>
      <Part x={x} y={y} w={w} h={h} fill={C.cush} sw={1.4} />
      <Part x={x + w - 4} y={y} w={4} h={h} uid={uid} hatch sw={1} />
      {Array.from({ length: f.tiers + 1 }, (_, i) => (
        <Part
          key={i} x={x} y={i === 0 ? y : i === f.tiers ? y + h - t : y + t + i * tier - bt / 2}
          w={w} h={i === 0 || i === f.tiers ? t : bt} uid={uid} hatch sw={1.2}
        />
      ))}
    </g>
  );
};

const shelfTop = (b: Box, c: Ctx) => {
  const { x, y, w, h } = b;
  return (
    <g>
      <Part x={x} y={y} w={w} h={h} uid={c.uid} hatch />
      <rect x={x + 4} y={y + 4} width={w - 8} height={Math.max(0, h - 8)} fill="none" stroke={C.inner} strokeWidth={0.8} />
      <Ln x1={x + 4} y1={y + h - 5} x2={x + w - 4} y2={y + h - 5} c={C.line} sw={1} />
    </g>
  );
};

const nightstandFront = (b: Box, c: Ctx) => {
  const { x, y, w, h } = b;
  const { uid } = c;
  const legH = Math.max(6, h * 0.14);
  const bodyH = h - legH;
  const topT = Math.max(4, bodyH * 0.07);
  const dh = (bodyH - topT - 8) / 2;
  const lw = Math.max(4, w * 0.06);
  return (
    <g>
      <Part x={x} y={y} w={w} h={bodyH} rx={3} uid={uid} hatch />
      <Ln x1={x} y1={y + topT} x2={x + w} y2={y + topT} c={C.line} sw={1} />
      {[0, 1].map((i) => {
        const dy = y + topT + 3 + i * (dh + 2);
        return (
          <g key={i}>
            <Part x={x + 4} y={dy} w={w - 8} h={dh} rx={2} fill={C.cush} sw={1.1} />
            <Ln x1={x + w * 0.33} y1={dy + 5} x2={x + w * 0.67} y2={dy + 5} c={C.line} sw={2.2} />
          </g>
        );
      })}
      <Part x={x + 3} y={y + bodyH} w={lw} h={legH} fill={C.dark} sw={1.1} />
      <Part x={x + w - 3 - lw} y={y + bodyH} w={lw} h={legH} fill={C.dark} sw={1.1} />
    </g>
  );
};

const nightstandSide = (b: Box, c: Ctx) => {
  const { x, y, w, h } = b;
  const { uid } = c;
  const legH = Math.max(6, h * 0.14);
  const bodyH = h - legH;
  const lw = Math.max(4, w * 0.08);
  return (
    <g>
      <Part x={x} y={y} w={w} h={bodyH} rx={3} uid={uid} hatch />
      <Part x={x + w * 0.1} y={y + 5} w={w * 0.8} h={bodyH - 10} fill={C.cush} sw={0.9} />
      <Ln x1={x} y1={y + Math.max(4, bodyH * 0.07)} x2={x + w} y2={y + Math.max(4, bodyH * 0.07)} c={C.line} sw={1} />
      <Part x={x + 3} y={y + bodyH} w={lw} h={legH} fill={C.dark} sw={1.1} />
      <Part x={x + w - 3 - lw} y={y + bodyH} w={lw} h={legH} fill={C.dark} sw={1.1} />
    </g>
  );
};

// ---------------------------------------------------------------------------
// BÀN
// ---------------------------------------------------------------------------
const tableFront = (b: Box, c: Ctx) => {
  const { x, y, w, h } = b;
  const { uid, s, f } = c;
  const topT = clamp(3.5 * s, 4, h * 0.14);
  const legW = clamp(6 * s, 5, w * 0.08);
  const apron = clamp(7 * s, 5, h * 0.14);
  const inset = w * 0.04;
  const ped = f.pedestal;
  const pw = ped ? Math.min(w * 0.28, 55 * s) : 0;
  const rightX = ped ? x + w - pw - inset * 0.3 : x + w - inset - legW;
  const dh = ped ? (h - topT - 4) / 3 : 0;
  return (
    <g>
      <Part x={x + inset} y={y + topT} w={legW} h={h - topT} sw={1.3} uid={uid} hatch />
      {ped ? (
        <g>
          <Part x={rightX} y={y + topT} w={pw} h={h - topT} uid={uid} hatch />
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <Part x={rightX + 3} y={y + topT + 3 + i * dh} w={pw - 6} h={dh - 3} rx={1.5} fill={C.cush} sw={1} />
              <Ln x1={rightX + pw * 0.35} y1={y + topT + 8 + i * dh} x2={rightX + pw * 0.65} y2={y + topT + 8 + i * dh} c={C.line} sw={2} />
            </g>
          ))}
        </g>
      ) : (
        <Part x={rightX} y={y + topT} w={legW} h={h - topT} sw={1.3} uid={uid} hatch />
      )}
      <Part x={x + inset + legW} y={y + topT} w={Math.max(0, rightX - (x + inset + legW))} h={apron} uid={uid} hatch sw={1.2} />
      <Part x={x} y={y} w={w} h={topT} uid={uid} hatch />
    </g>
  );
};

const tableSide = (b: Box, c: Ctx) => {
  const { x, y, w, h } = b;
  const { uid, s } = c;
  const topT = clamp(3.5 * s, 4, h * 0.14);
  const legW = clamp(6 * s, 5, w * 0.16);
  const apron = clamp(7 * s, 5, h * 0.14);
  const inset = w * 0.05;
  return (
    <g>
      <Part x={x + inset} y={y + topT} w={legW} h={h - topT} sw={1.3} uid={uid} hatch />
      <Part x={x + w - inset - legW} y={y + topT} w={legW} h={h - topT} sw={1.3} uid={uid} hatch />
      <Part x={x + inset + legW} y={y + topT} w={Math.max(0, w - 2 * inset - 2 * legW)} h={apron} uid={uid} hatch sw={1.2} />
      <Part x={x} y={y} w={w} h={topT} uid={uid} hatch />
    </g>
  );
};

const tableTop = (b: Box, c: Ctx) => {
  const { x, y, w, h } = b;
  const { uid, s, f } = c;
  const edge = clamp(3.5 * s, 4, Math.min(w, h) * 0.12);
  return (
    <g>
      <Part x={x} y={y} w={w} h={h} rx={2} uid={uid} hatch />
      <rect x={x + edge} y={y + edge} width={Math.max(0, w - 2 * edge)} height={Math.max(0, h - 2 * edge)} fill={C.cush} stroke={C.inner} strokeWidth={0.8} />
      {f.stone ? (
        <g fill="none" stroke={C.inner} strokeWidth={0.8} opacity={0.6}>
          <path d={`M ${x + w * 0.1} ${y + h * 0.9} Q ${x + w * 0.35} ${y + h * 0.4} ${x + w * 0.55} ${y + h * 0.55} T ${x + w * 0.9} ${y + h * 0.15}`} />
          <path d={`M ${x + w * 0.05} ${y + h * 0.5} Q ${x + w * 0.3} ${y + h * 0.2} ${x + w * 0.5} ${y + h * 0.3} T ${x + w * 0.75} ${y + h * 0.1}`} />
        </g>
      ) : (
        <g stroke={C.inner} strokeWidth={0.7} opacity={0.5}>
          {[0.28, 0.5, 0.72].map((t) => (
            <line key={t} x1={x + edge + 4} y1={y + h * t} x2={x + w - edge - 4} y2={y + h * t} />
          ))}
        </g>
      )}
    </g>
  );
};

// ---------------------------------------------------------------------------
// GHẾ
// ---------------------------------------------------------------------------
const swivelBase = (x: number, y: number, w: number, h: number, seatY: number, st: number) => (
  <g>
    <Part x={x + w * 0.47} y={seatY + st} w={w * 0.06} h={h * 0.16} fill={C.dark} sw={1.1} />
    <Part x={x + w * 0.08} y={y + h - 9} w={w * 0.84} h={5} rx={2} fill={C.dark} sw={1.1} />
    {[0.14, 0.5, 0.86].map((t) => (
      <circle key={t} cx={x + w * t} cy={y + h - 3} r={3} fill={C.paper} stroke={C.line} strokeWidth={1.1} />
    ))}
  </g>
);

const chairFront = (b: Box, c: Ctx) => {
  const { x, y, w, h } = b;
  const { uid, f } = c;
  const seatY = y + h * (f.bar ? 0.6 : f.swivel ? 0.58 : 0.55);
  const st = Math.max(5, h * 0.07);
  const lw = Math.max(4, w * 0.07);
  if (f.swivel) {
    return (
      <g>
        {swivelBase(x, y, w, h, seatY, st)}
        <Part x={x + w * 0.12} y={y} w={w * 0.76} h={seatY - y - 5} rx={w * 0.12} uid={uid} hatch />
        <Part x={x + w * 0.2} y={y + 6} w={w * 0.6} h={(seatY - y) * 0.5} rx={6} fill={C.cush} sw={1} />
        <Part x={x} y={seatY - h * 0.14} w={w * 0.07} h={h * 0.12} rx={2} fill={C.dark} sw={1.1} />
        <Part x={x + w * 0.93} y={seatY - h * 0.14} w={w * 0.07} h={h * 0.12} rx={2} fill={C.dark} sw={1.1} />
        <Part x={x + w * 0.05} y={seatY} w={w * 0.9} h={st} rx={3} fill={C.cush} sw={1.3} />
      </g>
    );
  }
  return (
    <g>
      <Part x={x + w * 0.08} y={seatY + st} w={lw} h={y + h - (seatY + st)} fill={C.dark} sw={1.2} />
      <Part x={x + w * 0.92 - lw} y={seatY + st} w={lw} h={y + h - (seatY + st)} fill={C.dark} sw={1.2} />
      {f.bar && <Part x={x + w * 0.08 + lw} y={y + h * 0.83} w={Math.max(0, w * 0.84 - 2 * lw)} h={3.5} fill={C.dark} sw={1} />}
      <Part x={x + w * 0.1} y={y} w={w * 0.8} h={seatY - y - 2} rx={w * 0.12} uid={uid} hatch />
      <Part x={x + w * 0.18} y={y + h * 0.05} w={w * 0.64} h={(seatY - y) * 0.6} rx={6} fill={C.cush} sw={1} />
      <Part x={x} y={seatY} w={w} h={st} rx={3} fill={C.cush} sw={1.3} />
    </g>
  );
};

const chairSide = (b: Box, c: Ctx) => {
  const { x, y, w, h } = b;
  const { uid, f } = c;
  const seatY = y + h * (f.bar ? 0.6 : f.swivel ? 0.58 : 0.55);
  const st = Math.max(5, h * 0.07);
  const lw = Math.max(4, w * 0.07);
  const back =
    `M ${x + w * 0.72} ${seatY} L ${x + w * 0.88} ${y + 1} L ${x + w * 0.99} ${y + 1} L ${x + w * 0.86} ${seatY + st * 0.6} Z`;
  return (
    <g>
      {f.swivel ? (
        swivelBase(x, y, w, h, seatY, st)
      ) : (
        <g>
          <Part x={x + w * 0.05} y={seatY + st} w={lw} h={y + h - (seatY + st)} fill={C.dark} sw={1.2} />
          <Shape d={`M ${x + w * 0.76} ${seatY + st} L ${x + w * 0.86} ${seatY + st} L ${x + w * 0.98} ${y + h} L ${x + w * 0.9} ${y + h} Z`} fill={C.dark} sw={1.2} />
          {f.bar && <Part x={x + w * 0.05 + lw} y={y + h * 0.83} w={Math.max(0, w * 0.75 - lw)} h={3.5} fill={C.dark} sw={1} />}
        </g>
      )}
      <Shape d={back} uid={uid} hatch />
      <Part x={x} y={seatY} w={w * 0.9} h={st} rx={3} fill={C.cush} sw={1.3} />
    </g>
  );
};

const chairTop = (b: Box, c: Ctx) => {
  const { x, y, w, h } = b;
  const { uid } = c;
  const r = Math.min(w, h) * 0.2;
  return (
    <g>
      <Part x={x + w * 0.04} y={y} w={w * 0.92} h={h * 0.16} rx={6} uid={uid} hatch />
      <Part x={x} y={y + h * 0.18} w={w} h={h * 0.82} rx={r} fill={C.cush} sw={1.4} />
      <rect x={x + w * 0.1} y={y + h * 0.28} width={w * 0.8} height={h * 0.62} rx={r * 0.7} fill="none" stroke={C.inner} strokeWidth={0.8} />
    </g>
  );
};

// ---------------------------------------------------------------------------
// Khối trơn (đèn, thảm, tượng, các loại chưa nhận diện)
// ---------------------------------------------------------------------------
const genericBody = (b: Box, kind: 'front' | 'side' | 'top', uid: string) => {
  const { x, y, w, h } = b;
  const t = Math.min(10, Math.max(3, Math.min(w, h) * 0.07));
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={C.fill} />
      <rect x={x} y={y} width={w} height={h} fill={`url(#hatch${uid})`} />
      <rect x={x + t} y={y + t} width={Math.max(0, w - 2 * t)} height={Math.max(0, h - 2 * t)} fill="none" stroke={C.inner} strokeWidth={0.8} />
      {kind !== 'top' && h > 30 && (
        <line x1={x} y1={y + h - Math.max(6, h * 0.1)} x2={x + w} y2={y + h - Math.max(6, h * 0.1)} stroke={C.inner} strokeWidth={0.8} />
      )}
      <rect x={x} y={y} width={w} height={h} fill="none" stroke={C.line} strokeWidth={2} strokeLinejoin="miter" />
    </g>
  );
};

type ViewName = 'front' | 'side' | 'top';

const figure = (kind: FurnitureKind, view: ViewName, b: Box, c: Ctx) => {
  switch (kind) {
    case 'sofa': return view === 'front' ? sofaFront(b, c) : view === 'side' ? sofaSide(b, c) : sofaTop(b, c);
    case 'bed': return view === 'front' ? bedFront(b, c, true) : view === 'side' ? bedSide(b, c, true) : bedTop(b, c, true);
    case 'daybed': return view === 'front' ? bedFront(b, c, false) : view === 'side' ? bedSide(b, c, false) : bedTop(b, c, false);
    case 'table': return view === 'front' ? tableFront(b, c) : view === 'side' ? tableSide(b, c) : tableTop(b, c);
    case 'chair': return view === 'front' ? chairFront(b, c) : view === 'side' ? chairSide(b, c) : chairTop(b, c);
    case 'cabinet': return view === 'front' ? cabinetFront(b, c) : view === 'side' ? cabinetSide(b, c) : cabinetTop(b, c);
    case 'shelf': return view === 'front' ? shelfFront(b, c) : view === 'side' ? shelfSide(b, c) : shelfTop(b, c);
    case 'nightstand':
      return view === 'front' ? nightstandFront(b, c)
        : view === 'side' ? nightstandSide(b, c)
        : cabinetTop(b, { ...c, f: { ...c.f, doors: 1 } });
    default: return genericBody(b, view, c.uid);
  }
};

const wrap = (text: string, max: number): string[] => {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let cur = '';
  for (const w of words) {
    if ((cur + ' ' + w).trim().length > max && cur) {
      lines.push(cur);
      cur = w;
    } else {
      cur = (cur + ' ' + w).trim();
    }
  }
  if (cur) lines.push(cur);
  return lines.slice(0, 3);
};

const toNum = (v: number | string | undefined): number => {
  const n = typeof v === 'number' ? v : parseFloat(String(v ?? '').replace(',', '.'));
  return Number.isFinite(n) && n > 0 ? n : 0;
};

const fmt = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1));

export const DynamicBlueprint: React.FC<DynamicBlueprintProps> = ({
  length, width, height, name, itemName, categoryId, code, className = ''
}) => {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const wrapRef = useRef<HTMLDivElement>(null);
  const [cw, setCw] = useState(720);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => setCw(Math.max(280, Math.round(el.clientWidth)));
    update();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const L = toNum(length);
  const Wd = toNum(width);
  const H = toNum(height);
  if (!L || !Wd || !H) return null;

  // Giường có đầu giường: mặt đứng chính nhìn từ phía đầu giường (ngang = Rộng), cạnh = Dài
  const kind = classifyProduct(name, categoryId);
  const swap = kind === 'bed';
  const A = swap ? Wd : L; // ngang mặt đứng chính + mặt bằng
  const B = swap ? L : Wd; // ngang mặt đứng cạnh, dọc mặt bằng
  const aLabel = swap ? 'R' : 'D';
  const bLabel = swap ? 'D' : 'R';
  const flags = parseFlags(kind, name, itemName ?? '', A);

  // ---------- Bố cục (đơn vị = px thật, nên chữ luôn đọc được trên mobile) ----------
  const W = cw;
  const compact = W < 640;
  const PAD = compact ? 14 : 26;
  const DIM = compact ? 32 : 40; // chỗ cho đường kích thước + số đo
  const TITLE = 24; // dòng tên góc nhìn
  const GUT = compact ? 0 : 40;
  const ROW_GAP = compact ? 10 : 18;
  const MAX_S = 5;

  let s: number;
  if (compact) {
    s = Math.min((W - 2 * PAD - DIM) / Math.max(A, B), 190 / Math.max(H, B), MAX_S);
  } else {
    const sW = (W - 2 * PAD - 2 * DIM - GUT) / (A + B);
    const sH = (600 - 2 * PAD - 2 * (TITLE + DIM) - ROW_GAP) / (H + B);
    s = Math.min(sW, sH, MAX_S);
  }
  const Ap = A * s, Bp = B * s, Hp = H * s;

  // Vị trí các góc nhìn
  let fx: number, fy: number, sx: number, sy: number, tx: number, ty: number;
  let tbX: number, tbY: number, tbW: number;

  if (compact) {
    const cx = (w: number) => Math.round((W - (DIM + w)) / 2) + DIM;
    fx = cx(Ap); fy = PAD + TITLE;
    sx = cx(Bp); sy = fy + Hp + DIM + ROW_GAP + TITLE;
    tx = cx(Ap); ty = sy + Hp + DIM + ROW_GAP + TITLE;
    tbX = PAD; tbW = W - 2 * PAD; tbY = ty + Bp + DIM + ROW_GAP;
  } else {
    const rowW = DIM + Ap + GUT + DIM + Bp;
    const x0 = Math.round((W - rowW) / 2);
    fx = x0 + DIM; fy = PAD + TITLE;
    sx = fx + Ap + GUT + DIM; sy = fy;
    tx = fx; ty = PAD + (TITLE + Hp + DIM) + ROW_GAP + TITLE;
    const beside = W - PAD - (tx + Ap + GUT) >= 210;
    if (beside) {
      tbX = tx + Ap + GUT; tbW = W - PAD - tbX; tbY = ty;
    } else {
      tbX = PAD; tbW = W - 2 * PAD; tbY = ty + Bp + DIM + ROW_GAP;
    }
  }

  // ---------- Khung tên ----------
  const charsPerLine = Math.max(14, Math.floor((tbW - 24) / 9.5));
  const nameLines = wrap(name, charsPerLine);
  const sub = itemName && itemName !== name ? wrap(itemName, charsPerLine + 2).slice(0, 2) : [];
  const tbH = 26 + nameLines.length * 17 + sub.length * 15 + 3 * 15 + 10;
  const bottom = compact ? tbY + tbH : Math.max(tbY + tbH, ty + Bp + DIM);
  const totalH = Math.ceil(bottom + PAD);

  const ctx: Ctx = { uid, s, A, B, H, f: flags };

  // ---------- Thành phần vẽ ----------
  const Dimension = ({ x1, y1, x2, y2, label, vertical }: {
    x1: number; y1: number; x2: number; y2: number; label: string; vertical?: boolean;
  }) => {
    const off = DIM * 0.55;
    const tick = 4;
    if (!vertical) {
      const ly = y1 + off;
      return (
        <g stroke={C.dim} strokeWidth={0.9} fill="none">
          <line x1={x1} y1={y1 + 3} x2={x1} y2={ly + 5} strokeWidth={0.6} />
          <line x1={x2} y1={y2 + 3} x2={x2} y2={ly + 5} strokeWidth={0.6} />
          <line x1={x1} y1={ly} x2={x2} y2={ly} />
          <line x1={x1 - tick} y1={ly + tick} x2={x1 + tick} y2={ly - tick} strokeWidth={1.4} />
          <line x1={x2 - tick} y1={ly + tick} x2={x2 + tick} y2={ly - tick} strokeWidth={1.4} />
          <text
            x={(x1 + x2) / 2} y={ly - 4} textAnchor="middle" fontSize={11} fontFamily={MONO}
            fontWeight={700} fill={C.dim} stroke={C.paper} strokeWidth={3} paintOrder="stroke"
          >{label}</text>
        </g>
      );
    }
    const lx = x1 - off;
    const my = (y1 + y2) / 2;
    return (
      <g stroke={C.dim} strokeWidth={0.9} fill="none">
        <line x1={x1 - 3} y1={y1} x2={lx - 5} y2={y1} strokeWidth={0.6} />
        <line x1={x2 - 3} y1={y2} x2={lx - 5} y2={y2} strokeWidth={0.6} />
        <line x1={lx} y1={y1} x2={lx} y2={y2} />
        <line x1={lx - tick} y1={y1 + tick} x2={lx + tick} y2={y1 - tick} strokeWidth={1.4} />
        <line x1={lx - tick} y1={y2 + tick} x2={lx + tick} y2={y2 - tick} strokeWidth={1.4} />
        <text
          transform={`translate(${lx - 5} ${my}) rotate(-90)`} textAnchor="middle" fontSize={11}
          fontFamily={MONO} fontWeight={700} fill={C.dim} stroke={C.paper} strokeWidth={3} paintOrder="stroke"
        >{label}</text>
      </g>
    );
  };

  const View = ({ x, y, w, h, view }: Box & { view: ViewName }) => {
    const ext = 9;
    return (
      <g>
        {figure(kind, view, { x, y, w, h }, ctx)}
        {/* đường tâm */}
        <g stroke={C.dim} strokeWidth={0.7} strokeDasharray="10 3 2 3" opacity={0.75}>
          <line x1={x + w / 2} y1={y - ext} x2={x + w / 2} y2={y + h + ext} />
          {view === 'top' && <line x1={x - ext} y1={y + h / 2} x2={x + w + ext} y2={y + h / 2} />}
        </g>
      </g>
    );
  };

  const Caption = ({ x, y, text }: { x: number; y: number; text: string }) => (
    <text x={x} y={y} fontSize={11} fontWeight={700} letterSpacing={1.2} fill={C.text}
      fontFamily={MONO} stroke={C.paper} strokeWidth={3} paintOrder="stroke">{text}</text>
  );

  const ariaLabel =
    `Bản vẽ kỹ thuật ${name}${itemName ? ' - ' + itemName : ''}: dài ${fmt(L)} cm, rộng ${fmt(Wd)} cm, cao ${fmt(H)} cm`;

  return (
    <div ref={wrapRef} className={`w-full ${className}`}>
      <svg
        viewBox={`0 0 ${W} ${totalH}`}
        width={W}
        height={totalH}
        role="img"
        aria-label={ariaLabel}
        className="block w-full h-auto rounded-2xl"
        style={{ background: C.paper }}
      >
        <title>{ariaLabel}</title>
        <defs>
          <pattern id={`gm${uid}`} width={10} height={10} patternUnits="userSpaceOnUse">
            <path d="M10 0H0V10" fill="none" stroke={C.gridMinor} strokeWidth={0.5} opacity={0.35} />
          </pattern>
          <pattern id={`gM${uid}`} width={50} height={50} patternUnits="userSpaceOnUse">
            <path d="M50 0H0V50" fill="none" stroke={C.gridMajor} strokeWidth={0.8} opacity={0.4} />
          </pattern>
          <pattern id={`hatch${uid}`} width={7} height={7} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1={0} y1={0} x2={0} y2={7} stroke={C.inner} strokeWidth={0.6} opacity={0.28} />
          </pattern>
        </defs>

        {/* Lưới caro */}
        <rect width={W} height={totalH} fill={C.paper} />
        <rect width={W} height={totalH} fill={`url(#gm${uid})`} />
        <rect width={W} height={totalH} fill={`url(#gM${uid})`} />

        {/* Khung bản vẽ */}
        <rect x={4} y={4} width={W - 8} height={totalH - 8} fill="none" stroke={C.line} strokeWidth={1.6} />
        <rect x={8} y={8} width={W - 16} height={totalH - 16} fill="none" stroke={C.line} strokeWidth={0.6} />

        {/* MẶT ĐỨNG CHÍNH */}
        <Caption x={fx} y={fy - 10} text="MẶT ĐỨNG CHÍNH" />
        <View x={fx} y={fy} w={Ap} h={Hp} view="front" />
        <Dimension x1={fx} y1={fy + Hp} x2={fx + Ap} y2={fy + Hp} label={`${aLabel} ${fmt(A)}`} />
        <Dimension x1={fx} y1={fy} x2={fx} y2={fy + Hp} label={`C ${fmt(H)}`} vertical />

        {/* MẶT ĐỨNG CẠNH */}
        <Caption x={sx} y={sy - 10} text="MẶT ĐỨNG CẠNH" />
        <View x={sx} y={sy} w={Bp} h={Hp} view="side" />
        <Dimension x1={sx} y1={sy + Hp} x2={sx + Bp} y2={sy + Hp} label={`${bLabel} ${fmt(B)}`} />
        <Dimension x1={sx} y1={sy} x2={sx} y2={sy + Hp} label={`C ${fmt(H)}`} vertical />

        {/* MẶT BẰNG */}
        <Caption x={tx} y={ty - 10} text="MẶT BẰNG" />
        <View x={tx} y={ty} w={Ap} h={Bp} view="top" />
        <Dimension x1={tx} y1={ty + Bp} x2={tx + Ap} y2={ty + Bp} label={`${aLabel} ${fmt(A)}`} />
        <Dimension x1={tx} y1={ty} x2={tx} y2={ty + Bp} label={`${bLabel} ${fmt(B)}`} vertical />

        {/* Khung tên */}
        <g>
          <rect x={tbX} y={tbY} width={tbW} height={tbH} fill={C.paper} stroke={C.line} strokeWidth={1.4} />
          <line x1={tbX} y1={tbY + 20} x2={tbX + tbW} y2={tbY + 20} stroke={C.line} strokeWidth={0.8} />
          <text x={tbX + 10} y={tbY + 14} fontSize={9} letterSpacing={0.8} fontWeight={700} fill={C.muted} fontFamily={MONO}>
            BẢN VẼ KỸ THUẬT · CDHOME ATELIER
          </text>
          {nameLines.map((ln, i) => (
            <text key={i} x={tbX + 10} y={tbY + 38 + i * 17} fontSize={13.5} fontWeight={700} fill={C.text} fontFamily={SERIF}>{ln}</text>
          ))}
          {sub.map((ln, i) => (
            <text key={i} x={tbX + 10} y={tbY + 38 + nameLines.length * 17 + i * 15} fontSize={11.5} fill={C.line} fontFamily={SERIF} fontStyle="italic">{ln}</text>
          ))}
          {(() => {
            const y0 = tbY + 40 + nameLines.length * 17 + sub.length * 15;
            return (
              <>
                <text x={tbX + 10} y={y0} fontSize={11} fontWeight={700} fill={C.dim} fontFamily={MONO}>
                  D×R×C: {fmt(L)} × {fmt(Wd)} × {fmt(H)} cm
                </text>
                <text x={tbX + 10} y={y0 + 15} fontSize={10} fill={C.muted} fontFamily={MONO}>
                  Đơn vị: cm · Tỷ lệ minh họa
                </text>
                <text x={tbX + 10} y={y0 + 30} fontSize={10} fill={C.muted} fontFamily={MONO}>
                  {code ? `Mã: ${code} · ` : ''}Sai số ±1 cm
                </text>
              </>
            );
          })()}
        </g>
      </svg>
    </div>
  );
};
