// Monta o sistema em um arquivo único.
//   node build.mjs
// Saídas:
//   index.html           página completa, abre direto no navegador (inclusive sem internet)
//   dist/artefato.html   mesmo conteúdo sem <html>/<head>/<body>, para publicar como artefato
//   dist/dados.json      os dados embutidos, para os testes
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import respostas from './src/dados/respostas.js';
import extras from './src/dados/extras.js';
import roteiro from './src/dados/roteiro.js';
import pessoas from './src/dados/pessoas.js';
import {
  INDICE, INDICE_LEI, ARTIGOS, GLOSSARIO, LINHA_DO_TEMPO, PEDIDOS,
  PROVAS_AUTORA, DOCS_DEFESA, PONTOS_FRACOS, TESES, FRASES,
} from './src/dados/tabelas.js';

const RAIZ = path.dirname(fileURLToPath(import.meta.url));
const ler = (p) => fs.readFileSync(path.join(RAIZ, p), 'utf8');
const lista = (s) => (s || '').split(',').map((x) => x.trim()).filter(Boolean);
const semPonto = (s) => s.replace(/[.;:]\s*$/, '');
const minuscula = (s) => s.charAt(0).toLowerCase() + s.slice(1);

// ------------------------------------------------------------------ fichas

const fichas = [];
function ficha(o) {
  const f = {
    id: o.id,
    categoria: o.c,
    titulo: o.t,
    palavras_chave: Array.isArray(o.k) ? o.k : lista(o.k),
    fale_assim: o.f || '',
    explicacao: o.e || '',
    fundamento: o.l || '',
    onde_esta: o.o || '',
  };
  if (o.x) f.cuidado = o.x;
  if (o.q) f.quem = o.q;
  if (o.r) f.rotulo_fala = o.r;
  if (o.mais && o.mais.length) f.mais_falas = o.mais.map((m) => ({ rotulo: m.r, quem: m.q || '', texto: m.t }));
  f.atalhos = Array.isArray(o.a) ? o.a : lista(o.a);
  f.peso = o.p || 0;
  fichas.push(f);
}

respostas.forEach(ficha);
extras.forEach(ficha);

// Índice remissivo (cap. 7)
INDICE.forEach((r, i) => {
  const [tema, pi, provas, cont, outros, fala, cat, atalhos, palavras] = r;
  const tem = (v) => v && !/^(não fala|nenhuma|não trata)$/.test(v);
  const partes = [];
  const onde = [];
  if (tem(pi)) { partes.push(`Na inicial: ${pi}.`); onde.push(`PI ${pi}`); } else if (pi === 'não fala') partes.push('A inicial não fala do tema.');
  if (tem(provas)) { partes.push(`Nas provas da autora: ${provas}.`); onde.push(provas === 'Anexo I' ? 'Provas aut. Anexo I' : `Provas aut. ${provas}`); } else if (provas === 'nenhuma') partes.push('A autora não juntou prova sobre isso.');
  if (tem(cont)) { partes.push(`Na contestação: ${cont}.`); onde.push(`Cont. ${cont}`); } else if (cont === 'não trata') partes.push('A contestação não trata do tema.');
  if (outros) { partes.push(`Veja também: ${outros}.`); onde.push(outros); }
  onde.push(i <= 20 ? 'Apostila p. 21' : 'Apostila p. 22');
  ficha({
    id: `ix-${String(i + 1).padStart(2, '0')}`, c: cat, t: `Onde está: ${tema}`,
    k: `${palavras}, índice remissivo, onde está`, f: fala, e: partes.join(' '),
    l: INDICE_LEI[tema] || '', o: onde.join('; '), a: atalhos, p: 1,
  });
});

// Artigos (A11)
function artigoPorExtenso(a) {
  const nomes = { CC: 'do Código Civil', CPC: 'do CPC', CF: 'da Constituição Federal', ECA: 'do ECA' };
  const i = a.indexOf(', ');
  if (i < 0) return a;
  const lei = a.slice(0, i);
  let resto = a.slice(i + 2).replace('par. único', 'parágrafo único');
  resto = resto.charAt(0).toUpperCase() + resto.slice(1);
  const nome = nomes[lei] || `da ${lei}`;
  return /,/.test(resto) ? `${resto}, ${nome}` : `${resto} ${nome}`;
}
ARTIGOS.forEach((r, i) => {
  const [art, diz, quando, palavras, atalhos, cuidado] = r;
  ficha({
    id: `art-${String(i + 1).padStart(2, '0')}`, c: 'Artigos', t: `${art} · ${quando}`,
    k: `${palavras}, ${quando}, artigo, lei`, f: `${artigoPorExtenso(art)}: ${minuscula(diz)}.`,
    e: `Quando usar: ${minuscula(quando)}.`, l: art, o: 'Base A11 (artigos de lei)',
    x: cuidado, a: `artigos${atalhos ? ',' + atalhos : ''}`, p: 2, r: 'O QUE DIZ, EM PALAVRAS SIMPLES',
  });
});

// Glossário (A12)
GLOSSARIO.forEach((r, i) => {
  const [termo, def, palavras] = r;
  ficha({
    id: `gl-${String(i + 1).padStart(2, '0')}`, c: 'Glossário', t: `Glossário: ${termo}`,
    k: `${termo}, ${palavras}, glossário, significado, o que é`, f: def,
    e: `Termo do glossário da base: ${termo}.`, o: 'Base A12 (glossário)', p: 1, r: 'SIGNIFICA',
  });
});

// Linha do tempo (A2)
LINHA_DO_TEMPO.forEach((r, i) => {
  const [data, fato, fonte, palavras] = r;
  const curto = semPonto(fato.split(/\.\s/)[0]);
  ficha({
    id: `lt-${String(i + 1).padStart(2, '0')}`, c: 'Caso e datas', t: `${data.replace(/ \((avó|Jacinto)\)$/, '')}: ${curto}`,
    k: `${palavras}, ${data}, linha do tempo, data, quando foi`, f: fato,
    e: 'Fato da linha do tempo do caso.', o: fonte, p: 1, r: 'O FATO',
  });
});

// Pedidos da contestação (A4): a página de cada pedido vem do PDF da contestação.
const contPaginas = ler('fontes/textos/02_contestacao_por_pagina.txt').split('\f');
function paginaDoPedido(letra) {
  for (let p = 36; p <= 39; p += 1) {
    if (new RegExp(`(^|\\n)\\s*${letra}\\)\\s`).test(contPaginas[p - 1] || '')) return p;
  }
  return null;
}
PEDIDOS.forEach((r) => {
  const [letra, texto, cat, atalhos, palavras, cuidado] = r;
  const pg = paginaDoPedido(letra);
  if (!pg) throw new Error(`Página do pedido ${letra} não encontrada`);
  ficha({
    id: `ped-${letra}`, c: cat, t: `Pedido ${letra} da contestação: ${semPonto(texto)}`,
    k: `${palavras}, pedido ${letra}, pedidos da contestação, requerimentos finais`,
    f: `Está no pedido ${letra} da contestação: ${minuscula(texto)}`,
    e: 'Faz parte dos pedidos e requerimentos finais da contestação (tópico 18).',
    o: `Cont. pedido ${letra}, p. ${pg}; Cont. tóp. 18, p. 36 a 39`, x: cuidado, a: atalhos, p: 1,
  });
});

// Provas da autora (A5)
PROVAS_AUTORA.forEach((r, i) => {
  const [pag, oque, critica, fala, palavras, lei] = r;
  ficha({
    id: `pa-${i + 1}`, c: 'Documentos', t: `Provas aut. ${pag}: ${minuscula(oque)}`,
    k: `${palavras}, provas da autora, prova da Mariana`, f: fala, e: `Crítica da defesa: ${minuscula(critica)}`,
    l: lei, o: `Provas aut. ${pag}`, p: 3,
  });
});

// Documentos da defesa (A6)
DOCS_DEFESA.forEach((r) => {
  const [doc, pag, oque, prova, fala, palavras, cat, atalhos, cuidado] = r;
  ficha({
    id: `doc-${doc.slice(-2)}`, c: 'Documentos', t: `${doc}: ${oque} (${pag})`,
    k: `${palavras}, ${doc}, Doc ${Number(doc.slice(-2))}, documento da defesa`, f: fala,
    e: `O que prova: ${minuscula(prova)} Fica na ${pag} do PDF da contestação.`,
    o: `${doc}; Cont. ${pag}`, x: cuidado, a: atalhos, p: 3,
  });
});

// Pontos fracos (A10)
PONTOS_FRACOS.forEach((r, i) => {
  const [ponto, resposta, fala, palavras, atalhos, onde] = r;
  const proibidos = !fala;
  ficha({
    id: `pf-${String(i + 1).padStart(2, '0')}`, c: 'Pontos fracos', t: proibidos ? ponto : `Ponto fraco: ${ponto}`,
    k: `${palavras}, ponto fraco, fraqueza, como responder`, f: fala,
    e: proibidos ? 'Lista do que a defesa combinou não usar na audiência.' : `Como responder: ${minuscula(resposta)}`,
    x: proibidos ? `Não use: ${minuscula(resposta)}` : '', o: onde, a: atalhos, p: 2,
  });
});

// Teses (A3)
TESES.forEach((r) => {
  const [n, tema, texto, fala, lei, cat, atalhos, palavras] = r;
  ficha({
    id: `tese-${n}`, c: cat, t: `Tese ${n} da defesa: ${tema}`, k: `${palavras}, tese, teses da defesa, tese ${n}`,
    f: fala, e: texto, l: lei, o: 'Base A3; Apostila p. 2', a: atalhos, p: 3,
  });
});

// Frases de bolso (8.2)
FRASES.forEach((r, i) => {
  const [situacao, frase, palavras, cuidado] = r;
  ficha({
    id: `fr-${String(i + 1).padStart(2, '0')}`, c: 'Frases', t: `Frase de bolso: ${minuscula(situacao)}`,
    k: `${palavras}, frase de bolso, frase pronta`, f: frase, e: `Situação: ${minuscula(situacao)}.`,
    o: 'Apostila p. 23 (8.2)', x: cuidado, a: 'frases', p: 2,
  });
});

// Roteiro (Partes 1 a 8)
roteiro.forEach((p) => {
  const [primeira, ...outras] = p.falas;
  ficha({
    id: `rot-${p.n}`, c: 'Roteiro', t: `Parte ${p.n} do roteiro: ${p.titulo}`,
    k: `${p.k}, parte ${p.n}, roteiro da professora, roteiro`,
    f: primeira ? primeira.t : '', r: primeira ? `FALE ASSIM · ${primeira.r.toUpperCase()}` : '',
    q: p.quem, e: `${p.resumo} ${p.fazer.join(' ')}`,
    o: `Roteiro da professora, Parte ${p.n}; ${p.apostila}`,
    mais: outras.map((f) => ({ r: `${f.r.toUpperCase()} (${f.q.toUpperCase()})`, q: f.q, t: f.t })),
    a: p.n === 7 ? 'alegacoes' : p.n === 2 ? 'mp' : '', p: 4,
  });
});

// Perguntas por pessoa
const ARTIGO_NOME = { wagner: 'O WAGNER', maria: 'A MARIA', jacinto: 'O JACINTO' };
pessoas.forEach((pes) => {
  pes.blocos.forEach((b) => {
    b.itens.forEach((it) => {
      const base = { id: `q-${pes.id}-${it.cod.toLowerCase()}`, c: pes.cat, a: pes.atalho, q: pes.quem };
      const rotuloNome = pes.id === 'avo' ? 'Testemunha da autora' : pes.nome;
      const titulo = `${rotuloNome} ${it.cod}: ${it.t}`;
      const palavras = `${it.k || ''}, ${pes.nome}, ${pes.papel}, pergunta ${it.cod}`;
      if (b.tipo === 'defesa') {
        const partes = [];
        if (it.obj) partes.push(`Objetivo: ${minuscula(it.obj)}`);
        if (it.prov) partes.push('Pergunta provocativa.');
        if (it.resp) partes.push(`Resposta esperada: "${it.resp}"`);
        if (it.nota) partes.push(it.nota);
        ficha({
          ...base, t: titulo, k: `${palavras}, perguntar`, f: it.t, e: partes.join(' '),
          o: `${it.fonte ? it.fonte + '; ' : ''}Apostila p. ${it.pg}`, p: 2,
        });
      } else {
        const quemPergunta = /juiz/i.test(b.titulo) ? 'Pergunta provável do juiz.' : 'Pergunta provável da advogada da Mariana.';
        ficha({
          ...base, q: '', t: titulo, k: `${palavras}, resposta combinada`, f: it.resp,
          r: `${ARTIGO_NOME[pes.id]} RESPONDE`, e: `${quemPergunta}${it.nota ? ' ' + it.nota : ''}`,
          o: `Apostila p. ${it.pg}`, p: 2,
        });
      }
    });
  });
});

// ------------------------------------------------------------------ texto integral

const LIG = { 'ﬁ': 'fi', 'ﬂ': 'fl', 'ﬀ': 'ff', 'ﬃ': 'ffi', 'ﬄ': 'ffl' };
function limparTexto(s) {
  let t = s
    .replace(/[ﬁﬂﬀﬃﬄ]/g, (c) => LIG[c])
    .replace(/[   ]/g, ' ')
    .replace(/­/g, '')
    .replace(/[‐‑]/g, '-')
    .replace(/➢/g, '•')
    .replace(/&nbsp;/g, ' ')
    .replace(/\\\./g, '.')
    .replace(/\*\*/g, '');
  // Sem travessão: numeração de título vira ponto, o resto vira vírgula.
  t = t.replace(/^(\s*(?:PARTE|Parte)\s+\d+|\s*[IVXLC]+|\s*\d+(?:\.\d+)*)\s*[–—]\s*/gm, '$1. ');
  t = t.replace(/\s*[–—]\s*/g, ', ');
  t = t.replace(/-{2,}/g, ' ');
  return t;
}
function juntarLinhas(par) {
  const linhas = par.split('\n').map((l) => l.trim()).filter(Boolean);
  let out = '';
  for (const l of linhas) {
    if (!out) out = l;
    else if (/[A-Za-zÀ-ÿ]-$/.test(out) && /^[a-zà-ÿ]/.test(l)) out += l; // "requer-" + "se"
    else out += ' ' + l;
  }
  return out.replace(/\s+/g, ' ').replace(/\s+([,.;:])/g, '$1').replace(/,\s*,/g, ',').trim();
}
const ehTitulo = (p) => p.length < 130 && (/^([IVXLC]+\.|\d+(\.\d+)*\.?)\s+\S/.test(p) || (p === p.toUpperCase() && /[A-ZÀ-Ý]{4}/.test(p)));
const alnum = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');

const textos = [];
function trecho(doc, ref, texto, sec) {
  const t = texto.trim();
  if (t.length < 3 || /^[\d\s._]+$/.test(t)) return;
  const o = { doc, ref, texto: t };
  if (sec && sec !== t) o.sec = sec;
  textos.push(o);
}

// Documentos paginados por form feed.
function paginado(arquivo, doc, refDe) {
  const paginas = ler(arquivo).split('\f');
  let sec = '';
  let estado = {};
  paginas.forEach((pg, i) => {
    const corpo = limparTexto(pg).replace(/^\s*\d{1,2}\s*$/gm, '');
    corpo.split(/\n\s*\n/).map(juntarLinhas).filter(Boolean).forEach((par) => {
      if (ehTitulo(par)) { sec = par; estado = { ...estado, titulo: par }; }
      trecho(doc, refDe(i + 1, par, estado), par, sec);
    });
  });
}

paginado('fontes/textos/01_peticao_inicial.txt', 'Petição inicial', (p) => `PI p. ${p}`);
paginado('fontes/textos/03_manifestacao_erro_material_autora.txt', 'Manifestação de "erro material" da autora', () => 'Manifestação de 09/11');
paginado('fontes/textos/04_relatorio_social.txt', 'Relatório social', (p, par, est) => {
  const m = /^(\d)\.\s+[A-ZÀ-Ý]/.exec(est.titulo || '');
  return m ? `Rel. item ${m[1]} (p. ${p})` : `Rel. p. ${p}`;
});
paginado('fontes/textos/05_parecer_psicologo.txt', 'Parecer do psicólogo', (p) => `Parecer psicólogo p. ${p}`);
paginado('fontes/textos/06_manifestacao_conselho_tutelar.txt', 'Manifestação do Conselho Tutelar', (p) => `Conselho Tutelar p. ${p}`);
paginado('fontes/textos/07_roteiro_professora.txt', 'Roteiro da professora', (p) => `Roteiro da professora p. ${p}`);

// Localiza a página de um trecho dentro de um texto paginado (PDF convertido).
function localizador(paginas, primeira = 1) {
  const blocos = paginas.map(alnum);
  let cursor = 0;
  return (texto) => {
    const alvo = alnum(texto);
    for (const n of [48, 30, 20]) {
      if (alvo.length < n) continue;
      const chave = alvo.slice(0, n);
      for (let k = 0; k < blocos.length; k += 1) {
        const i = (cursor + k) % blocos.length; // procura a partir da última página achada
        if (blocos[i].includes(chave)) { cursor = i; return i + primeira; }
      }
    }
    return null;
  };
}

// Contestação: parágrafos do texto corrido, páginas pelo PDF.
{
  const achar = localizador(contPaginas.slice(0, 40));
  let topico = '';
  let ultima = 1;
  let sec = '';
  limparTexto(ler('fontes/textos/02_contestacao.txt')).split(/\n\s*\n/).map(juntarLinhas).filter(Boolean).forEach((par) => {
    const m = /^(\d{1,2}(?:\.\d)?)\s*[.\-]\s+(D[AOE]S?\s|ROL)/.exec(par);
    if (m) { topico = m[1]; sec = par; }
    const pg = achar(par) || ultima;
    ultima = pg;
    trecho('Contestação', topico ? `Cont. tóp. ${topico}, p. ${pg}` : `Cont. p. ${pg}`, par, sec);
  });
  // Índice de documentos e Docs. 01 e 02 (os Docs. 03 a 08 são imagens).
  [[41, 'Cont. p. 41 (índice de documentos)'], [42, 'Doc. 01, Cont. p. 42'], [43, 'Doc. 02, Cont. p. 43']].forEach(([p, ref]) => {
    const linhas = limparTexto(contPaginas[p - 1]).split('\n').map((l) => l.replace(/\s{2,}/g, ' · ').replace(/^ · /, '').trim());
    let buf = '';
    const solta = () => { if (buf) trecho('Documentos da defesa', ref, buf.replace(/\s+/g, ' ')); buf = ''; };
    linhas.forEach((l) => {
      if (!l) return solta();
      if (/^Doc\. 0\d$/.test(l)) return undefined;
      if (/^(Doc\. 0\d ·|\d\. |[A-Z][a-zç]+\/20\d\d|Total|Média|\(|Lucro|Receita|Notas)/.test(l)) solta();
      buf += (buf ? ' ' : '') + l;
      return undefined;
    });
    solta();
  });
}

// Apostila: Parte B da base, com a página achada no PDF da apostila.
{
  const base = ler('fontes/BASE_DE_CONHECIMENTO.md');
  const parteB = base.slice(base.indexOf('# PARTE B'));
  const sumario = {};
  for (const m of parteB.matchAll(/^\s*-\s+(?:\*\*Capítulo (\d+),[^*]*\*\*|(\d+\.\d+)[^:\n]*?):\s*p\. (\d+)/gm)) {
    sumario[m[1] ? `cap${m[1]}` : m[2]] = Number(m[3]);
  }
  const apostilaPaginas = ler('fontes/textos/00_apostila_por_pagina.txt').split('\f');
  const achar = localizador(apostilaPaginas.slice(2), 2); // PDF: capa, sumário (p. 1), depois p. 2 em diante
  const corpo = limparTexto(parteB.slice(parteB.indexOf('# CAPÍTULO DA APOSTILA')));
  let cap = '';
  let secao = '';
  let secNum = '';
  let capNum = 0;
  let ultima = 2;
  const blocos = corpo.split(/\n\s*\n/);
  let pend = '';
  const refDe = (texto) => {
    const pg = achar(texto);
    if (pg && pg >= ultima - 1) ultima = pg;
    const onde = pg ? `p. ${ultima}` : `a partir da p. ${sumario[secNum] || sumario[`cap${capNum}`] || ultima}`;
    return secNum ? `Apostila ${secNum}, ${onde}` : `Apostila cap. ${capNum}, ${onde}`;
  };
  const solta = () => {
    if (pend) trecho('Apostila da Defesa', refDe(pend), pend, secao || cap);
    pend = '';
  };
  blocos.forEach((bruto) => {
    const b = bruto.trim();
    if (!b || /^(CAPÍTULO|TESTEMUNHA) \d+$/.test(b)) return;
    let m;
    if ((m = /^# CAPÍTULO DA APOSTILA: (.+)$/.exec(b))) {
      solta();
      const nomes = ['O caso', 'Roteiro da audiência', 'Perguntas', 'Pareceres técnicos', 'Wagner', 'Testemunhas', 'Índice remissivo', 'Alegações e frases'];
      const idx = nomes.indexOf(m[1]);
      if (idx >= 0) capNum = idx + 1;
      cap = m[1]; secao = ''; secNum = '';
      return;
    }
    if ((m = /^## (\d+\.\d+) (.+)$/.exec(b))) { solta(); secNum = m[1]; secao = `${m[1]} ${m[2]}`; return; }
    if ((m = /^### (.+)$/.exec(b))) { solta(); pend = `${m[1]}:`; return; }
    if (b.startsWith('|')) {
      solta();
      b.split('\n').filter((l) => !/^\|\s*[-:| ]+\|\s*$/.test(l)).slice(1).forEach((l) => {
        const cel = l.split('|').map((c) => c.trim()).filter(Boolean);
        if (cel.length > 1) trecho('Apostila da Defesa', refDe(cel[0] + ' ' + cel[1]), cel.join(' · '), secao || cap);
        else if (cel.length === 1) trecho('Apostila da Defesa', refDe(cel[0]), cel[0], secao || cap);
      });
      return;
    }
    const par = juntarLinhas(b.replace(/^\s*[-•]\s+/gm, '• ').replace(/^(\d+)\.\s{2,}/gm, '$1. '));
    const novaPergunta = /^([A-Z]{1,2}\d{1,2}\.|\d{1,2} [A-ZÉ]|Parte \d ·)/.test(par);
    if (novaPergunta || (pend.length + par.length > 700 && !/^(OBJETIVO|FONTE|")/.test(par))) solta();
    pend += (pend ? ' ' : '') + par;
  });
  solta();
}

// ------------------------------------------------------------------ dados finais

const DADOS = {
  meta: {
    escritorio: 'Teles & Ramos Advocacia',
    sistema: 'Consulta de Audiência',
    caso: 'Mariana Alves x Wagner Alves',
    acao: 'Divórcio litigioso com guarda, convivência, alimentos, partilha e indenização',
    juizo: 'Vara da Família e das Sucessões de Mogi das Cruzes/SP',
    audiencia: 'Audiência simulada, 11/11/2026',
    cliente: 'Defesa do requerido Wagner Alves',
  },
  atalhos: [
    ['mp', 'MP'], ['mariana', 'Mariana'], ['psicologo', 'Psicólogo'], ['conselho', 'Conselho Tutelar'],
    ['social', 'Assistente social'], ['testemunhas', 'Testemunhas'], ['wagner', 'Wagner'], ['erro', 'Erro material'],
    ['alimentos', 'Alimentos'], ['guarda', 'Guarda'], ['partilha', 'Partilha'], ['artigos', 'Artigos'],
    ['frases', 'Frases'], ['alegacoes', 'Alegações'],
  ].map(([id, rotulo]) => ({ id, rotulo })),
  numeros: [
    ['R$ 8.500', 'renda média do Wagner (Doc. 01)'],
    ['R$ 2.550', '30% para os filhos'],
    ['R$ 547.500', 'meação da Mariana'],
    ['R$ 6.520', 'aluguel que ela recebe (Doc. 08)'],
    ['R$ 348 mil', 'faturamento anual da empresa, não renda'],
    ['R$ 718.700', 'valor da causa'],
    ['R$ 50 mil', 'indenização pedida'],
    ['R$ 10.100', 'soma dos alimentos pedidos'],
  ],
  sinonimos: [
    ['pensão', 'alimentos'],
    ['avó', 'testemunha da autora', 'sogra'],
    ['laudo', 'Augusto'],
    ['MP', 'promotora', 'Ministério Público', 'MPE'],
    ['carro', 'Civic', 'veículo'],
    ['apartamento', 'imóvel'],
    ['psicólogo', 'Giovani'],
    ['assistente social', 'Tatiane'],
    ['conselheira', 'Ananda', 'Conselho Tutelar'],
    ['síndica', 'Maria'],
    ['intercessor', 'Jacinto'],
    ['memoriais', 'razões finais'],
    ['gratuidade', 'justiça gratuita'],
  ],
  fichas,
  roteiro: roteiro.map((p) => ({
    n: p.n, titulo: p.titulo, quem: p.quem, resumo: p.resumo, juiz: p.juiz || '', esperado: p.esperado || '',
    fazer: p.fazer, falas: p.falas.map((f) => ({ rotulo: f.r, quem: f.q, texto: f.t })),
    ver: p.ver || [], apostila: p.apostila,
  })),
  pessoas: pessoas.map((p) => ({
    id: p.id, nome: p.nome, papel: p.papel, quem: p.quem, parte: p.parte, intro: p.intro, avisos: p.avisos || [],
    fala: p.fala ? { rotulo: p.fala.r, quem: p.fala.q, texto: p.fala.t } : null,
    blocos: p.blocos.map((b) => ({
      titulo: b.titulo, tipo: b.tipo,
      itens: b.itens.map((it) => ({
        cod: it.cod, texto: it.t, objetivo: it.obj || '', fonte: it.fonte || '', nota: it.nota || '',
        provocativa: !!it.prov, resposta: it.resp || '', pagina: it.pg,
      })),
    })),
  })),
  textos,
};

// ------------------------------------------------------------------ conferência

const erros = [];
const ids = new Set();
for (const f of fichas) {
  if (ids.has(f.id)) erros.push(`id repetido: ${f.id}`);
  ids.add(f.id);
  for (const campo of ['id', 'categoria', 'titulo', 'onde_esta']) if (!f[campo]) erros.push(`${f.id}: falta ${campo}`);
  if (!f.fale_assim && !f.cuidado) erros.push(`${f.id}: sem frase e sem cuidado`);
  if (!f.palavras_chave.length) erros.push(`${f.id}: sem palavras-chave`);
  for (const a of f.atalhos) if (!DADOS.atalhos.some((x) => x.id === a)) erros.push(`${f.id}: atalho desconhecido ${a}`);
}
(function semTravessao(v, caminho) {
  if (typeof v === 'string') {
    if (/[—–]|--/.test(v)) erros.push(`travessão ou hífen duplo em ${caminho}: ${v.slice(0, 80)}`);
  } else if (Array.isArray(v)) v.forEach((x, i) => semTravessao(x, `${caminho}[${i}]`));
  else if (v && typeof v === 'object') Object.entries(v).forEach(([k, x]) => semTravessao(x, `${caminho}.${k}`));
})(DADOS, 'DADOS');

const css = ler('src/estilo.css');
const corpo = ler('src/corpo.html');
const js = ler('src/busca.js') + '\n' + ler('src/app.js');
if (/[—–]|--/.test(corpo)) erros.push('travessão ou hífen duplo em src/corpo.html');
if (/[—–]|--/.test(js)) erros.push('travessão ou hífen duplo no JavaScript');
if (/[—–]/.test(css)) erros.push('travessão no CSS');
if (erros.length) {
  console.error(erros.join('\n'));
  process.exit(1);
}

// ------------------------------------------------------------------ montagem

const json = JSON.stringify(DADOS).replace(/</g, '\\u003c').replace(/ | /g, ' ');
const TITULO = 'Consulta de Audiência Teles & Ramos';
const cabeca = [
  `<title>${TITULO.replace('&', '&amp;')}</title>`,
  '<meta name="claude:viewport-fit-sides" content="cover">',
  '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap">',
  `<style>\n${css}\n</style>`,
].join('\n');
const miolo = `${corpo}\n<script type="application/json" id="dados">${json}</script>\n<script>\n${js}\n</script>\n`;

fs.mkdirSync(path.join(RAIZ, 'dist'), { recursive: true });
fs.writeFileSync(path.join(RAIZ, 'dist/artefato.html'), `${cabeca}\n${miolo}`);
fs.writeFileSync(path.join(RAIZ, 'dist/dados.json'), JSON.stringify(DADOS, null, 1));
fs.writeFileSync(path.join(RAIZ, 'index.html'), [
  '<!doctype html>', '<html lang="pt-BR">', '<head>', '<meta charset="utf-8">',
  '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">',
  '<style>:root{color-scheme:light}body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>',
  cabeca, '</head>', '<body>', miolo, '</body>', '</html>', '',
].join('\n'));

const porCat = {};
fichas.forEach((f) => { porCat[f.categoria] = (porCat[f.categoria] || 0) + 1; });
console.log(`fichas: ${fichas.length}`, porCat);
console.log(`trechos de texto integral: ${textos.length}`);
console.log(`artefato: ${(fs.statSync(path.join(RAIZ, 'dist/artefato.html')).size / 1024).toFixed(0)} KB`);
