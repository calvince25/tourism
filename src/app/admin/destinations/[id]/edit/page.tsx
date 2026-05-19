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

    if (params.id.startsWith("mock-dest-")) {
      destination = {
        id: params.id,
        name: "Maasai Mara National Reserve",
        slug: "maasai-mara",
        countryId: countries.length > 0 ? countries[0].id : "mock-country-id",
        shortTeaser: "The world-famous wildlife reserve.",
        status: "PUBLISHED",
        sortOrder: 1,
        contentIntro: "<p>Welcome to Maasai Mara...</p>",
        contentWhyVisit: "<p>Great wildebeest migration...</p>",
        contentWildlife: "<p>Big five wildlife...</p>",
        contentCulture: "<p>Maasai traditional culture...</p>",
        metaTitle: "Maasai Mara National Reserve Safari Guide",
        metaDescription: "Guide to Maasai Mara safari",
        focusKeyword: "maasai mara",
      };
    } else {
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
    }
  } catch (error) {
    console.error("Database connection failed during edit, using mock destination fallback.");
    destination = {
      id: params.id,
      name: "Maasai Mara National Reserve",
      slug: "maasai-mara",
      countryId: "mock-country-id",
      shortTeaser: "The world-famous wildlife reserve.",
      status: "PUBLISHED",
      sortOrder: 1,
      contentIntro: "<p>Welcome to Maasai Mara...</p>",
      contentWhyVisit: "<p>Great wildebeest migration...</p>",
      contentWildlife: "<p>Big five wildlife...</p>",
      contentCulture: "<p>Maasai traditional culture...</p>",
      metaTitle: "Maasai Mara National Reserve Safari Guide",
      metaDescription: "Guide to Maasai Mara safari",
      focusKeyword: "maasai mara",
    };
    countries = [
      { id: "mock-country-id", name: "Kenya" }
    ];
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
