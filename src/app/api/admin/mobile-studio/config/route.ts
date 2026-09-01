import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const CONFIG_PATH = path.join(process.cwd(), 'src/data/admin/mobile-studio-config.json');

const DEFAULT_CONFIG = {
  activeMode: 'SOVEREIGN_HUD_V5',
  features: {
    showRoleSwitcher: true,
    showJourneyBar: true,
    showAIConciergeFloating: false,
    showDirectWhatsAppButton: false,
    ambientGlow: true
  },
  rolesEnabled: ['novios', 'corporativo', 'artistas', 'b2g_institucional'],
  updatedAt: new Date().toISOString()
};

export async function GET() {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const data = fs.readFileSync(CONFIG_PATH, 'utf-8');
      return NextResponse.json(JSON.parse(data));
    }
    return NextResponse.json(DEFAULT_CONFIG);
  } catch (error) {
    console.error('[MOBILE_STUDIO_GET_ERROR]', error);
    return NextResponse.json(DEFAULT_CONFIG);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const updatedConfig = {
      ...DEFAULT_CONFIG,
      ...body,
      updatedAt: new Date().toISOString()
    };

    const dir = path.dirname(CONFIG_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(CONFIG_PATH, JSON.stringify(updatedConfig, null, 2), 'utf-8');

    const res = NextResponse.json({ success: true, config: updatedConfig });
    // Establecer cookie para SSR fallback inmediato sin latencia
    res.cookies.set('ear_mobile_mode', updatedConfig.activeMode, {
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 días
      sameSite: 'lax'
    });

    return res;
  } catch (error: any) {
    console.error('[MOBILE_STUDIO_POST_ERROR]', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
