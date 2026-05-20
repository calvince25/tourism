import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import StatsSection from "@/components/StatsSection";
import AboutUs from "@/components/AboutUs";
import Destinations from "@/components/Destinations";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  let countries = [];
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
    console.error("Database connection failed, using fallback data.");
    countries = [
      {
        id: "mock-kenya",
        name: "Kenya",
        slug: "kenya",
        destinations: [
          { id: "1", name: "Maasai Mara", slug: "maasai-mara", shortTeaser: "The world-famous wildlife reserve." },
          { id: "2", name: "Amboseli", slug: "amboseli", shortTeaser: "Home of the African elephant." },
        ]
      },
      {
        id: "mock-tz",
        name: "Tanzania",
        slug: "tanzania",
        destinations: [
          { id: "3", name: "Serengeti", slug: "serengeti", shortTeaser: "Endless plains of wildlife." },
        ]
      }
    ];
  }

  let heroImage = "/assets/hero_bg.png";
  try {
    const dbPromise = prisma.setting.findUnique({
      where: { key: "hero_home" }
    });
    const timeoutPromise = new Promise<any>((_, reject) => 
      setTimeout(() => reject(new Error("Timeout")), 2000)
    );
    const heroSetting = await Promise.race([dbPromise, timeoutPromise]);
    if (heroSetting?.value) {
      heroImage = heroSetting.value;
    }
  } catch (error) {
    console.warn("Failed to fetch home hero setting, using default:", error);
  }

  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero heroImage={heroImage} />
      <StatsSection />
      <AboutUs />
      <Destinations initialCountries={JSON.parse(JSON.stringify(countries))} />
    </main>
  );
}
