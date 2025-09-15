"use client";

import { TFaceShape } from '@/types/faceTypes';
import IooIIcon from '@/components/icon';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface IProps {
  type: TFaceShape
}

const FaceTypeResult = ({type}:IProps) => {
  const [scale, setScale] = useState("scale-[1]");
  useEffect(() => {
    function updateScale() {
      const wScale = window.innerWidth / 810;
      const hScale = window.innerHeight / 1080;
      setScale(`scale-[${ Math.min(wScale, hScale, 1) }]`);
    }
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  return <div className={"w-full h-[290px] rounded-[40px] bg-[linear-gradient(90deg,rgba(255,255,255,0.5)_0%,rgba(0,194,252,0.5)_60.98%)] backdrop-blur-[35px] border border-solid border-[#FFFFFF/50]" +
    "shadow-[inset_0_0_3px_0_#FFFFFF80,_inset_-1px_-1px_0.5px_-1px_#FFFFFF,_inset_1px_1px_0.5px_-1px_#FFFFFF,_inset_-1px_-1px_0_-0.5px_#262626,_inset_1px_1px_0_-0.5px_#333333,_0_1px_8px_0_#0000001F,_0_0_2px_0_#0000001A] " + scale}>
    <div className={"absolute right-0 z-0 w-[404px] h-[290px] bg-[url('/result/avatar/base.svg')] bg-cover"}>
      <Image src={`/result/avatar/${type.toLowerCase()}.png`} alt={type} width={333} height={290} className={'right-0 absolute'} />
    </div>
    <div className={"flex flex-col mt-[38px] mb-[24px] p-8"}>
      <p className={"heading-xl text-primary-50"}>Your Face Type is</p>
      <div className={"flex overflow-hidden justify-start items-center"}>
        <IooIIcon size={'result'} iconPath={`/result/icon/${type.toLowerCase()}.svg`} />
        <p className={"w-fit font-bold text-[58px] leading-[90%] tracking-[-2%]"}>{type}</p>
      </div>
    </div>
  </div>
}

export default FaceTypeResult;