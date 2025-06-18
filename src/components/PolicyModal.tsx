import { useState } from 'react';

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PolicyModal({ isOpen, onClose }: PolicyModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">🔒 Privacy Policy – Facial Analysis Addendum</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <div className="space-y-4 text-gray-600">
          <h3 className="text-xl font-semibold text-gray-800">Facial Analysis for Eyewear Recommendations</h3>
          
          <p>We offer an optional facial analysis feature that allows customers to receive personalised eyewear recommendations based on their face shape.</p>
          
          <p>By using this feature, you acknowledge and agree to the following:</p>
          
          <ul className="list-disc pl-6 space-y-2">
            <li>Your facial image will be captured and processed using AI technology to determine your face shape.</li>
            <li>The image is processed in real-time and will not be stored or retained after analysis is complete.</li>
            <li>No facial data is used for identity recognition, biometric matching, or any unrelated purposes.</li>
            <li>Your image is not shared with third parties, and no data is used for marketing or profiling.</li>
            <li>We do not store any biometric information as defined under the Australian Privacy Act 1988.</li>
            <li>You must be 15 years or older to use this feature. If you are under 15, parental or guardian consent is required.</li>
          </ul>
          
          <p className="font-semibold">By proceeding, you consent to this one-time analysis for the stated purpose only.</p>

          <div className="flex justify-center mt-8">
            <button
              onClick={onClose}
              className="px-8 py-3 bg-[#007a8a] text-white rounded-xl font-semibold text-lg hover:bg-blue-700 transition-colors duration-200 shadow-md"
            >
              I Agree
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 