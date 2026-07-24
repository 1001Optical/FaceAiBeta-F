'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import {
    frameProducts,
    isResultFaceShape,
    resultRecommendations,
    type FrameProduct,
    type ProductFrameShape,
    type ResultFaceShape,
} from '@/data/productFrameData';

export default function ResultPage() {
    const params = useParams<{ shape: string }>();
    const router = useRouter();
    const rawShape = params.shape;
    const faceShape = isResultFaceShape(rawShape) ? rawShape : null;
    const [selectedProduct, setSelectedProduct] = useState<FrameProduct | null>(null);
    const [showQr, setShowQr] = useState(false);
    const resultImageRef = useRef<Blob | null>(null);

    useEffect(() => {
        if (!faceShape) {
            router.replace('/');
            return;
        }

        resultImageRef.current = null;
        fetch(`/result-images/${faceShape}.png`)
            .then(response => response.blob())
            .then(blob => {
                resultImageRef.current = blob;
            })
            .catch(() => {
                resultImageRef.current = null;
            });
    }, [faceShape, router]);

    if (!faceShape) return null;

    const recommendations = resultRecommendations[faceShape];

    const saveResultImage = async () => {
        const filename = `1001-${faceShape}.png`;
        const blob = resultImageRef.current;

        if (blob && navigator.canShare) {
            const file = new File([blob], filename, { type: 'image/png' });
            if (navigator.canShare({ files: [file] })) {
                try {
                    await navigator.share({ files: [file] });
                } catch {
                    // The user closed the native share sheet.
                }
                return;
            }
        }

        const anchor = document.createElement('a');
        anchor.href = `/result-images/${faceShape}.png`;
        anchor.download = filename;
        anchor.click();
    };

    return (
        <main className="relative min-h-screen overflow-x-hidden bg-[#004047]">
            <Image src="/Bg_result.png" alt="" fill className="fixed object-cover object-center" priority />

            <header className="app-header fixed left-1/2 z-30 -translate-x-1/2">
                <Link href="/" className="relative block h-[64px] w-[100px]">
                    <Image src="/1001Logo.png" alt="1001 Optometry" fill sizes="100px" className="object-contain" priority />
                </Link>
            </header>

            <div className="relative z-10 mx-auto w-full max-w-[810px] px-4 pb-[max(24px,env(safe-area-inset-bottom))] pt-[calc(max(16px,env(safe-area-inset-top))+92px)] sm:px-9">
                <FaceShapeCard faceShape={faceShape} />

                <h1 className="mb-5 mt-7 font-aribau text-[clamp(27px,5vw,40px)] leading-tight text-white">
                    Recommendation Frame
                </h1>

                <section className="flex flex-col gap-7 rounded-[clamp(24px,5vw,40px)] border border-white/25 bg-white/10 p-4 shadow-lg backdrop-blur-md sm:p-8">
                    {recommendations.map((shape, index) => (
                        <RecommendationGroup
                            key={shape}
                            shape={shape}
                            ranking={index + 1}
                            onSelect={setSelectedProduct}
                        />
                    ))}
                </section>

                <div className="mt-6 flex flex-col gap-3">
                    <ActionButton label="Save Image" icon="/download.png" onClick={saveResultImage} />
                    <ActionButton label="QR Code" icon="/qr.png" onClick={() => setShowQr(true)} />
                    <ActionButton label="Scan Another Face" icon="/face.png" onClick={() => router.push('/')} />
                </div>
            </div>

            {selectedProduct && (
                <ProductModal
                    faceShape={faceShape}
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                />
            )}

            {showQr && (
                <QrModal faceShape={faceShape} onClose={() => setShowQr(false)} />
            )}
        </main>
    );
}

function FaceShapeCard({ faceShape }: { faceShape: ResultFaceShape }) {
    const slug = faceShape.toLowerCase();

    return (
        <section className="relative aspect-[738/290] w-full overflow-hidden rounded-[clamp(20px,5vw,40px)] border border-white/30 bg-[linear-gradient(90deg,rgba(255,255,255,0.5)_0%,rgba(0,194,252,0.5)_61%)] shadow-lg backdrop-blur-2xl">
            <div className="absolute inset-y-0 right-0 w-[55%] bg-[url('/result/avatar/base.svg')] bg-cover bg-left">
                <Image
                    src={`/result/avatar/${slug}.png`}
                    alt=""
                    fill
                    sizes="(max-width: 809px) 55vw, 404px"
                    className="object-contain object-right"
                    priority
                />
            </div>

            <div className="absolute inset-y-0 left-0 z-10 flex w-[58%] flex-col justify-center px-[clamp(16px,4vw,32px)]">
                <p className="font-aribau text-[clamp(18px,4vw,40px)] leading-tight text-white/90">
                    Your Face Type is
                </p>
                <div className="mt-1 flex items-center">
                    <span className="relative mr-2 aspect-square w-[clamp(38px,9vw,86px)] shrink-0">
                        <Image src={`/result/icon/${slug}.svg`} alt="" fill sizes="86px" className="object-contain" />
                    </span>
                    <strong className="font-aribau text-[clamp(30px,7vw,58px)] leading-none text-white">
                        {faceShape}
                    </strong>
                </div>
            </div>
        </section>
    );
}

function RecommendationGroup({
    shape,
    ranking,
    onSelect,
}: {
    shape: ProductFrameShape;
    ranking: number;
    onSelect: (product: FrameProduct) => void;
}) {
    return (
        <div>
            <div className="flex items-baseline gap-2 border-b border-white/20 px-1 pb-3 sm:px-3">
                <span className="font-aribau text-[clamp(21px,4vw,32px)] text-white/55">
                    {ranking === 1 ? '1st' : '2nd'}
                </span>
                <span className="font-aribau text-[clamp(21px,4vw,32px)] text-[#c9f1e8]">{shape}</span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4">
                {frameProducts[shape].map(product => (
                    <button
                        key={`${product.vendor}-${product.name}`}
                        type="button"
                        onClick={() => onSelect(product)}
                        className="relative aspect-square overflow-hidden rounded-[clamp(18px,4vw,32px)] bg-[#dff7fa] p-3 text-left text-[#006878] shadow-[inset_0_0_14px_#f2f2f2] sm:p-6"
                    >
                        <span className="block font-aribau text-[clamp(12px,2.2vw,18px)]">{product.vendor}</span>
                        <span className="block font-aribau text-[clamp(18px,3.5vw,30px)] leading-tight">{product.name}</span>
                        <span className="absolute -bottom-[12%] -right-[18%] h-[68%] w-[92%] overflow-hidden rounded-tl-[clamp(18px,4vw,32px)] bg-white">
                            <Image
                                src={`${product.src}/preview.webp`}
                                alt=""
                                fill
                                sizes="(max-width: 639px) 44vw, 296px"
                                className="object-cover"
                            />
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}

function ActionButton({ label, icon, onClick }: { label: string; icon: string; onClick: () => void }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="flex min-h-14 w-full items-center justify-center gap-2 rounded-full border border-white/60 bg-black/20 px-5 py-3 font-aribau text-[clamp(17px,3vw,24px)] text-white backdrop-blur-md sm:min-h-[88px]"
        >
            {label}
            <Image src={icon} alt="" width={28} height={28} className="object-contain" />
        </button>
    );
}

const productViews = ['Product', 'Woman', 'Man'] as const;
type ProductView = (typeof productViews)[number];

function productImageSource(product: FrameProduct, faceShape: ResultFaceShape, view: ProductView) {
    return `${product.src}/${view === 'Product' ? 'Product' : `${faceShape}_${view}`}.webp`;
}

function ProductModal({
    faceShape,
    product,
    onClose,
}: {
    faceShape: ResultFaceShape;
    product: FrameProduct;
    onClose: () => void;
}) {
    const [view, setView] = useState<ProductView>('Product');

    useEffect(() => {
        productViews.forEach(option => {
            new window.Image().src = productImageSource(product, faceShape, option);
        });
    }, [faceShape, product]);

    return (
        <Modal onClose={onClose}>
            <div className="mb-5 flex items-center justify-center gap-3 text-center">
                <span className="font-aribau text-lg text-white/75">{product.vendor}</span>
                <span className="h-7 w-px bg-white/20" />
                <span className="font-aribau text-2xl text-white">{product.name}</span>
            </div>

            <div className="mx-auto mb-6 flex w-fit max-w-full rounded-full bg-white/10 p-2 shadow-inner">
                {productViews.map(option => (
                    <button
                        key={option}
                        type="button"
                        onClick={() => setView(option)}
                        className={`min-h-11 rounded-full px-4 font-aribau text-base text-white transition sm:px-6 sm:text-xl ${
                            view === option
                                ? 'bg-[#00eaff]/45 shadow-[inset_0_0_8px_rgba(255,255,255,0.45)]'
                                : 'hover:bg-white/10'
                        }`}
                    >
                        {option}
                    </button>
                ))}
            </div>

            <div className="relative mx-auto aspect-square w-full max-w-[562px] overflow-hidden rounded-[clamp(24px,6vw,48px)] bg-white">
                <Image
                    key={view}
                    src={productImageSource(product, faceShape, view)}
                    alt={`${product.vendor} ${product.name} ${view}`}
                    fill
                    sizes="min(82vw, 562px)"
                    className="object-cover"
                    unoptimized
                />
            </div>

            <ModalCloseButton onClick={onClose} />
        </Modal>
    );
}

function QrModal({ faceShape, onClose }: { faceShape: ResultFaceShape; onClose: () => void }) {
    const holderRef = useRef<HTMLDivElement>(null);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        let cancelled = false;
        const target = `${window.location.origin}/result/${faceShape}`;

        void import('qr-code-styling')
            .then(({ default: QRCodeStyling }) => {
                if (cancelled || !holderRef.current) return;
                const size = Math.min(440, Math.max(240, window.innerWidth - 96));
                const qr = new QRCodeStyling({
                    width: size,
                    height: size,
                    type: 'svg',
                    data: target,
                    image: `/result/icon/${faceShape.toLowerCase()}.svg`,
                    margin: 6,
                    qrOptions: { errorCorrectionLevel: 'H' },
                    dotsOptions: { type: 'dots', color: '#141414' },
                    cornersSquareOptions: { type: 'dot', color: '#141414' },
                    cornersDotOptions: { type: 'dot', color: '#141414' },
                    backgroundOptions: { color: '#ffffff' },
                    imageOptions: {
                        crossOrigin: 'anonymous',
                        hideBackgroundDots: true,
                        imageSize: 0.4,
                        margin: 6,
                    },
                });

                holderRef.current.replaceChildren();
                qr.append(holderRef.current);
            })
            .catch(() => {
                if (!cancelled) setHasError(true);
            });

        return () => {
            cancelled = true;
        };
    }, [faceShape]);

    return (
        <Modal onClose={onClose}>
            <h2 className="text-center font-aribau text-xl text-white/80">QR Code</h2>
            <hr className="my-3 border-white/20" />
            <p className="mb-5 text-center font-aribau text-2xl text-white">{faceShape}</p>
            <div className="mx-auto flex w-fit items-center justify-center rounded-[44px] bg-[#1e848d] p-3 sm:p-[18px]">
                <div className="rounded-[30px] bg-white p-3 sm:p-4">
                    {hasError ? (
                        <div className="flex aspect-square w-[min(68vw,440px)] items-center justify-center text-black">
                            Could not generate QR
                        </div>
                    ) : (
                        <div ref={holderRef} className="max-w-full overflow-hidden" />
                    )}
                </div>
            </div>
            <ModalCloseButton onClick={onClose} />
        </Modal>
    );
}

function ModalCloseButton({ onClick }: { onClick: () => void }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="mt-6 min-h-14 w-full rounded-full border border-white/40 bg-white/15 font-aribau text-xl text-white backdrop-blur-xl hover:bg-white/25 sm:min-h-[88px]"
        >
            Got it
        </button>
    );
}

function Modal({ children, onClose }: { children: ReactNode; onClose: () => void }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md" onClick={onClose}>
            <section
                role="dialog"
                aria-modal="true"
                aria-label="Result details"
                className="max-h-[calc(100dvh-2rem)] w-full max-w-[738px] overflow-y-auto rounded-[clamp(28px,6vw,48px)] border-2 border-white/40 bg-black/35 p-4 text-white shadow-2xl backdrop-blur-xl sm:px-8 sm:py-8"
                onClick={event => event.stopPropagation()}
            >
                {children}
            </section>
        </div>
    );
}
