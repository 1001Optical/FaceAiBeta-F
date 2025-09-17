'use client';

import styles from '@/css/main.module.css'
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import './FaceScanner.css';
import FaceScanBar from './FaceScanBar';
import ResponsiveContainer from '../../components/ResponsiveContainer';
import SiteHeader from '@/components/header';

const intro_guideline = [
  {src: "cameracheck.png", title: "Camera", description: "Please look straight at the camera."},
  {src: "glassesclose.png", title: "Eyewear", description: "Remove your eyewear for an accurate scan."},
  {src: "haircheck.png", title: "Hair", description: "Pull your hair back to show your face."},
]

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
  const [, setCountdown] = useState<number | null>(null);

  // 카메라 프리뷰 시작
  useEffect(() => {
    if (step === 'intro' || step === 'guide') {
      startCamera();
    }

    // ref의 값을 클로저 변수로 저장
    const videoEl = videoRef.current;

    // 정리: 컴포넌트 언마운트 시 카메라 종료
    return () => {
      if (videoEl) {
        const stream = videoEl.srcObject as MediaStream;
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
      console.error(err);
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
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
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
          Authorization: process.env.API_TOKEN ?? "",
          Accept: 'application/json',
        },
        body: JSON.stringify({ image_url: data.image_url }),
        signal: AbortSignal.timeout(10000),
      });

      if (!detectRes.ok) {
        const errorText = await detectRes.text();
        throw new Error(
          `HTTP error! status: ${detectRes.status}, message: ${errorText}`
        );
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

      router.push(`/loading?${queryParams}`);
    } catch (err) {
      setError(
        'API request failed: ' +
          (err instanceof Error ? err.message : String(err))
      );
      setStep('guide');
      setCaptured(false);
    } finally {
      setIsLoading(false);
    }
  }, [apiUrl, isLoading, router]);

  // 얼굴이 타원 안에 들어오면 2초 후 자동 캡처 (임시: 버튼 없이 타이머)
  useEffect(() => {
    if (step === 'guide' && !captured) {
      setCountdown(2);
      const timer = setTimeout(() => {
        handleCapture();
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      setCountdown(null);
    }
  }, [step, captured, handleCapture]);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen w-full h-screen bg-black overflow-hidden">
      {/* 카메라 프리뷰 */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover z-0 transform scale-x-[-1]"
      />
      {/* 캡처된 이미지 미리보기 (디버그용) */}
      <canvas ref={canvasRef} className="hidden" />
      <div
        className="fixed inset-0 z-10 bg-black-400 min-w-[658px] min-h-[652px]"
      >
        <ResponsiveContainer>
        {/* 로고 (가로 중앙 상단 고정) */}
        <SiteHeader leftHref={() => router.back()}/>

      {/* 반투명 오버레이 + 안내문구 + 버튼 (1번 화면) */}
      {step === 'intro' && (
        <>
        <div className={"relative w-[810px] h-[1080px]"}>
          {/* 중앙 반투명 박스 */}
          <div className={styles.scan_warning_box}>
            {/* 안내문구 및 아이콘 */}
            <div className="flex flex-col items-center">
              <div className="flex justify-center items-center">
                <Image
                  src="/record_icon.png"
                  alt="Record"
                  width={100}
                  height={100}
                />
              </div>
              <p className={"heading-md text-nowrap overflow-hidden text-ellipsis"}>
                Please adjust face to guidelines
              </p>

              {/* 실선 구분선 */}
              <div className={"w-[658px] h-0.5 bg-white-200 m-0 my-2.5 rounded-full"} />

              {/* 흰색 반투명 박스 3개 */}
              <div className="flex gap-5 mt-2">
                {
                  intro_guideline.map(v => (
                    <div key={v.title}>
                      <Image
                        src={`/icon/${v.src}`}
                        alt={`/icon/${v.src}`}
                        width={206}
                        height={206}
                        style={{ borderRadius: 42 }}
                      />
                      <div className={styles.scan_warning_title}>
                        {v.title}
                      </div>
                      <div className={styles.scan_warning_text}>
                        {v.description}
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>

            {/* 버튼: 박스 하단 */}
            <button className={styles.scan_button} onClick={() => setStep('guide')}>
              <p className={styles.scan_button_text}>Let&apos;s Begin</p>
            </button>
          </div>
        </div>
        </>
      )}

      {/* 2번 화면: 타원 가이드라인 + 안내문구 */}
      {step === 'guide' && (
        <>
          <div className={"relative w-[810px] h-[1080px]"}>
          <div className={"absolute w-[1200px] h-[1200px] left-1/2 top-[40%] transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20"}>
            {/* 타원 가이드라인 */}
            <svg width="100%" height="100%" viewBox="0 0 1200 1200">
              <ellipse
                cx="600"
                cy="540"
                rx={240}
                ry={307}
                stroke="var(--white-1000, #FFF)"
                strokeWidth={8}
                fill="none"
                style={{ filter: 'drop-shadow(0 0 12px #fff)' }}
              />
            </svg>
            <FaceScanBar />
          </div>

          {/* 안내문구 박스: 타원보다 훨씬 아래에 배치 */}
          <div
            className={`absolute left-1/2 bottom-[200px] -translate-x-1/2 flex justify-center items-center rounded-[48px] border border-white-400 shadow-lg backdrop-blur-[12.5px] text-white text-center z-30 w-[738px] h-[132px] text-[1.15rem] 
                                    ${error ? 'bg-red-500/40' : 'bg-black-400'}`}
          >
            <div className="w-[658px] text-white text-center font-aribau text-[24px] font-normal leading-[142%] tracking-[-0.048px]">
              {error ? (
                <>
                  We couldn&apos;t recognize your face.
                  <br />
                  Make sure your face is clearly visible and try again.
                </>
              ) : (
                <>
                  Just a moment
                  <br />
                  We&apos;re scanning your face to find the best frames for
                  you!
                </>
              )}
            </div>
          </div>
          </div>
        </>
      )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
