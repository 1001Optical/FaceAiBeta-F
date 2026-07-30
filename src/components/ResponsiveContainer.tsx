"use client"

import React, { useEffect, useLayoutEffect, useState } from 'react';

const backgroundType = {
  "result": "bg-[url(/background/bg_result.svg)]",
  "main": "bg-[url(/background/bg_main.svg)]",
  "loading": "bg-[url(/background/bg_loading.svg)]",
}

// useLayoutEffect on the server warns; fall back to useEffect there.
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

interface IProps {
  children: React.ReactNode;
  page?: "result" | "main" | "loading";
  className?: string
}

export default function ResponsiveContainer({
  children, page, className
}: IProps) {
  // null until measured. Keeping the content hidden + applying the scale in a
  // layout effect (before paint) avoids the flash where the 810px design first
  // renders at scale 1 (huge on small screens) and then snaps down.
  const [scale, setScale] = useState<number | null>(null);

  useIsomorphicLayoutEffect(() => {
    function handleResize() {
      const viewportWidth = window.visualViewport?.width ?? window.innerWidth;
      const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
      const wScale = viewportWidth / 810;
      const hScale = viewportHeight / 1080;
      setScale(Math.min(wScale, hScale, 1));
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    window.visualViewport?.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      window.visualViewport?.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div
      className={
      "inset-0 w-screen h-[100dvh] overflow-x-hidden bg-cover bg-local flex flex-col justify-start items-center "
        + (page ? backgroundType[page] : "")
        + (page === "result" ? " overflow-y-auto" : " overflow-hidden")
        + (` ${className}`)
    }
    >
      <div
        className={"w-[810px] h-full origin-top"}
        style={{
          transform: scale != null ? `scale(${scale})` : undefined,
          height: scale != null ? `calc(100% / ${scale})` : '100%',
          visibility: scale != null ? 'visible' : 'hidden',
        }}
      >
        {children}
      </div>
    </div>
  );
}
