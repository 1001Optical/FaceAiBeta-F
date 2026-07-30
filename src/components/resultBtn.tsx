import styles from '@/css/main.module.css'
import Image from 'next/image';
import React from 'react';

interface IProps {
  onClick: () => void
  style?: string
  text: string
  image: string
}

const ResultBtn = ({onClick, style, image, text}:IProps) => {
  return (
    <div className={`w-[738px] h-[88px] mx-auto ${style ?? ''}`}>
      <button
        onClick={onClick}
        className={styles.result_btn}
      >
        <p className={'text-2xl text-white font-aribau'}>{text}</p>
        <Image
          src={`/${image}.png`}
          alt={image}
          width={44}
          height={44}
          className="ml-2"
        />
      </button>
    </div>
  );
}

export default ResultBtn;