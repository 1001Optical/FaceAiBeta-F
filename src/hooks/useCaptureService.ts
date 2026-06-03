"use client"

import { useRef } from 'react';
import { domToPng } from 'modern-screenshot';

interface UseCaptureServiceProps {
  shape: string;
}

export function useCaptureService({ shape }: UseCaptureServiceProps) {
  const captureRef = useRef<HTMLDivElement>(null);

  const handleDownloadPng = async () => {
    if (!captureRef.current) return;

    try {
      // ResponsiveContainer의 첫 번째 자식 엘리먼트(w-[810px] 콘텐츠 박스) 조준
      const target = captureRef.current.firstElementChild as HTMLElement;
      if (!target) return;

      const ignoreArea = target.querySelector('[data-capture-ignore="true"]') as HTMLElement;
      
      // 저장 버튼 영역의 높이를 제외한 컨텐츠 실제 높이 계산
      const totalHeight = target.scrollHeight - (ignoreArea?.offsetHeight ?? 0);
      const totalWidth = 810; 

      const dataUrl = await domToPng(target, {
        width: totalWidth,
        height: totalHeight,
        features: {
          //imageEmbed: true, 
        },
        scale: 2, 
        style: {
          transform: 'none',
          overflow: 'visible',
          height: 'auto',
          backgroundImage: "url('/background/bg_result.svg')",
          backgroundSize: "cover",
          backgroundPosition: "center top",
          backgroundAttachment: "local",
          backgroundColor: "#0b3d3f", 
        },
        onClone: (clone: any) => {
          const clonedRoot = clone as HTMLElement;
          
          clonedRoot.style.transform = 'none';
          clonedRoot.style.transformOrigin = 'top';
          clonedRoot.style.height = 'auto';
          clonedRoot.style.width = `${totalWidth}px`;
          clonedRoot.style.overflow = 'hidden';

          clonedRoot.style.backgroundImage = "url('/background/bg_result.svg')";
          clonedRoot.style.backgroundSize = "cover";
          clonedRoot.style.backgroundPosition = "center top";
          clonedRoot.style.backgroundAttachment = "local";
          clonedRoot.style.backgroundColor = "#0b3d3f";

          const cloneIgnore = clonedRoot.querySelector('[data-capture-ignore="true"]');
          if (cloneIgnore) {
            cloneIgnore.remove();
          }
        }
      } as any);

      // 브라우저 파일 다운로드
      const link = document.createElement('a');
      link.download = `result-${shape}.png`;
      link.href = dataUrl;
      link.click();

    } catch (error) {
      console.error("이미지 저장 중 오류 발생:", error);
    }
  };

  return {
    captureRef,
    handleDownloadPng,
  };
}