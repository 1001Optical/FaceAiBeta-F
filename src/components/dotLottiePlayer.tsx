import dynamic from 'next/dynamic';
import '@dotlottie/react-player/dist/index.css';
import { useEffect, useState } from 'react';

const DotLottiePlayer = dynamic(
  () => import("@dotlottie/react-player").then(m => m.DotLottiePlayer),
  { ssr: false }
);

interface IProps {
  src: string;
  page: 'main' | 'loading';
  className?: string
}

export default function DotPlayer({src, className, page}: IProps) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShow(true), 0); // 마운트 직후 교체 가능
    return () => clearTimeout(t);
  }, []);
  return (
     <div className={`flex items-center justify-center w-full ${className ?? ''}`}>
       {
         show
         ? <DotLottiePlayer
             src={src}
             autoplay
             loop
             background="transparent"
             speed={1}
             className={"w-[400px] h-[400px]"}
           />
         : <img
             src={`/lottie_preload/${page}.svg`}
             alt="Hero poster"
             className="inset-0 object-cover w-[398px] h-[398px]"
             loading="eager"
           />
       }
    </div>
  );
}
