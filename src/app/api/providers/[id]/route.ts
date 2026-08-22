import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  return NextResponse.json({
    id: id || 'prov-ear-sovereign-01',
    name: 'Productora EAR Sovereign',
    category: 'Producción Audiovisual y Musical',
    status: 'ACTIVE',
    roiGuaranteeScore: 9.8,
    specs: {
      soundSystem: 'Behringer XR18 + Bose F1 812',
      vocalMicrophones: 'Shure GLXD4 Beta 87A',
      latencyMs: 1.2
    }
  });
}
