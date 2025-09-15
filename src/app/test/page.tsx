"use client"
import styles from "@/css/main.module.css"
import ResultBg from '@/components/Background/resultBg';
import SiteHeader from '@/components/header';
import FaceTypeResult from '@/components/faceTypeResult';
import ResponsiveContainer from '@/components/ResponsiveContainer';
import RecommendedFrame from '@/components/Result/recommendedFrame';
import IooIBtn from '@/components/IooIBtn';
import CelebList from '@/components/Result/celebList';
import { CelebType } from '@/types/face';
import IooIModal from '@/components/Modal/IooIModal';
import { useState } from 'react';
import IooISelectModal from '@/components/Modal/IooISelectModal';

export default function Test() {
  const [selectCeleb, setSelectCeleb] = useState<CelebType | undefined>(undefined)
  const [isOpenQR, setIsOpenQR] = useState<boolean>(false)
  const [isOpenProduct, setIsOpenProduct] = useState<boolean>(false)

  const celebList: CelebType[] = [
    {
      name: "Lisa",
      img_src: "/celebs/Lisa.png"
    },
    {
      name: "Emma Watson",
      img_src: "/celebs/EmmaWatson.png"
    },
    {
      name: "Emma Watson1",
      img_src: "/celebs/EmmaWatson.png"
    }
  ]
  const list = [
    {
      shape: 'Square',
      vendor: '1001 Premium',
      name: 'LITEN 3 LT32',
      img_url: '/frame/LITEN_3_LT32/Product.png'
    },
    {
      shape: 'Round',
      vendor: '1001 Signature',
      name: 'SF39',
      img_url: '/frame/Product.png'
    },
  ]

  return (
    <ResultBg>
      <ResponsiveContainer>
        <SiteHeader />
        <div className={'pt-6 px-9 h-full'}>
          <div className={'w-full h-full flex flex-col gap-8'}>
            <FaceTypeResult type={'Oval'} />
            <div className={'flex flex-col gap-[34px]'}>
              <p className={'heading-xl'}>Recommendation Frame</p>
              <div className={styles.result_recommended_frame}>
                {list.map((item, index) => {
                  return (
                    <div className={"cursor-pointer"} onClick={() => setIsOpenProduct(true)} key={index}>
                      <RecommendedFrame
                        key={index}
                        item={item}
                        ranking={index + 1}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
            <div className={'flex flex-col gap-[34px]'}>
              <p className={'heading-xl'}>Recommendation Frame</p>
              <div className={styles.result_celeb}>
                <div className={'px-3 flex gap-6 items-center'}>
                  <div className={styles.result_celeb_type}>
                    <p className={'heading-xl text-center'}>Oval</p>
                  </div>
                  <p className={'w-fit heading-md'}>
                    Longer than wide, softly rounded
                  </p>
                </div>
                <div className={'flex '}>
                  <CelebList gender={'Woman'} list={celebList} selectCeleb={(celeb: CelebType) => setSelectCeleb(celeb)}/>
                  <CelebList gender={'Man'} list={celebList} selectCeleb={(celeb: CelebType) => setSelectCeleb(celeb)}/>
                </div>
              </div>
            </div>
            <div className={'pb-8 flex flex-col gap-4'}>
              <IooIBtn text={'Get QR Code'} icon={'/upload.png'} onClick={() => setIsOpenQR(true)} />
              <IooIBtn text={'Scan Another Face'} icon={'/face.png'} />
            </div>
          </div>
        </div>
      </ResponsiveContainer>
      {selectCeleb ? <IooIModal
        items={{
          title: "Celebs with Your Face Type",
          sub_title: selectCeleb.name,
          img_src: selectCeleb.img_src
        }} onClose={() => setSelectCeleb(undefined)}
      /> : <></>}
      {isOpenQR ? <IooIModal
        items={{
          title: "QR Code",
          sub_title: "Oval",
          img_src: "/QR/QR_Oval.png"
        }} onClose={() => setIsOpenQR(false)}
      /> : <></>}
      {
        isOpenProduct ?
          <IooISelectModal
            title={"LITEN 3 LT32"}
            src={"/frame/LITEN_3_LT32"}
            onClose={() => setIsOpenProduct(false)}
          />: <></>
      }

    </ResultBg>
  );
}
