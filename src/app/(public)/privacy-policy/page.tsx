import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import { generateSEOMetadata } from "@/lib/seo";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import JsonLd from "@/components/shared/JsonLd";

export const metadata: Metadata = generateSEOMetadata({
  title: "Privacy Policy | WildpathAfrica",
  description: "Read WildpathAfrica's Privacy Policy to understand how we collect, use, and protect your personal information.",
  path: "/privacy-policy",
});

export const revalidate = 3600;

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-navy text-white">
      <Navbar />
      <Breadcrumbs items={[{ name: "Privacy Policy", href: "/privacy-policy" }]} />
      <JsonLd type="webPage" data={{ name: "Privacy Policy", description: "WildpathAfrica Privacy Policy", url: "/privacy-policy" }} />

      <main className="container mx-auto px-4 sm:px-8 py-16 max-w-4xl">
        <h1 className="text-4xl sm:text-5xl font-bold font-outfit mb-8">Privacy Policy</h1>
        <div className="prose prose-invert prose-lg max-w-none prose-accent">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2>1. Introduction</h2>
          <p>
            Welcome to WildpathAfrica. We respect your privacy and are committed to protecting your personal data. 
            This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
          </p>

          <h2>2. The Data We Collect About You</h2>
          <p>
            Personal data, or personal information, means any information about an individual from which that person can be identified. 
            We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
          </p>
          <ul>
            <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier, title, date of birth.</li>
            <li><strong>Contact Data:</strong> includes billing address, delivery address, email address and telephone numbers.</li>
            <li><strong>Transaction Data:</strong> includes details about payments to and from you and other details of products and services you have purchased from us.</li>
            <li><strong>Technical Data:</strong> includes internet protocol (IP) address, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
          </ul>

          <h2>3. How We Use Your Personal Data</h2>
          <p>
            We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
          </p>
          <ul>
            <li>Where we need to perform the contract we are about to enter into or have entered into with you (e.g., booking a safari).</li>
            <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
            <li>Where we need to comply with a legal obligation.</li>
          </ul>

          <h2>4. Data Security</h2>
          <p>
            We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed. 
            In addition, we limit access to your personal data to those employees, agents, contractors, and other third parties who have a business need to know.
          </p>

          <h2>5. Contact Us</h2>
          <p>
            If you have any questions about this privacy policy or our privacy practices, please contact us at <strong>info@wildpathafrica.co.ke</strong>.
          </p>
        </div>
      </main>
    </div>
  );
}
