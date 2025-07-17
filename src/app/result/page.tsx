'use client';

import React, { useState, Suspense } from 'react';
// import { useRouter, useSearchParams } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

// 데이터 임포트
import { faceShapeDetails } from '@/data/faceData';
import { frameRecommendations } from '@/data/reconMap';
import { frameShapeDetails } from '@/data/frameData';
import { FaceShapeDetail, FrameShapeDetail } from '@/types/face';

function ResultContent() {
  // const router = useRouter();
  const searchParams = useSearchParams();
  const [showQRModel, setShowQRModel] = useState(false);
  const [selectedCelebrity, setSelectedCelebrity] = useState<string | null>(null);


  // URL 파라미터에서 데이터 가져오기
    const faceShapeRaw = searchParams.get('faceShape') || 'Unknown';
    const faceShape = faceShapeRaw.match(/^[A-Za-z]+/)?.[0] || 'Unknown';

  // const confidence = parseFloat(searchParams.get('confidence') || '0');
  // const ratios = JSON.parse(searchParams.get('ratios') || '{}');

  // 얼굴형 상세 정보
    const faceDetail = faceShapeDetails.find(
        (f: FaceShapeDetail) =>
            f.shape.toLowerCase() === faceShape.toLowerCase()
    );

  // 추천 프레임 정보
  const recommendations = frameRecommendations[faceShape];
  const recommendedFrames = recommendations?.recommendedFrames || [];

  // 추천 프레임 상세 정보
  const frameDetails = recommendedFrames.map((frameName: string) =>
    frameShapeDetails.find((f: FrameShapeDetail) => f.shape.toLowerCase() === frameName.toLowerCase()),
  ).filter(Boolean);


  // 디버깅용 로그npm inst
    /*
    useEffect(() => {
    console.log('Result Page Data:', {
      faceShape,
      confidence,
      faceDetail,
      recommendations,
      frameDetails,
      rawParams: Object.fromEntries(searchParams.entries()),
    });
  }, [faceShape, confidence, faceDetail, recommendations, frameDetails, searchParams]);
    */  

    return (
        <div className="fixed inset-0 z-20">
            {/* 배경 */}
            <Image src="/Bg_result.png" alt="로딩 배경" fill className="object-cover object-center z-0" priority />
            <div className="flex flex-col h-full absolute inset-0 z-10">
                {/* 상단 로고 */}
                <header className="flex flex-col items-center mt-8 mb-4">
                    <Link href="/" passHref>
                        <div className="relative w-[100px] h-[64px] mb-4 cursor-pointer">
                            <Image src="/1001Logo.png" alt="1001Logo" fill className="object-contain" priority />
                        </div>
                    </Link>
                </header>

                <main className="max-w-4xl w-full mx-auto px-6 flex flex-col gap-6">
                    <Image
                        src={`/result/${faceShape}.png`}
                        alt={`${faceShape} 결과 이미지`}
                        width={738}
                        height={290}
                        className="w-full max-w-[738px] mx-auto rounded-[40px] shadow-lg"
                        priority
                    />


                    {/* 추천 프레임 */}
                    {frameDetails.length > 0 && (
                        <div style={{ display: 'flex', gap: '18px', justifyContent: 'center' }}>
                            {frameDetails.map((frame, index) =>
                                frame && index < 2 ? (
                                    <div
                                        key={index}
                                        style={{
                                            position: 'relative',
                                            width: 360,
                                            height: 360,
                                        }}
                                    >
                                        <Image
                                            src={`/frame/${frame.image}`}
                                            alt="frame"
                                            width={360}
                                            height={360}
                                            style={{ display: 'block' }}
                                        />
                                        <span
                                            className="text-3xl text-white/50"
                                            style={{
                                                position: 'absolute',
                                                top: '16px',
                                                left: '10px',
                                                borderRadius: '10px',
                                                padding: '6px 16px',
                                            }}
                                        >
                                            {index === 0
                                                ? '1st Recommendation'
                                                : '2nd Recommendation'}
                                        </span>
                                        <h3
                                            className="text-5xl text-white"
                                            style={{
                                                position: 'absolute',
                                                top: '60px',
                                                left: '10px',
                                                borderRadius: '10px',
                                                padding: '6px 16px',
                                                margin: 0,
                                            }}
                                        >
                                            {frame.shape}
                                        </h3>
                                    </div>
                                ) : null
                            )}
                        </div>
                    )}

                    {/* 얼굴형 설명 및 셀럽 */ }
                    <section
                        className="p-[32px] w-[738px] h-[502px] mx-auto"
                        style={{
                            borderRadius: "40px",
                            background: "rgba(0, 0, 0, 0.15)",
                            backdropFilter: "blur(6px)",
                        }}
                    >
                        {/* 상단: 좌측 얼굴형 박스 + 우측 설명 */}
                        <div className="flex flex-row items-start gap-8">
                            {/* 좌측: 얼굴형 텍스트 박스 */}
                            <div className="bg-white/20 rounded-3xl flex items-center justify-center w-[181px] h-[86px] shadow">
                                <span className="text-3xl text-white">{faceShape}</span>
                            </div>
                            {/* 우측: 설명 */}
                            <div className="flex-1">
                                <h3 className="text-3xl text-white mb-4">Understanding Your Face Shape</h3>
                                {faceDetail?.description && (
                                    <p className="text-2xl text-white/70">{faceDetail.description}</p>
                                )}
                            </div>
                        </div>

                        {/* 흰색 반투명 실선 */}
                        <hr className="my-6 border-t-2 border-white/20" />

                        {/* 하단: 셀럽 리스트 */}
                        <h4 className="text-3xl text-white mb-6">Celebs with Your Face Type</h4>
                        {faceDetail?.celebrities && (
                            <div className="flex flex-wrap gap-3 mt-4">
                                {faceDetail.celebrities.map((name, idx) => (
                                    <span
                                        key={idx}
                                        className="
                                            bg-gray-400/50
                                            rounded-full
                                            px-3
                                            py-3
                                            text-2xl
                                            text-white
                                            flex
                                            items-center
                                            gap-3
                                            cursor-pointer
                                            max-w-[200px]
                                            h-[68px]
                                            overflow-hidden
                                            whitespace-nowrap
                                            text-ellipsis
                                        "
                                        onClick={() => setSelectedCelebrity(name)}
                                        title={name} // 툴팁으로 전체 이름 표시
                                    >
                                        <Image
                                            src={`/button/Button_${name}.png`}
                                            alt={name}
                                            width={44}
                                            height={44}
                                            className="w-8 h-8 rounded-full object-cover shrink-0"
                                        />
                                        <span className="truncate">{name}</span>
                                    </span>
                                ))}
                            </div>
                        )}

                    </section>

                    {/* QR 코드 버튼 */}
                    <div className="w-[738px] h-[88px] mx-auto mt-4">
                        <button
                            onClick={() => setShowQRModel(true)}
                            className="w-full py-5 bg-gray-500/50 text-2xl text-white rounded-full hover:bg-black/60 transition flex items-center justify-center"
                        >
                            Get QR Code
                            <Image
                                src="/upload.png"
                                alt="Upload"
                                width={35}
                                height={35}
                                className="ml-2"
                            />
                        </button>
                    </div>

                    {/* QR 코드 모달 */}
                    {showQRModel && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md">
                            <div
                                className="relative flex flex-col items-center w-full max-w-2xl mx-4 px-10 py-12"
                                style={{
                                    borderRadius: "48px",
                                    border: "2px solid rgba(255, 255, 255, 0.38)",
                                    background: "rgba(0, 0, 0, 0.67)",
                                    boxShadow: "0px 4px 30px 0px rgba(0, 0, 0, 0.40)",
                                    backdropFilter: "blur(12.5px)",
                                }}
                            >
                                <span className="text-3xl font-semibold text-white">QR Code</span>
                                <hr className="w-[500px] border-t border-white border-opacity-30 my-3" />
                                <span className="text-2xl text-white mb-6">{faceShape}</span>
                                <div className="w-[500px] h-[500px] flex items-center justify-center mb-8">
                                    <Image
                                        src={`/QR/QR_${faceShape}.png`}
                                        alt={`${faceShape} QR Code`}
                                        width={500}
                                        height={500}
                                        className="rounded-2xl"
                                    />
                                </div>
                                <button
                                    onClick={() => setShowQRModel(false)}
                                    className="w-full py-4 bg-white/20 text-2xl text-white rounded-full hover:bg-white/40 transition"
                                >
                                    Got it
                                </button>
                            </div>
                        </div>
                    )}

                    {/* 셀럽 모달 */}
                    {selectedCelebrity && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md">
                            <div
                                className="relative flex flex-col items-center w-full max-w-2xl mx-4 px-10 py-12"
                                style={{
                                    borderRadius: "48px",
                                    border: "2px solid rgba(255, 255, 255, 0.38)",
                                    background: "rgba(0, 0, 0, 0.67)",
                                    boxShadow: "0px 4px 30px 0px rgba(0, 0, 0, 0.40)",
                                    backdropFilter: "blur(12.5px)",
                                }}
                                onClick={e => e.stopPropagation()}
                            >
                                <span className="text-3xl font-semibold text-white">Celebs with Your Face Type</span>
                                <hr className="w-[500px] border-t border-white border-opacity-30 my-3" />
                                {/* 셀럽 이름 */}
                                <span className="text-2xl text-white mb-6">{selectedCelebrity}</span>
                                {/* 셀럽 사진 */}
                                <div className="w-[500px] h-[500px] flex items-center justify-center mb-8">
                                    <Image
                                        src={`/model/Model_${selectedCelebrity}.png`}
                                        alt={selectedCelebrity}
                                        width={500}
                                        height={500}
                                        className="rounded-2xl object-cover"
                                    />
                                </div>
                                {/* Got it 버튼 */}
                                <button
                                    onClick={() => setSelectedCelebrity(null)}
                                    className="w-full py-4 bg-white/20 text-2xl text-white rounded-full hover:bg-white/40 transition"
                                >
                                    Got it
                                </button>
                            </div>
                        </div>
                    )}
                </main>
            </div>
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