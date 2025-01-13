// README.md
# Verify Influencers

Uma plataforma para verificar alegações de saúde feitas por influenciadores usando IA.

## Setup Local

1. Clone o repositório:
```bash
git clone [seu-repositorio]
cd verify-influencers
```

2. Instale as dependências:
```bash
npm install
```

3. Execute o projeto:
```bash
npm run dev
```

4. Acesse http://localhost:3000

## Deploy no Vercel

1. Push seu código para o GitHub

2. Acesse vercel.com e faça login

3. Clique em "New Project"

4. Selecione o repositório

5. Configure as variáveis de ambiente (se necessário)

6. Clique em "Deploy"

## Estrutura do Projeto

```
verify-influencers/
├── src/
│   ├── app/                  # Páginas Next.js
│   ├── components/           # Componentes React
│   ├── contexts/             # Contextos React
│   └── lib/                  # Utilitários e dados mockados
├── public/                   # Arquivos estáticos
└── package.json             # Dependências
```

## Tecnologias Utilizadas

- Next.js 13+ (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Lucide Icons

## Funcionalidades

- [x] Busca de influenciadores
- [x] Análise de alegações
- [x] Verificação científica
- [x] Dashboard interativo
- [x] Perfis detalhados