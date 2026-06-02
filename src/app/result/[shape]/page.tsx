"use client"
import styles from "@/css/main.module.css"
import SiteHeader from '@/components/header';
import FaceShapeCard from '@/components/faceShapeCard';
import ResponsiveContainer from '@/components/ResponsiveContainer';
import RecommendedFrame from '@/components/Result/recommendedFrame';
import IooIBtn from '@/components/IooIBtn';
import { CelebType, TFaceShape } from '@/types/face';
import IooIModal from '@/components/Modal/IooIModal';
import React, { Suspense, use, useEffect, useState, useRef } from 'react';
import IooISelectModal from '@/components/Modal/IooISelectModal';
import QRModal from '@/components/Modal/qrModal';
import { FaceShapeData } from '@/data/faceShapeData';
import { FrameProducts, ProductType } from '@/data/frameData';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { domToPng } from 'modern-screenshot';

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
    /* 💡 2. 진짜 캡처되어야 하는 알맹이(전체 스크롤 영역)에만 data 속성을 명시합니다. */
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
  const [selectCeleb, setSelectCeleb] = useState<CelebType | undefined>(undefined);
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

  // ✅ 사용자가 [Save Image] 버튼을 클릭했을 때만 실행되는 전체 영역 캡처 함수
  const handleDownloadPng = async () => {
    if (!captureRef.current) return;

    try {
      const target = captureRef.current;

      // 💡 [핵심 변경] 캡처 시작 전, 화면 밖으로 넘치는 자식 요소를 포함한 '진짜 전체 렌더링 높이'를 구합니다.
      // target.scrollHeight는 스크롤 박스 내부에 숨겨진 모든 컨텐츠의 실제 높이를 반환합니다.
      const totalHeight = target.scrollHeight;
      const totalWidth = target.scrollWidth || 810; // 원본 디자인 가로폭 기준 (기본값 설정)

      const dataUrl = await domToPng(target, {
        // 💡 중요: 시작 규격 자체를 스크롤 끝까지 포함한 전체 크기로 강제 지정합니다.
        width: totalWidth,
        height: totalHeight,
        features: {
          imageEmbed: true, // 이미지 에셋 깨짐 방지
        },
        scale: 2, // 2배 고화질 유지
        onClone: (clone) => {
          const clonedRoot = clone as HTMLElement;
          
          // 1. 이미지 파일로 구워질 복제 가상 DOM의 스타일 감옥을 완전히 해제합니다.
          clonedRoot.style.transform = 'none';
          clonedRoot.style.transformOrigin = 'top';
          clonedRoot.style.height = 'auto';
          clonedRoot.style.minHeight = 'max-content';
          clonedRoot.style.overflow = 'visible';

          // 2. ResponsiveContainer가 내부적으로 scale이나 height 제한을 걸어두었다면 복제본 안에서 함께 해제합니다.
          const responsiveInner = clonedRoot.firstElementChild as HTMLElement;
          if (responsiveInner) {
            responsiveInner.style.transform = 'none';
            responsiveInner.style.height = 'auto';
            responsiveInner.style.overflow = 'visible';
          }

          // 3. 저장될 결과물 PNG 이미지 안에서는 [Save Image] 버튼이 노출되지 않도록 복제본에서 삭제합니다.
          const ignoreArea = target.querySelector(
            '[data-capture-ignore="true"]'
          ) as HTMLElement;

          const totalHeight =
            target.scrollHeight -
            (ignoreArea?.offsetHeight ?? 0);
        }
      });

      // 브라우저 파일 다운로드 트리거
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

      {/* 💡 1. 캡처 ref 영역을 한 단계 격상시켜 부모 컨테이너 전체를 감싸게 만듭니다. */}
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
          {selectCeleb && (
            <IooIModal
              items={{
                title: 'Celebs with Your Face Type',
                subTitle: selectCeleb.name,
                imgSrc: selectCeleb.img_src,
              }}
              onClose={() => setSelectCeleb(undefined)}
            />
          )}
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