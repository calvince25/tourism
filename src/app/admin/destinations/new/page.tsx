import { prisma } from "@/lib/prisma";
import DestinationForm from "@/components/admin/DestinationForm";

export default async function NewDestinationPage() {
  let countries: any[] = [];
  try {
    countries = await prisma.country.findMany({
      where: { active: true },
      orderBy: { name: 'asc' }
    });
  } catch (error) {
    console.error("Database connection failed fetching countries:", error);
    countries = [];
  }

  return (
    <DestinationForm countries={JSON.parse(JSON.stringify(countries))} />
  );
}
