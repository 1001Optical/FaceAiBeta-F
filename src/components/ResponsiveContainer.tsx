import React, { useEffect, useState } from 'react';

const DESIGN_WIDTH = 810;
const DESIGN_HEIGHT = 1080;
const DESKTOP_TOP_OFFSET = 70;

export default function ResponsiveContainer({ children }: { children: React.ReactNode }) {
    const [layout, setLayout] = useState({ scale: 0, top: 0 });

    useEffect(() => {
        function updateLayout() {
            const viewport = window.visualViewport;
            const viewportWidth = viewport?.width ?? window.innerWidth;
            const viewportHeight = viewport?.height ?? window.innerHeight;
            const top = Math.min(DESKTOP_TOP_OFFSET, Math.max(16, viewportHeight * 0.065));
            const availableHeight = Math.max(0, viewportHeight - top);
            const widthScale = viewportWidth / DESIGN_WIDTH;
            const heightScale = availableHeight / DESIGN_HEIGHT;

            setLayout({
                scale: Math.min(widthScale, heightScale, 1),
                top,
            });
        }

        updateLayout();
        window.addEventListener('resize', updateLayout);
        window.addEventListener('orientationchange', updateLayout);
        window.visualViewport?.addEventListener('resize', updateLayout);

        return () => {
            window.removeEventListener('resize', updateLayout);
            window.removeEventListener('orientationchange', updateLayout);
            window.visualViewport?.removeEventListener('resize', updateLayout);
        };
    }, []);

    return (
        <div className="fixed-container"
            style={{
                position: 'fixed',
                inset: 0,
                width: '100vw',
                height: '100dvh',
                background: 'none',
                overflow: 'hidden',
            }}
        >
            <div
                className="content-container"
                style={{
                    width: DESIGN_WIDTH,
                    height: DESIGN_HEIGHT,
                    position: 'absolute',
                    left: '50%',
                    top: layout.top,
                    transformOrigin: 'top left',
                    transform: `scale(${layout.scale}) translateX(-50%)`,
                    visibility: layout.scale > 0 ? 'visible' : 'hidden',
                }}
            >
                {children}
            </div>
        </div>
    );
}
