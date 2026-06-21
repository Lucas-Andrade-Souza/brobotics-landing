# Brobotics — landing page

Landing page de divulgação / lista de espera do Brobotics, feita em React + Vite.

## Rodar localmente (opcional)

Se você tiver Node.js instalado:

```bash
npm install
npm run dev
```

Abre em `http://localhost:5173`.

## Deploy na Vercel

Veja o passo a passo completo na conversa com o Claude, ou resumidamente:

1. Suba esta pasta para um repositório no GitHub.
2. Em vercel.com, clique em "Add New… → Project" e selecione o repositório.
3. A Vercel detecta o framework (Vite) automaticamente — não precisa mudar nada.
4. Clique em "Deploy".

## Estrutura

```
index.html        — HTML raiz
src/main.jsx       — ponto de entrada React
src/App.jsx         — a landing page (todo o conteúdo e estilo)
src/index.css       — reset CSS mínimo
```

Para editar textos, cores ou seções, mexa em `src/App.jsx`.
