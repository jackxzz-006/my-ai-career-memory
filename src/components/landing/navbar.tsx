import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Sparkles } from "lucide-react";

const links = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how" },
  { label: "Memory Engine", href: "#memory" },
  { label: "Roadmap", href: "#roadmap" },
  { label: "Demo", href: "#demo" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-white/5 bg-[#050505]/80 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a href="#" className="group flex items-center gap-2">
          <div className="relative grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-royal-purple to-electric-purple shadow-glow">
            <Sparkles className="h-4 w-4 text-white" />
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-royal-purple to-electric-purple opacity-50 blur-md transition group-hover:opacity-80" />
          </div>
          <span className="font-display text-lg font-semibold tracking-tight">
            CareerTwin <span className="text-gradient-purple">AI</span>
          </span>
        </a>

        <div className="hidden items-center gap-8 lg:flex">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-sm text-soft-gray transition hover:text-white"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <button className="text-sm text-soft-gray transition hover:text-white">
            Sign In
          </button>
          <button className="group relative overflow-hidden rounded-full px-5 py-2 text-sm font-medium text-white shadow-glow transition hover:shadow-glow-lg">
            <span className="absolute inset-0 bg-gradient-to-r from-royal-purple to-electric-purple" />
            <span className="absolute inset-0 bg-gradient-to-r from-electric-purple to-royal-purple opacity-0 transition group-hover:opacity-100" />
            <span className="relative">Join Beta</span>
          </button>
        </div>

        <button
          className="lg:hidden text-white"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          <div className="space-y-1.5">
            <span className="block h-0.5 w-6 bg-white" />
            <span className="block h-0.5 w-6 bg-white" />
          </div>
        </button>
      </nav>

      {open && (
        <div className="border-t border-white/5 bg-[#050505]/95 backdrop-blur-xl lg:hidden">
          <div className="space-y-3 px-6 py-4">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block text-sm text-soft-gray hover:text-white"
              >
                {l.label}
              </a>
            ))}
            <div className="flex gap-3 pt-2">
              <button className="flex-1 rounded-full border border-white/10 px-4 py-2 text-sm">
                Sign In
              </button>
              <button className="flex-1 rounded-full bg-gradient-to-r from-royal-purple to-electric-purple px-4 py-2 text-sm">
                Join Beta
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.header>
  );
}
