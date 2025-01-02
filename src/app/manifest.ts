import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'isubscribe',
    short_name: 'isubscribe',
    description: 'A subscription platform for all your needs',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#111827',
    icons: [
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/badge.png',
        sizes: '32x32',
        type: 'image/png',
        purpose: 'badge',
      },
    ],
    prefer_related_applications: false,
    orientation: 'any',
    categories: ['productivity']
  }
}