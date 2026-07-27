"use client"

import { useEffect, useState } from 'react';

interface IProps {
  onClose: () => void;
  children: React.ReactNode;
}

const Modal = ({onClose, children}: IProps) => {
  const [scale, setScale] = useState(Math.min(window.innerWidth / 810, window.innerHeight / 1080));

  useEffect(() => {
    function handleResize() {
      const wScale = window.innerWidth / 810;
      const hScale = window.innerHeight / 1080;
      setScale(Math.min(wScale, hScale));
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black-600 backdrop-blur-md"
      onClick={() => onClose()}
    >
      <div
        className="w-[738px] h-fit relative flex flex-col items-center bg-[rgba(0,0,0,0.3)] border-[2px] border-white-400 shadow-[0_4px_30px_0_rgba(0,0,0,0.4)] backdrop-blur-[12.5px] rounded-[48px] px-4 py-8"
        style={{
          transform: `scale(${scale}) `,
        }}
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}

export default Modal