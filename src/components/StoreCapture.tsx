'use client';

import { useEffect } from 'react';
import { getStore } from '@/lib/store';

/**
 * 진입 시 ?store= param을 세션에 캡처. 이후 /scan으로 이동해 param이 사라져도 유지됨.
 * 막지는 않음 — param 없으면 나중에 store='unknown'으로 기록됨. 화면엔 아무것도 안 그림.
 */
export default function StoreCapture() {
  useEffect(() => {
    getStore();
  }, []);
  return null;
}
