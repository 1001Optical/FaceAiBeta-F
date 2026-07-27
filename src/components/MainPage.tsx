'use client';

import Image from 'next/image';

export default function LottiePlayerWrapper() {
  return (
    <Image
      src="/lottie_preload/main.svg"
      alt=""
      fill
      className="object-contain"
      unoptimized
    />
  );
}
