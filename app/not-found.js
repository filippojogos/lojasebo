import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      textAlign: 'center',
      padding: '20px',
      color: '#000000', // Preto absoluto
      backgroundColor: '#ffffff'
    }}>
      <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '20px', color: '#000' }}>
        404 - Página Não Encontrada
      </h2>
      <p style={{ fontSize: '1.2rem', color: '#333', marginBottom: '30px' }}>
        O endereço "admin" não existe mais. Use o link correto ou volte para a loja.
      </p>
      <Link
        href="/"
        style={{
          padding: '12px 24px',
          backgroundColor: '#dc2626', // Vermelho
          color: 'white',
          fontWeight: 'bold',
          borderRadius: '8px',
          textDecoration: 'none'
        }}
      >
        Voltar para a Loja
      </Link>
    </div>
  )
}

