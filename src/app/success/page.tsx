'use client';

import { useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';

const stripePromise = loadStripe('pk_test_XXXXXXXX');  // Sua public key Stripe de teste

export default function Home() {
  const { data: session } = useSession();
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);

  const generateImage = async () => {
    if (!session?.user?.subscribed) return alert('Assine para gerar!');
    setLoading(true);
    try {
      const response = await axios.post(
        'https://api-inference.huggingface.co/models/andite/anything-v4.0',  // Modelo NSFW anime, mude se quiser realista como runwayml/stable-diffusion-v1-5 (mas teste NSFW)
        { inputs: prompt + ' (tema brasileiro, tropical, NSFW)' },  // Diferencial: adiciona tema BR
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY}`,  // Use env no client? Melhor server-side.
          },
        }
      );
      const blob = new Blob([response.data], { type: 'image/png' });
      setImage(URL.createObjectURL(blob));
    } catch (error) {
      console.error(error);
      alert('Erro na geração. Limite da API?');
    }
    setLoading(false);
  };

  const handleCheckout = async () => {
    const stripe = await stripePromise;
    const { data } = await axios.post('/api/checkout');
    await stripe?.redirectToCheckout({ sessionId: data.id });
  };

  return (
    <div className="p-4">
      <h1>SeduzIA - Gerador de Imagens NSFW com Toque Brasileiro</h1>
      {session ? (
        <>
          <button onClick={() => signOut()}>Sair</button>
          {!session.user.subscribed ? (
            <button onClick={handleCheckout}>Assinar por R$19,90/mês</button>
          ) : null}
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Descreva a imagem NSFW..."
          />
          <button onClick={generateImage} disabled={loading}>Gerar</button>
          {image && <img src={image} alt="Gerada" />}
        </>
      ) : (
        <button onClick={() => signIn('credentials')}>Entrar (user/pass)</button>
      )}
    </div>
  );
}