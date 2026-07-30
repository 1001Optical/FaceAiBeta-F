import Image from 'next/image';

type IconSize = 'xs' | 'sm' | 'lg' | 'xl' | 'result';
interface IIconPorps {
  size: IconSize;
  iconPath: string
}

const IooIIcon = ({size, iconPath}: IIconPorps) => {

  const changeSize = (size:IconSize) => {
    switch(size) {
      case 'xs':
        return "size-[24px]"
      case 'sm':
        return "size-[44px]"
      case 'lg':
        return "size-[128px]"
      case 'xl':
        return "size-[158px]"
      case 'result':
        return "size-[112px]"
    }
  }

  return (
    <div className={`${changeSize(size)} overflow-hidden relative`}>
      <Image src={iconPath} alt={iconPath} fill className={`object-cover`} />
    </div>
  );
}

export default IooIIcon