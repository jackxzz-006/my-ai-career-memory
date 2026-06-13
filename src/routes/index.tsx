import { createFileRoute } from "@tanstack/react-router";
import { AuroraBackground, MouseGlow, Particles } from "@/components/landing/background";
import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { HowItWorks, MemoryEvolution, DashboardPreview } from "@/components/landing/sections";
import {
  FuturePredictor,
  Testimonials,
  Pricing,
  FinalCTA,
  Footer,
  TrustedBy,
} from "@/components/landing/more-sections";
import {
  AchievementVault,
  XPSystem,
  CareerDNA,
  HallOfFame,
  WeeklyChallenges,
  CareerReplay,
  FutureSelfAI,
  MemoryGraph,
  PremiumLegacyCTA,
} from "@/components/landing/gamification";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CareerTwin AI — Your Professional Memory That Never Forgets" },
      {
        name: "description",
        content:
          "CareerTwin AI is an AI-powered digital career twin that remembers every skill, project, certification, and goal — evolving into your personal career advisor.",
      },
      { property: "og:title", content: "CareerTwin AI — Your Digital Career Twin" },
      {
        property: "og:description",
        content:
          "An AI that remembers every achievement, interview, and career goal — becoming smarter with every interaction.",
      },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#050505] text-white">
      <AuroraBackground />
      <Particles count={28} />
      <MouseGlow />
      <Navbar />

      <main>
        <Hero />
        <TrustedBy />
        <Features />
        <HowItWorks />
        <MemoryEvolution />
        <DashboardPreview />
        <FuturePredictor />
        <Testimonials />
        <Pricing />
        <FinalCTA />
      </main>

      <Footer />
    </div>
  );
}
