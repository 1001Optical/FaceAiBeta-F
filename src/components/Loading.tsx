import React from 'react';

export default function Loading() {
  return (
    <div className="flex items-center justify-center">
      <video
        className={"w-[80px] block my-0 mx-auto"}
        src="/video/face_animation.mp4"
        autoPlay
        loop
        muted
        playsInline
      />
    </div>
  );
}
