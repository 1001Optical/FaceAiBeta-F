// Brand CTA links shown in the result page button stack (/result/[shape]).
// Brand is "1001 Optometry" (1001optical.com.au redirects to 1001optometry.com.au).
// Edit here only (single source of truth).
export interface SocialLink {
  label: string;
  href: string;
}

export const SOCIAL_LINKS: SocialLink[] = [
  { label: 'Shop Frames Online', href: 'https://1001optometry.com.au' },
  // Google Maps opens with the user's location, so this surfaces the nearest branch.
  // Adjust the brand query if the stores are listed under a different name on Maps.
  { label: 'Find Nearest Store', href: 'https://www.google.com/maps/search/?api=1&query=1001%20Optometry' },
  { label: 'See more on Instagram', href: 'https://instagram.com/1001optometry' },
];
