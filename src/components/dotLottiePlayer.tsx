import dynamic from 'next/dynamic';
import '@dotlottie/react-player/dist/index.css';

const DotLottiePlayer = dynamic(
  () => import('@lottiefiles/dotlottie-react').then(m => m.DotLottieReact),
  { ssr: false }
);

interface IProps {
  src: string;
  className?: string;
  size?: string;
}

export default function DotPlayer({src, className, size}: IProps) {
  return (
    <div
      className={`flex items-center justify-center w-full ${className ?? ''}`}
    >
      <DotLottiePlayer
        src={src}
        loop
        autoplay
        className={size ?? 'w-[400px] h-[400px]'}
      />
    </div>
  );
}
