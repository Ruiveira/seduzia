import Link from 'next/link';

export default function CancelPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h1 className="text-3xl font-bold text-red-600 mb-4">Pagamento Cancelado</h1>
      <p className="text-gray-600 mb-6">Parece que houve um problema ou você desistiu da compra. Nenhuma cobrança foi feita.</p>
      <Link href="/" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
        Voltar para a Loja
      </Link>
    </div>
  );
}