import Image from 'next/image';
import Modal from '@/components/OptimizedResult/Modal/modal';
import ModalCtaButton from '@/components/OptimizedResult/Modal/ModalCtaButton';
import { useState } from 'react';

interface IProps {
  faceShape: string;
  title: string;
  vendor: string;
  src: string;
  onClose: () => void;
}

export const selectOptions = ["Product", "Woman", "Man"] as const;

/**
 * Modal image path. Shared with the result page preloader so the exact same
 * URLs are warm in the browser cache before the modal opens.
 */
export function modalImageSrc(src: string, faceShape: string, option: string): string {
  return `${src}/${option !== "Product" ? `${faceShape}_` : ""}${option}.webp`;
}
const selectStyle = "bg-[#00EAFF7A] backdrop-blur-[13.098590850830078px] shadow-[inset_0_0_3.27px_0_#FFFFFF80,inset_-1.09px_-1.09px_0.55px_-1.09px_#FFFFFF,inset_1.09px_1.09px_0.55px_-1.09px_#FFFFFF,inset_-1.09px_-1.09px_0_-0.55px_#262626,inset_1.09px_1.09px_0_-0.55px_#333333,0_1.09px_8.73px_0_#0000001F,0_0_2.18px_0_#0000001A]"

const IooISelectModal = ({faceShape, src, title, vendor= "", onClose}: IProps) => {
  const [selectIndex, setSelectIndex] = useState(0);

  return (
    <Modal onClose={onClose} >
      <div className={"flex flex-col gap-[42px]"}>
        <div className={'flex flex-col items-center justify-center gap-6'}>
          <div className={"flex gap-2 justify-center items-center"}>
            <span className="heading-sm text-white-800 text-center">
              {vendor}
            </span>
            <div className={"h-7 w-0.5 bg-white-200"}/>
            <span className="heading-md text-white-1000 text-center">
              {title}
            </span>
          </div>
        <div className={"w-[375px] h-[68px] gap-2 p-3 rounded-full flex flex-row justify-center items-centers bg-opacity-100 backdrop-blur-[12px] shadow-[inset_0_0_3px_0_#FFFFFF80,inset_-1px_-1px_0.5px_-1px_#FFFFFF,inset_1px_1px_0.5px_-1px_#FFFFFF,inset_-1px_-1px_0_-0.5px_#262626,inset_1px_1px_0_-0.5px_#333333,0_1px_8px_0_#0000001F,0_0_2px_0_#0000001A]"}>
          {selectOptions.map((option, index) => (
            <div key={option} onClick={() => setSelectIndex(index)} className={`h-[44px] rounded-full px-6 py-2 ${selectIndex === index ? selectStyle : "cursor-pointer"}`}>
              <p className={"heading-xs text-white-1000"}>{option}</p>
            </div>
          ))}
        </div>
        <div
          className="flex items-center justify-center size-[562px]"
        >
          <Image
            src={modalImageSrc(src, faceShape, selectOptions[selectIndex])}
            alt={modalImageSrc(src, faceShape, selectOptions[selectIndex])}
            width={562}
            height={562}
            className="rounded-[48px] object-cover w-full h-full"
            // Files are pre-compressed WebP served as-is — skipping the optimizer
            // keeps the URL identical to the preloaded one (instant open).
            unoptimized
          />
        </div>
        </div>
        <ModalCtaButton onClick={onClose} />
      </div>
    </Modal>
  )
}

export default IooISelectModal
