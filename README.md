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

## SEO e Google Search Console

Antes de publicar, troque `SEU-DOMINIO-AQUI` pela sua URL real (ex: `brobotics-landing.vercel.app` ou seu domínio próprio) nestes 4 lugares:

- `index.html` — tags `og:url` e `canonical`
- `public/robots.txt` — linha do Sitemap
- `public/sitemap.xml` — tag `<loc>`

O arquivo `public/google26bb92f6c5badfaa.html` é a verificação de propriedade do Google Search Console — não precisa editar, só manter como está. Depois do deploy, ele fica acessível em `seusite.com/google26bb92f6c5badfaa.html`, que é o que o Google confere para validar.

Depois de publicado e verificado no Search Console, use a barra de busca do painel para colar a URL principal e clicar em "Solicitar indexação".

## Estrutura

```
index.html                          — HTML raiz
public/robots.txt                    — instruções para crawlers
public/sitemap.xml                    — mapa do site para o Google
public/google*.html                    — verificação do Search Console
public/screenshots/                     — capturas de tela do app (alta qualidade)
src/main.jsx                              — ponto de entrada React
src/App.jsx                                — a landing page (todo o conteúdo e estilo)
src/index.css                                — reset CSS mínimo
```

Para editar textos, cores ou seções, mexa em `src/App.jsx`. As imagens de tela do
app ficam em `public/screenshots/` como arquivos `.webp` separados — para trocar
ou adicionar uma captura, coloque o arquivo nessa pasta e referencie pelo caminho
`/screenshots/nome-do-arquivo.webp` no array `SCREENSHOTS` em `src/App.jsx`.
