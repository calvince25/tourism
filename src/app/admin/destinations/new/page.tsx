import { prisma } from "@/lib/prisma";
import DestinationForm from "@/components/admin/DestinationForm";

export default async function NewDestinationPage() {
  let countries = [];
  try {
    countries = await prisma.country.findMany({
      where: { active: true },
      orderBy: { name: 'asc' }
    });
  } catch (error) {
    console.error("Database connection failed, loading mock countries.");
    countries = [
      { id: "mock-country-ke", name: "Kenya", slug: "kenya", active: true },
      { id: "mock-country-tz", name: "Tanzania", slug: "tanzania", active: true },
      { id: "mock-country-ug", name: "Uganda", slug: "uganda", active: true },
    ];
  }

  return (
    <DestinationForm countries={JSON.parse(JSON.stringify(countries))} />
  );
}
