"use client"

import Link from 'next/link';
import Image from 'next/image';
import IooIIcon from '@/components/icon';

interface IHeaderProps {
  leftHref?: string
  rightHref?: () => void
}

const SiteHeader = ({leftHref, rightHref}: IHeaderProps) => {
  return (
    <div className={'w-full h-[64px] flex justify-between items-center mt-6'}>
      <div className={"ml-4"}>{leftHref ? <Link href={leftHref}> <IooIIcon size={'sm'} iconPath={"/direction_left.png"} /> </Link>: <></>}</div>
      <Link href="/" passHref>
        <div className="relative cursor-pointer w-[100px] h-[64px]">
          <Image
            src="/1001Logo.png"
            alt="1001Logo"
            fill
            className="object-contain w-full h-full"
            priority
          />
        </div>
      </Link>
      <div className={'mr'}>{rightHref ? <IooIIcon size={'sm'} iconPath={'/arrow_right.png'}/> : <></>}</div>
    </div>
  );
}

export default SiteHeader;