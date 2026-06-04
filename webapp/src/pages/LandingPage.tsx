import Footer from '@/components/common/footer/Footer';
import Header from '@/components/common/header/Header';
import Hero        from '@/components/landing/Hero';
import PressQuotes from '@/components/landing/PressQuotes';
import { APP_NAME }    from '@/constants/config';
import {
  APP_TAGLINE,
  HERO_CTA_HREF,
  HERO_CTA_LABEL,
  HERO_HEADLINE,
  HERO_SUBHEADLINE,
  NAV_LOGIN_HREF,
  NAV_LOGIN_LABEL,
  PRESS_QUOTES,
  PRESS_QUOTES_TITLE,
} from '@/constants/landing';

/**
 * Assembles the public landing page from Header, Hero, press quotes, and Footer.
 *
 * @returns {JSX.Element} The landing page element.
 */
const LandingPage = () => (
  <>
    <Header
      brand={APP_NAME}
      links={[]}
      loginCta={{ label: NAV_LOGIN_LABEL, href: NAV_LOGIN_HREF }}
    />
    <main>
      <Hero
        headline={HERO_HEADLINE}
        subheadline={HERO_SUBHEADLINE}
        primaryCta={{ label: HERO_CTA_LABEL, href: HERO_CTA_HREF }}
      />
      <PressQuotes title={PRESS_QUOTES_TITLE} items={PRESS_QUOTES} />
    </main>
    <Footer brand={APP_NAME} tagline={APP_TAGLINE} />
  </>
);

export default LandingPage;
