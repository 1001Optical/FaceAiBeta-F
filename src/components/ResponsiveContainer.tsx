"use client"

import React, { useEffect, useState } from 'react';

export default function ResponsiveContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    function handleResize() {
      const wScale = window.innerWidth / 810;
      setScale(Math.min(wScale, 1));
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      className={"inset-0 w-screen h-screen overflow-hidden bg-none flex flex-col justify-start items-center"}>
      <div
        className={"w-[810px] h-screen origin-top overflow-auto no-scrollbar"}
        style={{
          transform: `scale(${scale}) `,
        }}
      >
        {children}
      </div>
    </div>
  );
}
