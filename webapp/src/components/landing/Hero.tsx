import { Link } from 'react-router-dom';
import dashboardImg from '@/assets/hero-image/dashboard.png';

interface CtaLink {
  label: string;
  href: string;
}

interface HeroProps {
  headline: string;
  subheadline: string;
  primaryCta: CtaLink;
}

/**
 * Responsive hero section.
 * Mobile: centred text, full-width CTA, screenshot below.
 * Desktop: two-column grid with screenshot on the right.
 *
 * @param {HeroProps} props - Component props.
 * @returns {JSX.Element} The hero section element.
 */
const Hero = ({ headline, subheadline, primaryCta }: HeroProps) => (
  <section className="overflow-hidden bg-secondary dark:bg-gray-900">
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
      <div className="grid items-center gap-10 lg:grid-cols-[420px_1fr] lg:gap-12">

        {/* Text + CTA — centred on mobile, left-aligned on desktop */}
        <div className="flex flex-col items-center gap-4 text-center sm:gap-5 lg:items-start lg:text-left">
          <h1 className="whitespace-pre-line text-[2.25rem] font-black leading-[1.05] tracking-tight text-ink sm:text-[3rem] lg:text-[4rem] dark:text-gray-50">
            {headline}
          </h1>
          <p className="max-w-[320px] text-base leading-relaxed text-quaternary-500 sm:text-[1.0625rem] dark:text-gray-400">
            {subheadline}
          </p>
          <Link
            to={primaryCta.href}
            className="mt-1 inline-flex w-full items-center justify-center rounded-xl bg-primary px-8 py-3 text-base font-semibold text-white shadow-md shadow-primary-100 transition-all duration-200 hover:bg-primary-hover hover:-translate-y-px active:translate-y-0 sm:w-auto sm:py-3.5"
          >
            {primaryCta.label}
          </Link>
        </div>

        {/* Dashboard screenshot — right column on desktop */}
        <div className="hidden lg:block">
          <img
            src={dashboardImg}
            alt="TrackLog dashboard"
            className="w-full rounded-2xl border border-quaternary-200/60 shadow-[0_8px_40px_rgba(0,0,0,0.12)]"
          />
        </div>

      </div>

      {/* Dashboard screenshot — below text on mobile */}
      <div className="mt-10 lg:hidden">
        <img
          src={dashboardImg}
          alt="TrackLog dashboard"
          className="w-full rounded-xl border border-quaternary-200/60 shadow-lg sm:rounded-2xl sm:shadow-xl"
        />
      </div>
    </div>
  </section>
);

export default Hero;
