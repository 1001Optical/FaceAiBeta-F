'use client';

import Image from 'next/image';

export default function LottieCanvas() {
    return (
        <div className="relative h-[420px] w-[420px]">
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
