export type StoreEventParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: object[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * 매장 키오스크용 커스텀 이벤트. GA4(gtag)와 GTM(dataLayer)에 동시에 전달합니다.
 * GTM에서는 트리거를 Custom Event 이름으로 맞추면 됩니다.
 */
export function trackStoreEvent(eventName: string, params?: StoreEventParams): void {
  if (typeof window === "undefined") return;

  const dataLayer = (window.dataLayer = window.dataLayer ?? []);
  dataLayer.push({ event: eventName, ...params });

  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, params ?? {});
  }
}
