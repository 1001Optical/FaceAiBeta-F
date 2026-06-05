'use client';

import styles from "@/css/main.module.css"
import Image from 'next/image';
import ResponsiveContainer from '../components/ResponsiveContainer';
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
                  fetchPriority={"high"}
                />
                {/* Animated SVG (SMIL) — plays on its own as a plain image. */}
                <Image
                  src="/lottie_preload/main.svg"
                  alt=""
                  width={810}
                  height={705}
                  className="w-full h-[532px] object-contain"
                  unoptimized
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