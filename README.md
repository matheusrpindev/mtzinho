# Consulta de Audiência · Teles & Ramos Advocacia

Sistema de consulta rápida para a audiência simulada de 11/11/2026 (defesa de Wagner Alves).
Página única, sem dependências, que funciona sem internet depois de aberta.

- `index.html`: o sistema pronto. Abra no navegador do celular ou do notebook.
- `dist/artefato.html`: a mesma página, no formato de artefato do Claude.
- `src/dados/`: as fichas, o roteiro e as perguntas, escritos a partir de `fontes/BASE_DE_CONHECIMENTO.md`.
- `src/busca.js`, `src/app.js`, `src/estilo.css`, `src/corpo.html`: busca e interface.
- `fontes/`: a base de conhecimento e o texto dos documentos do processo.

Para gerar de novo e testar:

```bash
node build.mjs
```

```bash
node teste.mjs
```

O build falha se algum texto tiver travessão ou hífen duplo, ou se alguma ficha estiver incompleta.
`teste.mjs` roda as 10 buscas de conferência do pedido original.
