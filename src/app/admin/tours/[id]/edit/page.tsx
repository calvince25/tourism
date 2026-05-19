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
    if (params.id.startsWith("mock-tour-")) {
      tour = {
        id: params.id,
        name: "Classic Kenya Safari Tour",
        slug: "classic-kenya-safari-tour",
        shortDescription: "Experience the best of Kenya's wildlife in one unforgettable week.",
        fullDescription: "<p>Enjoy game drives, premium camping, and cultural tours.</p>",
        priceKes: 150000,
        priceUsd: 1500,
        durationDays: 7,
        durationNights: 6,
        travelStyle: "Safari",
        difficulty: "MODERATE",
        status: "PUBLISHED",
        featured: true,
        groupSizeMin: 1,
        groupSizeMax: 12,
      };
    } else {
      tour = await prisma.tour.findUnique({
        where: { id: params.id },
      });
    }
  } catch (error) {
    console.error("Database connection failed during edit, using mock tour fallback.");
    tour = {
      id: params.id,
      name: "Classic Kenya Safari Tour",
      slug: "classic-kenya-safari-tour",
      shortDescription: "Experience the best of Kenya's wildlife in one unforgettable week.",
      fullDescription: "<p>Enjoy game drives, premium camping, and cultural tours.</p>",
      priceKes: 150000,
      priceUsd: 1500,
      durationDays: 7,
      durationNights: 6,
      travelStyle: "Safari",
      difficulty: "MODERATE",
      status: "PUBLISHED",
      featured: true,
      groupSizeMin: 1,
      groupSizeMax: 12,
    };
  }

  if (!tour) {
    notFound();
  }

  return (
    <TourForm initialData={JSON.parse(JSON.stringify(tour))} />
  );
}
