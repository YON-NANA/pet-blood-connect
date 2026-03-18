import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'AnimalBloodConnect',
    short_name: 'ABC',
    description: '動物の命を救う緊急供血マッチング・プラットフォーム',
    start_url: '/',
    display: 'standalone',
    background_color: '#fafafa',
    theme_color: '#003366',
    icons: [
      {
        src: '/assets/logo_v2.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/assets/logo_v2.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
