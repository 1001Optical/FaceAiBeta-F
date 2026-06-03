"use client"

import styles from "@/css/main.module.css"
import ResponsiveContainer from '@/components/ResponsiveContainer';
import IooIBtn from '@/components/IooIBtn';
import { TFaceShape } from '@/types/face';
import { SOCIAL_LINKS } from '@/config/socialLinks';
import { use } from 'react';
import { notFound } from 'next/navigation';

const SHAPES: TFaceShape[] = ['Diamond', 'Heart', 'Oval', 'Angular', 'Round'];

interface IProps {
  params: Promise<{ shape: string }>;
}

/**
 * QR landing. Scanning the result QR opens this page. It shows the pre-generated
 * result image (a faithful screenshot of /result/[shape]) so it can be saved/shared,
 * plus the brand social links. Reuses the existing result-page chrome + spacing —
 * no new design.
 */
export default function Share({ params }: IProps) {
  const { shape: raw } = use(params);
  // API may say "Square"; the UI treats it as "Angular" (matches result page).
  const shape = (raw === 'Square' ? 'Angular' : raw) as TFaceShape;
  if (!SHAPES.includes(shape)) notFound();

  return (
    <ResponsiveContainer page={'result'}>
      <div className={'pt-6 px-9 h-full'}>
        <div className={'w-full h-full flex flex-col gap-8'}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/result-images/${shape}.png`}
            alt={`${shape} face shape result`}
            className={styles.result_img}
          />
          <p className={'label-lg text-white-800 text-center'}>
            Press and hold the image to save &amp; share it
          </p>
          <div className={'pb-8 flex flex-col gap-4'}>
            {SOCIAL_LINKS.map((link) => (
              <IooIBtn
                key={link.href}
                text={link.label}
                onClick={() => window.open(link.href, '_blank', 'noopener,noreferrer')}
              />
            ))}
          </div>
        </div>
      </div>
    </ResponsiveContainer>
  );
}
