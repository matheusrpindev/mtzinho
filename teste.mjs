// Testes do final do prompt: node teste.mjs (depois de node build.mjs)
import fs from 'node:fs';
import { createRequire } from 'node:module';
const Busca = createRequire(import.meta.url)('./src/busca.js');
const dados = JSON.parse(fs.readFileSync(new URL('./dist/dados.json', import.meta.url), 'utf8'));
const motor = Busca.criar(dados);
const casos = [
  ['renda', ['8.500', 'Doc. 01']],
  ['erro material', ['329, II', 'não consente']],
  ['bicicleta', ['13 de junho de 2026', 'Maria']],
  ['memoriais', ['364, § 2º', 'Parte 7']],
  ['avo', ['contradita', '447, § 2º, I']],
  ['pedro silveira', ['amigo', 'cedeu']],
  ['1695', ['bens suficientes', 'Mariana']],
  ['suspeicao', ['não vai arguir']],
  ['residencia paterna', ['também seja ouvido e avaliado']],
  ['jogo', ['15/05', 'Corinthians x Palmeiras', 'Doc. 04 e 05']],
];
let falhas = 0;
casos.forEach(([q, esperado], i) => {
  const r = motor.consultar(q);
  const f = r.fichas[0];
  const tudo = f ? JSON.stringify(f) : '';
  const faltou = esperado.filter((e) => !tudo.includes(e));
  if (faltou.length) falhas += 1;
  console.log(`${faltou.length ? 'FALHOU' : 'ok    '} ${i + 1}. "${q}" -> ${f ? f.id + ' | ' + f.titulo : 'nada'}${faltou.length ? ' | faltou: ' + faltou.join('; ') : ''}`);
});
for (const q of ['pensao', 'promotora', 'bicicleat', 'cachorro', 'laudo', 'hipossuficiência']) {
  const r = motor.consultar(q);
  console.log(`   "${q}": ${r.fichas.length} fichas, ${r.totalTextos} trechos, corrigido=${r.corrigido}, 1o=${r.fichas[0] ? r.fichas[0].id : '-'}, proximos=${r.proximos.map((p) => p.id)}`);
}
process.exit(falhas ? 1 : 0);
