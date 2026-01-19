export default function SuccessPage() {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <h1 className="text-2xl font-bold text-green-600">Pagamento Confirmado!</h1>
        <p>Sua assinatura foi ativada. Volte para a página inicial para gerar imagens.</p>
        <a href="/" className="mt-4 text-blue-500 underline">Voltar para Home</a>
      </div>
    );
  }
  