import { permanentRedirect } from 'next/navigation';

export default function VoiceStudioRootRedirect() {
  permanentRedirect('/voicestudio/studio-pro');
}
