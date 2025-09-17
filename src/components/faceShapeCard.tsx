import styles from "@/css/main.module.css"
import IooIIcon from '@/components/icon';
import Image from 'next/image';

interface IProps {
  type: string
}

const FaceShapeCard = ({type}:IProps) => {

  return <div className={"w-full h-[290px] rounded-[40px] bg-[linear-gradient(90deg,rgba(255,255,255,0.5)_0%,rgba(0,194,252,0.5)_60.98%)] backdrop-blur-[35px] border border-solid border-[#FFFFFF/50]" + styles.sd_face_shape_card}>
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

export default FaceShapeCard;