import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import StatsSection from "@/components/StatsSection";
import AboutUs from "@/components/AboutUs";
import Destinations from "@/components/Destinations";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function Home() {
  let countries: any[] = [];
  try {
    countries = await prisma.country.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
      include: {
        destinations: {
          where: { status: "PUBLISHED" },
          take: 3,
          include: { thumbnailImage: true }
        }
      }
    });
  } catch (error) {
    console.error("Database error:", error);
  }

  let heroImage = "/assets/hero_bg.png";
  let aboutUsImage = "/assets/agency_office.png";
  try {
    const [heroSetting, aboutSetting] = await Promise.all([
      prisma.setting.findUnique({ where: { key: "hero_home" } }),
      prisma.setting.findUnique({ where: { key: "about_us_image" } }),
    ]);
    if (heroSetting?.value) {
      heroImage = heroSetting.value;
    }
    if (aboutSetting?.value) {
      aboutUsImage = aboutSetting.value;
    }
  } catch (error) {
    console.warn("Failed to fetch page settings, using defaults:", error);
  }

  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero heroImage={heroImage} />
      <StatsSection />
      <AboutUs aboutImage={aboutUsImage} />
      <Destinations initialCountries={JSON.parse(JSON.stringify(countries))} />
    </main>
  );
}

