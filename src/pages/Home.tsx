import { FaqSection } from '../components/sections/FaqSection';
import { FeaturedMusic } from '../components/sections/FeaturedMusic';
import { FeaturedPlaylists } from '../components/sections/FeaturedPlaylists';
import { FinalCta } from '../components/sections/FinalCta';
import { HowItWorks } from '../components/sections/HowItWorks';
import { SubmissionOptions } from '../components/sections/SubmissionOptions';
import { SmoothScroll } from '../components/layout/SmoothScroll';
import { ZoomParallax } from '../components/ui/zoom-parallax';
import { PARALLAX_IMAGES } from '../lib/images';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import Heroo from '../components/ui/Heroo';
import TrendingThisMonth from '../components/ui/TrendingThisMonth_1';
import DobaRecordsFolder from '../components/ui/DobaRecordsFolder';

export default function Home() {

  useDocumentTitle('Doba Music — Independent Artist Discovery');

  return (
    <>
      <SmoothScroll />

      <Heroo />

      <TrendingThisMonth />

      <DobaRecordsFolder />

      <FeaturedPlaylists />

      {/* Original zoom-parallax scene: desktop only */}
      <div
        aria-hidden="true"
        className="hidden md:block motion-reduce:hidden"
      >
        <ZoomParallax images={PARALLAX_IMAGES} />
      </div>

      <FeaturedMusic />

      <HowItWorks />

      <SubmissionOptions />

      <FaqSection />

      <FinalCta />
    </>
  );
}
