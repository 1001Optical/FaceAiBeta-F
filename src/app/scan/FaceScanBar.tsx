import React, { useEffect, useState } from "react";

const cx = 600;
const cy = 660;
const rx = 310;
const ry = 396;

const FaceScanBar: React.FC = () => {
    const [scanY, setScanY] = useState(cy); // 반드시 cy로 초기화
    const [width, setWidth] = useState(2 * rx);

    useEffect(() => {
        let direction = 1;
        let y = cy; // 중앙에서 시작
        let rafId: number;

        function animate() {
            y += direction * 2;
            if (y > cy + ry) { y = cy + ry; direction = -1; }
            if (y < cy - ry) { y = cy - ry; direction = 1; }
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
            style={{
                position: "absolute",
                left: cx - width / 2, // 타원 중심 기준 좌우 정렬
                top: scanY,           // y좌표
                width: width,
                height: 4,
                background: "var(--semantic-secondary-50, #C9F1E8)",
                opacity: 1,
                borderRadius: 2,
                boxShadow: "0 0 8px 10px rgba(201, 241, 232, 0.25)",
                zIndex: 30,
                pointerEvents: "none",
            }}
        />
    );
};

export default FaceScanBar;

