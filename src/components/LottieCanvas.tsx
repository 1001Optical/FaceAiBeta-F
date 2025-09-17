'use client';
import { useEffect, useRef } from 'react';
import { DotLottie } from '@lottiefiles/dotlottie-web';

export default function LottieCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let instance: DotLottie | null = null;
    if (canvasRef.current) {
      instance = new DotLottie({
        autoplay: true,
        loop: true,
        canvas: canvasRef.current,
        src: 'https://lottie.host/3ee95351-a63f-4806-9414-45d55670a4b0/V8oXQSrKxH.lottie',
      });
    }
    return () => {
      if (instance) instance.destroy?.();
    };
  }, []);

  return (
    <div className="w-[420px] h-[420px]">
      <canvas
        ref={canvasRef}
        width={420}
        height={420}
        style={{ width: 420, height: 420 }}
      />
    </div>
  );
}
