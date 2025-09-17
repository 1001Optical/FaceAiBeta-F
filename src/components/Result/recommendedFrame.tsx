import Image from 'next/image';

interface IProps {
  item: { shape: string, vendor: string, name: string, imgUrl: string },
  ranking: number
}

const RecommendedFrame = ({item, ranking}: IProps) => {
  return <div className={"flex flex-col gap-4"}>
    <div className={"flex flex-col px-3"}>
      <p className={"heading-xl text-white-600"}>{ranking === 1 ? "1st" : "2nd"}</p>
      <p className={"heading-xl text-information-200"}>{item.shape}</p>
    </div>
    <div className={"px-3 w-full border-t border-white-200"}/>
    <div className={"size-[320px] rounded-[32.82px] p-[24.62px] overflow-hidden bg-primary-50 shadow-[inset_0_0_14.22px_0_#F2F2F2,_inset_0_0_2.67px_0_#FFFFFF80,_inset_-0.89px_-0.89px_0.44px_-0.89px_#FFFFFF,_inset_0.89px_0.89px_0.44px_-0.89px_#FFFFFF,_inset_-0.89px_-0.89px_0_-0.44px_#262626,_inset_0.89px_0.89px_0_-0.44px_#333333,_0_0.89px_7.11px_0_#0000001F,_0_0_1.78px_0_#0000001A] backdrop-blur-[10.666666030883789px]"}>
      <div className={" w-[296px] h-[212px] rounded-tl-[32px] absolute -right-14 -bottom-10 z-10 overflow-hidden flex justify-center items-center"}>
        <Image src={item.imgUrl} alt={'frames'} fill />
      </div>
      <div>
        <p className={"heading-sm text-primary-800"}>{item.vendor}</p>
        <p className={"heading-xl text-primary-900"}>{item.name}</p>
      </div>
    </div>
  </div>
}

export default RecommendedFrame;
