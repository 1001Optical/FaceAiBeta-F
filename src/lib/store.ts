/**
 * 매장 식별. 진입 URL의 `?store=`(예: chc/chw)를 세션에 저장하고 반환.
 * param이 한 번이라도 들어오면 그 세션 내내 유지됨. 없으면 'unknown'.
 * 매장 id는 여기 한 곳에서만 읽음 — 다른 곳은 import해서 쓸 것.
 */
export function getStore(): string {
  if (typeof window === 'undefined') return 'unknown';
  const fromUrl = new URLSearchParams(window.location.search).get('store');
  if (fromUrl) sessionStorage.setItem('store', fromUrl.toLowerCase());
  return sessionStorage.getItem('store') ?? 'unknown';
}
