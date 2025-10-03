// import { useEffect, useState } from 'react';
import Image from 'next/image';
import Modal from '@/components/Modal/modal';

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
      <button
        onClick={onClose}
        className="w-[658px] h-[88px] py-4 bg-white-200 text-lg font-aribau text-white-1000 rounded-full hover:bg-white-400 transition-colors duration-200 mt-auto border border-white-400 shadow-[inset_0_0_1.69px_1.69px_#999999,_inset_0_0_1.69px_1.69px_#FFFFFF26,_inset_-1.69px_-1.69px_1.69px_-0.85px_#FFFFFFBF,_inset_1.69px_1.69px_1.69px_-0.85px_#FFFFFFBF,_inset_-5.07px_-5.07px_0.85px_-5.07px_#FFFFFFCC,_inset_5.07px_5.07px_0.85px_-5.92px_#FFFFFFBF,_0_1.69px_13.52px_0_#0000001F,_0_0_3.38px_0_#0000001A] backdrop-blur-[20px]"
      >
        <p className={"label-xl text-white-1000"}>Got it</p>
      </button>
    </Modal>
  )
}

export default IooIModal