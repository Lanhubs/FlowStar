import type { Metadata } from 'next'
import { LandingHeader, Hero } from '@/components/landing/hero'

export const metadata: Metadata = {
  title: 'FlowStar — Stream tokens by the second on Stellar',
  description:
    'Stream tokens by the second on Stellar. Create vesting schedules, payroll, and grants that unlock continuously — withdraw anytime, cancel anytime.',
}
import {
  Features,
  HowItWorks,
  UseCases,
  CTA,
  Footer,
} from '@/components/landing/sections'

export default function LandingPage() {
  return (
    <div className="relative min-h-svh">
      <LandingHeader />
      <Hero />
      <Features />
      <HowItWorks />
      <UseCases />
      <CTA />
      <Footer />
    </div>
  )
}
