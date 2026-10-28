import { FaqSection } from '../components/sections/FaqSection';
import { FinalCta } from '../components/sections/FinalCta';
import { HowItWorks } from '../components/sections/HowItWorks';
import { RoadmapPreview } from '../components/sections/RoadmapPreview';
import { SubmissionOptions } from '../components/sections/SubmissionOptions';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function HowItWorksPage() {
  useDocumentTitle('How it works — Doba Music');
  return (
    <>
      <HowItWorks standalone />
      <RoadmapPreview />
      <SubmissionOptions />
      <FaqSection />
      <FinalCta />
    </>
  );
}
