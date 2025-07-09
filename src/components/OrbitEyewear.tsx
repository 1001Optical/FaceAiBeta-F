'use client';

import { DotLottiePlayer } from '@dotlottie/react-player';
import '@dotlottie/react-player/dist/index.css';

export default function OrbitEyewear() {
    return (
        <div className="flex items-center justify-center w-full py-8">
            <DotLottiePlayer
                src="https://lottie.host/c992f4c3-1b27-4dff-8586-f6d9af8192da/Rpb2UtV7ND.lottie"
                autoplay
                loop
                background="transparent"
                speed={1}
                style={{ width: 800, height: 800 }}
            />
        </div>
    );
}


