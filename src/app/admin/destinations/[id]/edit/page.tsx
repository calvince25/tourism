import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import DestinationForm from "@/components/admin/DestinationForm";

interface Props {
  params: {
    id: string;
  };
}

export default async function EditDestinationPage({ params }: Props) {
  let destination: any = null;
  let countries: any[] = [];

  try {
    countries = await prisma.country.findMany({
      where: { active: true },
      orderBy: { name: 'asc' }
    });

    destination = await prisma.destination.findUnique({
      where: { id: params.id },
      include: {
        faqs: true,
        attractions: {
          include: { photo: true }
        },
        heroImage: true,
        thumbnailImage: true
      }
    });
  } catch (error) {
    console.error("Database connection failed during edit destination:", error);
  }

  if (!destination) {
    notFound();
  }

  return (
    <DestinationForm 
      initialData={JSON.parse(JSON.stringify(destination))} 
      countries={JSON.parse(JSON.stringify(countries))} 
    />
  );
}
