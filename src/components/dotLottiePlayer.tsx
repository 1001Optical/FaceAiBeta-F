import { DotLottiePlayer } from '@dotlottie/react-player'
import '@dotlottie/react-player/dist/index.css';

interface IProps {
  src: string;
  style?: string
}

export default function DotPlayer({src, style}: IProps) {
  return (
    <div className={`flex items-center justify-center w-full ${style ?? ''}`}>
      <DotLottiePlayer
        src={src}
        autoplay
        loop
        background="transparent"
        speed={1}
        className={"w-full h-full"}
      />
    </div>
  );
}
