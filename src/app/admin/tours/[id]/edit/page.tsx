import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import TourForm from "@/components/admin/TourForm";

interface Props {
  params: {
    id: string;
  };
}

export default async function EditTourPage({ params }: Props) {
  let tour: any = null;
  try {
    tour = await prisma.tour.findUnique({
      where: { id: params.id },
      include: {
        coverImage: true,
        heroImage: true,
        itinerary: {
          include: { photo: true },
          orderBy: { dayNumber: "asc" }
        },
        gallery: {
          include: { media: true },
          orderBy: { sortOrder: "asc" }
        }
      }
    });
  } catch (error) {
    console.error("Database connection failed during edit tour:", error);
  }

  if (!tour) {
    notFound();
  }

  return (
    <TourForm initialData={JSON.parse(JSON.stringify(tour))} />
  );
}
