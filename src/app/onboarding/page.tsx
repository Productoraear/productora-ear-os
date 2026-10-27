import { permanentRedirect } from 'next/navigation';

export default function OnboardingRootRedirect() {
  permanentRedirect('/onboarding/select-profile');
}
