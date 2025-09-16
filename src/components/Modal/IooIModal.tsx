// import { useEffect, useState } from 'react';
import Image from 'next/image';
import Modal from '@/components/Modal/modal';

interface IProps {
  items: {
    title: string;
    sub_title: string;
    img_src: string;
  };
  onClose: () => void;
}

const IooIModal = ({items, onClose}: IProps) => {

  return (
    <Modal onClose={onClose}>
      <span className="text-xl font-aribau font-semibold text-white text-center">
        {items?.title ?? ""}
      </span>
      <hr className="w-full border-t border-white border-opacity-30 my-3" />
      <span className="text-lg font-aribau text-white mb-6">
        {items?.sub_title ?? ""}
      </span>
      <div
        className="flex items-center justify-center mb-8 size-[562px]"
      >
        <Image
          src={items?.img_src ?? ""}
          alt={items?.sub_title ?? ""}
          width={500}
          height={500}
          className="rounded-2xl object-cover w-full h-full"
        />
      </div>
      <button
        onClick={onClose}
        className="w-full py-4 bg-white/20 text-lg font-aribau text-white rounded-full hover:bg-white/35 transition-colors duration-200 mt-auto border border-white/40 backdrop-blur-lg shadow-md"
      >
        Got it
      </button>
    </Modal>
  )
}

export default IooIModal