'use client';

import Image from "next/image";
import { useState } from "react";
import PolicyModal from "@/components/PolicyModal";
import Link from "next/link";

export default function Home() {
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);

  return (
    <main className="min-h-screen w-full bg-black">
      <div className="max-w-[834px] mx-auto px-6 py-8">
        {/* header section */}
        <header className="flex flex-col items-center justify-center space-y-8 mb-8">
          <div className="relative w-[200px] h-[120px]">
            <Image
              src="https://i.ibb.co/4wLNdbSx/logo-w.png"
              alt="1001Logo"
              fill
              sizes="200px"
              className="object-contain"
              priority
            />
          </div>
        </header>

        {/* 메인 콘텐츠 영역 */}
        <div className="max-w-[768px] mx-auto">
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold text-center text-white mb-6">Ai Facial Recommendation</h1>
            <div className="relative w-[660px] h-[400px] bg-gray-100 rounded-xl mb-12 overflow-hidden my-8">
              <Image
                src="https://i.ibb.co/CK49vHLp/Screenshot-2025-06-18-at-3-52-33-pm.png"
                alt="Facial Analysis"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex items-center justify-center w-full">
              <Link href="/scan" className="flex justify-center">
                <button className="px-12 py-4 bg-[#007a8a] text-white rounded-xl font-semibold text-lg hover:bg-gray-300 transition-colors duration-200 shadow-md">
                  Start New Test
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <PolicyModal 
        isOpen={isPolicyModalOpen}
        onClose={() => setIsPolicyModalOpen(false)}
      />
    </main>
  );
}
