import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { url } = await req.json();

  if (!url) {
    return NextResponse.json({ error: 'No URL provided' }, { status: 400 });
  }

  const apiKey = process.env.SMMRY_API_KEY;
  const apiEndpoint = `https://api.smmry.com?SM_API_KEY=${apiKey}&SM_URL=https://edition.cnn.com/2021/09/27/tech/facebook-whistleblower/index.html`;


  try {
    const response = await fetch(apiEndpoint, {
      method: 'GET',
    });

    const data = await response.json();

    if (data.sm_api_error) {
      return NextResponse.json({ error: data.sm_api_message }, { status: 500 });
    }

    return NextResponse.json({
      summary: data.sm_api_content,
    });
  } catch (error) {
    console.error('SMMRY API Error:', error);
    return NextResponse.json({ error: 'Failed to summarise' }, { status: 500 });
  }
}
