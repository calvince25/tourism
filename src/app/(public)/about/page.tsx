import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import { 
  Shield, 
  Zap, 
  TrendingUp, 
  Users, 
  Heart, 
  Globe, 
  Compass, 
  Leaf, 
  Map, 
  DollarSign, 
  Award,
  BookOpen,
  Camera,
  Waves
} from "lucide-react";
import type { Metadata } from "next";
import { generateSEOMetadata } from "@/lib/seo";
import JsonLd from "@/components/shared/JsonLd";

export const metadata: Metadata = generateSEOMetadata({
  title: "About Us | Our Story and Values",
  description: "Learn about WildpathAfrica's mission, values, and our commitment to sustainable tourism and community empowerment in Kenya.",
  path: "/about",
});

const values = [
  { 
    title: "Every Journey Is Bespoke", 
    desc: "We do not operate fixed departure group packages. Every WildpathAfrica itinerary is built from the ground up for the individual, couple, family, or small group we are working with. Your interests, your pace, your budget, and the kind of memories you want to take home: these are the building blocks of your trip. You will never find yourself on a WildpathAfrica safari feeling like you are following someone else's schedule.",
    icon: Compass,
    color: "bg-accent/10 text-accent"
  },
  { 
    title: "Responsible Tourism Is Non Negotiable", 
    desc: "We operate with a deep responsibility to the country that makes our work possible. WildpathAfrica partners only with accommodation providers, conservancies, and ground operators who meet our standards for environmental responsibility and ethical practice. We minimise waste, respect wildlife protocols, support anti poaching initiatives, and ensure that the communities in and around our operating areas receive a genuine and fair share of the economic benefit that tourism generates. Kenya's wild spaces belong to the future, and we take that seriously.",
    icon: Leaf,
    color: "bg-emerald-500/10 text-emerald-400"
  },
  { 
    title: "Local Knowledge Is Our Greatest Asset", 
    desc: "Every guide and field specialist in the WildpathAfrica network is Kenyan, with deep and direct experience of the regions they work in. This is not a courtesy: it is a core requirement. The kind of safari experience that genuinely moves people is only possible when the person leading it understands the land, the wildlife behaviour, the seasonal shifts, and the cultural context from the inside. Our guides do not read from scripts. They share what they know, and what they know runs deep.",
    icon: Map,
    color: "bg-blue-500/10 text-blue-400"
  },
  { 
    title: "Honest, Transparent Pricing", 
    desc: "We are straightforward about what things cost and why. Our quotes are detailed, clear, and free from hidden charges. We will always tell you what is included, what is not, and what your alternatives are at different price points. Planning a safari involves significant financial decisions, and our clients deserve complete clarity at every stage of the process. Integrity, for us, begins with the first number we put in front of you.",
    icon: DollarSign,
    color: "bg-yellow-500/10 text-yellow-400"
  },
  { 
    title: "Community at the Centre", 
    desc: "Kenya's wildlife exists because of the communities that live alongside it and choose, often at great personal cost, to protect it. WildpathAfrica designs its tours to return direct and meaningful benefit to those communities: through partnerships with community owned conservancies, employment of local staff at every level of our operations, and culturally respectful experiences that generate income for the people who are doing the real work of conservation. When you travel with us, your money goes somewhere that matters.",
    icon: Users,
    color: "bg-purple-500/10 text-purple-400"
  },
  { 
    title: "Quality Over Quantity", 
    desc: "We would rather do fewer things exceptionally well than many things adequately. This applies to the number of bookings we take, the accommodation we recommend, the guides we certify, and the itineraries we design. Every detail of a WildpathAfrica journey is held to a high standard: not because we are trying to impress, but because we believe that is simply what Kenya deserves, and what our clients deserve in return for placing their trust in us.",
    icon: Award,
    color: "bg-pink-500/10 text-pink-400"
  },
];

const offerings = [
  {
    title: "Kenya Wildlife Safari",
    desc: "We design and operate game drives across Kenya's most celebrated and most under explored national parks and private conservancies. The Maasai Mara is the jewel of our portfolio, home to the Great Wildebeest Migration, the Big Five, and landscapes of a scale that genuinely stops people in their tracks. We know the Mara's rhythms across all twelve months of the year, and we design itineraries around what each season offers rather than simply sending clients at the most crowded time.",
    icon: Compass
  },
  {
    title: "Beyond the Mara",
    desc: "We take our clients to Amboseli National Park where elephant herds move in the shadow of Mount Kilimanjaro and the photography is unlike anywhere else in Kenya. We operate in Tsavo East and Tsavo West, two of Kenya's largest and most dramatically different parks. We design trips to Samburu National Reserve in Kenya's north, home to rare wildlife species not found further south: the Grevy's zebra, Beisa oryx, and reticulated giraffe among them. We include Lake Nakuru and Lake Naivasha for those who want Kenya's extraordinary birdlife and the flamingo spectacles of the Great Rift Valley.",
    icon: Camera
  },
  {
    title: "Kenyan Coastal Experiences",
    desc: "We also offer Kenyan coastal experiences for travellers who want to pair their safari with time on one of the most beautiful stretches of Indian Ocean coastline in Africa. The white sand beaches of Diani, the ancient Swahili architecture of Lamu, and the vibrant marine ecosystems of Watamu and Malindi are all part of the Kenya that WildpathAfrica knows and loves, and all part of the journeys we can design for you.",
    icon: Waves
  },
  {
    title: "Community and Culture",
    desc: "For culturally curious travellers, we offer community based tourism experiences that bring you into genuine, respectful contact with Kenya's diverse peoples. We facilitate Maasai community visits in the south, interactions with Samburu and Turkana communities in the north, and immersive cultural experiences in the historic settlements of the coast. These are not performative encounters designed for photographs: they are real introductions, coordinated in partnership with the communities themselves, that leave both the visitor and the host with something of value.",
    icon: Users
  }
];

export default async function AboutPage() {
  const breadcrumbItems = [
    { name: "Home", item: "/" },
    { name: "About Us", item: "/about" },
  ];

  let heroImage = "/assets/hero_bg.png";
  try {
    const dbPromise = prisma.setting.findUnique({
      where: { key: "hero_about" }
    });
    const timeoutPromise = new Promise<any>((_, reject) => 
      setTimeout(() => reject(new Error("Timeout")), 2000)
    );
    const heroSetting = await Promise.race([dbPromise, timeoutPromise]);
    if (heroSetting?.value) {
      heroImage = heroSetting.value;
    }
  } catch (error) {
    console.warn("Failed to fetch hero image setting:", error);
  }

  return (
    <div className="min-h-screen bg-navy text-white">
      <JsonLd type="breadcrumb" data={{ items: breadcrumbItems }} />
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[60vh] py-20 flex items-center justify-center overflow-hidden text-center">
        <div className="absolute inset-0 bg-navy-dark opacity-75 z-10" />
        <div 
          id="hero-bg-about"
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: `url('${heroImage}')` }}
        />
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            try {
              var customBg = localStorage.getItem('setting_hero_about');
              if (customBg) {
                document.getElementById('hero-bg-about').style.backgroundImage = "url('" + customBg + "')";
              }
            } catch (e) {}
          })();
        `}} />
        <div className="container mx-auto px-8 relative z-20 max-w-5xl">
          <p className="text-accent uppercase tracking-widest font-bold mb-4 text-xs sm:text-sm">
            About WildpathAfrica: Kenya&apos;s Boutique Safari Company
          </p>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold font-outfit mb-8 leading-tight">
            We are a small team with a deep love for this land.
          </h1>
          <p className="text-white/80 max-w-2xl mx-auto text-lg sm:text-xl md:text-2xl font-light leading-relaxed">
            Everything we do is built around one belief: that Kenya deserves to be experienced properly.
          </p>
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-24 border-b border-white/5">
        <div className="container mx-auto px-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <span className="text-accent uppercase tracking-widest font-bold text-sm block">Who We Are</span>
              <h2 className="text-3xl sm:text-5xl font-bold font-outfit leading-tight">
                Crafting Personalised Journeys Across Kenya
              </h2>
              <p className="text-white/60 text-lg leading-relaxed">
                WildpathAfrica is a boutique safari and travel company based in Kenya, specialising in carefully crafted, personalised tours across some of the most extraordinary landscapes on earth. We are not a large agency and we do not pretend to be. We are a passionate, close knit team that designs and delivers Kenya safari experiences with the kind of attention and care that only a small, dedicated company can offer.
              </p>
              <p className="text-white/60 text-lg leading-relaxed">
                From the sweeping grasslands of the Maasai Mara to the dramatic terrain of Amboseli, from the pristine coastline of the Kenyan Indian Ocean to the ancient forests of Aberdare and Mount Kenya, we know this country intimately. We have driven its roads in every season, stood quietly at its waterholes at dawn, and walked alongside the communities that have lived within its landscapes for centuries. That knowledge is what we bring to every single journey we plan for our clients.
              </p>
            </div>
            
            <div className="bg-navy-light/10 border border-white/5 rounded-[40px] p-8 md:p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full filter blur-3xl pointer-events-none" />
              <h3 className="text-xl sm:text-2xl font-semibold font-outfit mb-6 text-accent">
                Our Core Belief
              </h3>
              <p className="text-white/80 text-lg sm:text-xl italic leading-relaxed font-light">
                &ldquo;At WildpathAfrica, we believe that a truly great safari is not measured by how many parks you visit or how many animals appear on a checklist. It is measured by how fully you connected with the place: how well you understood it, how warmly you were received within it, and how long it stays with you when you return home. That is the experience we work hard to create, every time.&rdquo;
              </p>
              
              <div className="grid grid-cols-2 gap-8 pt-8 mt-8 border-t border-white/5">
                <div className="space-y-1">
                  <h4 className="text-4xl font-bold text-accent font-outfit">100%</h4>
                  <p className="text-white/40 uppercase tracking-widest text-[10px] font-bold">Local Guides</p>
                </div>
                <div className="space-y-1">
                  <h4 className="text-4xl font-bold text-accent font-outfit">Bespoke</h4>
                  <p className="text-white/40 uppercase tracking-widest text-[10px] font-bold">Tailored Trips</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Was Born (Cynthia's Story) */}
      <section className="py-24 bg-navy-dark border-b border-white/5">
        <div className="container mx-auto px-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-5 relative">
              <div className="aspect-[4/5] bg-navy-light/20 rounded-[40px] overflow-hidden border border-white/5 relative group">
                <img 
                  src="/assets/about-image.png" 
                  alt="WildpathAfrica Founder Cynthia" 
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-dark via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-8 left-8 right-8">
                  <p className="text-accent uppercase tracking-widest font-bold text-xs mb-1">Founder &amp; Director</p>
                  <h3 className="text-2xl font-bold font-outfit">Cynthia</h3>
                  <p className="text-white/60 text-sm">WildpathAfrica</p>
                </div>
              </div>
              <div className="absolute -top-6 -left-6 bg-accent text-navy p-6 rounded-3xl hidden md:block">
                <Globe size={24} className="mb-2" />
                <p className="font-bold text-lg font-outfit">Genuine</p>
                <p className="text-navy/70 uppercase tracking-widest text-[9px] font-bold">Local Vision</p>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-8">
              <span className="text-accent uppercase tracking-widest font-bold text-sm block">How WildpathAfrica Was Born</span>
              <h2 className="text-3xl sm:text-5xl font-bold font-outfit leading-tight">
                Beyond The Postcard Lion
              </h2>
              <p className="text-white/60 text-lg leading-relaxed">
                WildpathAfrica was founded by Cynthia, a young Kenyan woman who grew up watching her country be reduced, far too often, to a single image: the postcard lion on a golden plain. Beautiful, yes. But incomplete. Kenya is so much more than its most famous photograph, and Cynthia knew it. She also knew that the travellers who came here, if given the chance to see it properly, would know it too.
              </p>
              <p className="text-white/60 text-lg leading-relaxed">
                She started WildpathAfrica with a simple but stubborn conviction: that Kenya&apos;s landscapes, wildlife, people, and cultures deserve to be shown with honesty and depth; not packaged and rushed, but explored with time, intention, and genuine local knowledge. She built the company from the ground up, establishing partnerships with trusted local guides, community conservancies, and carefully selected accommodation partners who shared the same values. Every element of WildpathAfrica was assembled by hand, chosen for quality and integrity rather than convenience or margin.
              </p>
              <p className="text-white/60 text-lg leading-relaxed">
                The early days were modest: a small number of clients, a lean operation, and an outsized commitment to getting every detail right. That commitment paid off in the way it always does when the work is genuine: through trust. Travellers returned. They sent their friends. They wrote reviews that spoke not just of the animals they had seen but of how the journey had felt: personal, unhurried, honest. That reputation is what WildpathAfrica has been built on, and it is what continues to drive every decision we make today.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do & Where We Take You */}
      <section className="py-24 border-b border-white/5">
        <div className="container mx-auto px-8 max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-accent uppercase tracking-widest font-bold text-sm block mb-4">Our Experiences</span>
            <h2 className="text-3xl sm:text-5xl font-bold font-outfit mb-6">What We Do and Where We Take You</h2>
            <p className="text-white/60 text-lg leading-relaxed">
              WildpathAfrica operates exclusively within Kenya, and that focus is entirely intentional. We have chosen to know one country deeply rather than spread ourselves thin across a map. Kenya alone offers a lifetime of extraordinary travel, and we are determined to do justice to every corner of it.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {offerings.map((offering, idx) => {
              const Icon = offering.icon;
              return (
                <div 
                  key={idx} 
                  className="bg-navy-light/10 border border-white/5 rounded-3xl p-8 sm:p-10 hover:border-accent/20 hover:bg-navy-light/20 transition-all duration-300 relative group overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full filter blur-2xl pointer-events-none" />
                  <div className="w-14 h-14 bg-white/5 text-accent rounded-2xl flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-navy transition-all duration-300">
                    <Icon size={24} />
                  </div>
                  <h3 className="text-2xl font-bold font-outfit mb-4 group-hover:text-accent transition-colors">
                    {offering.title}
                  </h3>
                  <p className="text-white/60 leading-relaxed text-base sm:text-lg">
                    {offering.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why We Are Proudly Boutique */}
      <section className="py-24 bg-navy-deep border-b border-white/5">
        <div className="container mx-auto px-8 max-w-5xl text-center">
          <span className="text-accent uppercase tracking-widest font-bold text-sm block mb-4">The Boutique Difference</span>
          <h2 className="text-3xl sm:text-5xl font-bold font-outfit mb-8">Why We Are Proudly Boutique</h2>
          <div className="space-y-6 text-white/70 text-lg sm:text-xl leading-relaxed font-light max-w-4xl mx-auto">
            <p>
              There is a version of the safari industry built on volume: large groups, standardised itineraries, and a business model where the goal is to move as many travellers through as many parks as quickly as possible. WildpathAfrica is not that company, and we have never wanted to be.
            </p>
            <p>
              We are small by design. We take on a limited number of bookings at any given time because every client we work with deserves our full attention. When you contact WildpathAfrica, you are not handed to a call centre or directed to a booking portal. You speak to someone who knows Kenya, who listens to what you are hoping to find here, and who then builds your itinerary from scratch around your specific interests, travel style, budget, and timeframe.
            </p>
            <p className="text-accent font-semibold">
              This is the WildpathAfrica difference. It is not a feature we have added; it is the founding model of everything we do. And it is why our clients come back, and why they send the people they love to us.
            </p>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-24 bg-navy-dark border-b border-white/5">
        <div className="container mx-auto px-8 max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-accent uppercase tracking-widest font-bold text-sm block mb-4">Our Values</span>
            <h2 className="text-3xl sm:text-5xl font-bold font-outfit mb-6">The Values WildpathAfrica Stands By</h2>
            <p className="text-white/60 text-lg leading-relaxed">
              We are guided by a clear and non negotiable set of values. These govern the itineraries we design, the partners we work with, and the way we treat every single person who trusts us with their African journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, idx) => {
              const Icon = value.icon;
              return (
                <div 
                  key={idx} 
                  className="bg-navy/40 border border-white/5 rounded-3xl p-8 hover:border-accent/30 hover:bg-navy-light/10 transition-all duration-300 group"
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${value.color} group-hover:scale-110 transition-transform`}>
                    <Icon size={24} />
                  </div>
                  <h3 className="text-xl font-bold font-outfit mb-4 group-hover:text-accent transition-colors">
                    {value.title}
                  </h3>
                  <p className="text-white/50 leading-relaxed text-sm sm:text-base">
                    {value.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* This Is Just the Beginning CTA */}
      <section className="py-24">
        <div className="container mx-auto px-8 max-w-7xl">
          <div className="bg-gradient-to-br from-navy-light/30 via-navy-deep to-navy-dark border border-white/5 rounded-[40px] p-12 md:p-20 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-96 h-96 bg-accent/5 rounded-full filter blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/5 rounded-full filter blur-3xl pointer-events-none" />
            
            <div className="relative z-10 max-w-3xl mx-auto space-y-8">
              <span className="text-accent uppercase tracking-widest font-bold text-sm block">This Is Just the Beginning</span>
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold font-outfit leading-tight">
                Ready to Start Your Journey?
              </h2>
              <p className="text-white/70 text-lg leading-relaxed max-w-2xl mx-auto">
                WildpathAfrica is a young company, and we are proud of that. We are still building, still learning, and still discovering new ways to share Kenya&apos;s extraordinary depth with the travellers who come to us. What we have already, though, is solid: the right values, the right team, the right partnerships, and a genuine love for this country that shows up in every single journey we plan.
              </p>
              <p className="text-white/70 text-lg leading-relaxed max-w-2xl mx-auto">
                If you are looking for a Kenya safari company that will treat your trip the way you want it treated: with personal attention, expert knowledge, and complete honesty from start to finish: you are in the right place.
              </p>
              <p className="text-accent font-medium text-xl font-outfit">
                Get in touch with our team. Tell us what you are dreaming of. We will take it from there.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-6 pt-6">
                <a 
                  href="/tours"
                  className="bg-accent text-navy font-bold px-10 py-4 rounded-xl hover:scale-105 transition-transform text-lg inline-block"
                >
                  Browse Tours
                </a>
                <a 
                  href="/contact"
                  className="bg-white/5 text-white font-bold px-10 py-4 rounded-xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-lg inline-block"
                >
                  Get in Touch
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
