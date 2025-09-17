"use client"
import styles from "@/css/main.module.css"
import SiteHeader from '@/components/header';
import FaceShapeCard from '@/components/faceShapeCard';
import ResponsiveContainer from '@/components/ResponsiveContainer';
import RecommendedFrame from '@/components/Result/recommendedFrame';
import IooIBtn from '@/components/IooIBtn';
import CelebList from '@/components/Result/celebList';
import { CelebType } from '@/types/face';
import IooIModal from '@/components/Modal/IooIModal';
import { useState } from 'react';
import IooISelectModal from '@/components/Modal/IooISelectModal';
import { FaceShapeData } from '@/data/faceShapeData';
import { FrameProducts, ProductType } from '@/data/frameData';
import { useRouter, useSearchParams } from 'next/navigation';

export default function Test() {
  const getParams = useSearchParams();
  const [selectCeleb, setSelectCeleb] = useState<CelebType | undefined>(undefined)
  const [selectProduct, setSelectProduct] = useState<ProductType | undefined>(undefined)
  const [isOpenQR, setIsOpenQR] = useState<boolean>(false)

  const faceShapeRaw = getParams.get('faceShape') || 'Unknown';
  const faceShape = faceShapeRaw.match(/^[A-Za-z]+/)?.[0] || 'Unknown';

  console.log(faceShape)


  const router = useRouter()

  return faceShape ? (
    <>
      <ResponsiveContainer page={'result'}>
        <SiteHeader />
        <div className={'pt-6 px-9 h-full'}>
          <div className={'w-full h-full flex flex-col gap-8'}>
            <FaceShapeCard type={faceShape} />
            <div className={'flex flex-col gap-[34px]'}>
              <p className={'heading-xl'}>Recommendation Frame</p>
              <div className={styles.result_recommended_frame}>
                {FaceShapeData[faceShape].frameRecommendation.map((item, index) => {
                  const product = FrameProducts[item]
                  return (
                    <div
                      className={'cursor-pointer'}
                      onClick={() => setSelectProduct(product[0])}
                      key={index}
                    >
                      <RecommendedFrame
                        key={index}
                        item={{
                          shape: item, vendor: product[0].vendor, name: product[0].name, imgUrl: `${product[0].src}/Product.png`
                        }}
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
                    <p className={'heading-xl text-center'}>{faceShape}</p>
                  </div>
                  <p className={'w-fit heading-md'}>
                    {FaceShapeData[faceShape].description}
                  </p>
                </div>
                <div className={'flex gap-6'}>
                  <CelebList
                    gender={'Woman'}
                    list={FaceShapeData[faceShape].celebrities.woman}
                    selectCeleb={(celeb: CelebType) => setSelectCeleb(celeb)}
                  />
                  <CelebList
                    gender={'Man'}
                    list={FaceShapeData[faceShape].celebrities.man}
                    selectCeleb={(celeb: CelebType) => setSelectCeleb(celeb)}
                  />
                </div>
              </div>
            </div>
            <div className={'pb-8 flex flex-col gap-4'}>
              <IooIBtn
                text={'Get QR Code'}
                icon={'/upload.png'}
                onClick={() => setIsOpenQR(true)}
              />
              <IooIBtn text={'Scan Another Face'} icon={'/face.png'} onClick={() => router.push('/')} />
            </div>
          </div>
        </div>
      </ResponsiveContainer>
      {selectCeleb ? (
        <IooIModal
          items={{
            title: 'Celebs with Your Face Type',
            subTitle: selectCeleb.name,
            imgSrc: selectCeleb.img_src,
          }}
          onClose={() => setSelectCeleb(undefined)}
        />
      ) : (
        <></>
      )}
      {isOpenQR ? (
        <IooIModal
          items={{
            title: 'QR Code',
            subTitle: faceShape,
            imgSrc: `/QR/QR_${faceShape}.png`,
          }}
          onClose={() => setIsOpenQR(false)}
        />
      ) : (
        <></>
      )}
      {selectProduct ? (
        <IooISelectModal
          title={selectProduct.name}
          src={selectProduct.src}
          onClose={() => setSelectProduct(undefined)}
        />
      ) : (
        <></>
      )}
    </>
  ) : <></>;
}
