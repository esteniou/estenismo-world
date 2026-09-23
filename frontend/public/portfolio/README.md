# EST — Portfolio Images

Cada categoria tem uma pasta própria. Basta soltar as imagens dentro da pasta
correspondente com os nomes exatos indicados no README de cada uma.

```
/app/frontend/public/portfolio/
├── illustration/   →  project-1.jpg, project-2.jpg
├── murals/         →  project-1.jpg, project-2.jpg
├── packaging/      →  project-1.jpg, project-2.jpg
├── printing/       →  project-1.jpg, project-2.jpg
├── fashion/        →  project-1.jpg, project-2.jpg
├── games/          →  project-1.jpg, project-2.jpg
└── contact/        →  hero.jpg (opcional)
```

## Como funciona

- Os cards do site carregam automaticamente `project-1.jpg` e `project-2.jpg`
  de cada categoria.
- Se um arquivo ainda **não existir**, o site mostra uma imagem placeholder
  bonita da Unsplash/Pexels no lugar (fallback automático).
- Não precisa reiniciar nada — basta atualizar a página.

## Formatos

- `.jpg` / `.jpeg` (recomendado)
- `.png`
- `.webp`

## Dicas

- Proporção 4:3 renderiza melhor (ex. 1600x1200 px)
- Mantenha ≤ 800 KB por imagem para carregamento rápido
- Se quiser usar `.png` em vez de `.jpg`, renomeie o arquivo mantendo o mesmo
  prefixo (ex. `project-1.png`) e me avise que eu ajusto a extensão no código.
