import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

/**
 * Canonical production base URL — never use env vars here so Vercel
 * preview deployments or a misconfigured NEXT_PUBLIC_SITE_URL cannot
 * accidentally leak a wrong origin into the sitemap.
 */
const BASE_URL = 'https://www.wildpathafrica.co.ke'

/** Join base + path without ever producing a double slash. */
function url(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${BASE_URL}${cleanPath}`
}

/**
 * Static pages with fixed, meaningful lastModified dates.
 * Update these dates whenever you ship copy/design changes to the page.
 */
const staticPages: MetadataRoute.Sitemap = [
  {
    url: url('/'),
    lastModified: new Date('2026-06-30'),
    changeFrequency: 'daily',
    priority: 1.0,
  },
  {
    url: url('/destinations'),
    lastModified: new Date('2026-06-30'),
    changeFrequency: 'weekly',
    priority: 0.9,
  },
  {
    url: url('/tours'),
    lastModified: new Date('2026-06-30'),
    changeFrequency: 'weekly',
    priority: 0.9,
  },
  {
    url: url('/blog'),
    lastModified: new Date('2026-06-30'),
    changeFrequency: 'daily',
    priority: 0.8,
  },
  {
    url: url('/about'),
    lastModified: new Date('2026-06-15'),
    changeFrequency: 'monthly',
    priority: 0.7,
  },
  {
    url: url('/contact'),
    lastModified: new Date('2026-06-15'),
    changeFrequency: 'monthly',
    priority: 0.7,
  },
  {
    url: url('/faq'),
    lastModified: new Date('2026-06-15'),
    changeFrequency: 'monthly',
    priority: 0.7,
  },
  {
    url: url('/sitemap'),
    lastModified: new Date('2026-06-30'),
    changeFrequency: 'monthly',
    priority: 0.5,
  },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const [destinations, tours, posts, countries] = await Promise.all([
      prisma.destination.findMany({
        where: { status: 'PUBLISHED' },
        select: { slug: true, updatedAt: true, country: { select: { slug: true } } },
        orderBy: { updatedAt: 'desc' },
      }),
      prisma.tour.findMany({
        where: { status: 'PUBLISHED' },
        select: { slug: true, updatedAt: true },
        orderBy: { updatedAt: 'desc' },
      }),
      prisma.blogPost.findMany({
        where: { status: 'PUBLISHED' },
        select: { slug: true, updatedAt: true },
        orderBy: { updatedAt: 'desc' },
      }),
      prisma.country.findMany({
        where: { active: true },
        select: { slug: true, createdAt: true },
      }),
    ])

    const countryPages: MetadataRoute.Sitemap = countries.map((c) => ({
      url: url(`/destinations/${c.slug}`),
      lastModified: c.createdAt,
      changeFrequency: 'weekly',
      priority: 0.85,
    }))

    const destinationPages: MetadataRoute.Sitemap = destinations.map((d) => ({
      url: url(`/destinations/${d.country.slug}/${d.slug}`),
      lastModified: d.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.9,
    }))

    const tourPages: MetadataRoute.Sitemap = tours.map((t) => ({
      url: url(`/tours/${t.slug}`),
      lastModified: t.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.85,
    }))

    const blogPages: MetadataRoute.Sitemap = posts.map((p) => ({
      url: url(`/blog/${p.slug}`),
      lastModified: p.updatedAt,
      changeFrequency: 'monthly',
      priority: 0.7,
    }))

    return [
      ...staticPages,
      ...countryPages,
      ...destinationPages,
      ...tourPages,
      ...blogPages,
    ]
  } catch (error) {
    console.warn(
      'Sitemap: database unavailable — returning static pages only.',
      error,
    )
    return staticPages
  }
}
