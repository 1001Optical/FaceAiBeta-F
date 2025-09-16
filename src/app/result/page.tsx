'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from '@/css/main.module.css'

// 데이터 임포트
import { faceShapeDetails } from '@/data/faceData';
import { frameRecommendations } from '@/data/reconMap';
import { frameShapeDetails } from '@/data/frameData';
import { FaceShapeDetail, FrameShapeDetail, Celebrity } from '@/types/face';
import SiteHeader from '@/components/header';
import IooIModal from '@/components/Modal/IooIModal';
import QRModal from '@/components/Modal/qrModal';
import ResultBtn from '@/components/resultBtn';
import ResponsiveContainer from '@/components/ResponsiveContainer';

function ResultContent() {
  const searchParams = useSearchParams();
  const [showQRModel, setShowQRModel] = useState(false);
  const [selectedCelebrity, setSelectedCelebrity] = useState<Celebrity | null>(
    null
  );
  const router = useRouter();

  // 뷰포트 크기에 따른 스케일 상태
  const [scale, setScale] = useState("scale-1");

  useEffect(() => {
    function updateScale() {
      const wScale = window.innerWidth / 810;
      const hScale = window.innerHeight / 1080;
      setScale(`scale-[${ Math.min(wScale, hScale, 1) }]`);
    }
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  // URL 파라미터에서 데이터 가져오기
  const faceShapeRaw = searchParams.get('faceShape') || 'Unknown';
  const faceShape = faceShapeRaw.match(/^[A-Za-z]+/)?.[0] || 'Unknown';

  // const faceShape = searchParams.get('faceShape') || 'Heart';

  // 얼굴형 상세 정보
  const faceDetail = faceShapeDetails.find(
    (f: FaceShapeDetail) => f.shape.toLowerCase() === faceShape.toLowerCase()
  );

  // 추천 프레임 정보
  const recommendations = frameRecommendations[faceShape];
  const recommendedFrames = recommendations?.recommendedFrames || [];

  // 추천 프레임 상세 정보
  const frameDetails = recommendedFrames
    .map((frameName: string) =>
      frameShapeDetails.find(
        (f: FrameShapeDetail) =>
          f.shape.toLowerCase() === frameName.toLowerCase()
      )
    )
    .filter(Boolean);

  // 반응형 모달 스타일
  const getModalSize = () => {
    // 예시: 화면의 80vw/80vh를 넘지 않도록 제한
    const maxWidth = Math.min(window.innerWidth * 0.8, 500);
    const maxHeight = Math.min(window.innerHeight * 0.8, 600);
    return {
      width: maxWidth,
      height: maxHeight,
    };
  };
  // 모달 크기 상태 관리
  const [modalSize, setModalSize] = useState({ width: 400, height: 500 });
  useEffect(() => {
    function handleModalResize() {
      setModalSize(getModalSize());
    }
    handleModalResize();
    window.addEventListener('resize', handleModalResize);
    return () => window.removeEventListener('resize', handleModalResize);
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col z-20 bg-[url(/Bg_result.png)] bg-cover bg-center">
      <ResponsiveContainer>
      {/* 상단 로고 고정 */}
      <SiteHeader />

      {/* QR 코드 모달: 화면 전체에 오버레이, 바깥 영역은 항상 반투명 처리. 내부 모달만 화면 크기에 따라 반응형 */}
      {
        showQRModel && (
          <QRModal
            faceShape={faceShape}
            onClose={() => setShowQRModel(false)}
            modalSize={modalSize}
          />
        )
      }
      {/* 셀럽 모달: 화면 전체에 오버레이, 바깥 영역은 항상 반투명 처리. 내부 모달만 화면 크기에 따라 반응형 */}
      {
        selectedCelebrity &&
        <IooIModal
          items={{
            title: "Celebs with Your Face Type",
            sub_title: selectedCelebrity.name,
            img_src: `/model/Model_${selectedCelebrity.name}.png`,
          }}
          onClose={() => setSelectedCelebrity(null)}
        />
      }

      {/* 메인 영역 */}
      <div className={`${styles.result_container}`}>
        {/* 컨텐츠 박스: 고정 크기 + scale + 중앙 정렬 */}
        <div className={"w-[810px] h-[1080px] relative bg-transparent origin-top " + scale}>
          <div className={styles.result_main}>
            <Image
              src={`/result/${faceShape}.png`}
              alt={`${faceShape} 결과 이미지`}
              width={738}
              height={290}
              className={styles.result_img}
              priority
            />

            {/* 얼굴형 설명*/}
            <section
              className="p-[32px] w-738 h-[210px] mx-auto mb-6 rounded-[40px] bg-white/20 backdrop-blur-[6px]"
            >
              <div className="flex flex-row items-start gap-8">
                <div className="flex-1">
                  <h3 className="text-3xl font-aribau text-white mb-4">
                    Understanding Your Face Shape
                  </h3>
                  {faceDetail?.description && (
                    <p className="text-2xl font-aribau text-white/70">
                      {faceDetail.description}
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* Recommendation Frame 문구 추가 */}
            <div className="w-[738px] mx-auto mt-6 mb-6">
              <h3 className="text-4xl font-aribau text-white">
                Recommendation Frame
              </h3>
            </div>

            {/* 추천 프레임 */}
            {frameDetails.length > 0 && (
              <div className={"flex flex-col gap-6 items-center justify-start"}>
                {frameDetails.map((frame, index) =>
                  frame && index < 2 ? (
                    <div
                      key={index}
                      className={"relative w-[738px] h-[392px] rounded-[40px] overflow-hidden"}
                    >
                      <Image
                        className={"block rounded-[40px]"}
                        src={`/frame/${frame.image}`}
                        alt="frame"
                        width={738}
                        height={392}
                      />
                      <span
                        className="heading-xl text-opacity-white-400 font-aribau absolute top-4 rounded-[40px] py-5 px-[42px]"
                      >
                        {index === 0 ? '1st' : '2nd'}
                      </span>
                      <h3
                        className="absolute top-[60px] py-5 px-[42px] m-0 text-5xl text-white font-aribau"
                      >
                        {frame.shape}
                      </h3>

                      {/* 우측 상단부에 "faceShape Celebs" */}
                      <div className="absolute top-4 left-[350px] rounded-[40px] py-5 px-[42px] box-border">
                        <h4 className="m-0 mb-2.5 text-4xl text-white font-aribau">
                          {faceShape} Celebs
                        </h4>

                        {/* 셀럽 3인 버튼 리스트 출력 */}
                        <div className={"flex flex-col gap-3 items-start w-full"}>
                          {faceDetail?.celebrities?.slice(index * 3, index * 3 + 3)
                            .map((celeb, btnIdx) => (
                              <button
                                key={btnIdx}
                                type="button"
                                className={`flex items-center border-0 border-b-4 border-solid outline-none cursor-pointer gap-2 py-2 ${celeb.gender === 'female' ? 'border-b-[#FF69B4]' : 'border-b-[#00BFFF]'}`}
                                onClick={() => setSelectedCelebrity(celeb)}
                              >
                                <Image
                                  src={`/button/Button_${celeb.name}.png`}
                                  alt={celeb.name}
                                  width={64}
                                  height={64}
                                />
                                <span className={"block text-left"}>
                                  <p className={"font-normal text-white text-2xl font-aribau"}>{celeb.name}</p>
                                </span>
                              </button>
                            ))}
                        </div>
                      </div>
                    </div>
                  ) : null
                )}
              </div>
            )}

            {/* QR 코드 버튼 */}
            <ResultBtn
              onClick={() => setShowQRModel(true)} text={"Get QR Code"} image={"upload"}
              style={"mt-10"}
            />

            {/* Go Back 버튼 */}
            <ResultBtn
              onClick={() => router.push('/')} text={"Scan Another Face"} image={"face"}
              style={"mt-4 mb-12"}
            />
          </div>
        </div>
      </div>
      </ResponsiveContainer>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="fixed inset-0 z-20">
      <Image
        src="/Blur.jpg"
        alt="로딩 배경"
        fill
        className="object-cover object-center z-0"
        priority
      />
      <div className="absolute inset-0 flex items-center justify-center z-10 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-lg">Loading results...</p>
        </div>
      </div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ResultContent />
    </Suspense>
  );
}
