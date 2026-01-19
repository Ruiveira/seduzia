import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    const enhancedPrompt = `${prompt}, estilo brasileiro tropical sedutor, NSFW, high quality, 4k`; // Diferencial anti-plágio
    const response = await fetch(
      'https://api-inference.huggingface.co/models/andite/anything-v4.0',
      {
        headers: { Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}` },
        method: 'POST',
        body: JSON.stringify({ inputs: enhancedPrompt }),
      }
    );
    if (!response.ok) throw new Error('Erro na API Hugging Face');
    const buffer = await response.arrayBuffer();
    return new NextResponse(buffer, { headers: { 'Content-Type': 'image/png' } });
  } catch (error) {
    return NextResponse.json({ error: 'Erro na geração de imagem' }, { status: 500 });
  }
}