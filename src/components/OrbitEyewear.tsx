'use client';

import Image from 'next/image';

export default function OrbitEyewear() {
    return (
        <div className="flex h-[705px] w-[810px] items-center justify-center">
            <Image
                src="/lottie_preload/main.svg"
                alt=""
                width={810}
                height={705}
                className="h-full w-full object-contain"
                unoptimized
            />
        </div>
    );
}

