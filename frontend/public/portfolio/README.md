# EST — Real Portfolio Images

Cada categoria aceita até **10 projetos**. Basta soltar os arquivos com os
nomes abaixo dentro da pasta correspondente. Se um slot não tiver imagem,
o projeto simplesmente **não aparece** no site (sem placeholder).

```
/app/frontend/public/portfolio/
├── illustration/   →  project-1.<ext>  …  project-10.<ext>
├── murals/         →  project-1.<ext>  …  project-10.<ext>
├── packaging/      →  project-1.<ext>  …  project-10.<ext>
├── printing/       →  project-1.<ext>  …  project-10.<ext>
├── fashion/        →  project-1.<ext>  →  project-10.<ext>
└── games/          →  project-1.<ext>  …  project-10.<ext>
```

`<ext>` pode ser um destes (o loader tenta nesta ordem):
`.webp` → `.jpg` → `.jpeg` → `.png`

## Recomendações

- Proporção: **4:3**  ·  Tamanho: **~1600 × 1200 px**
- Formato preferido: **WebP** ou **JPG otimizado**
- Peso: **≤ 800 KB** por imagem

## Editando títulos, descrições, anos e URLs

Todos os metadados (título, descrição, ano, URL externa) ficam em:

`/app/frontend/src/data/portfolio.js`

Basta editar o array `CATEGORY_OVERRIDES` naquele arquivo. Exemplo:

```js
const CATEGORY_OVERRIDES = {
  illustration: [
    {
      slot: 1,
      title: "Neo Noir",
      description: "Uma série de ilustrações inspiradas em cinema.",
      year: "2026",
      url: "https://est-studio.art/neo-noir",
    },
    {
      slot: 3,
      title: "Botanical Voxels",
      year: "2025",
    },
  ],
  // ... outras categorias
};
```

O `slot` corresponde ao número do arquivo (`project-1`, `project-2`…).
Você só precisa listar os slots que quiser customizar — o resto usa
`Project 01`, `Project 02`, etc. como fallback.
