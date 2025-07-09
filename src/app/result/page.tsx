'use client';

import React, { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';

// 데이터 임포트
import { faceShapeDetails } from '@/data/faceData';
import { frameRecommendations } from '@/data/reconMap';
import { frameShapeDetails } from '@/data/frameData';
import { FaceShapeDetail, FrameShapeDetail } from '@/types/face';

function ResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL 파라미터에서 데이터 가져오기
  const faceShape = searchParams.get('faceShape') || 'Unknown';
  const confidence = parseFloat(searchParams.get('confidence') || '0');
  const ratios = JSON.parse(searchParams.get('ratios') || '{}');

  // 얼굴형 상세 정보
  const faceDetail = faceShapeDetails.find((f: FaceShapeDetail) => f.shape === faceShape);

  // 추천 프레임 정보
  const recommendations = frameRecommendations[faceShape as keyof typeof frameRecommendations];
  const recommendedFrames = recommendations?.recommendedFrames || [];

  // 추천 프레임 상세 정보
  const frameDetails = recommendedFrames.map((frameName: string) =>
    frameShapeDetails.find((f: FrameShapeDetail) => f.shape.toLowerCase() === frameName.toLowerCase()),
  ).filter(Boolean);

  // 디버깅용 로그
  useEffect(() => {
    console.log('Result Page Data:', {
      faceShape,
      confidence,
      ratios,
      faceDetail,
      recommendations,
      frameDetails,
      rawParams: Object.fromEntries(searchParams.entries()),
    });
  }, [faceShape, confidence, ratios, faceDetail, recommendations, frameDetails, searchParams]);

  return (
    <div className="fixed inset-0 z-20">
      {/* 배경 이미지 */}
      <Image
        src="/Blur.jpg"
        alt="로딩 배경"
        fill
        className="object-cover object-center z-0"
        priority
      />
      {/* 메인 콘텐츠 */}
          <div className="flex flex-col h-full absolute inset-0 z-10">
        {/* 상단 로고 */}
        <header className="flex flex-col items-center mt-8 mb-4">
            <div className="relative w-[200px] h-[120px] mb-12">
                <Image
                 src="/1001Logo.png"
                 alt="1001Logo"
                 fill
                 className="object-contain"
                 priority
                />
            </div>
        </header>

        <div className="max-w-4xl mx-auto">

        {/* 얼굴형 정보 */}
        <div className="bg-gray-500 rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-8">
            {faceDetail?.image && (
              <div className="w-full md:w-1/3">
                <Image
                  src={faceDetail.image}
                  alt={`${faceShape} face shape`}
                  width={300}
                  height={200}
                  className="w-full h-auto rounded-lg"
                />
              </div>
            )}
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-4">Your Face Shape is</h2>
              <p className="text-gray-300 mb-6">
                    <span className="font-bold text-white">{faceShape}</span>
                {confidence > 0 && (
                  <span className="text-sm text-gray-400 ml-2">
                    (Confidence: {Math.round(confidence * 100)}%)
                  </span>
                )}
              </p>
              {faceDetail?.description && <p className="text-gray-300 mb-4">{faceDetail.description}</p>}
              {faceDetail?.celebrities && (
                <div className="mt-4">
                  <h3 className="text-lg font-medium mb-2">Similar Celebrities:</h3>
                  <p className="text-gray-300">{faceDetail.celebrities.join(', ')}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 얼굴 측정값 */}
        <div className="bg-gray-900 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Face Measurements</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            
          </div>
        </div>

        {/* 추천 프레임 */}
        {recommendations && (
          <div className="bg-gray-900 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Recommended Frames</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {frameDetails.map((frame, index) =>
                frame ? (
                  <div key={index} className="bg-gray-800 p-4 rounded-lg">
                    <h3 className="font-medium mb-4">{frame.shape}</h3>
                    <Image
                      src={frame.image}
                      alt={`${frame.shape} frame`}
                      width={300}
                      height={200}
                      className="w-full h-auto rounded-lg"
                    />
                  </div>
                ) : null,
              )}
            </div>
          </div>
        )}

        <div className="flex justify-center space-x-4">
          <button
            onClick={() => router.push('/QR_${faceShape}.png')}
            className="px-6 py-3 bg-gray-800 text-white rounded-full font-semibold hover:bg-gray-700 transition"
          >
            Get QR Code
          </button>
        </div>
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