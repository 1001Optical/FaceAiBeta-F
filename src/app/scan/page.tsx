'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Loading from '@/components/Loading';
import { faceShapeDetails } from '@/data/faceData';
import { frameRecommendations } from '@/data/reconMap';
import { frameShapeDetails } from '@/data/frameData';
import { FaceShapeDetail, FrameShapeDetail } from '@/types/face';
import Image from 'next/image'
import "./FaceScanner.css";
import FaceScanBar from "./FaceScanBar";

export default function ScanPage() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [step, setStep] = useState<'intro' | 'guide' | 'loading'>('intro');
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;


    // 캡처 및 얼굴 감지 상태 (useCallback, useEffect보다 위에 선언)
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [captured, setCaptured] = useState(false);
    const [countdown, setCountdown] = useState<number | null>(null);

    // 카메라 프리뷰 시작
    useEffect(() => {
        if (step === 'intro' || step === 'guide') {
            startCamera();
        }
        // 정리: 컴포넌트 언마운트 시 카메라 종료
        return () => {
            if (videoRef.current) {
                const stream = videoRef.current.srcObject as MediaStream;
                if (stream) {
                    stream.getTracks().forEach(track => track.stop());
                }
            }
        };
    }, [step]);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    facingMode: 'user',
                },
            });

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            setError('Cannot access camera. Please check camera permissions.');
        }
    };

    // 캡처 함수 useCallback 적용
    const handleCapture = useCallback(async () => {
        if (!videoRef.current || !canvasRef.current || isLoading) {
            return;
        }

        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.save();
            ctx.scale(-1, 1); // 좌우반전
            ctx.drawImage(
                video,
                -video.videoWidth,
                0,
                video.videoWidth,
                video.videoHeight
            );
            ctx.restore();
        }
        setCaptured(true);
        setIsLoading(true);
        setError(null); // 에러 상태 초기화

        try {
            // 캡처된 이미지를 Blob으로 변환
            const blob = await new Promise<Blob | null>(resolve => {
                canvas.toBlob(blob => resolve(blob), 'image/jpeg', 0.95);
            });

            if (!blob) {
                throw new Error('Failed to convert image.');
            }

            // FormData로 변환
            const formData = new FormData();
            formData.append('image', blob, 'capture.jpg');

            // Flask API 엔드포인트에 POST 요청
            const response = await fetch(`${apiUrl}/upload_image`, {
                method: 'POST',
                body: formData,
                headers: {
                    Accept: 'application/json',
                },
                signal: AbortSignal.timeout(10000),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }

            const data = await response.json();

            if (!data || !data.image_url) {
                throw new Error('Image upload failed.');
            }

            // 업로드된 이미지 URL을 Face Shape Detection API에 POST
            const detectRes = await fetch(`${apiUrl}/detect_face_shape`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer eyJzdWIiOiIxMjM0NTY4ODkwIiwibmFtZSI6IkpqaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ`,
                    Accept: 'application/json',
                },
                body: JSON.stringify({ image_url: data.image_url }),
                signal: AbortSignal.timeout(10000),
            });

            if (!detectRes.ok) {
                const errorText = await detectRes.text();
                throw new Error(`HTTP error! status: ${detectRes.status}, message: ${errorText}`);
            }

            const detectData = await detectRes.json();

            // 얼굴 인식 실패 처리
            if (
                (detectData.status === 'error' &&
                    detectData.status_code === 'unable_to_determine') ||
                detectData.shape === 'Unknown' ||
                !detectData.shape
            ) {
                setError('Face recognition failed. Please try again.');
                setStep('guide');
                setCaptured(false);
                return;
            }

            // 결과 페이지로 이동하면서 데이터 전달
            const queryParams = new URLSearchParams({
                faceShape: detectData.shape,
                confidence: detectData.confidence || '0',
                ratios: JSON.stringify({
                    cheek: detectData.cheek_ratio,
                    chin: detectData.chin_ratio,
                    forehead: detectData.forehead_ratio,
                    head: detectData.head_ratio,
                    jaw: detectData.jaw_ratio,
                    jawAngle: detectData.jaw_angle,
                }),
            }).toString();

            // 얼굴형 이미지와 프레임 이미지들을 미리 로드
            const faceDetail = faceShapeDetails.find(
                (f: FaceShapeDetail) => f.shape === detectData.shape
            );
            const recommendations =
                frameRecommendations[
                detectData.shape as keyof typeof frameRecommendations
                ];
            const frameDetails =
                recommendations?.recommendedFrames
                    .map((frameName: string) =>
                        frameShapeDetails.find(
                            (f: FrameShapeDetail) =>
                                f.shape.toLowerCase() === frameName.toLowerCase()
                        )
                    )
                    .filter(Boolean) || [];

            // 모든 이미지 로드 완료 대기
            const imageUrls = [
                faceDetail?.image,
                ...frameDetails.map(
                    (frame: FrameShapeDetail | undefined) => frame?.image
                ),
            ].filter(Boolean) as string[];

            const imageLoadPromises = imageUrls.map(url => {
                return new Promise((resolve, reject) => {
                    const img = new Image();
                    img.onload = resolve;
                    img.onerror = reject;
                    img.src = url;
                });
            });

            try {
                // 모든 이미지가 로드될 때까지 대기
                await Promise.all(imageLoadPromises);
                // 이미지 로드가 완료된 후 결과 페이지로 이동
                router.push(`/result?${queryParams}`);
            } catch (error) {
                // 이미지 로드 실패 시에도 결과 페이지로 이동
                router.push(`/result?${queryParams}`);
            }
        } catch (err) {
            setError(
                'API request failed: ' + (err instanceof Error ? err.message : String(err))
            );
            setStep('guide');
            setCaptured(false);
        } finally {
            setIsLoading(false);
        }
    }, [apiUrl, isLoading, captured, router]);

    // 얼굴이 타원 안에 들어오면 5초 후 자동 캡처 (임시: 버튼 없이 타이머)
    useEffect(() => {
        if (step === 'guide' && !captured) {
            setCountdown(5);
            const timer = setTimeout(() => {
                handleCapture();
            }, 5000);
            return () => clearTimeout(timer);
        } else {
            setCountdown(null);
        }
    }, [step, captured, handleCapture]);

    return (
        <div
            className="relative flex flex-col items-center justify-center min-h-screen bg-black p-0 m-0"
            style={{ width: '100%', height: '100vh' }}
        >
            {/* 카메라 프리뷰 */}
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 w-full h-full object-cover z-0"
                style={{ transform: 'scaleX(-1)' }}
            />
            {/* 캡처된 이미지 미리보기 (디버그용) */}
            <canvas ref={canvasRef} style={{ display: 'none' }} />


            {/* 로딩 화면 */}


            {/* 에러 메시지 */}
            {error && (
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg">
                    <p className="text-center">{error}</p>
                </div>
            )}

            {/* 반투명 오버레이 + 안내문구 + 버튼 (1번 화면) */}
            {step === 'intro' && (
                <div
                    className="fixed inset-0 z-10"
                    style={{
                        background: 'rgba(0,0,0,0.35)',
                        minWidth: 658,
                        minHeight: 652,
                    }}
                >
                    {/* 로고: 메인화면과 동일한 위치/크기 */}
                    <header
                        className="flex flex-col items-center justify-center space-y-8 mb-8 pt-8"
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '100%',
                            zIndex: 20,
                        }}
                    >
                        <div className="relative w-[200px] h-[120px]">
                            <Image
                                src="/1001Logo.png"
                                alt="1001Logo"
                                fill
                                sizes="200px"
                                className="object-contain"
                            />
                        </div>
                    </header>

                    {/* 중앙 반투명 박스 */}
                    <div
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 1107,
                            height: 1074,
                            boxSizing: 'border-box',
                            borderRadius: 48,
                            border: '2px solid var(--opacity-white-400, rgba(255, 255, 255, 0.38))',
                            background: 'var(--opacity-black-600, rgba(0, 0, 0, 0.60))',
                            boxShadow: '0px 4px 30px 0px rgba(0, 0, 0, 0.10)',
                            backdropFilter: 'blur(12.5px)',
                            display: 'inline-flex',
                            padding: '60px 40px',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: 42,
                        }}
                    >
                        {/* 안내문구 및 아이콘 */}
                        <div className="flex flex-col items-center">
                            <div className="flex justify-center items-center mb-6">
                                <Image
                                    src="/record_icon.png"
                                    alt="Record"
                                    width={100}
                                    height={100}
                                />
                            </div>
                            <h1
                                style={{
                                    color: '#FFF',
                                    fontFamily: '"Aribau Grotesk", sans-serif',
                                    fontSize: 40,
                                    fontWeight: 400,
                                    lineHeight: '136%',
                                    letterSpacing: '-0.084px',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                }}
                            >
                                Please adjust face to guidelines
                            </h1>

                            {/* 실선 구분선 */}
                            <div
                                style={{
                                    width: 960,
                                    height: 2,
                                    background: 'rgba(136,136,136,0.55)', 
                                    marginTop: 20,
                                    marginBottom: 10,
                                    marginLeft: 0,
                                    marginRight: 0,
                                    borderRadius: 1,
                                }}
                            />

                            {/* 흰색 반투명 박스 3개 (아이콘만) */}
                            <div className="flex gap-8 mt-10">
                                <div
                                    className="flex flex-col items-center justify-center"
                                    style={{
                                        width: 300,
                                        height: 300,
                                        borderRadius: 42,
                                        background: 'var(--opacity-white-400, rgba(255, 255, 255, 0.38))',
                                        boxShadow: `0px 0px 2.183px 0px rgba(0, 0, 0, 0.10),
                                                    0px 1.092px 8.732px 0px rgba(0, 0, 0, 0.12),
                                                    1.092px 1.092px 0px -0.546px #333 inset,
                                                    -1.092px -1.092px 0px -0.546px #262626 inset,
                                                    1.092px 1.092px 0.546px -1.092px #FFF inset,
                                                    -1.092px -1.092px 0.546px -1.092px #FFF inset,
                                                    0px 0px 3.275px 0px rgba(255, 255, 255, 0.50) inset,
                                                    0px 0px 17.465px 0px #F2F2F2 inset
                                        `,
                                        backdropFilter: 'blur(6.549295425415039px)',
                                    }}
                                >
                                    <Image
                                        src="/camera_icon.png"
                                        alt="Camera"
                                        width={240}
                                        height={240}
                                    />
                                </div>
                                <div
                                    className="flex flex-col items-center justify-center"
                                    style={{
                                        width: 300,
                                        height: 300,
                                        borderRadius: 42,
                                        background: 'var(--opacity-white-400, rgba(255, 255, 255, 0.38))',
                                        boxShadow: `0px 0px 2.183px 0px rgba(0, 0, 0, 0.10),
                                                    0px 1.092px 8.732px 0px rgba(0, 0, 0, 0.12),
                                                    1.092px 1.092px 0px -0.546px #333 inset,
                                                    -1.092px -1.092px 0px -0.546px #262626 inset,
                                                    1.092px 1.092px 0.546px -1.092px #FFF inset,
                                                    -1.092px -1.092px 0.546px -1.092px #FFF inset,
                                                    0px 0px 3.275px 0px rgba(255, 255, 255, 0.50) inset,
                                                    0px 0px 17.465px 0px #F2F2F2 inset
                                        `,
                                        backdropFilter: 'blur(6.549295425415039px)',
                                    }}
                                >
                                    <Image
                                        src="/glasses_icon.png"
                                        alt="Glasses"
                                        width={240}
                                        height={240}
                                    />
                                </div>
                                <div
                                    className="flex flex-col items-center justify-center"
                                    style={{
                                        width: 300,
                                        height: 300,
                                        borderRadius: 42,
                                        background: 'var(--opacity-white-400, rgba(255, 255, 255, 0.38))',
                                        boxShadow: `0px 0px 2.183px 0px rgba(0, 0, 0, 0.10),
                                                    0px 1.092px 8.732px 0px rgba(0, 0, 0, 0.12),
                                                    1.092px 1.092px 0px -0.546px #333 inset,
                                                    -1.092px -1.092px 0px -0.546px #262626 inset,
                                                    1.092px 1.092px 0.546px -1.092px #FFF inset,
                                                    -1.092px -1.092px 0.546px -1.092px #FFF inset,
                                                    0px 0px 3.275px 0px rgba(255, 255, 255, 0.50) inset,
                                                    0px 0px 17.465px 0px #F2F2F2 inset
                                        `,
                                        backdropFilter: 'blur(6.549295425415039px)',
                                    }}
                                >
                                    <Image
                                        src="/hair_icon.png"
                                        alt="Hair"
                                        width={240}
                                        height={240}
                                    />
                                </div>
                            </div>

                            {/* 카테고리명: Camera, Eyewear, Hair */}
                            <div className="flex gap-8 mt-3">
                                <span
                                    style={{
                                        color: '#888',
                                        fontFamily: '"Aribau Grotesk"',
                                        fontSize: 25,
                                        fontWeight: 500,
                                        textAlign: 'center',
                                        width: 300,
                                        marginTop: 8,
                                        marginBottom: 8,
                                        letterSpacing: '0.01em',
                                    }}
                                >
                                    Camera
                                </span>
                                <span
                                    style={{
                                        color: '#888',
                                        fontFamily: '"Aribau Grotesk"',
                                        fontSize: 25,
                                        fontWeight: 500,
                                        textAlign: 'center',
                                        width: 300,
                                        marginTop: 8,
                                        marginBottom: 8,
                                        letterSpacing: '0.01em',
                                    }}
                                >
                                    Eyewear
                                </span>
                                <span
                                    style={{
                                        color: '#888',
                                        fontFamily: '"Aribau Grotesk"',
                                        fontSize: 25,
                                        fontWeight: 500,
                                        textAlign: 'center',
                                        width: 300,
                                        marginTop: 8,
                                        marginBottom: 8,
                                        letterSpacing: '0.01em',
                                    }}
                                >
                                    Hair
                                </span>
                            </div>

                            {/* 안내문구 3개: 각 박스 하단에 위치 */}
                            <div className="flex gap-8 mt-4">
                                <span
                                    style={{
                                        color: '#FFF',
                                        fontFamily: '"Aribau Grotesk"',
                                        fontSize: 35,
                                        fontWeight: 300,
                                        textAlign: 'center',
                                        width: 300,
                                    }}
                                >
                                    Please look straight at the camera.
                                </span>
                                <span
                                    style={{
                                        color: '#FFF',
                                        fontFamily: '"Aribau Grotesk"',
                                        fontSize: 35,
                                        fontWeight: 300,
                                        textAlign: 'center',
                                        width: 300,
                                    }}
                                >
                                    Remove your eyewear for an accurate scan.
                                </span>
                                <span
                                    style={{
                                        color: '#FFF',
                                        fontFamily: '"Aribau Grotesk"',
                                        fontSize: 35,
                                        fontWeight: 300,
                                        textAlign: 'center',
                                        width: 300,
                                    }}
                                >
                                    Pull your hair back to show your face.
                                </span>
                            </div>
                        </div>

                        {/* 버튼: 박스 하단 */}
                        <button
                            style={{
                                width: 960,
                                height: 150,
                                borderRadius: 200,
                                border: '1.5px solid rgba(255,255,255,0.38)',
                                background: 'rgba(255,255,255,0.15)',
                                color: '#FFF',
                                fontSize: 35,
                                fontFamily: '"Aribau Grotesk"',
                                fontWeight: 300,
                                cursor: 'pointer',
                                marginTop: 32,
                                boxShadow: '0 2px 12px 0 rgba(0,0,0,0.08)',
                                transition: 'background 0.2s',
                            }}
                            onClick={() => setStep('guide')}
                            onMouseOver={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.35)')}
                            onMouseOut={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.15)')}
                        >
                            Let&apos;s Begin
                        </button>
                    </div>
                </div>
            )}

            {/* 2번 화면: 타원 가이드라인 + 안내문구 */}
            {
                step === 'guide' && (
                    <div
                        className="absolute inset-0 flex flex-col items-center justify-center z-10 p-4"
                        style={{ background: 'rgba(0,0,0,0.35)' }}
                    >
                        {/* 로고: 메인화면과 동일한 위치/크기 */}
                        <header
                            className="flex flex-col items-center justify-center space-y-8 mb-8 pt-8"
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: '100%',
                                zIndex: 20,
                            }}
                        >
                            <div className="relative w-[200px] h-[120px]">
                                <Image
                                    src="/1001Logo.png"
                                    alt="1001Logo"
                                    fill
                                    sizes="200px"
                                    className="object-contain"
                                />
                            </div>
                        </header>

                        <div
                            style={{
                                position: "absolute",
                                width: 1200,
                                height: 1320,
                                left: "50%",
                                top: "50%",
                                transform: "translate(-50%, -50%)",
                                pointerEvents: "none",
                                zIndex: 20,
                            }}
                        >
                            {/* 타원 가이드라인 */}
                            <svg
                                width="100%"
                                height="100%"
                                viewBox="0 0 1200 1320"
                                style={{
                                    display: 'block',
                                    position: 'absolute',
                                    left: '50%',
                                    top: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    zIndex: 20,
                                }}
                            >
                                <ellipse
                                    cx="600"
                                    cy="660"
                                    rx="310"
                                    ry="396"
                                    stroke="var(--opacity-white-1000, #FFF)"
                                    strokeWidth={8}                                   
                                    fill="none"
                                    style={{ filter: 'drop-shadow(0 0 12px #fff)' }}
                                />
                            </svg>

                            {/* Face Scan Animation */}
                            <FaceScanBar />
                        </div>

                        {/* 안내문구 박스: 타원보다 훨씬 아래에 배치 */}
                        <div
                            style={{
                                display: "inline-flex",
                                padding: "32px 40px",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                gap: "24px",
                                borderRadius: "48px",
                                border: "2px solid var(--opacity-white-400, rgba(255, 255, 255, 0.38))",
                                background: "var(--opacity-black-400, rgba(0, 0, 0, 0.38))",
                                boxShadow: "0px 4px 30px 0px rgba(0, 0, 0, 0.10)",
                                backdropFilter: "blur(12.5px)",
                                color: "#fff",
                                fontSize: "1.15rem",
                                fontWeight: 500,
                                textAlign: "center",
                                maxWidth: "90%",
                                zIndex: 30,
                                position: "absolute",
                                left: "50%",
                                bottom: "60px",
                                transform: "translateX(-50%)"
                            }}
                        >
                            <div
                                style={{
                                    width: "658px",
                                    color: "var(--opacity-white-1000, #FFF)",
                                    textAlign: "center",
                                    fontFamily: '"Aribau Grotesk", sans-serif',
                                    fontSize: "24px",
                                    fontStyle: "normal",
                                    fontWeight: 400,
                                    lineHeight: "142%", // 34.08px
                                    letterSpacing: "-0.048px"
                                }}
                            >
                                Just a moment<br />
                                We're scanning your face to find the best frames for you!
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
}
