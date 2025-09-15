import { Player } from '@lottiefiles/react-lottie-player';
interface IProps {
  src: string
  style?: string
}

export default function LottiePlayer({src, style}:IProps) {
  return (
    <Player
      autoplay
      loop
      src={src}
      className={`w-3 left-0 ${style ?? ""}`}
    />
  );
}
