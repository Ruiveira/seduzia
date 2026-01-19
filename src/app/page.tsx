'use client';

import { useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function Home() {
  const { data: session } = useSession();
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);

  const generateImage = async () => {
    // Melhoria: Validação rápida antes de chamar a API
    if (!session?.user?.subscribed) return alert('Assine o Premium para liberar o gerador!');
    
    setLoading(true);
    try {
      // Diferencial: Prompt enriquecido automaticamente para alta qualidade brasileira
      const enhancedPrompt = `${prompt}, high quality, realistic skin, Brazilian aesthetic, trending in Brazil, 4k, highly detailed`;
      
      const response = await fetch('/api/generate', {
        method: 'POST',
        body: JSON.stringify({ prompt: enhancedPrompt }),
      });

      if (!response.ok) throw new Error('Erro na geração');

      const blob = await response.blob();
      setImage(URL.createObjectURL(blob));
    } catch (error) {
      alert('Erro na geração. Verifique o limite da API ou sua assinatura.');
    } finally {
      setLoading(false); // Resposta rápida dentro dos 3-7 segundos previstos
    }
  };

  const handleCheckout = async () => {
    try {
      const { data } = await axios.post('/api/checkout');
      const stripe = await stripePromise;
      await stripe?.redirectToCheckout({ sessionId: data.sessionId });
    } catch (err) {
      alert('Erro ao iniciar pagamento.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 font-sans">
      <header className="flex justify-between items-center mb-8 border-b pb-4">
        <h1 className="text-2xl font-bold italic text-purple-700">SEDUZIA</h1>
        {session ? (
          <button onClick={() => signOut()} className="text-sm text-gray-500">Sair</button>
        ) : (
          <button onClick={() => signIn()} className="bg-black text-white px-4 py-1 rounded">Entrar</button>
        )}
      </header>

      {session ? (
        <div className="space-y-6">
          {!session.user.subscribed && (
            <div className="bg-yellow-100 p-4 rounded-lg text-center">
              <p className="mb-2">Você está no plano gratuito.</p>
              <button onClick={handleCheckout} className="bg-green-600 text-white px-6 py-2 rounded-full font-bold hover:scale-105 transition">
                Liberar Acesso Premium (Sem Pix)
              </button>
            </div>
          )}

          <div className="flex flex-col gap-4">
            <textarea
              className="border p-4 rounded-xl w-full"
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ex: Uma modelo brasileira na praia de Copacabana..."
            />
            <button 
              onClick={generateImage} 
              disabled={loading || !session.user.subscribed}
              className={`py-3 rounded-xl font-bold text-white ${loading ? 'bg-gray-400' : 'bg-purple-600 hover:bg-purple-700'}`}
            >
              {loading ? 'Gerando beleza (3-7s)...' : 'Gerar Imagem'}
            </button>
          </div>

          {image && (
            <div className="mt-8">
              <img src={image} alt="Gerada por SeduzIA" className="w-full rounded-2xl shadow-2xl" />
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-20">
          <h2 className="text-xl mb-4">Bem-vindo ao futuro da arte por IA.</h2>
          <p className="text-gray-500">Faça login para começar a criar.</p>
        </div>
      )}
    </div>
  );
}