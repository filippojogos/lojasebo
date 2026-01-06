import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">404 - Página Não Encontrada</h2>
            <p className="text-lg text-gray-700 mb-8">Parece que o endereço que você digitou sumiu no espaço ou não existe.</p>
            <Link
                href="/"
                className="px-6 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors"
            >
                Voltar para a Loja
            </Link>
        </div>
    )
}
