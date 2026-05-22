const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  // ── SETTINGS ──────────────────────────────────────────────
  const settingsData = [
    { key: 'site_name',        value: 'WildpathAfrica' },
    { key: 'site_tagline',     value: 'Where Every Path Leads to Wonder' },
    { key: 'site_email',       value: 'info@wildpathafrica.co.ke' },
    { key: 'site_phone',       value: '+254 704 059 438' },
    { key: 'site_whatsapp',    value: '254704059438' },
    { key: 'site_address',     value: 'Nairobi, Kenya' },
    { key: 'social_facebook',  value: 'https://facebook.com/wildpathafrica' },
    { key: 'social_instagram', value: 'https://instagram.com/wildpathafrica' },
    { key: 'social_tiktok',    value: 'https://tiktok.com/@wildpathafrica' },
    { key: 'ga4_id',           value: '' },
    { key: 'currency',         value: 'KES' },
  ]

  for (const s of settingsData) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: { key: s.key, value: s.value }
    })
  }
  console.log('✅ Settings seeded')

  // ── COUNTRY: KENYA ────────────────────────────────────────
  const kenya = await prisma.country.upsert({
    where: { slug: 'kenya' },
    create: { name: 'Kenya', slug: 'kenya', continent: 'Africa', flagEmoji: '🇰🇪', sortOrder: 1, active: true },
    update: {}
  })
  console.log('✅ Kenya country seeded')

  // ── KENYA DESTINATIONS ────────────────────────────────────
  const destinations = [
    { name: 'Maasai Mara National Reserve', slug: 'maasai-mara', shortTeaser: "Witness the Great Wildebeest Migration and encounter the Big Five on Kenya's most iconic savannah.", metaTitle: "Maasai Mara Safari | Kenya's Greatest Wildlife Reserve | WildpathAfrica", metaDescription: "Experience the Great Wildebeest Migration and Big Five in Maasai Mara.", focusKeyword: 'Maasai Mara safari Kenya', secondaryKeywords: JSON.stringify(['Great Wildebeest Migration', 'Big Five Kenya', 'Maasai Mara lodges']), language: 'English, Swahili, Maasai', currency: 'KES / USD', timezone: 'EAT (UTC+3)', visaRequired: true, bestSeason: 'July–October (Migration); Year-round for Big Five', parkEntryResident: 'KES 400/day', parkEntryNonResident: 'USD 80/day' },
    { name: 'Amboseli National Park', slug: 'amboseli', shortTeaser: 'Walk with giant elephant herds beneath the snow-capped peak of Mount Kilimanjaro.', metaTitle: "Amboseli National Park | Elephants & Kilimanjaro Views | WildpathAfrica", metaDescription: "Witness Kenya's majestic elephant herds against Mount Kilimanjaro in Amboseli National Park.", focusKeyword: 'Amboseli National Park safari', language: 'English, Swahili, Maasai', currency: 'KES / USD', timezone: 'EAT (UTC+3)', visaRequired: true, bestSeason: 'June–October; January–February for clear Kilimanjaro views', parkEntryResident: 'KES 400/day', parkEntryNonResident: 'USD 60/day' },
    { name: 'Diani Beach', slug: 'diani-beach', shortTeaser: 'Stretch out on 25km of white coral sand lapped by the warm turquoise Indian Ocean.', metaTitle: "Diani Beach Kenya | Africa's Best Beach Holiday | WildpathAfrica", metaDescription: "Relax on Diani Beach — 25km of white sand and turquoise Indian Ocean.", focusKeyword: 'Diani Beach Kenya holiday', language: 'English, Swahili', currency: 'KES / USD', timezone: 'EAT (UTC+3)', visaRequired: true, bestSeason: 'December–March (calm seas); June–September (kite surfing)' },
    { name: 'Lake Nakuru National Park', slug: 'lake-nakuru', shortTeaser: 'A flamingo-fringed soda lake surrounded by acacia forest sheltering rhinos and lions.', metaTitle: "Lake Nakuru National Park | Flamingos & Rhinos | WildpathAfrica", metaDescription: "Visit Lake Nakuru for flamingos, endangered rhinos, and prolific birdlife.", focusKeyword: 'Lake Nakuru National Park Kenya', language: 'English, Swahili', currency: 'KES / USD', timezone: 'EAT (UTC+3)', visaRequired: true, bestSeason: 'Year-round; June–September for bird concentrations' },
    { name: 'Tsavo East & West', slug: 'tsavo', shortTeaser: "Kenya's largest wilderness — 22,000 sq km of red-dusted elephants, volcanic landscapes, and silent solitude.", metaTitle: "Tsavo National Park Kenya | Kenya's Largest Wilderness | WildpathAfrica", metaDescription: "Explore Tsavo East and West — Kenya's largest national park, famous for red elephants.", focusKeyword: 'Tsavo National Park Kenya safari', language: 'English, Swahili', currency: 'KES / USD', timezone: 'EAT (UTC+3)', visaRequired: true, bestSeason: 'June–October; January–February' },
    { name: 'Nairobi', slug: 'nairobi', shortTeaser: 'The only capital city on Earth with a national park — lions roaming against a skyscraper skyline.', metaTitle: "Nairobi Tourism | Safari, Culture & City Experiences | WildpathAfrica", metaDescription: "Discover Nairobi — David Sheldrick Elephant Orphanage, Giraffe Centre, Nairobi National Park.", focusKeyword: 'Nairobi tourism Kenya', language: 'English, Swahili', currency: 'KES', timezone: 'EAT (UTC+3)', visaRequired: true, bestSeason: 'Year-round' },
    { name: 'Mount Kenya & Aberdare', slug: 'mount-kenya', shortTeaser: "Trek Africa's second-highest peak through moorlands, glacial tarns, and ancient forest.", metaTitle: "Mount Kenya Trekking | Africa's Second Highest Mountain | WildpathAfrica", metaDescription: "Climb Mount Kenya through Sirimon, Chogoria, or Naro Moru routes.", focusKeyword: 'Mount Kenya trekking climb', language: 'English, Swahili', currency: 'KES / USD', timezone: 'EAT (UTC+3)', visaRequired: true, bestSeason: 'January–February; July–September' },
    { name: 'Samburu National Reserve', slug: 'samburu', shortTeaser: 'Remote northern Kenya where rare species found nowhere else roam untouched semi-arid wilderness.', metaTitle: "Samburu National Reserve | Kenya's Northern Frontier Safari | WildpathAfrica", metaDescription: "Discover Samburu's unique Northern Specials — reticulated giraffe, Grevy's zebra.", focusKeyword: 'Samburu National Reserve safari Kenya', language: 'English, Swahili, Samburu', currency: 'KES / USD', timezone: 'EAT (UTC+3)', visaRequired: true, bestSeason: 'June–September; January–February' },
    { name: 'Watamu & Malindi', slug: 'watamu-malindi', shortTeaser: "Kenya's marine heartland — UNESCO coral reefs, turtle nesting beaches, and Swahili history.", metaTitle: "Watamu & Malindi Kenya | Marine Parks & Beaches | WildpathAfrica", metaDescription: "Explore Watamu Marine National Park, sea turtles, world-class diving.", focusKeyword: 'Watamu Malindi Kenya beach', language: 'English, Swahili', currency: 'KES / USD', timezone: 'EAT (UTC+3)', visaRequired: true, bestSeason: 'October–March (turtles); Year-round diving' },
    { name: 'Lamu Island', slug: 'lamu', shortTeaser: 'A UNESCO World Heritage island of whitewashed coral-stone houses, donkey-paths, and dhow-sailing sunsets.', metaTitle: "Lamu Island Kenya | UNESCO World Heritage Culture & Dhow Sailing | WildpathAfrica", metaDescription: "Escape to Lamu Island — Kenya's most authentic Swahili experience.", focusKeyword: 'Lamu Island Kenya tourism', language: 'English, Swahili', currency: 'KES / USD', timezone: 'EAT (UTC+3)', visaRequired: true, bestSeason: 'July–September; January–March' },
  ]

  for (const dest of destinations) {
    await prisma.destination.upsert({
      where: { slug: dest.slug },
      create: { ...dest, countryId: kenya.id, status: 'PUBLISHED' },
      update: {}
    })
  }
  console.log('✅ 10 Kenya destinations seeded')

  // ── GLOBAL FAQs ───────────────────────────────────────────
  const faqs = [
    { category: 'Booking & Reservations', sortOrder: 1, question: 'How do I book a safari or tour with WildpathAfrica?', answer: 'Browse our tours and destinations on wildpathafrica.co.ke, click "Book Now" or "Get a Quote" on your chosen package, and complete the inquiry form. Our safari consultant will contact you within 24 hours to confirm availability.' },
    { category: 'Booking & Reservations', sortOrder: 2, question: 'Can I book a private safari for my family or group?', answer: 'Absolutely. All WildpathAfrica tours can be arranged as fully private departures for couples, families, or corporate groups, offering maximum flexibility in timing, pace, and itinerary customization.' },
    { category: 'Booking & Reservations', sortOrder: 3, question: 'How far in advance should I book a Kenya safari?', answer: 'We recommend booking 4–8 weeks in advance for most tours. For peak season (July–October, Great Migration) and luxury Maasai Mara lodges, book 3–6 months ahead to secure availability.' },
    { category: 'Payment & Pricing', sortOrder: 1, question: 'What payment methods do you accept?', answer: 'WildpathAfrica accepts M-Pesa (Kenya preferred), Visa/Mastercard, bank transfer (local and international), PayPal, and cash (KES or USD at our Nairobi office). All online payments are SSL-encrypted.' },
    { category: 'Payment & Pricing', sortOrder: 2, question: 'Is a deposit required to confirm my booking?', answer: 'Yes. A 30% deposit is required to confirm your booking and secure lodge reservations. The balance is due 30 days before departure.' },
    { category: 'Cancellation & Refunds', sortOrder: 1, question: 'What is the WildpathAfrica cancellation policy?', answer: '60+ days before departure: full refund minus 10% admin fee. 30–59 days: 50% refund. 15–29 days: 25% refund. Under 14 days: no refund (travel insurance strongly recommended).' },
    { category: 'Visas & Documentation', sortOrder: 1, question: 'Do I need a visa to visit Kenya?', answer: 'Most international visitors require a Kenya ETA (Electronic Travel Authorisation), applied for online at etakenya.go.ke before travel. It typically costs USD 30 and is processed within 72 hours.' },
    { category: 'Safari Experiences', sortOrder: 1, question: 'What is the Great Wildebeest Migration and when can I see it?', answer: "The Great Wildebeest Migration sees over 1.5 million wildebeest and hundreds of thousands of zebra journey between Kenya's Maasai Mara and Tanzania's Serengeti. The most dramatic Mara River crossings occur July–October in the Maasai Mara." },
    { category: 'Safari Experiences', sortOrder: 2, question: "What are Kenya's Big Five and where do I see them?", answer: "Kenya's Big Five are lion, elephant, buffalo, leopard, and rhinoceros. Best parks: Maasai Mara (lion, leopard, elephant, buffalo), Amboseli (elephant), Ol Pejeta (rhino), Lake Nakuru (rhino, lion), and Tsavo (all five)." },
    { category: 'Safety & Health', sortOrder: 1, question: 'Is it safe to travel to Kenya?', answer: "Kenya's established national parks and reserves are very safe for tourists, managed by Kenya Wildlife Service with ranger patrols. WildpathAfrica continuously monitors KWS and government travel advisories." },
    { category: 'Sustainability', sortOrder: 1, question: 'Is WildpathAfrica committed to sustainable tourism?', answer: 'Yes. We exclusively partner with KWS-licensed operators and eco-certified lodges, limit group sizes to reduce wildlife disturbance, support Maasai and local community enterprises.' },
  ]

  await prisma.faq.createMany({
    data: faqs,
    skipDuplicates: true,
  })
  console.log('✅ FAQs seeded')
  console.log('✅ Database seeded successfully!')
}

main().catch(console.error).finally(() => prisma.$disconnect())
