import { prisma } from "@/lib/prisma";
import DestinationForm from "@/components/admin/DestinationForm";

export default async function NewDestinationPage() {
  const countries = await prisma.country.findMany({
    where: { active: true },
    orderBy: { name: 'asc' }
  });

  return (
    <DestinationForm countries={countries} />
  );
}
