"use client"
import Modal from '@/components/Modal/modal';
import React from 'react';
import { QRCodeSVG } from 'qrcode.react'; 
import { useShare } from '@/hooks/useShare';

interface IProps {
  faceShape: string;
  onClose: () => void;
  targetUrl: string;
}

const QRModal = ({ faceShape, onClose, targetUrl }: IProps) => {
  const { copySuccess, handleCopyLink, handleShare } = useShare({ targetUrl, faceShape });

  return (
    <Modal onClose={onClose}>
      {/* 전체 콘텐트 영역 */}
      <div className="flex flex-col gap-[42px] items-center justify-center w-full max-w-[658px] mx-auto px-4 box-border">
        
        <div className="flex flex-col items-center justify-center gap-6 w-full">
          {/* 상단 타이틀 영역 */}
          <div className="flex flex-col gap-2 items-center justify-center w-full">
            <span className="heading-sm text-white-800 text-center">QR Code</span>
            <div className="w-full max-w-64 h-[1px] bg-white-200" />
            <span className="heading-md text-white-1000 text-center">{faceShape}</span>
          </div>

          {/* QR 코드를 감싸는 박스 */}
          <div className="flex items-center justify-center w-full max-w-[562px] aspect-square bg-white rounded-[48px] p-8 md:p-12 shadow-lg box-border">
            {targetUrl ? (
              <QRCodeSVG 
                value={targetUrl} 
                level="H" 
                includeMargin={false} 
                style={{ width: '100%', height: '100%' }}
              />
            ) : (
              <p className="text-black heading-sm">Generating QR...</p>
            )}
          </div>
        </div>

        {/* 기능 버튼 영역 (두 버튼의 디자인을 완전히 동일하게 통일) */}
        <div className="flex gap-4 w-full">
          {/* 링크 복사 버튼 */}
          <button
            onClick={handleCopyLink}
            disabled={!targetUrl}
            className="flex-1 h-[88px] rounded-full border border-white-200 bg-white-100/80 text-white-1000 label-xl font-medium backdrop-blur-[20px] transition-all duration-300 hover:bg-white-200/90 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none shadow-[inset_0_1px_2px_rgba(255,255,255,0.2),0_4px_12px_rgba(0,0,0,0.1)] flex items-center justify-center gap-2.5"
          >
            {copySuccess ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-400">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
              </svg>
            )}
            <span>{copySuccess ? "Copied!" : "Copy Link"}</span>
          </button>
          
          {/* 공유하기 버튼 (링크 복사 버튼과 완전히 동일한 스타일 클래스로 맞춤 수정) */}
          <button
            onClick={handleShare}
            disabled={!targetUrl}
            className="flex-1 h-[88px] rounded-full border border-white-200 bg-white-100/80 text-white-1000 label-xl font-medium backdrop-blur-[20px] transition-all duration-300 hover:bg-white-200/90 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none shadow-[inset_0_1px_2px_rgba(255,255,255,0.2),0_4px_12px_rgba(0,0,0,0.1)] flex items-center justify-center gap-2.5"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3"></circle>
              <circle cx="6" cy="12" r="3"></circle>
              <circle cx="18" cy="19" r="3"></circle>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
            </svg>
            <span>Share</span>
          </button>
        </div>

        {/* 하단 닫기 버튼 */}
        <button
          onClick={onClose}
          className="w-full h-[88px] py-4 bg-white-200 label-xl text-white-1000 rounded-full hover:bg-white-400 transition-all duration-200 active:scale-[0.98] border border-white-400 shadow-[inset_0_0_1.69px_1.69px_#999999,_inset_0_0_1.69px_1.69px_#FFFFFF26,_inset_-1.69px_-1.69px_1.69px_-0.85px_#FFFFFFBF,_inset_1.69px_1.69px_1.69px_-0.85px_#FFFFFFBF,_inset_-5.07px_-5.07px_0.85px_-5.07px_#FFFFFFCC,_inset_5.07px_5.07px_0.85px_-5.92px_#FFFFFFBF,_0_1.69px_13.52px_0_#0000001F,_0_0_3.38px_0_#0000001A] backdrop-blur-[20px]"
        >
          Got it
        </button>
      </div>
    </Modal>
  );
};

export default QRModal;