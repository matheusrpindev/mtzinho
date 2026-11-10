/* Motor de busca local. Sem dependências. Funciona no navegador e no Node (testes). */
var Busca = (function () {
  'use strict';

  var STOP = {};
  ('a o e de do da dos das em no na nos nas um uma que para por com se os as ao aos ' +
   'qual quais como onde quando sobre art arts artigo artigos').split(' ').forEach(function (w) { STOP[w] = 1; });

  var RE_PALAVRA = /[0-9]+(?:\.[0-9]{3})+|[\p{L}\p{N}]+/gu;

  function semAcento(s) {
    return s.normalize('NFD').replace(/[̀-ͯ]/g, '');
  }

  // Reduz plural simples para que "ingressos" ache "ingresso" e "pensões" ache "pensão".
  function radical(w) {
    if (/^\d/.test(w)) return w;
    var n = w.length;
    if (n > 4 && w.slice(-3) === 'oes') return w.slice(0, -3) + 'ao';
    if (n > 4 && w.slice(-3) === 'aes') return w.slice(0, -3) + 'ao';
    if (n > 3 && w.slice(-2) === 'ns') return w.slice(0, -2) + 'm';
    if (n > 3 && w.slice(-1) === 's' && w.slice(-2) !== 'ss') return w.slice(0, -1);
    return w;
  }

  function normPalavra(bruta) {
    var w = semAcento(bruta.toLowerCase()).replace(/[^a-z0-9]/g, '');
    if (/^\d+$/.test(w)) w = w.replace(/^0+(?=\d)/, '');
    return radical(w);
  }

  function tokens(texto) {
    var out = [];
    var m = String(texto || '').match(RE_PALAVRA);
    if (!m) return out;
    for (var i = 0; i < m.length; i += 1) {
      var w = normPalavra(m[i]);
      if (w) out.push(w);
    }
    return out;
  }

  function campo(texto) {
    return ' ' + tokens(texto).join(' ') + ' ';
  }

  function aceitaPrefixo(tok) {
    return tok.length >= 3;
  }

  // 1 = palavra inteira, 0.7 = começo de palavra, 0 = não tem.
  function casa(campoNorm, tok) {
    if (campoNorm.indexOf(' ' + tok + ' ') >= 0) return 1;
    if (aceitaPrefixo(tok) && campoNorm.indexOf(' ' + tok) >= 0) return 0.7;
    return 0;
  }

  function levenshtein(a, b, max) {
    if (Math.abs(a.length - b.length) > max) return max + 1;
    var ant = [];
    var j;
    for (j = 0; j <= b.length; j += 1) ant[j] = j;
    for (var i = 1; i <= a.length; i += 1) {
      var atual = [i];
      var menor = i;
      for (j = 1; j <= b.length; j += 1) {
        var custo = a.charCodeAt(i - 1) === b.charCodeAt(j - 1) ? 0 : 1;
        var v = Math.min(ant[j] + 1, atual[j - 1] + 1, ant[j - 1] + custo);
        if (i > 1 && j > 1 && a.charCodeAt(i - 1) === b.charCodeAt(j - 2) && a.charCodeAt(i - 2) === b.charCodeAt(j - 1)) {
          v = Math.min(v, ant2[j - 2] + 1); // letras trocadas de lugar
        }
        atual[j] = v;
        if (v < menor) menor = v;
      }
      if (menor > max) return max + 1;
      var ant2 = ant;
      ant = atual;
    }
    return ant[b.length];
  }

  function criar(dados) {
    var PESOS = [
      ['titulo', 10], ['palavras', 8], ['fundamento', 5], ['fale', 3], ['onde', 3],
      ['explicacao', 2], ['categoria', 2], ['cuidado', 1.5],
    ];
    var vocab = Object.create(null);
    function contar(c) {
      var ws = c.split(' ');
      for (var i = 0; i < ws.length; i += 1) if (ws[i]) vocab[ws[i]] = (vocab[ws[i]] || 0) + 1;
    }

    var fichas = dados.fichas.map(function (f, ordem) {
      var falas = [f.fale_assim].concat((f.mais_falas || []).map(function (m) { return m.texto; })).join(' ');
      var it = {
        f: f,
        ordem: ordem,
        titulo: campo(f.titulo),
        palavras: campo(f.palavras_chave.join(' ')),
        chaves: f.palavras_chave.map(campo),
        fundamento: campo(f.fundamento),
        fale: campo(falas),
        onde: campo(f.onde_esta),
        explicacao: campo(f.explicacao),
        categoria: campo(f.categoria + ' ' + (f.quem || '')),
        cuidado: campo(f.cuidado || ''),
      };
      PESOS.forEach(function (p) { contar(it[p[0]]); });
      return it;
    });

    var trechos = null;
    function prepararTextos() {
      if (trechos) return trechos;
      trechos = dados.textos.map(function (t, ordem) {
        var c = campo(t.texto);
        contar(c);
        return { t: t, ordem: ordem, c: c };
      });
      return trechos;
    }

    var grupos = (dados.sinonimos || []).map(function (g) { return g.map(tokens); });

    // Variantes da consulta trocando um termo por seus sinônimos.
    function variantes(toks) {
      var out = [{ toks: toks, fator: 1, extra: null }];
      grupos.forEach(function (g) {
        g.forEach(function (termo, gi) {
          for (var i = 0; i + termo.length <= toks.length; i += 1) {
            var igual = true;
            for (var k = 0; k < termo.length; k += 1) if (toks[i + k] !== termo[k]) { igual = false; break; }
            if (!igual) continue;
            g.forEach(function (outro, oi) {
              if (oi === gi) return;
              out.push({ toks: toks.slice(0, i).concat(outro, toks.slice(i + termo.length)), fator: 0.6, extra: outro.join(' ') });
            });
          }
        });
      });
      return out;
    }

    function significativos(toks) {
      var s = toks.filter(function (t) { return !STOP[t]; });
      return s.length ? s : toks;
    }

    function pontuar(it, toks, frase, minimo) {
      var total = 0;
      var achados = 0;
      for (var i = 0; i < toks.length; i += 1) {
        var s1 = 0;
        var s2 = 0;
        for (var p = 0; p < PESOS.length; p += 1) {
          var q = casa(it[PESOS[p][0]], toks[i]);
          if (!q) continue;
          var v = q * PESOS[p][1];
          if (v > s1) { s2 = s1; s1 = v; } else if (v > s2) s2 = v;
        }
        if (s1 > 0) { achados += 1; total += s1 + 0.5 * s2; }
      }
      if (achados < minimo) return 0;
      var bonus = 0;
      if (it.titulo.indexOf(frase) >= 0) bonus = 12;
      for (var c = 0; c < it.chaves.length; c += 1) {
        if (it.chaves[c] === frase + ' ') { bonus = Math.max(bonus, 14); break; }
        if (it.chaves[c].indexOf(frase) >= 0) bonus = Math.max(bonus, 9);
      }
      if (!bonus && toks.length > 1 && (it.fale.indexOf(frase) >= 0 || it.explicacao.indexOf(frase) >= 0)) bonus = 3;
      return total * (achados / toks.length) + bonus + it.f.peso;
    }

    function ordenar(a, b) {
      return b.pontos - a.pontos || b.it.f.peso - a.it.f.peso || a.it.ordem - b.it.ordem;
    }

    function rodar(toks, minimoDe) {
      var vs = variantes(toks);
      var extras = {};
      var res = [];
      fichas.forEach(function (it) {
        var melhor = 0;
        var via = null;
        vs.forEach(function (v) {
          var sig = significativos(v.toks);
          var frase = ' ' + v.toks.join(' ');
          var p = pontuar(it, sig, frase, minimoDe(sig.length)) * v.fator;
          if (p > melhor) { melhor = p; via = v.extra; }
        });
        if (melhor > 0) {
          if (via) extras[via] = 1;
          res.push({ it: it, pontos: melhor });
        }
      });
      res.sort(ordenar);
      return { res: res, extras: Object.keys(extras) };
    }

    // Corrige erro de digitação quando a palavra não existe em lugar nenhum.
    function corrigir(toks) {
      prepararTextos();
      var palavras = Object.keys(vocab);
      var mudou = false;
      var out = toks.map(function (tok) {
        if (STOP[tok] || tok.length < 5 || /^\d+$/.test(tok)) return tok;
        var existe = false;
        var i;
        for (i = 0; i < palavras.length; i += 1) {
          if (palavras[i].lastIndexOf(tok, 0) === 0) { existe = true; break; }
        }
        if (existe) return tok;
        var max = tok.length >= 8 ? 2 : 1;
        var melhor = null;
        for (i = 0; i < palavras.length; i += 1) {
          var w = palavras[i];
          if (w.charCodeAt(0) !== tok.charCodeAt(0) || w.length < tok.length - 1) continue;
          var d = Math.min(
            levenshtein(tok, w.slice(0, tok.length), max),
            levenshtein(tok, w.slice(0, tok.length + 1), max),
            levenshtein(tok, w.slice(0, tok.length - 1), max)
          );
          if (d > max) continue;
          var cand = { w: w, d: d, n: vocab[w] };
          if (!melhor || cand.d < melhor.d || (cand.d === melhor.d && cand.n > melhor.n)) melhor = cand;
        }
        if (melhor) { mudou = true; return melhor.w; }
        return tok;
      });
      return mudou ? out : null;
    }

    function buscarTextos(toks, limite) {
      var lista = prepararTextos();
      var vs = variantes(toks);
      var res = [];
      lista.forEach(function (tr) {
        var melhor = 0;
        vs.forEach(function (v) {
          var sig = significativos(v.toks);
          var soma = 0;
          for (var i = 0; i < sig.length; i += 1) {
            var q = casa(tr.c, sig[i]);
            if (!q) return;
            soma += q * 2;
          }
          if (sig.length > 1 && tr.c.indexOf(' ' + v.toks.join(' ')) >= 0) soma += 5;
          soma *= v.fator;
          if (soma > melhor) melhor = soma;
        });
        if (melhor > 0) res.push({ tr: tr, pontos: melhor });
      });
      res.sort(function (a, b) { return b.pontos - a.pontos || a.tr.ordem - b.tr.ordem; });
      return { total: res.length, itens: res.slice(0, limite || 30).map(function (r) { return r.tr.t; }) };
    }

    function trigramas(s) {
      var t = {};
      var x = '  ' + s + ' ';
      for (var i = 0; i < x.length - 2; i += 1) t[x.substr(i, 3)] = 1;
      return t;
    }
    function semelhanca(a, b) {
      var ta = trigramas(a);
      var tb = trigramas(b);
      var inter = 0;
      var uni = 0;
      var k;
      for (k in ta) { uni += 1; if (tb[k]) inter += 1; }
      for (k in tb) if (!ta[k]) uni += 1;
      return uni ? inter / uni : 0;
    }

    // Temas mais próximos, para quando a consulta não consta na base.
    function proximos(toks, n) {
      var sig = significativos(toks);
      var parcial = rodar(toks, function () { return 1; }).res;
      if (parcial.length) return parcial.slice(0, n).map(function (r) { return r.it.f; });
      var alvo = sig.join(' ');
      var cand = [];
      fichas.forEach(function (it) {
        var melhor = 0;
        it.chaves.concat([it.titulo]).forEach(function (c) {
          var s = semelhanca(alvo, c.trim());
          if (s > melhor) melhor = s;
        });
        if (melhor >= 0.22) cand.push({ it: it, pontos: melhor });
      });
      cand.sort(ordenar);
      return cand.slice(0, n).map(function (r) { return r.it.f; });
    }

    /**
     * Consulta principal.
     * Devolve { fichas, textos, totalTextos, termos, extras, corrigido, parcial, vazio, proximos }.
     */
    function consultar(q, opcoes) {
      var op = opcoes || {};
      var toks = tokens(q);
      var saida = { fichas: [], textos: [], totalTextos: 0, termos: [], extras: [], corrigido: null, parcial: false, vazio: !toks.length, proximos: [] };
      if (!toks.length) return saida;
      var todos = function (n) { return n; };
      var r = rodar(toks, todos);
      var tx = buscarTextos(toks, op.limiteTextos);
      if (!r.res.length && !tx.total) {
        var novo = corrigir(toks);
        if (novo) {
          var r2 = rodar(novo, todos);
          var tx2 = buscarTextos(novo, op.limiteTextos);
          if (r2.res.length || tx2.total) { r = r2; tx = tx2; toks = novo; saida.corrigido = novo.join(' '); }
        }
      }
      if (!r.res.length && significativos(toks).length >= 3) {
        var rp = rodar(toks, function (n) { return Math.max(2, Math.ceil(n * 0.6)); });
        if (rp.res.length) { r = rp; saida.parcial = true; }
      }
      saida.fichas = r.res.map(function (x) { return x.it.f; });
      saida.extras = r.extras;
      saida.textos = tx.itens;
      saida.totalTextos = tx.total;
      saida.termos = significativos(toks);
      if (!saida.fichas.length) saida.proximos = proximos(toks, 3);
      return saida;
    }

    // Fichas mais relevantes para mandar ao assistente (aceita pergunta em frase inteira).
    function relevantes(q, n) {
      var toks = tokens(q);
      if (!toks.length) return [];
      var r = rodar(toks, function (k) { return k; }).res;
      if (r.length < n) {
        var vistos = {};
        r.forEach(function (x) { vistos[x.it.f.id] = 1; });
        rodar(toks, function () { return 1; }).res.forEach(function (x) { if (!vistos[x.it.f.id]) r.push(x); });
      }
      return r.slice(0, n).map(function (x) { return x.it.f; });
    }

    function porAtalho(id) {
      return fichas
        .filter(function (it) { return it.f.atalhos.indexOf(id) >= 0; })
        .sort(function (a, b) { return b.f.peso - a.f.peso || a.ordem - b.ordem; })
        .map(function (it) { return it.f; });
    }

    function porId(id) {
      for (var i = 0; i < fichas.length; i += 1) if (fichas[i].f.id === id) return fichas[i].f;
      return null;
    }

    return { consultar: consultar, relevantes: relevantes, porAtalho: porAtalho, porId: porId, prepararTextos: prepararTextos };
  }

  // Divide o texto em pedaços marcando as palavras que casam com os termos buscados.
  function destacar(texto, termos) {
    var partes = [];
    if (!termos || !termos.length) return [{ t: texto, m: false }];
    var ultimo = 0;
    var m;
    RE_PALAVRA.lastIndex = 0;
    while ((m = RE_PALAVRA.exec(texto))) {
      var w = normPalavra(m[0]);
      var ok = false;
      for (var i = 0; i < termos.length; i += 1) {
        var t = termos[i];
        if (w === t || (aceitaPrefixo(t) && w.lastIndexOf(t, 0) === 0)) { ok = true; break; }
      }
      if (!ok) continue;
      if (m.index > ultimo) partes.push({ t: texto.slice(ultimo, m.index), m: false });
      partes.push({ t: m[0], m: true });
      ultimo = m.index + m[0].length;
    }
    if (ultimo < texto.length) partes.push({ t: texto.slice(ultimo), m: false });
    return partes;
  }

  return { criar: criar, tokens: tokens, destacar: destacar };
})();

if (typeof module !== 'undefined' && module.exports) module.exports = Busca;
