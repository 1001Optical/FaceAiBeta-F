import React, { useEffect, useState } from 'react';

const cx = 600;
const cy = 540;
const rx = 240;
const ry = 307;

const FaceScanBar: React.FC = () => {
  const [scanY, setScanY] = useState(cy); // 반드시 cy로 초기화
  const [width, setWidth] = useState(2 * rx);

  useEffect(() => {
    let direction = 1;
    let y = cy; // 중앙에서 시작
    let rafId: number;

    function animate() {
      // direction에 곱해지는 값이 커질수록 속도 증가
      y += direction * 4;
      if (y > cy + ry) {
        y = cy + ry;
        direction = -1;
      }
      if (y < cy - ry) {
        y = cy - ry;
        direction = 1;
      }
      setScanY(y);

      // 타원 공식에 따라 width 계산
      const w = 2 * rx * Math.sqrt(1 - Math.pow((y - cy) / ry, 2));
      setWidth(isNaN(w) ? 0 : w);

      rafId = requestAnimationFrame(animate);
    }
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div
      className={'absolute h-1 bg-secondary-50 rounded-[2px] shadow-[0_0_8px_10px_rgba(201,241,232,0.25)] z-30 pointer-events-none'}
      style={{
        left: cx - width / 2, // 타원 중심 기준 좌우 정렬
        top: scanY, // y좌표
        width: width,
      }}
    />
  );
};

export default FaceScanBar;
