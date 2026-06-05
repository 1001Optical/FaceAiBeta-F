"use client"
import styles from "@/css/main.module.css"
import SiteHeader from '@/components/header';
import FaceShapeCard from '@/components/faceShapeCard';
import ResponsiveContainer from '@/components/ResponsiveContainer';
import RecommendedFrame from '@/components/Result/recommendedFrame';
import IooIBtn from '@/components/IooIBtn';
import CelebList from '@/components/Result/celebList';
import { CelebType, TFaceShape } from '@/types/face';
import IooIModal from '@/components/Modal/IooIModal';
import DynamicQrModal from '@/components/Modal/DynamicQrModal';
import React, { Suspense, use, useEffect, useState } from 'react';
import IooISelectModal, { modalImageSrc, selectOptions } from '@/components/Modal/IooISelectModal';
import { FaceShapeData } from '@/data/faceShapeData';
import { FrameProducts, ProductType } from '@/data/frameData';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';

interface IProps {
  params: Promise<{shape: string}>,
}

function ResultLoadingOverlay() {
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
        <div className={'size-[420px] relative'}>
          <Image
            src="/lottie_preload/loading.svg"
            alt=""
            fill
            className="object-contain"
            unoptimized
          />
        </div>
        <div className={'w-full h-[132px] px-10 py-8 bg-black-400 border-2 border-white-400 rounded-[48px]'}>
          <p className={'label-xl text-white-1000 text-center'}>
            We’re analyzing which eyewear<br/>
            suits you best!
          </p>
        </div>
      </div>
    </div>
  </ResponsiveContainer>;
}

interface ResultBodyProps {
  faceShape: TFaceShape;
  onSelectProduct: (product: ProductType) => void;
  onSelectCeleb: (celeb: CelebType) => void;
  onOpenQr: () => void;
  onScanAnother: () => void;
  onShare: () => void;
  // Web Share API is only available on supported (mostly mobile/tablet) browsers.
  canShare: boolean;
  // capture mode (used by the QR result-image screenshot): hide the action buttons
  capture?: boolean;
}

function ResultBody({
  faceShape,
  onSelectProduct,
  onSelectCeleb,
  onOpenQr,
  onScanAnother,
  onShare,
  canShare,
  capture = false,
}: ResultBodyProps) {
  return <div className={'pt-6 px-9 h-full'}>
    <div className={'w-full h-full flex flex-col gap-8'}>
      <FaceShapeCard type={faceShape} />
      <div className={'flex flex-col gap-5'}>
        <p className={'heading-xl text-primary-50'}>Recommendation Frame</p>
        <div className={styles.result_recommended_frame}>
          {FaceShapeData[faceShape].frameRecommendation.map((item, index) => {
            const product = FrameProducts[item]
            return (
                <RecommendedFrame
                key={item}
                  onClickProduct={onSelectProduct}
                  items={{
                    shape: item, products: product.map(product => product as ProductType) ?? []
                  }}
                  ranking={index + 1}
                />
            );
          })}
        </div>
      </div>
      {/* <div className={'flex flex-col gap-5'}>
        <p className={'heading-xl text-primary-50'}>Celebs with Your Face Type</p>
        <div className={styles.result_celeb}>
          <div className={'px-3 flex gap-6 items-center '}>
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
              selectCeleb={onSelectCeleb}
            />
            <CelebList
              gender={'Man'}
              list={FaceShapeData[faceShape].celebrities.man}
              selectCeleb={onSelectCeleb}
            />
          </div>
        </div>
      </div> */}
      {!capture && (
        <div className={'pb-8 flex flex-col gap-4'}>
          <div className={'flex gap-4'}>
            {canShare && (
              <div className={'flex-1'}>
                <IooIBtn text={'Share'} icon={'/upload.png'} onClick={onShare} />
              </div>
            )}
            <div className={'flex-1'}>
              <IooIBtn text={'QR Code'} icon={'/qr.png'} onClick={onOpenQr} />
            </div>
          </div>
          <IooIBtn text={'Scan Another Face'} icon={'/face.png'} onClick={onScanAnother} />
        </div>
      )}
    </div>
  </div>;
}

function ResultContent({params}: IProps) {
  const { shape } = use(params)
  const searchParams = useSearchParams()
  const isCapture = searchParams.get('capture') === '1'

  const [selectCeleb, setSelectCeleb] = useState<CelebType | undefined>(undefined)
  const [selectProduct, setSelectProduct] = useState<ProductType | undefined>(undefined)
  const [isOpenQR, setIsOpenQR] = useState<boolean>(false)
  // capture mode skips the 3s loading overlay entirely
  const [isLoading, setIsLoading] = useState<boolean>(!isCapture)
  // Web Share API support (mostly mobile/tablet) — gate the Share button on it
  const [canShare, setCanShare] = useState<boolean>(false)

  const faceShape = (shape === "Square" ? "Angular" : shape) as TFaceShape;

  const router = useRouter()

  useEffect(() => {
    if (isCapture) return;
    const t = setTimeout(() => {
      setIsLoading(false)
    }, 3000)
    return () => clearTimeout(t)
  }, [isCapture]);

  useEffect(() => {
    setCanShare(typeof navigator !== 'undefined' && typeof navigator.share === 'function')
  }, []);

  // Warm the browser cache for the frame-modal photos (Product / Woman / Man)
  // while the 3s loading overlay runs, so IooISelectModal opens instantly.
  useEffect(() => {
    FaceShapeData[faceShape]?.frameRecommendation.forEach((frame) => {
      FrameProducts[frame]?.forEach(({ src }) => {
        selectOptions.forEach((option) => {
          new window.Image().src = modalImageSrc(src, faceShape, option);
        });
      });
    });
  }, [faceShape]);

  const onShare = async () => {
    try {
      await navigator.share({
        title: '1001 Optometry',
        text: `My face shape is ${faceShape} — see my frame picks`,
        url: `${window.location.origin}/share/${faceShape}`,
      })
    } catch {
      // user cancelled the share sheet, or it is unsupported — nothing to do
    }
  };

  return <>
    {isLoading ? <ResultLoadingOverlay /> : null}
    <ResponsiveContainer page={'result'}>
      <div id="capture-root">
        <SiteHeader />
        <ResultBody
          faceShape={faceShape}
          onSelectProduct={setSelectProduct}
          onSelectCeleb={setSelectCeleb}
          onOpenQr={() => setIsOpenQR(true)}
          onScanAnother={() => router.push('/')}
          onShare={onShare}
          canShare={canShare}
          capture={isCapture}
        />
      </div>
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
        <DynamicQrModal shape={faceShape} onClose={() => setIsOpenQR(false)} />
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
  }</>;
}

export default function Result(props: IProps) {
  // useSearchParams() must live inside a Suspense boundary provided by a parent.
  return <Suspense fallback={null}><ResultContent {...props} /></Suspense>;
}
