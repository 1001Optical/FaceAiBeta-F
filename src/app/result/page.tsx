'use client';

import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';

// 데이터 임포트
import { faceShapeDetails } from '@/data/faceData';
import { frameRecommendations } from '@/data/reconMap';
import { frameShapeDetails } from '@/data/frameData';
import { FaceShapeDetail, FrameShapeDetail } from '@/types/face';

export default function ResultPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL 파라미터에서 데이터 가져오기
  const faceShape = searchParams.get('faceShape') || 'Unknown';
  const confidence = parseFloat(searchParams.get('confidence') || '0');
  const ratios = JSON.parse(searchParams.get('ratios') || '{}');

  // 얼굴형 상세 정보
  const faceDetail = faceShapeDetails.find(
    (f: FaceShapeDetail) => f.shape === faceShape
  );

  // 추천 프레임 정보
  const recommendations =
    frameRecommendations[faceShape as keyof typeof frameRecommendations];
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
  }, [
    faceShape,
    confidence,
    ratios,
    faceDetail,
    recommendations,
    frameDetails,
    searchParams,
  ]);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 flex justify-center items-center">
          Your Face Shape is {faceShape}
        </h1>

        {/* 얼굴형 정보 */}
        <div className="bg-gray-700 rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* 이미지 영역 */}
            {faceDetail?.image && (
              <div className="w-full md:w-1/3 flex justify-center items-center">
                <img
                  src={faceDetail.image}
                  alt={`${faceShape} face shape`}
                  className="w-full h-auto rounded-lg"
                />
              </div>
            )}

            {/* 텍스트 영역 */}
            <div className="flex-1 flex flex-col justify-center">
              <p className="text-gray-300 text-xl mb-2">
                {confidence > 0 && (
                  <span className="text-xl text-gray-400 ml-2">
                    (Confidence: {Math.round(confidence * 100)}%)
                  </span>
                )}
              </p>

              {faceDetail?.description && (
                <p className="text-gray-300 text-xl mb-4">
                  {faceDetail.description}
                </p>
              )}

              {faceDetail?.celebrities && (
                <div className="mt-4 text-lg">
                  <h3 className="text-lg font-medium mb-1">
                    Celebrities with Your Face Shape
                  </h3>
                  <p className="text-gray-300 text-base">
                    {faceDetail.celebrities.join(', ')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 얼굴 측정값 */}
        {/* <div className="bg-gray-900 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Face Measurements</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-gray-800 p-3 rounded-lg">
              <p className="text-sm text-gray-400">Cheek Ratio</p>
              <p className="text-lg font-medium">{Math.round(ratios.cheek * 100)}%</p>
            </div>
            <div className="bg-gray-800 p-3 rounded-lg">
              <p className="text-sm text-gray-400">Chin Ratio</p>
              <p className="text-lg font-medium">{Math.round(ratios.chin * 100)}%</p>
            </div>
            <div className="bg-gray-800 p-3 rounded-lg">
              <p className="text-sm text-gray-400">Forehead Ratio</p>
              <p className="text-lg font-medium">{Math.round(ratios.forehead * 100)}%</p>
            </div>
            <div className="bg-gray-800 p-3 rounded-lg">
              <p className="text-sm text-gray-400">Head Ratio</p>
              <p className="text-lg font-medium">{Math.round(ratios.head * 100)}%</p>
            </div>
            <div className="bg-gray-800 p-3 rounded-lg">
              <p className="text-sm text-gray-400">Jaw Ratio</p>
              <p className="text-lg font-medium">{Math.round(ratios.jaw * 100)}%</p>
            </div>
            <div className="bg-gray-800 p-3 rounded-lg">
              <p className="text-sm text-gray-400">Jaw Angle</p>
              <p className="text-lg font-medium">{Math.round(ratios.jawAngle)}°</p>
            </div>
          </div>
        </div> */}

        {/* 추천 프레임 */}
        {recommendations && (
          <div className="bg-gray-700 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-1">
              Recommended Frame Shape
            </h2>
            <p className="text-gray-300 mb-6">{recommendations.reason}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {frameDetails.map(
                (frame, index) =>
                  frame && (
                    <div key={index} className="bg-gray-800 p-4 rounded-lg ">
                      <h3 className="text-lg font-extrabold mb-4">
                        {frame.shape}
                      </h3>
                      <img
                        src={frame.image}
                        alt={`${frame.shape} frame`}
                        className="w-full h-auto rounded-lg"
                      />
                    </div>
                  )
              )}
            </div>
          </div>
        )}

        <div className="flex justify-center space-x-4">
          <button
            onClick={() => router.push('/scan')}
            className="px-6 py-3 bg-white text-black rounded-full font-semibold hover:bg-gray-200 transition"
          >
            Scan Again
          </button>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-gray-800 text-white rounded-full font-semibold hover:bg-gray-700 transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
