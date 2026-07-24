'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import ResponsiveContainer from '@/components/ResponsiveContainer';

type FaceWidth = 'Wide' | 'Normal' | 'Narrow';

const faceWidthOptions: Array<{
    value: FaceWidth;
    description: string;
    widthClass: string;
}> = [
    { value: 'Wide', description: 'Wider than average', widthClass: 'w-[104px]' },
    { value: 'Normal', description: 'Average width', widthClass: 'w-[78px]' },
    { value: 'Narrow', description: 'Slimmer than average', widthClass: 'w-[56px]' },
];

export default function FilterPage() {
    const router = useRouter();
    const [faceWidth, setFaceWidth] = useState<FaceWidth | ''>('');

    const continueToScan = () => {
        if (!faceWidth) return;

        sessionStorage.setItem('eyewear-filter-answers', JSON.stringify({ faceWidth }));
        const params = new URLSearchParams({ faceWidth });
        router.push(`/scan?${params.toString()}`);
    };

    return (
        <main className="relative min-h-[100dvh] w-full overflow-hidden bg-black-1000">
            <Image src="/Blur.jpg" alt="" fill className="object-cover object-center" priority />

            <ResponsiveContainer>
                <header className="absolute left-0 top-6 z-30 flex h-16 w-[810px] items-center justify-center px-4">
                    <button
                        type="button"
                        aria-label="Go back"
                        onClick={() => router.push('/')}
                        className="absolute left-4 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center text-white-1000"
                    >
                        <Image src="/icon/direction-left-figma.svg" alt="" width={24} height={21} />
                    </button>
                    <Link href="/" className="relative flex h-16 w-[100px] items-center justify-center">
                        <Image src="/1001Logo.png" alt="1001 Optometry" width={94} height={46} className="object-contain" priority />
                    </Link>
                </header>

                <div className="relative z-20 flex h-full min-h-[1080px] flex-col px-8 pb-10 pt-[112px]">
                        <section className="my-auto overflow-hidden rounded-[32px] border border-white-400 bg-white-200 p-6 text-white-1000 shadow-lg backdrop-blur-[5px]">
                            <div className="flex flex-col items-center">
                                <h1 className="mb-10 text-center font-aribau text-[40px] leading-[1.2] text-white-1000">
                                    How would you describe
                                    <br />
                                    your face width?
                                </h1>

                                <div className="flex w-full justify-center gap-6">
                                    {faceWidthOptions.map(option => {
                                        const selected = faceWidth === option.value;
                                        return (
                                            <button
                                                key={option.value}
                                                type="button"
                                                aria-pressed={selected}
                                                onClick={() => setFaceWidth(option.value)}
                                                className={`flex h-[220px] w-[200px] flex-col items-center justify-center gap-5 rounded-[20px] border font-aribau text-white-1000 transition ${
                                                    selected
                                                        ? 'border-white-1000 bg-white-400 ring-4 ring-white-200'
                                                        : 'border-white-400 bg-white-200 hover:bg-white-400'
                                                }`}
                                            >
                                                <span className="text-[26px]">{option.value}</span>
                                                <span className={`flex h-[108px] ${option.widthClass} items-center justify-center rounded-[50%] border-[3px] border-white-1000 bg-white-200`} />
                                                <span className="text-[17px] text-white-600">{option.description}</span>
                                            </button>
                                        );
                                    })}
                                </div>

                                <button
                                    type="button"
                                    disabled={!faceWidth}
                                    onClick={continueToScan}
                                    className="mt-10 flex h-[88px] w-full items-center justify-center rounded-full border border-white-400 bg-black-400 font-aribau text-[26px] text-white-1000 transition enabled:hover:bg-white-400 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Start Face Scan
                                    <Image src="/arrow_right.png" alt="" width={40} height={40} className="ml-2" />
                                </button>
                            </div>
                        </section>
                </div>
            </ResponsiveContainer>
        </main>
    );
}
