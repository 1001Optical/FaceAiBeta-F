// import { useEffect, useState } from 'react';
import Image from 'next/image';
import Modal from '@/components/Modal/modal';
import React from 'react';

interface IProps {
  faceShape: string
  onClose: () => void;
  modalSize: { width: number; height: number };
}

const QRModal = ({faceShape, onClose, modalSize}: IProps) => {

  return (
    <Modal onClose={onClose}>
         <span className="text-xl font-aribau font-semibold text-white">
              QR Code
            </span>
      <hr className="w-full border-t border-white border-opacity-30 my-3" />
      <span className="text-lg font-aribau text-white mb-6">
              {faceShape}
            </span>
      <div
        className="flex items-center justify-center mb-8"
        style={{
          width: Math.min(350, modalSize.width - 40),
          height: Math.min(350, modalSize.width - 40),
          maxWidth: '80vw',
          maxHeight: '40vh',
        }}
      >
        <Image
          src={`/QR/QR_${faceShape}.png`}
          alt={`${faceShape} QR Code`}
          width={500}
          height={500}
          className="rounded-2xl object-contain w-full h-full"
        />
      </div>
      <button
        onClick={onClose}
        className="w-full py-4 bg-white-200 text-lg font-aribau text-white rounded-full hover:bg-white-400 transition-colors duration-200 mt-auto border border-white-400 backdrop-blur-lg shadow-md"
      >
        Got it
      </button>
    </Modal>
  )
}

export default QRModal