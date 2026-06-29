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
import React, { Suspense, use, useEffect, useRef, useState } from 'react';
import IooISelectModal, { modalImageSrc, selectOptions } from '@/components/Modal/IooISelectModal';
import { FaceShapeData } from '@/data/faceShapeData';
import { FrameProducts, ProductType } from '@/data/frameData';
// import { SOCIAL_LINKS } from '@/config/socialLinks'; // re-enable with the social CTA buttons below
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
  // capture mode (used by the QR result-image screenshot): hide the action buttons
  capture?: boolean;
}

function ResultBody({
  faceShape,
  onSelectProduct,
  onSelectCeleb,
  onOpenQr,
  onScanAnother,
  capture = false,
}: ResultBodyProps) {
  // Pre-fetch the result PNG so the Save button can call navigator.share() synchronously
  // inside the click gesture — iOS Safari drops the user-activation if you await fetch()
  // first, which silently breaks "Save Image" (the whole point: land it in Photos, not Files).
  const imgBlobRef = useRef<Blob | null>(null);
  useEffect(() => {
    imgBlobRef.current = null;
    fetch(`/result-images/${faceShape}.png`)
      .then((r) => r.blob())
      .then((b) => { imgBlobRef.current = b; })
      .catch(() => {});
  }, [faceShape]);

  const onSaveImage = async () => {
    const filename = `1001-${faceShape}.png`;
    const blob = imgBlobRef.current;
    if (blob && navigator.canShare) {
      const file = new File([blob], filename, { type: 'image/png' });
      // No await before share(): keeps the user gesture so iOS shows the share sheet → Photos.
      if (navigator.canShare({ files: [file] })) {
        try { await navigator.share({ files: [file] }); } catch { /* user cancelled */ }
        return;
      }
    }
    // Desktop (or blob not ready yet): plain download. ponytail: on iOS this lands in Files,
    // not Photos — acceptable only as the rare not-yet-prefetched fallback.
    const a = document.createElement('a');
    a.href = `/result-images/${faceShape}.png`;
    a.download = filename;
    a.click();
  };

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
          {/* Saves the pre-generated result image (same PNG the old /share page showed).
              On iOS/Android the Web Share sheet's "Save Image" lands in Photos —
              a plain <a download> would only save to Files there. Desktop falls back to download. */}
          <IooIBtn text={'Save Image'} icon={'/download.png'} onClick={onSaveImage} />
          <IooIBtn text={'QR Code'} icon={'/qr.png'} onClick={onOpenQr} />
          {/* Brand CTAs folded in from the retired /share page. Hidden for now. */}
          {/* {SOCIAL_LINKS.map((link) => (
            <IooIBtn
              key={link.href}
              text={link.label}
              onClick={() => window.open(link.href, '_blank', 'noopener,noreferrer')}
            />
          ))} */}
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

  const faceShape = (shape === "Square" ? "Angular" : shape) as TFaceShape;

  const router = useRouter()

  useEffect(() => {
    if (isCapture) return;
    const t = setTimeout(() => {
      setIsLoading(false)
    }, 3000)
    return () => clearTimeout(t)
  }, [isCapture]);

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
