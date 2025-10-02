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
import React, { Suspense, use, useEffect, useState } from 'react';
import IooISelectModal from '@/components/Modal/IooISelectModal';
import { FaceShapeData } from '@/data/faceShapeData';
import { FrameProducts, ProductType } from '@/data/frameData';
import { useRouter } from 'next/navigation';
import DotPlayer from '@/components/dotLottiePlayer';

interface IProps {
  params: Promise<{shape: string}>,
}

export default function Result({params}: IProps) {
  const { shape } = use(params)
  const [selectCeleb, setSelectCeleb] = useState<CelebType | undefined>(undefined)
  const [selectProduct, setSelectProduct] = useState<ProductType | undefined>(undefined)
  const [isOpenQR, setIsOpenQR] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const faceShape = shape

  const router = useRouter()

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false)
    }, 3000)
  }, []);

  const Loading = () => {
    return <ResponsiveContainer page={'loading'} className={"absolute top-0 left-0 z-30"}>
      <SiteHeader />
      <div className={'w-full py-[64px] flex justify-center items-center'}>
        <div
          className={'w-full px-9 flex flex-col justify-center items-center gap-10'}
        >
          <div
            className={
              'w-[420px] h-fit flex flex-col justify-center items-center gap-2'
            }
          >
            <p className={'heading-md text-white-1000'}>
              Smart AI face scan
            </p>
            <div className={'bg-white-200 w-[270px] h-0.5'} />
            <p className={'heading-sm text-white-800'}>
              In progress
            </p>
          </div>
          <div className={'size-[420px]'}>
            {/*<LottieCanvas />*/}
            <DotPlayer src={'https://lottie.host/3ee95351-a63f-4806-9414-45d55670a4b0/V8oXQSrKxH.lottie'} />
          </div>
          <div className={'w-full h-[132px] px-10 py-8 bg-black-400 border-2 border-white-400 rounded-[48px]'}>
            <p className={'label-xl text-white-1000 text-center'}>
              We’re analyzing which eyewears<br/>
              suit you best!
            </p>
          </div>
        </div>
      </div>
    </ResponsiveContainer>
  }

  const Result = () => {
    return <div className={'pt-6 px-9 h-full'}>
      <div className={'w-full h-full flex flex-col gap-8'}>
        <FaceShapeCard type={faceShape} />
        <div className={'flex flex-col gap-[34px]'}>
          <p className={'heading-xl text-primary-50'}>Recommendation Frame</p>
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
                      shape: item, vendor: product[0].vendor, name: product[0].name, imgUrl: `${product[0].src}/preview.png`
                    }}
                    ranking={index + 1}
                  />
                </div>
              );
            })}
          </div>
        </div>
        <div className={'flex flex-col gap-[34px]'}>
          <p className={'heading-xl text-primary-50'}>Celebs with Your Face Type</p>
          <div className={styles.result_celeb}>
            <div className={'px-3 flex gap-6 items-center'}>
              <div className={styles.result_celeb_type}>
                <p className={'heading-xl text-center text-white-1000'}>{faceShape}</p>
              </div>
              <p className={'w-fit heading-md text-white-800'}>
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

  }

  return <Suspense fallback={null}>
    {isLoading ? <Loading /> : <></>}
    <ResponsiveContainer page={'result'}>
      <SiteHeader />
       <Result />
    </ResponsiveContainer>
    {faceShape ? (
    <>
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
          faceShape={faceShape}
          title={selectProduct.name}
          src={selectProduct.src}
          vendor={selectProduct.vendor}
          onClose={() => setSelectProduct(undefined)}
        />
      ) : (
        <></>
      )}
    </>
  ) : <></>
  }</Suspense>;
}

