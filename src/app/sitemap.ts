import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://wildpathafrica.co.ke'

  const staticPages = [
    { url: `${base}/`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 1.0 },
    { url: `${base}/destinations`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${base}/tours`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${base}/contact`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${base}/blog`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.8 },
    { url: `${base}/faq`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${base}/reviews`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.6 },
  ]

  try {
    const destinations = await prisma.destination.findMany({
      where: { status: 'PUBLISHED' },
      include: { country: true },
      orderBy: { updatedAt: 'desc' },
    })

    const tours = await prisma.tour.findMany({ where: { status: 'PUBLISHED' } })
    const posts = await prisma.blogPost.findMany({ where: { status: 'PUBLISHED' } })
    const countries = await prisma.country.findMany({ where: { active: true } })

    const countryPages = countries.map(c => ({
      url: `${base}/destinations/${c.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    }))

    const destinationPages = destinations.map(d => ({
      url: `${base}/destinations/${d.country.slug}/${d.slug}`,
      lastModified: d.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }))

    const tourPages = tours.map(t => ({
      url: `${base}/tours/${t.slug}`,
      lastModified: t.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    }))

    const blogPages = posts.map(p => ({
      url: `${base}/blog/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))

    return [...staticPages, ...countryPages, ...destinationPages, ...tourPages, ...blogPages]
  } catch (error) {
    console.warn('Sitemap generation database connection not available yet. Using static fallback pages sitemap.')
    return staticPages
  }
}
