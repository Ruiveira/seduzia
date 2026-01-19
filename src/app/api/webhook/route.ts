import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion: '2024-06-20' });

export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature') as string;
  const body = await req.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET as string);
  } catch (err) {
    return NextResponse.json({ error: 'Webhook Error' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    // Aqui, atualize o usuário como subscribed: true. Por simplicidade, logue.
    console.log(`Usuário ${session.customer_email} assinou!`);
    // Em produção, use DB para marcar subscribed.
  }

  return NextResponse.json({ received: true });
}