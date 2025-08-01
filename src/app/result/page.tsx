'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

// 데이터 임포트
import { faceShapeDetails } from '@/data/faceData';
import { frameRecommendations } from '@/data/reconMap';
import { frameShapeDetails } from '@/data/frameData';
import { FaceShapeDetail, FrameShapeDetail , Celebrity} from '@/types/face';

function ResultContent() {
    // const router = useRouter();
    // const TOP_OFFSET = 30;

    const searchParams = useSearchParams();
    const [showQRModel, setShowQRModel] = useState(false);
    const [selectedCelebrity, setSelectedCelebrity] = useState<Celebrity | null>(null);

    // 뷰포트 크기에 따른 스케일 상태
    const [scale, setScale] = useState(1);

    useEffect(() => {
        function updateScale() {
            const wScale = window.innerWidth / 810;
            const hScale = window.innerHeight / 1080;
            setScale(Math.min(wScale, hScale, 1));
        }
        updateScale();
        window.addEventListener('resize', updateScale);
        return () => window.removeEventListener('resize', updateScale);
    }, []);

    // URL 파라미터에서 데이터 가져오기
    const faceShapeRaw = searchParams.get('faceShape') || 'Unknown';
    const faceShape = faceShapeRaw.match(/^[A-Za-z]+/)?.[0] || 'Unknown';

    // const faceShape = searchParams.get('faceShape') || 'Oval';

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
        <div className="fixed inset-0 flex flex-col z-20">
            {/* 배경 이미지 전체 화면 */}
            <Image
                src="/Bg_result.png"
                alt="로딩 배경"
                fill
                className="object-cover object-center z-0"
                priority
            />

            {/* 상단 로고 고정 */}
            <header className="fixed top-8 left-1/2 -translate-x-1/2 z-30">
                <Link href="/" passHref>
                    <div className="relative w-[100px] h-[64px] cursor-pointer">
                        <Image src="/1001Logo.png" alt="1001Logo" fill className="object-contain" priority />
                    </div>
                </Link>
            </header>

            {/* QR 코드 모달: 화면 전체에 오버레이, 바깥 영역은 항상 반투명 처리. 내부 모달만 화면 크기에 따라 반응형 */}
            {showQRModel && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md">
                    <div
                        className="relative flex flex-col items-center bg-[rgba(0,0,0,0.3)] border-[2px] border-white/40 shadow-[0_4px_30px_0_rgba(0,0,0,0.4)] backdrop-blur-[12.5px] rounded-[48px] px-4 py-8"
                        style={{
                            width: modalSize.width,
                            maxWidth: "90vw",
                            height: modalSize.height,
                            maxHeight: "90vh",
                        }}
                    >
                        <span className="text-xl font-semibold text-white">QR Code</span>
                        <hr className="w-full border-t border-white border-opacity-30 my-3" />
                        <span className="text-lg text-white mb-6">{faceShape}</span>
                        <div
                            className="flex items-center justify-center mb-8"
                            style={{
                                width: Math.min(350, modalSize.width - 40),
                                height: Math.min(350, modalSize.width - 40),
                                maxWidth: "80vw",
                                maxHeight: "40vh",
                            }}
                        >
                            <Image
                                src={`/QR/QR_${faceShape}.png`}
                                alt={`${faceShape} QR Code`}
                                width={500}
                                height={500}
                                className="rounded-2xl object-contain w-full h-full"
                            />
                        </div>
                        <button
                            onClick={() => setShowQRModel(false)}
                            className="w-full py-4 bg-white/20 text-lg text-white rounded-full hover:bg-white/40 transition mt-auto"
                        >
                            Got it
                        </button>
                    </div>
                </div>
            )}

            {/* 셀럽 모달: 화면 전체에 오버레이, 바깥 영역은 항상 반투명 처리. 내부 모달만 화면 크기에 따라 반응형 */}
            {selectedCelebrity && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md">
                    <div
                        className="relative flex flex-col items-center bg-[rgba(0,0,0,0.3)] border-[2px] border-white/40 shadow-[0_4px_30px_0_rgba(0,0,0,0.4)] backdrop-blur-[12.5px] rounded-[48px] px-4 py-8"
                        style={{
                            width: modalSize.width,
                            maxWidth: "90vw",
                            height: modalSize.height,
                            maxHeight: "90vh",
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <span className="text-xl font-semibold text-white text-center">Celebs with Your Face Type</span>
                        <hr className="w-full border-t border-white border-opacity-30 my-3" />
                        {/* 셀럽 이름 */}
                        <span className="text-lg text-white mb-6">{selectedCelebrity?.name}</span>
                        {/* 셀럽 사진 */}
                        <div
                            className="flex items-center justify-center mb-8"
                            style={{
                                width: Math.min(350, modalSize.width - 40),
                                height: Math.min(350, modalSize.width - 40),
                                maxWidth: "80vw",
                                maxHeight: "40vh",
                            }}
                        >
                            <Image
                                src={`/model/Model_${selectedCelebrity?.name}.png`}
                                alt={selectedCelebrity?.name}
                                width={500}
                                height={500}
                                className="rounded-2xl object-cover w-full h-full"
                            />
                        </div>
                        <button
                            onClick={() => setSelectedCelebrity(null)}
                            className="w-full py-4 bg-white/20 text-lg text-white rounded-full hover:bg-white/40 transition mt-auto"
                        >
                            Got it
                        </button>
                    </div>
                </div>
            )}

            {/* 메인 영역 */}
            <div className="absolute top-[100px] left-0 w-full h-[calc(100vh-110px)] flex justify-center overflow-y-auto">

            {/* 컨텐츠 박스: 고정 크기 + scale + 중앙 정렬 */}
            <div
                style={{
                    width: 810,
                    height: 1080,
                    transform: `scale(${scale})`,
                    transformOrigin: 'top center',
                    position: 'relative',
                }}
                className="bg-transparent"
            >
                <main className="w-full mx-auto px-6 flex flex-col pt-[80px]">
                    <Image
                        src={`/result/${faceShape}.png`}
                        alt={`${faceShape} 결과 이미지`}
                        width={738}
                        height={290}
                        className="w-full max-w-[738px] mx-auto rounded-[40px] shadow-lg"
                        priority
                    />

                    {/* 얼굴형 설명*/}
                    <section
                        className="p-[32px] w-[738px] h-[210px] mx-auto mb-6"
                        style={{
                            borderRadius: "40px",
                            background: "rgba(255, 255, 255, 0.2)",
                            backdropFilter: "blur(6px)",
                        }}
                    >
                        <div className="flex flex-row items-start gap-8">
                            <div className="flex-1">
                                <h3 className="text-3xl text-white mb-4">Understanding Your Face Shape</h3>
                                {faceDetail?.description && (
                                    <p className="text-2xl text-white/70">{faceDetail.description}</p>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Recommendation Frame 문구 추가 */}
                    <div className="w-[738px] mx-auto mt-6 mb-6">
                        <h3 className="text-4xl text-white">Recommendation Frame</h3>
                    </div>

                    {/* 추천 프레임 */}
                    {frameDetails.length > 0 && (
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '24px',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                            }}
                        >
                            {frameDetails.map((frame, index) =>
                                frame && index < 2 ? (
                                    <div
                                        key={index}
                                        style={{
                                            position: 'relative',
                                            width: 738,
                                            height: 392,
                                            borderRadius: 40,
                                            overflow: 'hidden',
                                        }}
                                    >
                                        <Image
                                            src={`/frame/${frame.image}`}
                                            alt="frame"
                                            width={738}
                                            height={392}
                                            style={{ display: 'block', borderRadius: '40px' }}
                                        />
                                        <span
                                            className="text-4xl text-white/50"
                                            style={{
                                                position: 'absolute',
                                                top: '16px',
                                                borderRadius: '40px',
                                                padding: '20px 42px',
                                            }}
                                        >
                                            {index === 0
                                                ? '1st'
                                                : '2nd'}
                                        </span>
                                        <h3
                                            className="text-5xl text-white"
                                            style={{
                                                position: 'absolute',
                                                top: '60px',
                                                borderRadius: '40px',
                                                padding: '25px 42px',
                                                margin: 0,
                                            }}
                                        >
                                            {frame.shape}
                                        </h3>

                                        {/* 우측 상단부에 "faceShape Celebs" */}
                                        <div
                                            style={{
                                                position: 'absolute',
                                                top: '16px',
                                                left: '350px',
                                                borderRadius: '40px',
                                                padding: '20px 42px',
                                                boxSizing: 'border-box',
                                            }}
                                        >
                                            <h4 className="text-4xl text-white"
                                                style={{ margin: 0, marginBottom: 10 }}
                                            >   
                                                {faceShape} Celebs
                                            </h4>

                                            {/* 셀럽 3인 버튼 리스트 출력 */}
                                            <div style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '12px',
                                                alignItems: 'flex-start',
                                                width: '100%'
                                            }}>
                                                {faceDetail?.celebrities
                                                    ?.slice(index * 3, index * 3 + 3)
                                                    .map((celeb, btnIdx) => (
                                                        <button
                                                            key={btnIdx}
                                                            type="button"
                                                            className="text-2xl"
                                                            style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                color: '#fff',
                                                                fontWeight: 400,
                                                                border: 'none',
                                                                borderBottom: `4px solid ${celeb.gender === 'female' ? '#FF69B4' : '#00BFFF'}`,
                                                                outline: 'none',
                                                                cursor: 'pointer',
                                                                gap: '8px',
                                                                paddingTop: 8,
                                                                paddingBottom: 8,
                                                            }}
                                                            onClick={() => setSelectedCelebrity(celeb)}
                                                        >
                                                            <Image
                                                                src={`/button/Button_${celeb.name}.png`}
                                                                alt={celeb.name}
                                                                width={64}
                                                                height={64}
                                                            />
                                                            <span>
                                                                {celeb.name}
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
                    <div className="w-[738px] h-[88px] mx-auto mt-10">
                        <button
                            onClick={() => setShowQRModel(true)}
                            className="w-full py-5 bg-gray-500/40 text-2xl text-white rounded-full hover:bg-black/60 transition flex items-center justify-center"
                        >
                            Get QR Code
                            <Image
                                src="/upload.png"
                                alt="Upload"
                                width={44}
                                height={44}
                                className="ml-2"
                            />
                        </button>
                    </div>
                </main>
            </div>
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
