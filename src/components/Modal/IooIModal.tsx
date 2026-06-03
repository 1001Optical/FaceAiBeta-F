// import { useEffect, useState } from 'react';
import Image from 'next/image';
import Modal from '@/components/Modal/modal';
import ModalCtaButton from '@/components/Modal/ModalCtaButton';

interface IProps {
  items: {
    title: string;
    subTitle: string;
    imgSrc: string;
  };
  onClose: () => void;
}

const IooIModal = ({items, onClose}: IProps) => {

  return (
    <Modal onClose={onClose}>
      <span className="heading-sm text-white-800 text-white text-center font-light">
        {items?.title ?? ""}
      </span>
      <hr className="border-t border-white-200 border-opacity-30 my-3 w-[562px]" />
      <span className="heading-md text-white-1000 mb-6">
        {items?.subTitle ?? ""}
      </span>
      <div
        className="flex items-center justify-center mb-8 size-[562px]"
      >
        <Image
          src={items?.imgSrc ?? ""}
          alt={items?.subTitle ?? ""}
          width={500}
          height={500}
          className="rounded-2xl object-cover w-full h-full"
        />
      </div>
      <ModalCtaButton onClick={onClose} />
    </Modal>
  )
}

export default IooIModal