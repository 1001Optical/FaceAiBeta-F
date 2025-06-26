import React from 'react';

export default function Loading() {
  return (
    <div className="flex items-center justify-center">
      <video
        src="/video/face_animation.mp4"
        autoPlay
        loop
        muted
        playsInline
        style={{ width: '80%', display: 'block', margin: '0 auto' }}
      />
    </div>
  );
}
