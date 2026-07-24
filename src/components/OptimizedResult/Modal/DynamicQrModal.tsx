"use client"

import { useEffect, useRef, useState } from 'react';
import Modal from '@/components/OptimizedResult/Modal/modal';
import ModalCtaButton from '@/components/OptimizedResult/Modal/ModalCtaButton';
import { TFaceShape } from '@/types/optimizedResultTypes';

interface IProps {
  shape: TFaceShape;
  onClose: () => void;
}

// Rendered QR size (px). The brand teal frame + white panel wrap it.
const QR_SIZE = 440;
const FRAME_TEAL = '#1E848D'; // brand primary teal (matches legacy QR styling)
const MODULE_COLOR = '#141414';

/**
 * Dynamic QR modal. Generates a styled QR at runtime (no static QR PNGs):
 * dot modules + circular finder eyes, on a white panel inside a teal rounded
 * frame, with the per-shape result icon in the center. The QR encodes the
 * absolute URL of the per-shape result page (`/result/${shape}`).
 *
 * Error correction is H so the center logo never breaks scannability. The origin
 * is read at runtime via window.location.origin so the QR points at whatever
 * domain the app is served from (localhost in dev, the real domain in prod).
 */
const DynamicQrModal = ({ shape, onClose }: IProps) => {
  const holderRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    let cancelled = false;
    const target = `${window.location.origin}/result/${shape}`;

    (async () => {
      try {
        const QRCodeStyling = (await import('qr-code-styling')).default;
        if (cancelled) return;

        const qr = new QRCodeStyling({
          width: QR_SIZE,
          height: QR_SIZE,
          type: 'svg',
          data: target,
          image: `/result/icon/${shape.toLowerCase()}.svg`,
          margin: 6,
          qrOptions: { errorCorrectionLevel: 'H' },
          dotsOptions: { type: 'dots', color: MODULE_COLOR },
          cornersSquareOptions: { type: 'dot', color: MODULE_COLOR },
          cornersDotOptions: { type: 'dot', color: MODULE_COLOR },
          backgroundOptions: { color: '#FFFFFF' },
          imageOptions: {
            crossOrigin: 'anonymous',
            hideBackgroundDots: true,
            imageSize: 0.4,
            margin: 6,
          },
        });

        if (cancelled || !holderRef.current) return;
        holderRef.current.replaceChildren();
        qr.append(holderRef.current);
      } catch {
        if (!cancelled) setError(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [shape]);

  return (
    <Modal onClose={onClose}>
      <span className="heading-sm text-white-800 text-white text-center font-light">
        QR Code
      </span>
      <hr className="border-t border-white-200 border-opacity-30 my-3 w-[562px]" />
      <span className="heading-md text-white-1000 mb-6">{shape}</span>
      <div
        className="flex items-center justify-center mb-8 rounded-[44px] p-[18px]"
        style={{ backgroundColor: FRAME_TEAL }}
      >
        <div className="rounded-[30px] bg-white p-[16px]">
          {error ? (
            <div
              className="flex items-center justify-center"
              style={{ width: QR_SIZE, height: QR_SIZE }}
            >
              <span className="label-xl text-black">Could not generate QR</span>
            </div>
          ) : (
            <div
              ref={holderRef}
              style={{ width: QR_SIZE, height: QR_SIZE }}
            />
          )}
        </div>
      </div>
      <ModalCtaButton onClick={onClose} />
    </Modal>
  );
};

export default DynamicQrModal;
