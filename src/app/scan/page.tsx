'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Loading from '@/components/Loading';
import { faceShapeDetails } from '@/data/faceData';
import { frameRecommendations } from '@/data/reconMap';
import { frameShapeDetails } from '@/data/frameData';
import { FaceShapeDetail, FrameShapeDetail } from '@/types/face';

export default function ScanPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [step, setStep] = useState<'intro' | 'guide' | 'loading'>('intro');
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  console.log('=== 환경 변수 디버깅 ===');
  console.log('NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('현재 apiUrl:', apiUrl);
  console.log('========================');

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
      setError('카메라에 접근할 수 없습니다. 카메라 권한을 확인해주세요.');
      console.error('Camera access error:', err);
    }
  };

  // 캡처 함수 useCallback 적용
  const handleCapture = useCallback(async () => {
    console.log('=== handleCapture 시작 ===');
    console.log('apiUrl:', apiUrl);
    console.log('isLoading:', isLoading);
    
    if (!videoRef.current || !canvasRef.current || isLoading) {
      console.log('조건 체크 실패:', {
        videoRef: !!videoRef.current,
        canvasRef: !!canvasRef.current,
        isLoading
      });
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
      console.log('=== 이미지 캡처 시작 ===');
      // 캡처된 이미지를 Blob으로 변환
      const blob = await new Promise<Blob | null>(resolve => {
        canvas.toBlob(blob => resolve(blob), 'image/jpeg', 0.95);
      });

      if (!blob) {
        throw new Error('이미지 변환에 실패했습니다.');
      }

      console.log('Blob 생성 성공:', {
        size: blob.size,
        type: blob.type
      });

      // FormData로 변환
      const formData = new FormData();
      formData.append('image', blob, 'capture.jpg');

      console.log('=== 첫 번째 API 호출: upload_image ===');
      console.log('요청 URL:', `${apiUrl}/upload_image`);
      console.log('요청 메서드:', 'POST');
      console.log('FormData 내용:', {
        hasImage: formData.has('image'),
        imageName: formData.get('image') instanceof File ? (formData.get('image') as File).name : 'N/A'
      });

      // Flask API 엔드포인트에 POST 요청
      const response = await fetch(`${apiUrl}/upload_image`, {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
        },
        signal: AbortSignal.timeout(10000),
      });

      console.log('=== upload_image 응답 ===');
      console.log('응답 상태:', response.status);
      console.log('응답 상태 텍스트:', response.statusText);
      console.log('응답 헤더:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('upload_image 에러 응답:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      console.log('upload_image 성공 응답:', data);
      
      if (!data || !data.image_url) {
        console.error('image_url이 없음:', data);
        throw new Error('이미지 업로드에 실패했습니다.');
      }

      console.log('=== 두 번째 API 호출: detect_face_shape ===');
      console.log('요청 URL:', `${apiUrl}/detect_face_shape`);
      console.log('요청 메서드:', 'POST');
      console.log('요청 바디:', { image_url: data.image_url });

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

      console.log('=== detect_face_shape 응답 ===');
      console.log('응답 상태:', detectRes.status);
      console.log('응답 상태 텍스트:', detectRes.statusText);
      console.log('응답 헤더:', Object.fromEntries(detectRes.headers.entries()));

      if (!detectRes.ok) {
        const errorText = await detectRes.text();
        console.error('detect_face_shape 에러 응답:', errorText);
        throw new Error(`HTTP error! status: ${detectRes.status}, message: ${errorText}`);
      }

      const detectData = await detectRes.json();
      console.log('=== Face Detection Response ===');
      console.log('Raw Response:', detectData);
      console.log('Face Shape:', detectData.shape);
      console.log('Confidence:', detectData.confidence);
      console.log('Ratios:', {
        cheek: detectData.cheek_ratio,
        chin: detectData.chin_ratio,
        forehead: detectData.forehead_ratio,
        head: detectData.head_ratio,
        jaw: detectData.jaw_ratio,
        jawAngle: detectData.jaw_angle,
      });
      console.log('===========================');

      // 얼굴 인식 실패 처리
      if (
        (detectData.status === 'error' &&
          detectData.status_code === 'unable_to_determine') ||
        detectData.shape === 'Unknown' ||
        !detectData.shape
      ) {
        console.log('얼굴 인식 실패:', detectData);
        setError('We can not recognize face. Please try again.');
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

      console.log('=== Query Parameters ===');
      console.log('URL Parameters:', queryParams);
      console.log('===========================');

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

      console.log('로드할 이미지 URLs:', imageUrls);

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
        console.log('All images loaded successfully');
        // 이미지 로드가 완료된 후 결과 페이지로 이동
        router.push(`/result?${queryParams}`);
      } catch (error) {
        console.error('Error loading images:', error);
        // 이미지 로드 실패 시에도 결과 페이지로 이동
        router.push(`/result?${queryParams}`);
      }
    } catch (err) {
      console.error('=== API 요청 실패 ===');
      console.error('에러 타입:', err instanceof Error ? err.constructor.name : typeof err);
      console.error('에러 메시지:', err instanceof Error ? err.message : String(err));
      console.error('전체 에러 객체:', err);
      setError(
        'API 요청 실패: ' + (err instanceof Error ? err.message : String(err))
      );
      setStep('guide');
      setCaptured(false);
    } finally {
      setIsLoading(false);
      console.log('=== handleCapture 종료 ===');
    }
  }, [apiUrl, isLoading, captured, router]);

  // 얼굴이 타원 안에 들어오면 2초 후 자동 캡처 (임시: 버튼 없이 타이머)
  useEffect(() => {
    if (step === 'guide' && !captured) {
      setCountdown(5);
      const timer = setTimeout(() => {
        handleCapture();
      }, 2000);
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
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-black bg-opacity-75">
          <Loading />
          <p className="text-white mt-4 text-lg">
            Analyzing your face shape...
          </p>
        </div>
      )}

      {/* 에러 메시지 */}
      {error && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg">
          <p className="text-center">{error}</p>
        </div>
      )}

      {/* 반투명 오버레이 + 안내문구 + 버튼 (1번 화면) */}
      {step === 'intro' && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center z-10 p-4"
          style={{ background: 'rgba(0,0,0,0.35)' }}
        >
          <div className="max-w-lg text-center text-white flex flex-col gap-8">
            <h1 className="text-3xl font-bold mb-4">Ready to scan the face?</h1>
            <p className="mb-8 text-base font-light">
              Click &quot;I&apos;m ready&quot; and ask the customer to face the camera
              directly, looking straight ahead without any glasses, hats, or
              masks.
            </p>
            <button
              className="mt-4 px-8 py-3 rounded-full bg-white text-black font-semibold text-lg shadow-lg hover:bg-gray-200 transition"
              onClick={() => setStep('guide')}
            >
              I&apos;m ready
            </button>
          </div>
        </div>
      )}

      {/* 2번 화면: 타원 가이드라인 + 안내문구 */}
      {step === 'guide' && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center z-10 p-4"
          style={{ background: 'rgba(0,0,0,0.35)' }}
        >
          <h1 className="text-2xl font-bold text-white mb-8 text-center">
            {captured ? 'Captured!' : 'Please adjust face to guidelines'}
            {countdown && !captured && (
              <span className="block text-lg font-normal mt-2">
                Capturing in {countdown}...
              </span>
            )}
          </h1>
          <div
            className="relative flex items-center justify-center"
            style={{
              width: '90%',
              maxWidth: '500px',
              aspectRatio: '3/4',
              transform: 'scaleX(-1)',
            }}
          >
            {/* 타원 가이드라인 */}
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 100 100"
              className="absolute"
              style={{
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              <ellipse
                cx="50"
                cy="50"
                rx="40"
                ry="55"
                stroke="#fff"
                strokeWidth="2"
                fill="none"
                style={{ filter: 'drop-shadow(0 0 12px #fff)' }}
              />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}
