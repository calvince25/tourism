"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, 
  Clock, 
  BadgeDollarSign, 
  Compass, 
  Leaf, 
  Users, 
  Award,
  BookOpen,
  ArrowRight
} from "lucide-react";

interface AboutUsProps {
  aboutImage?: string;
}

const chapters = [
  {
    id: "genesis",
    title: "Redefining the African Safari Experience",
    shortName: "Our Origin Story",
    icon: BookOpen,
    content: (
      <>
        <p>
          WildpathAfrica was born out of a simple, persistent, and somewhat stubborn conviction: that Kenya’s extraordinary landscapes, diverse peoples, and ancient wild spaces deserved to be shown with genuine depth and honesty. Far too often, travelers seeking premium <strong>African safari packages</strong> find themselves presented with a singular, simplified narrative—the stereotypical &quot;postcard lion&quot; on a golden plain. While that image is undeniably beautiful, it only scratches the surface of what makes this country spectacular.
        </p>
        <p>
          Founded by Cynthia, a proud Kenyan woman who grew up with the sounds, rhythms, and seasonal migrations of East Africa in her blood, WildpathAfrica was established to bridge the gap between high-volume, industrialized tourism and authentic, immersive exploration. Cynthia observed that the larger travel operators frequently prioritized passenger volume and rigid checklists over deep connections. Travelers were shuttled from one national park to another on fixed itineraries that felt more like a hurried commute than a meaningful journey.
        </p>
        <p>
          Determined to offer an alternative, she set out to create what is today widely recognized as the <strong>best travel agency in Kenya</strong> for discerning, curious travelers. We began as a lean, boutique operation focused entirely on relationship-building and local integrity. Instead of trying to list every destination in Africa, we chose to focus exclusively on Kenya, deciding that we would rather know one country intimately and perfectly than spread ourselves thin across a map. We spent months in the field, establishing trusted relationships with native communities, selecting ethical lodge operators, and partnering with the finest <strong>local Kenyan safari guides</strong> in the industry. From those modest beginnings, built entirely on trust and word-of-mouth recommendations, WildpathAfrica has grown into a premier operator of <strong>bespoke Kenya safari tours</strong>, trusted by travelers worldwide who seek an experience that is deeply personal, unhurried, and completely honest.
        </p>
      </>
    )
  },
  {
    id: "philosophy",
    title: "The Art of Bespoke Travel & Personalization",
    shortName: "Our Philosophy",
    icon: Compass,
    content: (
      <>
        <p>
          At WildpathAfrica, we reject the notion of the cookie-cutter vacation. We do not sell pre-packaged, fixed-departure group tours where you are grouped with strangers and forced to adhere to a rigid, predetermined schedule. We believe that planning a journey to Kenya is a significant emotional and financial investment, and that your experience should be as unique as you are. This is why every single itinerary we produce is a <strong>custom African travel itineraries</strong>, built entirely from the ground up for the individual, couple, family, or small group we are working with.
        </p>
        <p>
          Whether you are dreaming of a classic <strong>Maasai Mara tour</strong> to witness the legendary Great Wildebeest Migration, embarking on dramatic <strong>Amboseli wildlife safaris</strong> to photograph massive elephant herds roaming in the shadow of Mount Kilimanjaro, or planning a romantic <strong>Diani beach holiday</strong> along the pristine, white-sand shores of the Indian Ocean, our travel designers collaborate directly with you to craft the perfect itinerary. We take the time to understand your personal travel style, your specific interests, your preferred pace of travel, your dietary needs, and the exact kinds of memories you wish to take home with you.
        </p>
        <p>
          Do you want to spend hours sitting quietly at a watering hole in a private conservancy watching a pride of lions, rather than rushing off to check a box? Do you want to include an off-the-beaten-path trek in the rugged Samburu north, or pair your wildlife viewing with a luxurious <strong>Kenya luxury safari</strong> lodge that offers private plunge pools and starlit dining? We make it all possible. By maintaining our boutique scale, we retain the absolute flexibility to customize every single detail of your trip—from the type of safari vehicle you drive to the specific guides who accompany you. We are here to listen, to advise, and to design a safari that feels entirely yours.
        </p>
      </>
    )
  },
  {
    id: "conservation",
    title: "Responsible Tourism & Community Empowerment",
    shortName: "Conservation & Impact",
    icon: Leaf,
    content: (
      <>
        <p>
          We operate with a profound sense of responsibility toward the land, the wildlife, and the people that make our work possible. At WildpathAfrica, <strong>sustainable tourism Kenya</strong> is not a marketing catchphrase or a secondary box to check; it is the non-negotiable foundation of our entire business model. Kenya&apos;s wild spaces and rich ecosystems are precious, fragile heritages that belong to future generations, and we are committed to ensuring that our presence has a lasting, positive impact.
        </p>
        <p>
          To achieve this, we partner exclusively with luxury lodges, tented camps, and ground operators who meet the highest international standards for environmental conservation and ethical operation. We actively avoid properties that engage in unsustainable waste management, water depletion, or intrusive wildlife practices. Instead, we champion and direct our guests toward community-owned conservancies. These private and community-managed lands act as crucial buffer zones around national parks, creating vital wildlife corridors while returning direct, meaningful financial benefits to the local landowners.
        </p>
        <p>
          We believe that conservation only succeeds when local communities are active, respected partners who benefit directly from tourism. Therefore, WildpathAfrica ensures that a significant portion of the revenue generated from our <strong>bespoke Kenya safari tours</strong> goes directly toward community development projects, local schools, clean water initiatives, and healthcare facilities. We also mandate fair wages and excellent working conditions for all our staff, local guides, and lodge partners. When you book a safari with us, you are not merely going on a holiday; you are actively contributing to the preservation of Kenya’s wildlife and the empowerment of the people who have lived alongside these creatures for centuries. This is travel that matters, designed with integrity and executed with care.
        </p>
      </>
    )
  },
  {
    id: "guiding",
    title: "Local Expertise & The Wildpath Standard of Excellence",
    shortName: "The Wildpath Standard",
    icon: Award,
    content: (
      <>
        <p>
          The ultimate difference between an ordinary holiday and an extraordinary, life-changing journey lies in the hands of the person leading it. This is why the heart and soul of every WildpathAfrica safari is our network of elite, professional <strong>local Kenyan safari guides</strong>. Every guide in our team is a certified professional who was born and raised in Kenya, possessing a deep, intuitive, and lifelong understanding of the regions they operate in.
        </p>
        <p>
          Our guides do not read from prepared scripts or regurgitate dry facts from textbooks. They are highly educated naturalists, expert wildlife trackers, and passionate storytellers who understand the land’s seasonal shifts, animal behaviors, and cultural histories from the inside out. They know exactly where to find the elusive leopard in the acacia trees of the Maasai Mara, how to interpret the warning calls of birds to locate a hidden predator, and how to safely navigate the remote terrain of Samburu and Tsavo.
        </p>
        <p>
          Beyond their unrivaled field expertise, our guides represent the Wildpath standard of hospitality—warm, attentive, and deeply respectful of both our guests and the environment. We pair this world-class guiding with uncompromising standards of logistical safety, maintaining a fleet of custom-designed, four-wheel-drive Safari Land Cruisers equipped with pop-up roofs for optimal game viewing, charging stations, and first-aid kits. Furthermore, we pride ourselves on complete pricing transparency. When you receive a quote from WildpathAfrica for your <strong>Kenya luxury safari</strong>, it is clear, detailed, and completely free from hidden fees or unexpected surcharges. We believe that building your dream safari should be a joyful, stress-free experience, and that trust begins with the very first number we present to you. From booking to departure, we hold ourselves to the highest standards of quality, ensuring that your African adventure is nothing short of flawless.
        </p>
      </>
    )
  }
];

export default function AboutUs({ aboutImage = "/assets/agency_office.png" }: AboutUsProps) {
  const [activeTab, setActiveTab] = useState("genesis");

  const currentChapter = chapters.find(c => c.id === activeTab) || chapters[0];
  const ChapterIcon = currentChapter.icon;

  return (
    <section id="about" className="py-20 sm:py-28 bg-navy-dark relative overflow-hidden">
      {/* Dynamic Background Accents */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-accent/5 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/5 rounded-full filter blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-8 max-w-7xl relative z-10">
        <div className="text-center lg:text-left mb-12 sm:mb-16">
          <p className="text-accent uppercase tracking-widest font-bold text-xs sm:text-sm mb-3">Who We Are</p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-outfit text-white">About WildpathAfrica</h2>
          <div className="w-20 h-1.5 bg-accent rounded-full mt-4 mx-auto lg:mx-0" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Image & Key Features Column */}
          <div className="lg:col-span-5 space-y-10 lg:sticky lg:top-32">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative rounded-[40px] overflow-hidden border border-white/10 aspect-video lg:aspect-square w-full shadow-2xl group"
            >
              <Image 
                src={aboutImage} 
                alt="WildpathAfrica Office & Travel Designers" 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/80 via-transparent to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6 bg-navy/80 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                <p className="text-accent text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-1">Local Heritage</p>
                <h4 className="text-white text-lg font-bold font-outfit">100% Kenyan Owned &amp; Operated</h4>
                <p className="text-white/60 text-xs mt-1">Based in Nairobi, rooted in the wild spaces we share.</p>
              </div>
            </motion.div>

            {/* Quick Benefits Badges */}
            <div className="grid grid-cols-3 gap-4 bg-navy-light/10 border border-white/5 rounded-3xl p-6">
              <div className="flex flex-col items-center text-center">
                <div className="text-accent mb-2 bg-accent/10 p-3 rounded-2xl">
                  <ShieldCheck size={24} />
                </div>
                <p className="text-[9px] sm:text-[10px] text-white font-bold uppercase tracking-widest">Reliability</p>
                <p className="text-[8px] text-white/40 mt-0.5">Fully Bonded</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="text-accent mb-2 bg-accent/10 p-3 rounded-2xl">
                  <Clock size={24} />
                </div>
                <p className="text-[9px] sm:text-[10px] text-white font-bold uppercase tracking-widest">Speed</p>
                <p className="text-[8px] text-white/40 mt-0.5">24/7 Response</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="text-accent mb-2 bg-accent/10 p-3 rounded-2xl">
                  <BadgeDollarSign size={24} />
                </div>
                <p className="text-[9px] sm:text-[10px] text-white font-bold uppercase tracking-widest">Best Value</p>
                <p className="text-[8px] text-white/40 mt-0.5">Direct Pricing</p>
              </div>
            </div>
          </div>

          {/* Interactive Storyteller Column */}
          <div className="lg:col-span-7 space-y-8">
            {/* Elegant Tab Headers (Glassmorphism & Flex Wrapper) */}
            <div className="bg-navy-light/20 border border-white/5 rounded-[24px] p-2 flex flex-wrap sm:flex-nowrap gap-1.5 overflow-x-auto scrollbar-none">
              {chapters.map((ch) => {
                const TabIcon = ch.icon;
                const isActive = activeTab === ch.id;
                return (
                  <button
                    key={ch.id}
                    onClick={() => setActiveTab(ch.id)}
                    className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex-grow justify-center ${
                      isActive 
                        ? "bg-accent text-navy shadow-lg hover:scale-[1.02]" 
                        : "text-white/40 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <TabIcon size={14} />
                    <span>{ch.shortName}</span>
                  </button>
                );
              })}
            </div>

            {/* Dynamic Content Panel */}
            <div className="bg-navy-light/10 border border-white/5 rounded-[40px] p-8 sm:p-12 relative overflow-hidden min-h-[500px] flex flex-col justify-between">
              {/* Soft decorative background shape */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full filter blur-3xl pointer-events-none" />

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentChapter.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                    <div className="bg-accent/10 p-3.5 rounded-2xl text-accent">
                      <ChapterIcon size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] text-accent uppercase tracking-widest font-bold font-outfit">
                        Explore Our Legacy
                      </p>
                      <h3 className="text-2xl sm:text-3xl font-bold font-outfit text-white leading-tight">
                        {currentChapter.title}
                      </h3>
                    </div>
                  </div>

                  <div className="space-y-4 text-white/70 leading-relaxed text-sm sm:text-base font-light">
                    {currentChapter.content}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Bottom Call to Action inside the card */}
              <div className="pt-8 mt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <p className="text-xs text-white/40 font-light">
                  Ready to craft your custom African travel itinerary?
                </p>
                <a
                  href="/contact"
                  className="text-accent hover:text-white font-bold text-sm flex items-center gap-2 group transition-colors"
                >
                  <span>Start Planning Today</span>
                  <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
