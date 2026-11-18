import type { Banner } from '@/types/Banner';

export interface BannerApiResponse {
  success: boolean;
  message: string;
  data: Banner[];
}

const apiBaseUrl = (
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
).replace(/\/+$/, '');

export async function getBannerList(): Promise<BannerApiResponse> {
  const response = await fetch(`${apiBaseUrl}/banners/list`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Could not load banners.');
  }

  return response.json();
}
