'use client';

import Image from 'next/image';

/** Static illustration (hosted lottie.host links expire). */
export default function LottieCanvas() {
  return (
    <div className="relative w-[420px] h-[420px]">
      <Image
        src="/lottie_preload/loading.svg"
        alt=""
        fill
        className="object-contain"
        unoptimized
      />
    </div>
  );
}
