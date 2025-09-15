import { CelebType } from '@/types/face';
import Image from 'next/image'

interface IProps {
  gender: "Man" | "Woman";
  list: CelebType[];
  selectCeleb: (celeb: CelebType) => void;
}

const CelebList = ({gender, list, selectCeleb}: IProps) => {
  return <div className={"w-[320px] h-12 px-3 flex flex-col gap-3"}>
    <p className={'heading-xl text-opacity-white-600'}>{gender}</p>
    <div className={'w-full border-t border-opacity-white-200'} />
    <div className={"flex flex-col gap-1.5"}>
      {list.map(celeb => (
        <div key={celeb.name} onClick={() => selectCeleb(celeb)} className={"flex gap-2 py-2 items-center cursor-pointer"}>
          <Image src={celeb.img_src} alt={celeb.name} width={64} height={64} className={'rounded-xl'}/>
          <p className={"w-[224px] heading-md overflow-hidden text-nowrap text-ellipsis"}>{celeb.name}</p>
        </div>
      ))}
    </div>
  </div>
}

export default CelebList;