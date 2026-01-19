Creating an optimized production build ...
✓ Compiled successfully in 8.1s
  Running TypeScript ...
Failed to compile.
./src/app/api/checkout/route.ts:4:70
Type error: Type '"2024-06-20"' is not assignable to type '"2025-12-15.clover"'.
  2 | import Stripe from 'stripe';
  3 |
> 4 | const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion: '2024-06-20' });
    |                                                                      ^
  5 |
  6 | export async function POST() {
  7 |   const session = await stripe.checkout.sessions.create({
Next.js build worker exited with code: 1 and signal: null
Error: Command "npm run build" exited with 1