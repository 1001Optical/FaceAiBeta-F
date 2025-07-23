import React, { useEffect, useState } from 'react';

export default function ResponsiveContainer({ children }: { children: React.ReactNode }) {
    const [scale, setScale] = useState(1);

    useEffect(() => {
        function handleResize() {
            const wScale = window.innerWidth / 810;
            const hScale = window.innerHeight / 1080;
            setScale(Math.min(wScale, hScale, 1));
        }
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="fixed-container"
            style={{
                position: 'fixed',
                inset: 0,
                width: '100vw',
                height: '100vh',
                background: 'none',
                overflow: 'hidden',
            }}
        >
            <div
                className="content-container"
                style={{
                    width: 810,
                    height: 1080,
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transformOrigin: 'top left',
                    transform: `scale(${scale}) translate(-50%, -50%)`
                }}
            >
                {children}
            </div>
        </div>
    );
}

