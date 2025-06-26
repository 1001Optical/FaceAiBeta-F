'use client';

import { Player } from '@lottiefiles/react-lottie-player';

export default function LottiePlayerWrapper() {
  return (
    <Player
      autoplay
      loop
      src="https://lottie.host/e57a436e-45d9-4c23-9a01-12a4846af177/MzDixCzrc7.json"
      style={{
        width: '100vw',
        height: '100vh',
        position: 'absolute',
        top: 0,
        left: 0,
        objectFit: 'cover',
        pointerEvents: 'none',}}
    />
  );
}
