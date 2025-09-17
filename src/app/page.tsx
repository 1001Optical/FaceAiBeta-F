'use client';

import styles from "@/css/main.module.css"
import Image from 'next/image';
import ResponsiveContainer from '../components/ResponsiveContainer';
import DotPlayer from '@/components/dotLottiePlayer';
import SiteHeader from '@/components/header';
import IooIBtn from '@/components/IooIBtn';
import { useRouter } from 'next/navigation';

const Home = () =>  {
  const router = useRouter();

  return (
    <main className={styles.main}>
      <ResponsiveContainer page={"main"}>
        <SiteHeader />
        {/* 메인 콘텐츠 영역 */}
        <div className={styles.contents}>
          <div className={styles.title_box}>
            <div className={"relative"}>
              <div className={styles.title_img}>
                <Image
                  src="/Title.png"
                  alt="AI Eyewear Recommendation, Perfect Frames. Powered by AI."
                  width={579}
                  height={176}
                  className="object-contain"
                  priority
                />
                <DotPlayer
                  src={"https://lottie.host/c992f4c3-1b27-4dff-8586-f6d9af8192da/Rpb2UtV7ND.lottie"}
                  style={"w-[810px] h-fit relative"}
                />
              </div>
            </div>
            <div className={"w-full"}>
              <IooIBtn text={"Start Face Scan"} icon={"/arrow_right.png"} onClick={() => router.push('/scan')} />
            </div>
          </div>
        </div>
      </ResponsiveContainer>
    </main>
  );
}

export default Home