"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Phone } from "lucide-react";
import { usePhoneRaw } from "@/contexts/SettingsContext";

const TEL_SELECTOR = 'a[href^="tel:"]:not([data-mobile-sticky-call])';

function isInViewport(el: Element): boolean {
  const rect = el.getBoundingClientRect();
  return rect.top < window.innerHeight && rect.bottom > 0;
}

export default function MobileCallButton() {
  const phoneRaw = usePhoneRaw();
  const pathname = usePathname();
  const [hideSticky, setHideSticky] = useState(false);

  useEffect(() => {
    const links = document.querySelectorAll<HTMLAnchorElement>(TEL_SELECTOR);
    if (links.length === 0) {
      setHideSticky(false);
      return;
    }
    const visible = new Set<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visible.add(entry.target);
          else visible.delete(entry.target);
        });
        setHideSticky(visible.size > 0);
      },
      { threshold: 0, rootMargin: "0px" }
    );
    setHideSticky(Array.from(links).some(isInViewport));
    links.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  if (hideSticky) return null;

  return (
    <a
      href={`tel:${phoneRaw}`}
      data-mobile-sticky-call
      className="fixed bottom-6 right-6 z-50 flex md:hidden items-center justify-center gap-2 rounded-full bg-green-600 px-4 py-3.5 font-semibold text-white shadow-lg transition hover:bg-green-700"
      aria-label="Appeler maintenant"
    >
      <Phone className="h-5 w-5" aria-hidden />
      Appeler maintenant
    </a>
  );
}
