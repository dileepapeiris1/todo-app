import { Link } from 'react-router-dom';

interface FooterProps {
  brand: string;
  tagline: string;
}

/**
 * Renders the landing page footer.
 * Mobile: centred column stack.
 * Desktop: single row with space-between layout.
 *
 * @param {FooterProps} props - Component props.
 * @param {string} props.brand - App brand name.
 * @param {string} props.tagline - App tagline.
 * @returns {JSX.Element} The footer element.
 */
const Footer = ({ brand, tagline }: FooterProps) => (
  <footer className="border-t border-quaternary-100 bg-white dark:border-gray-800 dark:bg-gray-900">
    <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
      <div className="flex flex-col items-center gap-2 text-center sm:flex-row sm:justify-between sm:gap-4 sm:text-left">
        <Link to="/home" className="text-sm font-bold text-quaternary-800 hover:opacity-70 transition-opacity dark:text-gray-200">
          {brand}
        </Link>
        <p className="text-xs text-quaternary-400 sm:text-sm dark:text-gray-500">{tagline}</p>
        <span className="text-xs text-quaternary-400 dark:text-gray-500">
          &copy; {new Date().getFullYear()} {brand}
        </span>
      </div>
    </div>
  </footer>
);

export default Footer;
