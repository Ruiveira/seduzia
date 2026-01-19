import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { 
  apiVersion: '2025-12-15.clover' as any 
});

export async function POST() {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: 'Assinatura Premium SeduzIA',
              description: 'Acesso ilimitado ao gerador de imagens',
            },
            unit_amount: 1990, // R$ 19,90
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXTAUTH_URL}/success`,
      cancel_url: `${process.env.NEXTAUTH_URL}/cancel`,
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error: any) {
    console.error('Erro no Checkout:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
