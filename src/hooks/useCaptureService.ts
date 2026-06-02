import { useRef, useState, useEffect } from 'react';
import html2canvas from 'html2canvas';

interface UseCaptureProps {
  isQrView: boolean;
}

export function useCaptureService({ isQrView }: UseCaptureProps) {
  const captureRef = useRef<HTMLDivElement>(null);
  const [capturedImg, setCapturedImg] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const done = useRef(false);

  useEffect(() => {
    if (!isQrView || done.current) return;

    const run = async () => {
      const target = captureRef.current;
      if (!target) return;

      done.current = true;
      setIsCapturing(true);

      try {
        await document.fonts.ready;
        await new Promise(r => setTimeout(r, 800));

        // ✅ [핵심 변경] 모든 이미지를 안전한 Base64 데이터로 변환하여 CORS 무력화
        const images = target.querySelectorAll('img');
        await Promise.all(
          Array.from(images).map(async (img) => {
            try {
              // 이미 변환되었거나 주소가 없으면 패스
              if (!img.src || img.src.startsWith('data:')) return;

              // 이미지의 현재 렌더링 주소를 fetch로 직접 가져옴 (동일 오리진 요청 활용)
              const response = await fetch(img.src, { cache: 'no-cache' });
              const blob = await response.blob();

              // Blob을 Base64 string으로 변환
              const base64Data = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
              });

              // 원본 DOM의 src를 Base64로 교체 (화면 교체 없이 데이터만 안전하게 변경됨)
              img.src = base64Data;
            } catch (err) {
              // 특정 이미지 변환 실패 시 로그를 남기고 다음 이미지 진행 (전체 크래시 방지)
              console.warn('이미지 오염 방지 변환 실패:', img.src, err);
            }
          })
        );

        // 다시 한 번 이미지가 완전히 대기 상태인지 체크
        await Promise.all(
          Array.from(images).map(
            img =>
              new Promise(resolve => {
                if (img.complete) return resolve(null);
                img.onload = () => resolve(null);
                img.onerror = () => resolve(null);
              })
          )
        );

        // ✅ 화면에 잘리는 부분 없이 전체 스크롤 높이 동적 계산
        let totalHeight = target.scrollHeight;
        target.querySelectorAll('*').forEach((el) => {
          if (el.scrollHeight > totalHeight) {
            totalHeight = el.scrollHeight;
          }
        });

        const canvas = await html2canvas(target, {
          backgroundColor: '#000000',
          scale: 2,
          useCORS: true,
          allowTaint: false, // 💡 Base64 변환을 마쳤으므로 false로 두어야 정상 내보내기가 가능합니다.
          width: target.offsetWidth,
          height: totalHeight,
          windowWidth: target.offsetWidth,
          windowHeight: totalHeight,
          scrollX: 0,
          scrollY: 0,
          x: 0,
          y: 0,
          imageTimeout: 15000,
          onclone: (clonedDoc) => {
            // ✅ 복제된 가상 DOM 내부에서 스크롤을 막는 CSS 속성 강제 해제
            const clonedRoot = clonedDoc.getElementById('capture-root');
            if (clonedRoot instanceof HTMLElement) {
              clonedRoot.style.height = 'auto';
              clonedRoot.style.maxHeight = 'none';
              clonedRoot.style.overflow = 'visible';

              clonedRoot.querySelectorAll('*').forEach((node) => {
                if (node instanceof HTMLElement) {
                  const computedStyle = window.getComputedStyle(node);
                  if (
                    computedStyle.overflowY === 'auto' || 
                    computedStyle.overflowY === 'scroll' || 
                    computedStyle.height.includes('vh') || 
                    computedStyle.maxHeight !== 'none'
                  ) {
                    node.style.height = 'auto';
                    node.style.maxHeight = 'none';
                    node.style.overflow = 'visible';
                    node.style.position = 'relative';
                  }
                }
              });
            }
          },
        });

        const dataUrl = canvas.toDataURL('image/png');
        setCapturedImg(dataUrl);

      } catch (e) {
        console.error('메인 캡처 실패:', e);

        // ✅ 최후의 Fallback: 문제 요소를 완전히 제외하고 텍스트 레이아웃이라도 안전하게 저장
        try {
          let totalHeightFallback = captureRef.current!.scrollHeight;
          captureRef.current!.querySelectorAll('*').forEach((el) => {
            if (el.scrollHeight > totalHeightFallback) {
              totalHeightFallback = el.scrollHeight;
            }
          });

          const canvas = await html2canvas(captureRef.current!, {
            backgroundColor: '#000000',
            scale: 2,
            allowTaint: false,
            useCORS: true,
            ignoreElements: (el) => el.tagName === 'IMG', // 에러를 발생시키는 모든 이미지 강제 제외
            width: captureRef.current!.offsetWidth,
            height: totalHeightFallback,
            windowWidth: captureRef.current!.offsetWidth,
            windowHeight: totalHeightFallback,
          });
          setCapturedImg(canvas.toDataURL('image/png'));
        } catch (e2) {
          console.error('최종 fallback도 실패:', e2);
          done.current = false;
        }
      } finally {
        setIsCapturing(false);
      }
    };

    const timer = setTimeout(run, 300);
    return () => clearTimeout(timer);
  }, [isQrView]);

  return { captureRef, capturedImg, isCapturing };
}