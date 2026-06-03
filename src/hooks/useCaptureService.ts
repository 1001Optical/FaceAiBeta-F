"use client"

import { useRef } from 'react';
import { domToPng } from 'modern-screenshot';

function drawBackgroundToCanvas(width: number, height: number): string {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // paint0: 메인 배경
  const mainGrad = ctx.createLinearGradient(0, 0, 0, height);
  mainGrad.addColorStop(0, '#005369');
  mainGrad.addColorStop(1, '#00CDE3');
  ctx.fillStyle = mainGrad;
  ctx.fillRect(0, 0, width, height);

  // paint2: 어두운 반투명 오버레이
  ctx.fillStyle = 'rgba(1,15,13,0.3)';
  ctx.fillRect(0, 0, width, height);

  // paint5: 상단 빛줄기
  const lightGrad = ctx.createLinearGradient(width * 0.78, height * 0.33, width * 0.76, height * 0.17);
  lightGrad.addColorStop(0, 'rgba(65,226,248,0)');
  lightGrad.addColorStop(1, 'rgba(65,226,248,0.25)');
  ctx.globalCompositeOperation = 'lighter';
  ctx.fillStyle = lightGrad;
  ctx.fillRect(0, 0, width, height * 0.5);

  // paint8: 상단 페이드
  ctx.globalCompositeOperation = 'source-over';
  const fadeGrad = ctx.createLinearGradient(width * 0.2, 0, width * 0.6, height);
  fadeGrad.addColorStop(0, 'rgba(0,0,0,0.4)');
  fadeGrad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = fadeGrad;
  ctx.fillRect(0, 0, width, height);

  return canvas.toDataURL('image/png');
}

function removeBackdropFilters(target: HTMLElement): () => void {
  const affectedElements: Array<{ el: HTMLElement; originalBf: string; originalWebkit: string }> = [];
  const backdropClassElements: Array<{ el: HTMLElement; removed: string[] }> = [];

  // inline style backdrop-filter 제거
  target.querySelectorAll('*').forEach((el) => {
    const htmlEl = el as HTMLElement;
    const computed = window.getComputedStyle(htmlEl);
    const bf =
      computed.backdropFilter ||
      computed.getPropertyValue('-webkit-backdrop-filter');

    if (bf && bf !== 'none') {
      affectedElements.push({
        el: htmlEl,
        originalBf: htmlEl.style.backdropFilter || '',
        originalWebkit: htmlEl.style.getPropertyValue('-webkit-backdrop-filter') || '',
      });
      htmlEl.style.backdropFilter = 'none';
      htmlEl.style.setProperty('-webkit-backdrop-filter', 'none');
    }
  });

  // Tailwind backdrop-* 클래스 제거
  target.querySelectorAll('[class*="backdrop"]').forEach((el) => {
    const htmlEl = el as HTMLElement;
    const toRemove = Array.from(htmlEl.classList).filter(c => c.includes('backdrop'));
    if (toRemove.length > 0) {
      backdropClassElements.push({ el: htmlEl, removed: toRemove });
      toRemove.forEach(c => htmlEl.classList.remove(c));
    }
  });

  return () => {
    affectedElements.forEach(({ el, originalBf, originalWebkit }) => {
      el.style.backdropFilter = originalBf;
      el.style.setProperty('-webkit-backdrop-filter', originalWebkit);
    });
    backdropClassElements.forEach(({ el, removed }) => {
      removed.forEach(c => el.classList.add(c));
    });
  };
}

interface UseCaptureServiceProps {
  shape: string;
}

export function useCaptureService({ shape }: UseCaptureServiceProps) {
  const captureRef = useRef<HTMLDivElement>(null);

  const handleDownloadPng = async () => {
    if (!captureRef.current) return;

    let restore: (() => void) | null = null;

    try {
      const target = captureRef.current.firstElementChild as HTMLElement;
      if (!target) return;

      const ignoreArea = target.querySelector('[data-capture-ignore="true"]') as HTMLElement;
      const totalHeight = target.scrollHeight - (ignoreArea?.offsetHeight ?? 0);
      const totalWidth = 810;

      // 캡처 전 backdrop-filter 제거 + 복원 함수 저장
      restore = removeBackdropFilters(target);

      // 배경 canvas 생성
      const base64Bg = drawBackgroundToCanvas(totalWidth, totalHeight);
      const bgStyle = `url('${base64Bg}')`;

      // 💡 [타입 에러 해결 핵심] r() 함수를 화살표 함수로 감싸서 변수 불일치 문제 차단
      await new Promise<void>(resolve => {
        requestAnimationFrame(() => resolve());
      });

      const dataUrl = await domToPng(target, {
        width: totalWidth,
        height: totalHeight,
        scale: 2,
        style: {
          transform: 'none',
          overflow: 'hidden',
          height: `${totalHeight}px`,
          width: `${totalWidth}px`,
          backgroundImage: bgStyle,
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat',
          backgroundColor: '#005369',
        },
        onClone: (clone: unknown) => {
          const clonedRoot = clone as HTMLElement;

          clonedRoot.style.transform = 'none';
          clonedRoot.style.transformOrigin = 'top left';
          clonedRoot.style.height = `${totalHeight}px`;
          clonedRoot.style.width = `${totalWidth}px`;
          clonedRoot.style.overflow = 'hidden';
          clonedRoot.style.backgroundImage = bgStyle;
          clonedRoot.style.backgroundSize = 'cover';
          clonedRoot.style.backgroundPosition = 'center top';
          clonedRoot.style.backgroundRepeat = 'no-repeat';
          clonedRoot.style.backgroundColor = '#005369';

          // 클론에서도 backdrop-filter 및 인라인 뭉개짐 블러 제거
          clonedRoot.querySelectorAll('*').forEach((el) => {
            const htmlEl = el as HTMLElement;
            htmlEl.style.backdropFilter = 'none';
            htmlEl.style.setProperty('-webkit-backdrop-filter', 'none');
            if (htmlEl.style.filter?.includes('blur')) {
              htmlEl.style.filter = 'none';
            }
          });

          // 캡처 제외 영역 제거
          clonedRoot.querySelector('[data-capture-ignore="true"]')?.remove();

          // img crossOrigin 설정
          clonedRoot.querySelectorAll('img').forEach((img) => {
            (img as HTMLImageElement).crossOrigin = 'anonymous';
          });
        },
      } as any);

      const link = document.createElement('a');
      link.download = `result-${shape}.png`;
      link.href = dataUrl;
      link.click();

    } catch (error) {
      console.error('이미지 저장 중 오류:', error);
    } finally {
      restore?.();
    }
  };

  return {
    captureRef,
    handleDownloadPng,
  };
}