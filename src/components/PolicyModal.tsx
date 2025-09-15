import React from 'react';

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PolicyModal({ isOpen, onClose }: PolicyModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white text-black p-6 rounded-lg max-w-md mx-4 max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">개인정보 처리방침</h2>
        <div className="text-sm space-y-3">
          <p>
            본 서비스는 얼굴 인식 기술을 사용하여 얼굴형을 분석합니다. 업로드된
            이미지는 분석 목적으로만 사용되며, 서버에 저장되지 않습니다.
          </p>
          <p>
            분석 결과는 개인 맞춤형 안경 프레임 추천을 위해 사용됩니다. 모든
            데이터는 안전하게 처리되며, 제3자와 공유되지 않습니다.
          </p>
          <p>서비스 이용 시 위 내용에 동의하는 것으로 간주됩니다.</p>
        </div>
        <button
          onClick={onClose}
          className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          확인
        </button>
      </div>
    </div>
  );
}
