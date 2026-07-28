'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import ResponsiveContainer from '@/components/ResponsiveContainer';
import SiteHeader from '@/components/header';
import IooIBtn from '@/components/IooIBtn';

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
    <main className="relative min-h-screen w-full overflow-hidden">
      <ResponsiveContainer page={"main"}>
        <SiteHeader leftHref={() => router.push('/')} />

        <div className="flex h-full flex-col px-9 pb-8 pt-[120px]">
          <div className="mb-10">
            <div className="mb-3 flex items-center justify-end font-aribau text-[20px] text-white/80">
              <span>1 / 1</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/20">
              <div className="h-full w-full rounded-full bg-white" />
            </div>
          </div>

          <section className="my-auto rounded-[40px] border border-white/40 bg-black/40 px-8 py-10 text-white shadow-lg backdrop-blur-[12.5px]">
            <div className="flex flex-col items-center">
              <h1 className="mb-10 text-center font-aribau text-[40px] leading-[120%] tracking-[-0.12px]">
                How would you describe
                <br />
                your face width?
              </h1>

              <div className="flex w-full justify-center gap-5">
                {faceWidthOptions.map(option => {
                  const selected = faceWidth === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => setFaceWidth(option.value)}
                      className={`flex h-[220px] w-[200px] flex-col items-center justify-center gap-4 rounded-[20px] border font-aribau transition ${
                        selected
                          ? 'border-white bg-white/25 ring-4 ring-white/20'
                          : 'border-white/45 bg-white/10 hover:bg-white/20'
                      }`}
                    >
                      <span className="text-[26px]">{option.value}</span>
                      <span className={`flex h-[108px] ${option.widthClass} items-center justify-center rounded-[50%] border-[3px] border-white/90 bg-white/5`} />
                      <span className="text-[17px] text-white/65">{option.description}</span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-10 w-full">
                <IooIBtn
                  text={faceWidth ? 'Start Face Scan' : 'Select face width first'}
                  icon={faceWidth ? '/arrow_right.png' : undefined}
                  onClick={continueToScan}
                  disabled={!faceWidth}
                />
              </div>
            </div>
          </section>
        </div>
      </ResponsiveContainer>
    </main>
  );
}
