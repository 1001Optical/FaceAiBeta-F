"use client";

import { useState } from 'react';

interface UseShareProps {
  targetUrl: string;
  faceShape: string;
}

export const useShare = ({ targetUrl, faceShape }: UseShareProps) => {
  const [copySuccess, setCopySuccess] = useState(false);

  // 1. 링크 복사 함수
  const handleCopyLink = async () => {
    if (!targetUrl) return;
    try {
      await navigator.clipboard.writeText(targetUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
      alert('Link copied successfully.'); 
    } catch (err) {
      console.error('Failed to copy link.', err);
    }
  };

  // 2. 에어드랍 / 퀵셰어 통합 공유 함수
  const handleShare = async () => {
    if (!targetUrl) return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${faceShape} 결과 확인하기`,
          text: `내 얼굴형 분석 결과(${faceShape})를 확인해보세요!`,
          url: targetUrl,
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('공유 실패:', err);
        }
      }
    } else {
      // 내장 공유를 지원하지 않는 환경(PC 브라우저 등)일 때 복사로 대체
      handleCopyLink();
    }
  };

  return {
    copySuccess,
    handleCopyLink,
    handleShare,
    isShareSupported: typeof navigator !== 'undefined' && !!navigator.share
  };
};