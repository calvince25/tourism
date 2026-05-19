import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/admin/', '/auth/', '/api/'] },
    ],
    sitemap: 'https://wildpathafrica.co.ke/sitemap.xml',
    host: 'https://wildpathafrica.co.ke',
  }
}
