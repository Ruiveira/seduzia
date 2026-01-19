'use client';
import { useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function Home() {
  const { data: session } = useSession();
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);

  const generateImage = async () => {
    if (!session?.user?.subscribed) return alert('Assine o Premium para gerar imagens!');
    setLoading(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      if (!res.ok) throw new Error('Erro');
      const blob = await res.blob();
      setImage(URL.createObjectURL(blob));
    } catch (error) {
      alert('Erro na geração. Tente mais tarde (limite da IA grátis)');
    }
    setLoading(false);
  };

  const handleCheckout = async () => {
    const res = await fetch('/api/checkout', { method: 'POST' });
    const { sessionId } = await res.json();
    const stripe = await stripePromise;
    await stripe?.redirectToCheckout({ sessionId });
  };

  return (
    <div className="p-8 text-center">
      <h1 className="text-3xl font-bold mb-8">SeduzIA - Imagens NSFW com Toque Brasileiro</h1>
      {!session ? (
        <button onClick={() => signIn('credentials')} className="bg-blue-600 text-white px-4 py-2 rounded">Entrar (user/pass)</button>
      ) : (
        <div className="space-y-4">
          <button onClick={() => signOut()} className="text-red-500">Sair</button>
          {!session.user?.subscribed && (
            <button onClick={handleCheckout} className="block mx-auto bg-green-500 text-white px-6 py-2 rounded">Assinar Premium (R$19,90/mês)</button>
          )}
          <input 
            className="border p-2 w-full max-w-md block mx-auto"
            value={prompt} 
            onChange={(e) => setPrompt(e.target.value)} 
            placeholder="Descreva a imagem NSFW..."
          />
          <button onClick={generateImage} disabled={loading} className="bg-purple-600 text-white px-6 py-2 rounded">
            {loading ? "Gerando..." : "Gerar Imagem"}
          </button>
          {image && <img src={image} alt="Gerada" className="mx-auto mt-4 rounded-lg shadow-lg max-w-md" />}
        </div>
      )}
    </div>
  );
}