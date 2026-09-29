import { NextRequest, NextResponse } from 'next/server';
import { MailerfindConnector, MailerfindSearchParams } from '@/lib/mcp/mailerfind-connector';
import { generateOrganicOutreach } from '@/lib/outreach/organic-outreach-engine';

export async function POST(req: NextRequest) {
  try {
    const body: MailerfindSearchParams = await req.json();

    const leads = await MailerfindConnector.searchLeads(body);

    const enrichedLeads = leads.map(lead => ({
      ...lead,
      outreach: generateOrganicOutreach(lead)
    }));

    return NextResponse.json({
      success: true,
      query: {
        targetAccount: body.targetAccount,
        niche: body.niche,
        location: body.location,
        province: body.province
      },
      totalFound: enrichedLeads.length,
      leads: enrichedLeads
    });
  } catch (err: any) {
    console.error('[Mailerfind Prospect API] Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
