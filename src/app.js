/* Interface do sistema de consulta de audiência. */
(function () {
  'use strict';

  var DADOS = JSON.parse(document.getElementById('dados').textContent);
  var motor = Busca.criar(DADOS);
  var $ = function (id) { return document.getElementById(id); };
  var TELAS = ['busca', 'audiencia', 'perguntas', 'anotacoes', 'cronometro'];
  var LIMITE = 20 * 60 * 1000;
  var AVISO = 15 * 60 * 1000;

  // ===== memória
  var memoria = {};
  function ler(chave, padrao) {
    try {
      var v = window.localStorage.getItem('tr-aud:' + chave);
      if (v !== null) return JSON.parse(v);
    } catch (e) { /* segue em memória */ }
    return Object.prototype.hasOwnProperty.call(memoria, chave) ? memoria[chave] : padrao;
  }
  function gravar(chave, valor) {
    memoria[chave] = valor;
    try { window.localStorage.setItem('tr-aud:' + chave, JSON.stringify(valor)); return true; } catch (e) { return false; }
  }

  var E = {
    tela: 'busca',
    q: '',
    atalho: null,
    limite: 20,
    parte: ler('parte', 0),
    aberta: ler('parte', 0) || 1,
    pessoa: ler('pessoa', 'mariana'),
    feitas: ler('feitas', {}),
    crono: ler('crono', { rodando: false, inicio: 0, acumulado: 0, a15: false, a20: false }),
  };
  var copias = [];

  // ===== utilidades
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function marcar(texto, termos) {
    return Busca.destacar(String(texto || ''), termos).map(function (p) {
      return p.m ? '<mark>' + esc(p.t) + '</mark>' : esc(p.t);
    }).join('');
  }
  function doisDigitos(n) { return (n < 10 ? '0' : '') + n; }
  function relogio(ms, paraCima) {
    var s = paraCima && ms > 0 ? Math.ceil(ms / 1000) : Math.floor(Math.abs(ms) / 1000);
    return doisDigitos(Math.floor(s / 60)) + ':' + doisDigitos(s % 60);
  }
  function botaoCopiar(texto) {
    copias.push(texto);
    return '<button type="button" class="copiar" data-acao="copiar" data-i="' + (copias.length - 1) + '">Copiar</button>';
  }
  var tempoAviso = null;
  function avisar(msg) {
    var el = $('aviso-copia');
    el.textContent = msg;
    el.hidden = false;
    clearTimeout(tempoAviso);
    tempoAviso = setTimeout(function () { el.hidden = true; }, 1600);
  }
  function copiarTexto(texto, aoFalhar) {
    function reserva() {
      try {
        var ta = document.createElement('textarea');
        ta.value = texto;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        var ok = document.execCommand('copy');
        document.body.removeChild(ta);
        if (ok) avisar('Copiado'); else if (aoFalhar) aoFalhar();
      } catch (e) { if (aoFalhar) aoFalhar(); }
    }
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(texto).then(function () { avisar('Copiado'); }, reserva);
        return;
      }
    } catch (e) { /* cai na reserva */ }
    reserva();
  }

  // ===== cartões
  function caixaFala(rotulo, texto, termos, segunda) {
    return '<div class="fale' + (segunda ? ' segunda' : '') + '"><div class="fale-topo"><span class="fale-rotulo">' + esc(rotulo) +
      '</span>' + botaoCopiar(texto) + '</div><p class="fale-texto">' + marcar(texto, termos) + '</p></div>';
  }
  function cartao(f, termos) {
    var h = '<article class="ficha"><div class="ficha-meta"><span>' + esc(f.categoria) + '</span>' +
      (f.quem ? '<span class="quem">' + esc(f.quem) + '</span>' : '') + '</div><h3>' + marcar(f.titulo, termos) + '</h3>';
    if (f.fale_assim) h += caixaFala(f.rotulo_fala || 'FALE ASSIM', f.fale_assim, termos, false);
    (f.mais_falas || []).forEach(function (m) { h += caixaFala(m.rotulo, m.texto, termos, true); });
    if (f.explicacao) h += '<p class="exp">' + marcar(f.explicacao, termos) + '</p>';
    h += '<dl class="refs">';
    if (f.fundamento) h += '<div><dt>Fundamento</dt><dd>' + marcar(f.fundamento, termos) + '</dd></div>';
    if (f.onde_esta) h += '<div><dt>Onde está</dt><dd>' + marcar(f.onde_esta, termos) + '</dd></div>';
    h += '</dl>';
    if (f.cuidado) h += '<p class="cuidado"><strong>Cuidado</strong>' + marcar(f.cuidado, termos) + '</p>';
    return h + '</article>';
  }
  function listaCartoes(fichas, termos) {
    var h = fichas.slice(0, E.limite).map(function (f) { return cartao(f, termos); }).join('');
    if (fichas.length > E.limite) {
      h += '<button type="button" class="btn btn-claro mais" data-acao="mais">Mostrar mais ' + Math.min(20, fichas.length - E.limite) + ' fichas</button>';
    }
    return h;
  }
  function recorte(texto, termos) {
    if (texto.length <= 420) return texto;
    var partes = Busca.destacar(texto, termos);
    var pos = 0;
    for (var i = 0; i < partes.length; i += 1) { if (partes[i].m) break; pos += partes[i].t.length; }
    var ini = Math.max(0, pos - 140);
    var fim = Math.min(texto.length, ini + 420);
    return (ini > 0 ? '... ' : '') + texto.slice(ini, fim) + (fim < texto.length ? ' ...' : '');
  }

  // ===== busca
  function nomeAtalho(id) {
    for (var i = 0; i < DADOS.atalhos.length; i += 1) if (DADOS.atalhos[i].id === id) return DADOS.atalhos[i].rotulo;
    return id;
  }
  function desenharAtalhos() {
    var el = $('atalhos');
    el.className = 'atalhos' + (E.q || E.atalho ? ' compacto' : '');
    el.innerHTML = DADOS.atalhos.map(function (a) {
      return '<button type="button" data-acao="atalho" data-id="' + a.id + '" aria-pressed="' + (E.atalho === a.id) + '"><span>' + esc(a.rotulo) + '</span><small>' + motor.porAtalho(a.id).length + ' fichas</small></button>';
    }).join('');
  }
  function inicio() {
    var h = '';
    if (E.parte) {
      var p = DADOS.roteiro[E.parte - 1];
      h += '<div class="cartao-parte"><p class="titulo-bloco">Parte atual da audiência</p><h3>Parte ' + p.n + ' · ' + esc(p.titulo) +
        '</h3><p>' + esc(p.quem) + '</p><button type="button" class="btn" data-acao="ir" data-tela="audiencia">Abrir o roteiro</button></div>';
    }
    h += '<p class="titulo-bloco">Números de cabeça</p><dl class="numeros">' + DADOS.numeros.map(function (n) {
      return '<div><dt>' + esc(n[0]) + '</dt><dd>' + esc(n[1]) + '</dd></div>';
    }).join('') + '</dl>';
    h += '<p class="apoio">' + DADOS.fichas.length + ' fichas e o texto integral dos documentos. A busca funciona sem internet depois de aberta.</p>';
    return h;
  }
  function desenharBusca() {
    copias = [];
    desenharAtalhos();
    $('btn-limpar').hidden = !(E.q || E.atalho);
    var alvo = $('resultados');
    if (E.atalho) {
      var lista = motor.porAtalho(E.atalho);
      alvo.innerHTML = '<div class="cabecalho-res"><span><strong>' + esc(nomeAtalho(E.atalho)) + '</strong> · ' + lista.length + ' fichas</span></div>' + listaCartoes(lista, []);
      return;
    }
    if (!E.q.trim()) { alvo.innerHTML = inicio(); return; }
    var r = motor.consultar(E.q, { limiteTextos: 25 });
    var h = '';
    if (r.vazio) { alvo.innerHTML = inicio(); return; }
    if (r.fichas.length) {
      var info = '<strong>' + r.fichas.length + '</strong> ' + (r.fichas.length === 1 ? 'ficha' : 'fichas');
      if (r.corrigido) info += ' · mostrando resultados para <strong>' + esc(r.corrigido) + '</strong>';
      if (r.parcial) info += ' · resultado aproximado';
      if (r.extras.length) info += ' · inclui ' + esc(r.extras.join(', '));
      h += '<div class="cabecalho-res"><span>' + info + '</span></div>' + listaCartoes(r.fichas, r.termos);
    } else {
      h += '<div class="nao-consta"><h3>' + (r.totalTextos ? 'Não há ficha pronta para isso' : 'Não consta na base') + '</h3>';
      if (r.totalTextos) h += '<p>O termo aparece no texto integral dos documentos. Veja os trechos abaixo.</p>';
      if (r.proximos.length) {
        h += '<p class="titulo-bloco">Tema mais próximo</p><div class="sugestoes">' + r.proximos.map(function (f) {
          return '<button type="button" data-acao="abrir-ficha" data-id="' + esc(f.id) + '">' + esc(f.titulo) + '</button>';
        }).join('') + '</div>';
      } else {
        h += '<p>Tente outra palavra ou use os atalhos acima.</p>';
      }
      h += '</div>';
    }
    if (r.totalTextos) {
      h += '<div class="trechos"><p class="titulo-bloco">No texto completo · ' + r.totalTextos + (r.totalTextos === 1 ? ' trecho' : ' trechos') +
        (r.totalTextos > r.textos.length ? ' (mostrando ' + r.textos.length + ')' : '') + '</p>';
      h += r.textos.map(function (t) {
        return '<div class="trecho"><p class="trecho-ref">' + esc(t.ref) + ' · ' + esc(t.doc) + '</p>' +
          (t.sec ? '<p class="trecho-sec">' + esc(t.sec.length > 110 ? t.sec.slice(0, 110) + '...' : t.sec) + '</p>' : '') +
          '<p>' + marcar(recorte(t.texto, r.termos), r.termos) + '</p></div>';
      }).join('') + '</div>';
    }
    alvo.innerHTML = h;
  }
  var espera = null;
  function aoDigitar() {
    E.q = $('busca').value;
    E.atalho = null;
    E.limite = 20;
    if (E.tela !== 'busca') irPara('busca');
    clearTimeout(espera);
    espera = setTimeout(desenharBusca, 70);
  }

  // ===== audiência
  function desenharAudiencia() {
    copias = [];
    $('linha').innerHTML = DADOS.roteiro.map(function (p) {
      var atual = E.parte === p.n;
      var aberta = E.aberta === p.n;
      var h = '<li class="parte' + (atual ? ' atual' : '') + '"><button type="button" class="parte-topo" data-acao="abrir-parte" data-n="' + p.n +
        '" aria-expanded="' + aberta + '"><span class="parte-n">' + p.n + '</span><span class="parte-titulo">' +
        esc(p.titulo) + (atual ? '<span class="selo-atual">Atual</span>' : '') + '</span><span class="parte-quem">' + esc(p.quem) + '</span></button>';
      if (aberta) {
        h += '<div class="parte-corpo"><p><strong>' + esc(p.resumo) + '</strong></p>';
        if (p.juiz) h += '<div class="juiz"><b>O juiz, no roteiro da professora</b>' + esc(p.juiz) + '</div>';
        if (p.esperado) h += '<div class="juiz"><b>O que esperar</b>' + esc(p.esperado) + '</div>';
        h += '<ul>' + p.fazer.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>';
        p.falas.forEach(function (f, i) { h += caixaFala(f.rotulo.toUpperCase() + ' · ' + f.quem.toUpperCase(), f.texto, [], i > 0); });
        if (p.ver.length) {
          h += '<div class="ver">' + p.ver.map(function (v) {
            return '<button type="button" data-acao="ver" data-pessoa="' + (v.pessoa || '') + '" data-tela="' + (v.tela || '') + '" data-atalho="' + (v.atalho || '') + '">' + esc(v.r) + '</button>';
          }).join('') + '</div>';
        }
        h += '<p class="p-det">' + esc(p.apostila) + '</p><div class="linha-botoes">';
        h += atual
          ? (p.n < 8 ? '<button type="button" class="btn" data-acao="parte-atual" data-n="' + (p.n + 1) + '">Avançar para a Parte ' + (p.n + 1) + '</button>' : '')
          : '<button type="button" class="btn" data-acao="parte-atual" data-n="' + p.n + '">Marcar como parte atual</button>';
        h += '</div></div>';
      }
      return h + '</li>';
    }).join('');
  }

  // ===== perguntas
  function pessoaAtual() {
    for (var i = 0; i < DADOS.pessoas.length; i += 1) if (DADOS.pessoas[i].id === E.pessoa) return DADOS.pessoas[i];
    return DADOS.pessoas[0];
  }
  function desenharPerguntas() {
    copias = [];
    $('pessoas').innerHTML = DADOS.pessoas.map(function (p) {
      return '<button type="button" data-acao="pessoa" data-id="' + p.id + '" aria-pressed="' + (p.id === E.pessoa) + '">' + esc(p.nome) + '</button>';
    }).join('');
    var p = pessoaAtual();
    var h = '<div><h3>' + esc(p.nome) + '</h3><p class="apoio">' + esc(p.papel) + ' · quem conduz: ' + esc(p.quem) + ' · Parte ' + p.parte + '</p></div>';
    h += '<p>' + esc(p.intro) + '</p>';
    if (p.avisos.length) h += '<ul class="avisos">' + p.avisos.map(function (a) { return '<li>' + esc(a) + '</li>'; }).join('') + '</ul>';
    if (p.fala) h += caixaFala(p.fala.rotulo.toUpperCase() + ' · ' + p.fala.quem.toUpperCase(), p.fala.texto, [], false);
    p.blocos.forEach(function (b) {
      var defesa = b.tipo === 'defesa';
      var feitas = b.itens.filter(function (it) { return E.feitas[p.id + '-' + it.cod]; }).length;
      h += '<p class="titulo-bloco">' + esc(b.titulo) + (defesa ? ' · ' + feitas + ' de ' + b.itens.length + ' feitas' : '') + '</p>';
      b.itens.forEach(function (it) {
        var chave = p.id + '-' + it.cod;
        var feita = !!E.feitas[chave];
        var idc = 'chk-' + chave;
        h += '<div class="pergunta' + (feita ? ' feita' : '') + '">';
        h += defesa
          ? '<input type="checkbox" id="' + idc + '" data-chave="' + chave + '"' + (feita ? ' checked' : '') + ' aria-label="Já perguntei ' + esc(it.cod) + '">'
          : '<span></span>';
        h += '<div><p class="p-cod">' + esc(it.cod) + (it.provocativa ? '<span class="prov">Provocativa</span>' : '') + (defesa && feita ? ' · já perguntei' : '') + '</p>';
        h += defesa ? '<label class="p-texto" for="' + idc + '">' + esc(it.texto) + '</label>' : '<span class="p-texto">' + esc(it.texto) + '</span>';
        if (it.resposta) h += '<p class="p-resp"><b>' + (defesa ? 'Resposta esperada: ' : 'Resposta combinada: ') + '</b>' + esc(it.resposta) + '</p>';
        var det = [];
        if (it.objetivo) det.push('<b>Objetivo:</b> ' + esc(it.objetivo));
        if (it.fonte) det.push('<b>Fonte:</b> ' + esc(it.fonte));
        if (it.nota) det.push('<b>Atenção:</b> ' + esc(it.nota));
        det.push('Apostila p. ' + it.pagina);
        h += '<p class="p-det">' + det.join(' · ') + '</p></div></div>';
      });
    });
    h += '<div class="linha-botoes"><button type="button" class="btn btn-claro" data-acao="limpar-feitas" id="btn-limpar-feitas">Desmarcar esta lista</button></div>';
    $('lista-perguntas').innerHTML = h;
  }

  // ===== anotações
  var NOTAS = [['nota-mp', 'O MP DISSE'], ['nota-tec', 'TÉCNICOS DISSERAM'], ['nota-filhos', 'FILHOS DISSERAM'], ['nota-contra', 'CONTRADIÇÕES DA AUTORA']];
  function carregarNotas() {
    var salvas = ler('notas', {});
    NOTAS.forEach(function (n) { $(n[0]).value = salvas[n[0]] || ''; });
  }
  function salvarNotas() {
    var o = {};
    NOTAS.forEach(function (n) { o[n[0]] = $(n[0]).value; });
    var ok = gravar('notas', o);
    $('aviso-salvo').textContent = ok
      ? 'Salvas neste aparelho enquanto você digita.'
      : 'Este navegador não deixou salvar. As anotações ficam só enquanto a página estiver aberta.';
  }
  function textoNotas() {
    return 'ANOTAÇÕES DA AUDIÊNCIA · ' + DADOS.meta.caso + '\n\n' + NOTAS.map(function (n) {
      return n[1] + '\n' + ($(n[0]).value.trim() || '(sem anotação)');
    }).join('\n\n');
  }

  // ===== cronômetro
  var audio = null;
  var trava = null;
  var passo = null;
  function decorrido() {
    var c = E.crono;
    return c.acumulado + (c.rodando ? Date.now() - c.inicio : 0);
  }
  function bip(vezes) {
    try {
      if (!audio) return;
      for (var i = 0; i < vezes; i += 1) {
        var o = audio.createOscillator();
        var g = audio.createGain();
        o.frequency.value = 880;
        o.connect(g);
        g.connect(audio.destination);
        var t = audio.currentTime + i * 0.45;
        g.gain.setValueAtTime(0.25, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
        o.start(t);
        o.stop(t + 0.36);
      }
    } catch (e) { /* sem som */ }
    try { if (navigator.vibrate) navigator.vibrate(vezes > 2 ? [400, 150, 400, 150, 400] : [300, 150, 300]); } catch (e2) { /* sem vibração */ }
  }
  function alerta(texto, vezes) {
    $('alerta-texto').textContent = texto;
    $('alerta').hidden = false;
    bip(vezes);
  }
  function desenharCrono() {
    var d = decorrido();
    var c = E.crono;
    var resta = LIMITE - d;
    var caixa = $('relogio');
    caixa.className = 'relogio' + (d >= LIMITE ? ' fim' : d >= AVISO ? ' aviso' : '');
    $('relogio-rotulo').textContent = d >= LIMITE ? 'Tempo esgotado, excedente' : d >= AVISO ? 'Faltam menos de 5 minutos' : 'Tempo restante';
    $('relogio-tempo').textContent = (resta < 0 ? '+' : '') + relogio(resta, true);
    $('relogio-sub').textContent = 'Decorrido ' + relogio(d) + ' de 20:00';
    $('trilho-cheio').style.width = Math.min(100, (d / LIMITE) * 100) + '%';
    $('btn-crono').textContent = c.rodando ? 'Pausar' : d > 0 ? 'Continuar' : 'Iniciar';
    if (c.rodando && d >= AVISO && !c.a15) { c.a15 = true; gravar('crono', c); alerta('15 minutos. Faltam 5.', 2); }
    if (c.rodando && d >= LIMITE && !c.a20) { c.a20 = true; gravar('crono', c); alerta('20 minutos. Tempo esgotado.', 4); }
    desenharStatus();
  }
  function ligarPasso() {
    clearInterval(passo);
    if (E.crono.rodando) passo = setInterval(desenharCrono, 250);
  }
  function pedirTela() {
    try {
      if (navigator.wakeLock && E.crono.rodando) {
        navigator.wakeLock.request('screen').then(function (t) { trava = t; }, function () {});
      }
    } catch (e) { /* sem trava de tela */ }
  }
  function alternarCrono() {
    var c = E.crono;
    try {
      if (!audio) {
        var Ctx = window.AudioContext || window.webkitAudioContext;
        if (Ctx) audio = new Ctx();
      }
      if (audio && audio.state === 'suspended') audio.resume();
    } catch (e) { /* sem som */ }
    if (c.rodando) {
      c.acumulado = decorrido();
      c.rodando = false;
      try { if (trava) trava.release(); } catch (e2) { /* nada */ }
    } else {
      c.inicio = Date.now();
      c.rodando = true;
      pedirTela();
    }
    gravar('crono', c);
    ligarPasso();
    desenharCrono();
  }
  function zerarCrono() {
    E.crono = { rodando: false, inicio: 0, acumulado: 0, a15: false, a20: false };
    gravar('crono', E.crono);
    ligarPasso();
    desenharCrono();
  }

  // ===== status e navegação
  function desenharStatus() {
    var h = '';
    if (E.parte) {
      var p = DADOS.roteiro[E.parte - 1];
      h += '<button type="button" class="chip" data-acao="ir" data-tela="audiencia">Parte ' + p.n + ' · ' + esc(p.titulo) + '</button>';
    }
    var d = decorrido();
    if (d > 0) {
      var resta = LIMITE - d;
      h += '<button type="button" class="chip' + (d >= AVISO ? ' cheio' : '') + '" data-acao="ir" data-tela="cronometro">Alegações ' + (resta < 0 ? '+' : '') + relogio(resta, true) + '</button>';
    }
    var el = $('status');
    if (el.innerHTML !== h) el.innerHTML = h;
    el.hidden = !h;
  }
  function irPara(tela, semHash) {
    if (TELAS.indexOf(tela) < 0) tela = 'busca';
    E.tela = tela;
    TELAS.forEach(function (t) { $('tela-' + t).hidden = t !== tela; });
    Array.prototype.forEach.call($('abas').querySelectorAll('a'), function (a) {
      if (a.getAttribute('data-tela') === tela) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    if (tela === 'busca') desenharBusca();
    if (tela === 'audiencia') desenharAudiencia();
    if (tela === 'perguntas') desenharPerguntas();
    if (tela === 'cronometro') desenharCrono();
    if (!semHash) {
      try { if (location.hash !== '#' + tela) history.replaceState(null, '', '#' + tela); } catch (e) { /* sem histórico */ }
    }
    desenharStatus();
  }
  function aplicarTema(tema) {
    document.documentElement.setAttribute('data-theme', tema);
    $('btn-tema').textContent = tema === 'dark' ? 'Tema claro' : 'Tema escuro';
  }
  var armado = {};
  function confirmarEmDoisToques(botao, texto, fazer) {
    if (armado[botao.id]) {
      clearTimeout(armado[botao.id].t);
      botao.textContent = armado[botao.id].original;
      delete armado[botao.id];
      fazer();
      return;
    }
    armado[botao.id] = { original: botao.textContent, t: setTimeout(function () {
      botao.textContent = armado[botao.id].original;
      delete armado[botao.id];
    }, 4000) };
    botao.textContent = texto;
  }

  // ===== assistente (opcional)
  var perguntarAoClaude = null;
  var controle = null;
  var INSTRUCAO = 'Responda em português, em até 5 linhas, só com base no material enviado, no formato: Fale assim / Por quê / Fundamento / Onde está. Se não estiver no material, diga que não consta na base. Não use travessão.';
  function semTravessao(s) {
    var tracos = new RegExp('\\s*[' + String.fromCharCode(8212, 8211) + ']\\s*', 'g');
    return String(s).replace(tracos, ', ').replace(/-{2,}/g, ', ');
  }
  function perguntar(pergunta) {
    var saida = $('resposta-assistente');
    if (!perguntarAoClaude || !pergunta.trim()) return;
    var material = motor.relevantes(pergunta, 8).map(function (f) {
      return '[' + f.titulo + ']\nFale assim: ' + f.fale_assim + '\nExplicação: ' + f.explicacao + '\nFundamento: ' + (f.fundamento || 'não indicado') +
        '\nOnde está: ' + f.onde_esta + (f.cuidado ? '\nCuidado: ' + f.cuidado : '');
    }).join('\n\n');
    var trechos = motor.consultar(pergunta, { limiteTextos: 4 }).textos.map(function (t) { return '(' + t.ref + ') ' + t.texto.slice(0, 600); }).join('\n');
    var entrada = INSTRUCAO + '\n\nMATERIAL (fichas da base):\n' + (material || 'Nenhuma ficha encontrada.') +
      (trechos ? '\n\nTRECHOS DOS DOCUMENTOS:\n' + trechos : '') + '\n\nPERGUNTA: ' + pergunta.trim();
    try { if (controle) controle.abort(); } catch (e) { /* nada */ }
    controle = new AbortController();
    saida.hidden = false;
    saida.textContent = 'Pensando...';
    perguntarAoClaude(entrada, {
      signal: controle.signal,
      modelTier: 'quick',
      onText: function (u) { saida.textContent = semTravessao(u.text); },
    }).then(function (r) {
      saida.textContent = semTravessao(r.text);
    }, function (erro) {
      var codigo = erro && erro.code;
      if (codigo === 'cancelled') return;
      if (['not_granted', 'sampling_disabled', 'not_declared', 'capability_disabled', 'capability_removed'].indexOf(codigo) >= 0) {
        $('assistente').hidden = true;
        perguntarAoClaude = null;
        return;
      }
      saida.textContent = 'Sem resposta do assistente agora. Use os resultados da busca.';
    });
  }
  try {
    if (window.claude && typeof window.claude.use === 'function') {
      window.claude.use('sample').then(function (s) {
        if (!s) return;
        perguntarAoClaude = s;
        $('assistente').hidden = false;
      }, function () {});
    }
  } catch (e) { /* sem assistente: a busca local segue funcionando */ }

  // ===== eventos
  $('busca').addEventListener('input', aoDigitar);
  $('busca').addEventListener('keydown', function (ev) {
    if (ev.key === 'Escape') { $('busca').value = ''; aoDigitar(); }
    if (ev.key === 'Enter') $('busca').blur();
  });
  $('assistente').addEventListener('submit', function (ev) {
    ev.preventDefault();
    perguntar($('pergunta-assistente').value || E.q);
  });
  NOTAS.forEach(function (n) { $(n[0]).addEventListener('input', salvarNotas); });
  document.addEventListener('change', function (ev) {
    var chave = ev.target.getAttribute && ev.target.getAttribute('data-chave');
    if (!chave) return;
    if (ev.target.checked) E.feitas[chave] = 1; else delete E.feitas[chave];
    gravar('feitas', E.feitas);
    desenharPerguntas();
  });
  document.addEventListener('click', function (ev) {
    var aba = ev.target.closest && ev.target.closest('.abas a');
    if (aba) { ev.preventDefault(); irPara(aba.getAttribute('data-tela')); window.scrollTo(0, 0); return; }
    var b = ev.target.closest && ev.target.closest('[data-acao]');
    if (!b) return;
    var acao = b.getAttribute('data-acao');
    if (acao === 'copiar') {
      var caixa = b.closest('.fale');
      copiarTexto(copias[Number(b.getAttribute('data-i'))] || '', function () {
        try {
          var faixa = document.createRange();
          faixa.selectNodeContents(caixa.querySelector('.fale-texto'));
          var sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(faixa);
          avisar('Texto selecionado: copie pelo menu');
        } catch (e) { /* nada */ }
      });
    } else if (acao === 'atalho') {
      var id = b.getAttribute('data-id');
      E.atalho = E.atalho === id ? null : id;
      E.q = '';
      E.limite = 20;
      $('busca').value = '';
      desenharBusca();
      window.scrollTo(0, 0);
    } else if (acao === 'limpar') {
      E.q = ''; E.atalho = null; E.limite = 20;
      $('busca').value = '';
      desenharBusca();
      $('busca').focus();
    } else if (acao === 'mais') {
      E.limite += 20;
      desenharBusca();
    } else if (acao === 'abrir-ficha') {
      var f = motor.porId(b.getAttribute('data-id'));
      if (f) { copias = []; $('resultados').innerHTML = '<div class="cabecalho-res"><span>Tema mais próximo</span></div>' + cartao(f, []); }
    } else if (acao === 'ir') {
      irPara(b.getAttribute('data-tela'));
      window.scrollTo(0, 0);
    } else if (acao === 'tema') {
      var novo = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      aplicarTema(novo);
      gravar('tema', novo);
    } else if (acao === 'abrir-parte') {
      var n = Number(b.getAttribute('data-n'));
      E.aberta = E.aberta === n ? 0 : n;
      desenharAudiencia();
    } else if (acao === 'parte-atual') {
      E.parte = Number(b.getAttribute('data-n'));
      E.aberta = E.parte;
      gravar('parte', E.parte);
      desenharAudiencia();
      desenharStatus();
    } else if (acao === 'ver') {
      if (b.getAttribute('data-pessoa')) { E.pessoa = b.getAttribute('data-pessoa'); gravar('pessoa', E.pessoa); irPara('perguntas'); }
      else if (b.getAttribute('data-atalho')) { E.atalho = b.getAttribute('data-atalho'); E.q = ''; $('busca').value = ''; irPara('busca'); }
      else irPara(b.getAttribute('data-tela'));
      window.scrollTo(0, 0);
    } else if (acao === 'pessoa') {
      E.pessoa = b.getAttribute('data-id');
      gravar('pessoa', E.pessoa);
      desenharPerguntas();
    } else if (acao === 'limpar-feitas') {
      confirmarEmDoisToques(b, 'Toque de novo para desmarcar', function () {
        Object.keys(E.feitas).forEach(function (k) { if (k.indexOf(E.pessoa + '-') === 0) delete E.feitas[k]; });
        gravar('feitas', E.feitas);
        desenharPerguntas();
      });
    } else if (acao === 'hora') {
      var campo = $(b.getAttribute('data-campo'));
      var agora = new Date();
      var marca = '[' + doisDigitos(agora.getHours()) + ':' + doisDigitos(agora.getMinutes()) + '] ';
      campo.value += (campo.value && !/\n$/.test(campo.value) ? '\n' : '') + marca;
      campo.focus();
      salvarNotas();
    } else if (acao === 'copiar-notas') {
      var tudo = textoNotas();
      var saida = $('notas-saida');
      saida.value = tudo;
      saida.hidden = false;
      copiarTexto(tudo, function () { saida.focus(); saida.select(); avisar('Texto selecionado: copie pelo menu'); });
    } else if (acao === 'apagar-notas') {
      confirmarEmDoisToques(b, 'Toque de novo para apagar tudo', function () {
        NOTAS.forEach(function (x) { $(x[0]).value = ''; });
        $('notas-saida').hidden = true;
        salvarNotas();
      });
    } else if (acao === 'crono-iniciar') {
      alternarCrono();
    } else if (acao === 'crono-zerar') {
      confirmarEmDoisToques(b, 'Toque de novo para zerar', zerarCrono);
    } else if (acao === 'fechar-alerta') {
      $('alerta').hidden = true;
    }
  });
  window.addEventListener('hashchange', function () { irPara(location.hash.slice(1), true); });
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) { pedirTela(); desenharCrono(); }
  });

  // ===== partida
  aplicarTema(ler('tema', 'light'));
  carregarNotas();
  ligarPasso();
  desenharCrono();
  irPara(location.hash.slice(1) || 'busca', true);
  setTimeout(function () { motor.prepararTextos(); }, 50);
  try { if (window.matchMedia('(min-width: 900px)').matches) $('busca').focus(); } catch (e) { /* sem foco */ }
})();
