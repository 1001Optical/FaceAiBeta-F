import Image from 'next/image';
import Modal from '@/components/Modal/modal';
import { useState } from 'react';

interface IProps {
  title: string;
  src: string;
  onClose: () => void;
}

const selectOptions = ["Product", "Woman", "Man"]
const selectStyle = "bg-[#00EAFF7A] backdrop-blur-[13.098590850830078px] shadow-[inset_0_0_17.46px_0_#F2F2F2,inset_0_0_3.27px_0_#FFFFFF80,inset_-1.09px_-1.09px_0.55px_-1.09px_#FFFFFF,inset_1.09px_1.09px_0.55px_-1.09px_#FFFFFF,inset_-1.09px_-1.09px_0_-0.55px_#262626,inset_1.09px_1.09px_0_-0.55px_#333333,0_1.09px_8.73px_0_#0000001F,0_0_2.18px_0_#0000001A]"

const IooISelectModal = ({src, title, onClose}: IProps) => {
  const [selectIndex, setSelectIndex] = useState(0);

  return (
    <Modal onClose={onClose}>
      <div className={'flex flex-col items-center justify-center gap-6'}>
      <span className="heading-md text-opacity-white-1000 text-center">
        {title}
      </span>
      <div className={"w-[375px] h-[68px] gap-2 p-3 rounded-full flex flex-row justify-center items-centers bg-opacity-100 backdrop-blur-[12px] shadow-[inset_0_0_16px_0_#F2F2F2,inset_0_0_3px_0_#FFFFFF80,inset_-1px_-1px_0.5px_-1px_#FFFFFF,inset_1px_1px_0.5px_-1px_#FFFFFF,inset_-1px_-1px_0_-0.5px_#262626,inset_1px_1px_0_-0.5px_#333333,0_1px_8px_0_#0000001F,0_0_2px_0_#0000001A]"}>
        {selectOptions.map((option, index) => (
          <div key={option} onClick={() => setSelectIndex(index)} className={`h-[44px] rounded-full px-6 py-2 ${selectIndex === index ? selectStyle : "cursor-pointer"}`}>
            <p className={"heading-xs"}>{option}</p>
          </div>
        ))}
      </div>
      <div
        className="flex items-center justify-center size-[562px]"
      >
        <Image
          src={`${src}/${selectOptions[selectIndex]}.png`}
          alt={`${src}/${selectOptions[selectIndex]}.png`}
          width={562}
          height={562}
          objectFit="contain"
          className="rounded-[48px] object-cover w-full h-full"
        />
      </div>
      <button
        onClick={onClose}
        className="w-full py-4 bg-white/20 text-lg font-aribau text-white rounded-full hover:bg-white/35 transition-colors duration-200 mt-auto border border-white/40 backdrop-blur-lg shadow-md"
      >
        Got it
      </button>
      </div>
    </Modal>
  )
}

export default IooISelectModal