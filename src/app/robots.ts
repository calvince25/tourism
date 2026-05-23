import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://wildpathafrica.co.ke'
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/admin/', '/auth/', '/api/'] },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  }
}
