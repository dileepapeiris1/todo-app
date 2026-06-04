import { useEffect, useState } from 'react';

interface PressQuoteItem {
  quote: string;
  publication: string;
  accentColor: string;
}

interface PressQuotesProps {
  title: string;
  items: PressQuoteItem[];
}

/**
 * Displays a shared section title and press testimonials.
 * Mobile: auto-play carousel (4 s interval) with prev/next arrows and dot indicators.
 * Desktop: three-column grid with vertical dividers.
 *
 * @param {PressQuotesProps} props - Component props.
 * @returns {JSX.Element} The press quotes section.
 */
const PressQuotes = ({ title, items }: PressQuotesProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  /** Auto-advance — restarts the 4 s timer whenever activeIndex changes. */
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex(current => (current + 1) % items.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [activeIndex, items.length]);

  function goNext(): void {
    setActiveIndex(current => (current + 1) % items.length);
  }

  function goPrev(): void {
    setActiveIndex(current => (current - 1 + items.length) % items.length);
  }

  return (
    <section className="border-t border-quaternary-100 bg-white py-10 sm:py-16 dark:border-gray-800 dark:bg-gray-900">

      {/* Single centered section title — shared across all quotes */}
      <h2 className="mb-8 text-center text-lg font-bold text-quaternary-800 sm:mb-10 sm:text-xl dark:text-gray-100">
        {title}
      </h2>

      {/* Mobile: auto-play carousel */}
      <div className="px-6 sm:hidden">
        <div className="relative min-h-[160px] overflow-hidden">
          {items.map((item, i) => (
            <div
              key={i}
              className={`absolute inset-0 flex flex-col gap-3 transition-opacity duration-500 ${
                i === activeIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              <blockquote className="text-base leading-relaxed text-quaternary-700 dark:text-gray-300">
                &ldquo;{item.quote}&rdquo;
              </blockquote>
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 shrink-0 rounded-full ${item.accentColor}`} />
                <span className="text-xs font-bold uppercase tracking-widest text-quaternary-500 dark:text-gray-400">
                  {item.publication}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Controls — prev arrow, dots, next arrow */}
        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={goPrev}
            aria-label="Previous quote"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-quaternary-200 text-quaternary-400 transition-colors hover:border-quaternary-400 hover:text-quaternary-700"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="flex items-center gap-2">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                aria-label={`Quote ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === activeIndex
                    ? 'w-6 bg-quaternary-700'
                    : 'w-1.5 bg-quaternary-300 hover:bg-quaternary-400'
                }`}
              />
            ))}
          </div>

          <button
            onClick={goNext}
            aria-label="Next quote"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-quaternary-200 text-quaternary-400 transition-colors hover:border-quaternary-400 hover:text-quaternary-700"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Desktop: three-column grid */}
      <div className="mx-auto hidden max-w-5xl px-4 sm:block sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 divide-x divide-quaternary-100 dark:divide-gray-800">
          {items.map((item, i) => (
            <div key={i} className="flex flex-col gap-3 px-10">
              <div className={`h-1 w-8 rounded-full ${item.accentColor}`} />
              <blockquote className="font-serif text-base italic leading-relaxed text-quaternary-700 dark:text-gray-300">
                &ldquo;{item.quote}&rdquo;
              </blockquote>
              <div className="flex items-center gap-2.5">
                <span className={`h-2.5 w-2.5 rounded-full ${item.accentColor}`} />
                <span className="text-sm font-bold uppercase tracking-widest text-quaternary-500 dark:text-gray-400">
                  {item.publication}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
};

export default PressQuotes;
