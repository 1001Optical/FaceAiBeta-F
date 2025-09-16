"use client"

import React, { useEffect, useState } from 'react';

const backgroundType = {
  "result": "bg-[url(/background/bg_result.svg)]",
  "main": "bg-[url(/background/bg_main.svg)]",
}

interface IProps {
  children: React.ReactNode;
  page?: "result" | "main";
}

export default function ResponsiveContainer({
  children, page
}: IProps) {
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
      className={"inset-0 w-screen h-screen overflow-auto bg-cover bg-local flex flex-col justify-start items-center "+ (page ? backgroundType[page] : "")}>
      <div
        className={"w-[810px] h-full origin-top"}
        style={{
          transform: `scale(${scale}) `,
          height: `calc(100% / ${scale})`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
