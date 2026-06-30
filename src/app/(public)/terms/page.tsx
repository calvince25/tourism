import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import { generateSEOMetadata } from "@/lib/seo";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import JsonLd from "@/components/shared/JsonLd";

export const metadata: Metadata = generateSEOMetadata({
  title: "Terms and Conditions | WildpathAfrica",
  description: "Read the Terms and Conditions for booking tours and using the WildpathAfrica website.",
  path: "/terms",
});

export const revalidate = 3600;

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-navy text-white">
      <Navbar />
      <Breadcrumbs items={[{ name: "Terms and Conditions", href: "/terms" }]} />
      <JsonLd type="webPage" data={{ name: "Terms and Conditions", description: "WildpathAfrica Terms and Conditions", url: "/terms" }} />

      <main className="container mx-auto px-4 sm:px-8 py-16 max-w-4xl">
        <h1 className="text-4xl sm:text-5xl font-bold font-outfit mb-8">Terms and Conditions</h1>
        <div className="prose prose-invert prose-lg max-w-none prose-accent">
          <p>Last updated: {new Date().toLocaleDateString()}</p>

          <h2>1. Agreement to Terms</h2>
          <p>
            These Terms and Conditions constitute a legally binding agreement made between you, whether personally or on behalf of an entity (“you”) and WildpathAfrica (“we,” “us” or “our”), 
            concerning your access to and use of the website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto (collectively, the “Site”).
          </p>

          <h2>2. Booking and Payments</h2>
          <p>
            When booking a safari tour or travel package through WildpathAfrica, a non-refundable deposit is required to secure your reservation. 
            The remaining balance must be paid in full prior to the commencement of your tour, as detailed in your specific booking agreement.
          </p>
          
          <h2>3. Cancellations and Refunds</h2>
          <p>
            Cancellation policies vary depending on the specific tour and accommodations booked. 
            We highly recommend purchasing comprehensive travel insurance that covers trip cancellations, medical emergencies, and other unforeseen events.
          </p>

          <h2>4. Travel Documents</h2>
          <p>
            It is your responsibility to ensure that you have all necessary travel documents, including a valid passport, visas, and health certificates (such as Yellow Fever vaccinations) required for entry into Kenya and other African countries on your itinerary.
          </p>

          <h2>5. Limitation of Liability</h2>
          <p>
            WildpathAfrica and its affiliates, directors, employees, or agents shall not be liable for any indirect, incidental, special, or consequential damages resulting from the use of our services or website.
          </p>

          <h2>6. Contact Us</h2>
          <p>
            If you have any questions or concerns regarding these Terms and Conditions, please contact us at <strong>info@wildpathafrica.co.ke</strong>.
          </p>
        </div>
      </main>
    </div>
  );
}
