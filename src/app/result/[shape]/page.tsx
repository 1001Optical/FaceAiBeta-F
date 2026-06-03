"use client"
import styles from "@/css/main.module.css"
import SiteHeader from '@/components/header';
import FaceShapeCard from '@/components/faceShapeCard';
import ResponsiveContainer from '@/components/ResponsiveContainer';
import RecommendedFrame from '@/components/Result/recommendedFrame';
import IooIBtn from '@/components/IooIBtn';
import { TFaceShape } from '@/types/face'; // CelebType 제거
import IooISelectModal from '@/components/Modal/IooISelectModal';
import QRModal from '@/components/Modal/qrModal';
import { FaceShapeData } from '@/data/faceShapeData';
import { FrameProducts, ProductType } from '@/data/frameData';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { domToPng } from 'modern-screenshot';
import React, { Suspense, use, useEffect, useState, useRef } from 'react'; // IooIModal 제거

interface IProps {
  params: Promise<{ shape: string }>,
}

function ResultLoadingOverlay() {
  return (
    <ResponsiveContainer page={'loading'} className={"absolute top-0 left-0 z-30"}>
      <SiteHeader />
      <div className={'w-full py-[64px] flex justify-center items-center'}>
        <div className={'w-full px-9 flex flex-col justify-center items-center gap-10'}>
          <div className={'w-[420px] h-fit flex flex-col justify-center items-center gap-2'}>
            <p className={'heading-md text-white-1000'}>Smart AI face scan</p>
            <div className={'bg-white-200 w-[270px] h-0.5'} />
            <p className={'heading-sm text-white-800'}>In progress</p>
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
              We're analyzing which eyewear<br />
              suits you best!
            </p>
          </div>
        </div>
      </div>
    </ResponsiveContainer>
  );
}

interface ResultBodyProps {
  faceShape: TFaceShape;
  isQrView: boolean;
  onSelectProduct: (product: ProductType) => void;
  onOpenQr: () => void;
  onScanAnother: () => void;
  onDownloadPng: () => void;
}

function ResultBody({
  faceShape,
  isQrView,
  onSelectProduct,
  onOpenQr,
  onScanAnother,
  onDownloadPng,
}: ResultBodyProps) {
  if (!FaceShapeData[faceShape]) return null;

  return (
    <div className="pt-6 px-9 w-full select-none flex flex-col gap-8" data-capture-content="true">
      <FaceShapeCard type={faceShape} />

      <div className="flex flex-col gap-5">
        <p className="heading-xl text-primary-50">Recommendation Frame</p>
        <div className={styles.result_recommended_frame}>
          {FaceShapeData[faceShape].frameRecommendation.map((item, index) => {
            const product = FrameProducts[item];
            if (!product) return null;
            return (
              <RecommendedFrame
                key={item}
                onClickProduct={onSelectProduct}
                items={{
                  shape: item,
                  products: product.map(p => p as ProductType) ?? [],
                }}
                ranking={index + 1}
              />
            );
          })}
        </div>
      </div>

      {isQrView ? (
        <div className="pb-8 flex flex-col gap-4" data-capture-ignore="true">
          <IooIBtn
            text="Save Image"
            icon="/upload.png"
            onClick={onDownloadPng}
          />
        </div>
      ) : (
        <div className="pb-8 flex flex-col gap-4">
          <IooIBtn
            text="Get QR Code"
            icon="/upload.png"
            onClick={onOpenQr}
          />
          <IooIBtn
            text="Scan Another Face"
            icon="/face.png"
            onClick={onScanAnother}
          />
        </div>
      )}
    </div>
  );
}

export default function Result({ params }: IProps) {
  const { shape } = use(params);
  const [selectProduct, setSelectProduct] = useState<ProductType | undefined>(undefined);
  const [isOpenQR, setIsOpenQR] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [modalSize, setModalSize] = useState({ width: 500, height: 800 });

  const captureRef = useRef<HTMLDivElement>(null);

  const searchParams = useSearchParams();
  const isQrView = searchParams.get('view') === 'qr';
  const router = useRouter();

  const rawShape = shape === "Square" ? "Angular" : shape;
  const validShapes = Object.keys(FaceShapeData) as TFaceShape[];
  const faceShape = validShapes.includes(rawShape as TFaceShape)
    ? (rawShape as TFaceShape)
    : null;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setModalSize({ width: window.innerWidth, height: window.innerHeight });
      const handleResize = () =>
        setModalSize({ width: window.innerWidth, height: window.innerHeight });
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  useEffect(() => {
    if (!faceShape) {
      router.push('/');
      return;
    }
    if (isQrView) {
      setIsLoading(false);
      return;
    }
    const timer = setTimeout(() => setIsLoading(false), 3000);
    return () => clearTimeout(timer);
  }, [faceShape, isQrView, router]);

  const handleDownloadPng = async () => {
    if (!captureRef.current) return;

    try {
      const target = captureRef.current.firstElementChild as HTMLElement;
      if (!target) return;

      const ignoreArea = target.querySelector('[data-capture-ignore="true"]') as HTMLElement;
      
      const totalHeight = target.scrollHeight - (ignoreArea?.offsetHeight ?? 0);
      const totalWidth = 810; 

      // 💡 옵션 객체 전체를 `as any` 캐스팅하여 modern-screenshot 컴파일 규칙 에러 완전 타파
      const dataUrl = await domToPng(target, {
        width: totalWidth,
        height: totalHeight,
        scale: 2, 
        style: {
          transform: 'none',
          overflow: 'visible',
          height: 'auto',
          backgroundImage: "url('/background/bg_result.svg')",
          backgroundSize: "cover",
          backgroundPosition: "center top",
          backgroundAttachment: "local",
          backgroundColor: "#0b3d3f", 
        },
        onClone: (clone: any) => {
          const clonedRoot = clone as HTMLElement;
          
          clonedRoot.style.transform = 'none';
          clonedRoot.style.transformOrigin = 'top';
          clonedRoot.style.height = 'auto';
          clonedRoot.style.width = `${totalWidth}px`;
          clonedRoot.style.overflow = 'hidden';

          clonedRoot.style.backgroundImage = "url('/background/bg_result.svg')";
          clonedRoot.style.backgroundSize = "cover";
          clonedRoot.style.backgroundPosition = "center top";
          clonedRoot.style.backgroundAttachment = "local";
          clonedRoot.style.backgroundColor = "#0b3d3f";

          const cloneIgnore = clonedRoot.querySelector('[data-capture-ignore="true"]');
          if (cloneIgnore) {
            cloneIgnore.remove();
          }
        }
      } as any);

      const link = document.createElement('a');
      link.download = `result-${shape}.png`;
      link.href = dataUrl;
      link.click();

    } catch (error) {
      console.error("전체 스크롤 이미지 저장 중 오류 발생:", error);
    }
  };

  const targetUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/result/${shape}?view=qr`
      : '';

  if (!faceShape) return null;

  return (
    <Suspense fallback={null}>
      {isLoading && <ResultLoadingOverlay />}

      <ResponsiveContainer
        page="result"
        containerRef={captureRef}
      >
        <SiteHeader />

        <ResultBody
          faceShape={faceShape}
          isQrView={isQrView}
          onSelectProduct={setSelectProduct}
          onOpenQr={() => setIsOpenQR(true)}
          onScanAnother={() => router.push('/')}
          onDownloadPng={handleDownloadPng}
        />
      </ResponsiveContainer>

      {faceShape && (
        <>
          {isOpenQR && (
            <QRModal
              faceShape={faceShape}
              onClose={() => setIsOpenQR(false)}
              modalSize={modalSize}
              targetUrl={targetUrl}
            />
          )}
          {selectProduct && (
            <IooISelectModal
              faceShape={faceShape}
              title={selectProduct.name}
              src={selectProduct.src}
              vendor={selectProduct.vendor}
              onClose={() => setSelectProduct(undefined)}
            />
          )}
        </>
      )}
    </Suspense>
  );
}