import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { 
  apiVersion: '2025-12-15.clover' as any 
});

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature') as string;

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    if (event.type === 'checkout.session.completed') {
      console.log('✅ Pagamento confirmado no SeduzIA!');
    }
    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error('Erro no Webhook:', err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}