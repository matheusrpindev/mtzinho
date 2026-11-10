// Perguntas por pessoa (capítulos 3, 5 e 6 da apostila).
// blocos.tipo: 'defesa' = perguntas que a defesa faz (com caixinha "já perguntei");
//              'ref'    = perguntas de outros e a resposta combinada (consulta).
// item: cod, t pergunta, obj objetivo, fonte, nota, prov (provocativa), resp resposta esperada, pg página da apostila, k palavras.
export default [
  {
    id: 'mariana', nome: 'Mariana', papel: 'Autora, depoimento pessoal', quem: 'Marcos', cat: 'Mariana', atalho: 'mariana', parte: 3,
    intro: 'Formato da professora: "Sra. Mari, é verdade que...?". As quatro primeiras desestabilizam; as do meio expõem o lado financeiro; a última fecha com o ponto mais forte.',
    avisos: [
      'Uma pergunta por vez, curta e fechada. Pausa depois de cada uma. Não discuta a resposta: "Obrigado." e siga.',
      'Não pergunte sobre faculdades mentais nem "má-fé ou manipulação". Isso vai para as alegações ou memoriais.',
    ],
    blocos: [
      {
        titulo: 'As 10 perguntas', tipo: 'defesa', itens: [
          { cod: '1', prov: true, pg: 5, t: 'Sra. Mari, a senhora ainda tem sentimentos pelo Wagner?', obj: 'Armadilha: se sim, por que um processo tão duro? Se não, por que falar de traição?', fonte: 'Doc. 06 ("vida", "te amo")', k: 'sentimentos, ama, amor' },
          { cod: '2', prov: true, pg: 5, t: 'A senhora mencionou na petição uma possível traição do Wagner. Isso ainda a machuca?', obj: 'Expor ressentimento como motor da ação.', fonte: 'PI p. 3', k: 'traição, ressentimento, mágoa' },
          { cod: '3', prov: true, pg: 5, t: 'A senhora pretende se vingar do Wagner por meio de R$ 718.700?', obj: 'Dizer o valor da causa em voz alta. Fale o número devagar.', fonte: 'PI p. 21', k: 'vingança, valor da causa, 718700' },
          { cod: '4', prov: true, pg: 5, t: 'A senhora está cobrando R$ 50 mil pelos 15 anos em que cuidou da própria casa e dos próprios filhos. A senhora vê o seu casamento como um investimento que agora quer de volta?', obj: 'O "cashback" em versão técnica.', fonte: 'PI p. 14', k: 'indenização, 50 mil, investimento, cashback, trabalho doméstico' },
          { cod: '5', prov: true, pg: 5, t: 'A assistente social encontrou a suíte do casal com cama de casal e guarda-roupa duplo. É verdade que a senhora e o Wagner ainda dividem esse quarto?', obj: 'Derrubar a narrativa de quartos separados há mais de um ano.', fonte: 'Rel. item 3; PI p. 3', nota: 'Se disser que não: "Então quem usa a suíte do casal?" e pare.', k: 'suíte, quartos separados, cama de casal' },
          { cod: '6', pg: 5, t: 'É verdade que, sobre a renda do Wagner, a senhora mesma escreveu que "não possui certeza sobre o valor"?', obj: 'Derrubar os R$ 20 mil com as palavras dela.', fonte: 'PI p. 10', k: 'renda, 20 mil, não possui certeza' },
          { cod: '7', pg: 5, t: 'É verdade que a senhora disse ao Wagner: "Não preciso do seu dinheiro. Recebi o valor do aluguel"?', obj: 'Renda própria: afasta gratuidade e alimentos.', fonte: 'Doc. 07 e Doc. 08', k: 'aluguel, não preciso do seu dinheiro, renda própria, gratuidade' },
          { cod: '8', pg: 6, t: 'É verdade que a senhora vai receber R$ 547.500 na partilha e, mesmo assim, pede R$ 4.100 de pensão por mês?', obj: 'Afastar os alimentos pelo art. 1.695 do CC (ela terá bens suficientes).', fonte: 'PI p. 8 e 11', k: 'meação, 547500, pensão, 4100, bens suficientes, 1695' },
          { cod: '9', pg: 6, t: 'É verdade que, no dia 15 de maio, os seus filhos estavam com o próprio pai e voltaram para casa no mesmo dia?', obj: 'Esvaziar a ideia de "sumiço".', fonte: 'PI p. 4; Doc. 04 e 05', k: '15 de maio, sumiço, jogo, voltaram no mesmo dia' },
          { cod: '10', prov: true, pg: 6, t: 'Sra. Mari, na sua petição a senhora disse que quem se machucou foi a Beatriz, de nove anos. Agora diz que foi o Augusto, de quinze. Qual das duas versões é a verdadeira?', obj: 'Credibilidade: duas versões para o mesmo fato.', fonte: 'PI p. 3; manifestação de 09/11; Provas aut. p. 4', nota: 'Se ela disser que o Wagner machucou o Augusto: "É verdade que a sua petição inicial não fala em nenhuma lesão do Augusto?" e pare. A Maria desmonta a versão em seguida.', k: 'duas versões, Beatriz, Augusto, erro material, troca de vítima' },
        ],
      },
      {
        titulo: 'Reserva (se sobrar tempo ou se alguma for indeferida)', tipo: 'defesa', itens: [
          { cod: 'R1', pg: 6, t: 'É verdade que a senhora acusa o Wagner de desviar uma herança cujo valor e cuja data a senhora não sabe dizer?', obj: 'O ônus da prova é dela (CPC, art. 373, I).', fonte: 'PI p. 6', k: 'herança, desvio, ônus da prova' },
          { cod: 'R2', pg: 6, t: 'É verdade que a senhora usava o cartão de crédito do Wagner no dia a dia?', obj: 'Contribuições recíprocas: enfraquece a indenização.', fonte: 'Doc. 06', k: 'cartão de crédito, indenização' },
        ],
      },
    ],
  },
  {
    id: 'tatiane', nome: 'Tatiane', papel: 'Assistente social, relatório de 06/11/2026', quem: 'Gui', cat: 'Técnicos', atalho: 'social', parte: 2,
    intro: 'Perguntas de confirmação: ela só precisa dizer que está no relatório. Leve o relatório impresso.',
    avisos: [
      'Ordem sugerida: T1, T3, T2, T4, T5. Termine nas divergências, para o ponto ficar fresco para as alegações.',
      'Só pergunte se o juiz abrir espaço.',
    ],
    blocos: [
      {
        titulo: 'Perguntas T1 a T5', tipo: 'defesa', itens: [
          { cod: 'T1', pg: 6, t: 'Sra. Tatiane, no relatório a senhora descreveu o imóvel como simples, sem corresponder à expectativa criada pelas informações patrimoniais da petição. Confirma?', obj: 'Enfraquecer a renda de R$ 20 mil e o valor de R$ 1 milhão.', fonte: 'Rel. item 3', k: 'imóvel simples, apartamento, 1 milhão' },
          { cod: 'T2', pg: 6, t: 'A senhora registrou uma suíte utilizada pelo casal, com cama de casal e guarda-roupa duplo?', obj: 'Contradiz os quartos separados.', fonte: 'Rel. item 3', k: 'suíte, cama de casal, quartos separados' },
          { cod: 'T3', pg: 6, t: 'Durante a visita, o Wagner foi entrevistado?', obj: 'Avaliação incompleta: só a autora foi ouvida.', fonte: 'Rel. itens 1 e 3', k: 'entrevistado, não foi ouvido, visita domiciliar' },
          { cod: 'T4', pg: 6, t: 'A senhora registrou uma divergência entre a petição, que fala da Beatriz, e o laudo médico, que é do Augusto?', obj: 'Confirmação técnica da falha da prova.', fonte: 'Rel. item 4', k: 'divergência, laudo, Beatriz, Augusto' },
          { cod: 'T5', pg: 6, t: 'A senhora encontrou nos autos algum documento médico em nome da Beatriz?', obj: 'Fechar o ponto: não há laudo da Beatriz.', fonte: 'Rel. item 4', k: 'documento médico da Beatriz, laudo' },
        ],
      },
    ],
  },
  {
    id: 'psicologo', nome: 'Psicólogo', papel: 'Giovani Patrick, parecer de 09/11/2026', quem: 'Gui', cat: 'Técnicos', atalho: 'psicologo', parte: 2,
    intro: 'O parecer usa só verbos no condicional ("teria", "conforme relatado") e admite que não fez avaliação própria. Objetivo: mostrar que ele repetiu a versão da autora.',
    avisos: ['Só pergunte se o juiz abrir espaço.'],
    blocos: [
      {
        titulo: 'Perguntas P1 a P7', tipo: 'defesa', itens: [
          { cod: 'P1', pg: 7, t: 'O senhor ouviu o Augusto pessoalmente? Em que data, onde e com quem presente?', obj: 'Testar o "segundo o adolescente Augusto".', fonte: 'Parecer, p. 1', k: 'ouviu o Augusto, segundo o adolescente' },
          { cod: 'P2', pg: 7, t: 'Foi escuta especializada, nos termos da Lei 13.431/2017, ou uma conversa informal?', obj: 'Fragilidade do relato.', fonte: 'Lei 13.431/2017', k: 'escuta especializada, conversa informal, 13431' },
          { cod: 'P3', pg: 7, t: 'O senhor ouviu o Wagner em algum momento?', obj: 'Avaliação unilateral.', fonte: 'Parecer psicólogo', k: 'ouviu o Wagner, unilateral' },
          { cod: 'P4', pg: 7, t: 'Seu parecer é de 9 de novembro, mesma data da manifestação da autora. Ele foi feito com base nessa manifestação?', obj: 'Ligar o parecer à troca de vítima.', fonte: 'Parecer, p. 5', k: 'mesma data, 9 de novembro, troca de vítima' },
          { cod: 'P5', pg: 7, t: 'O senhor confirma que não realizou avaliação psicológica própria, como consta do seu parecer?', obj: 'Parecer sem avaliação.', fonte: 'Parecer, p. 4', k: 'avaliação própria, sem avaliação' },
          { cod: 'P6', pg: 7, t: 'O senhor confirma que a declaração da rede municipal não permite diagnóstico nem concluir sofrimento ligado aos fatos?', obj: 'Esvaziar a prova da autora.', fonte: 'Parecer, p. 4; Provas aut. p. 8', k: 'declaração, rede municipal, diagnóstico, CRAS' },
          { cod: 'P7', pg: 7, t: 'O senhor escreve que a resistência da criança não deve ser atribuída automaticamente à influência materna. Concorda que também não deve ser atribuída automaticamente à violência paterna?', obj: 'Equilíbrio; abrir espaço para a alienação.', fonte: 'Parecer, p. 2', k: 'resistência da criança, influência materna, alienação' },
        ],
      },
    ],
  },
  {
    id: 'conselho', nome: 'Conselho Tutelar', papel: 'Ananda Martins, manifestação de 10/11/2026', quem: 'Gui', cat: 'Técnicos', atalho: 'conselho', parte: 2,
    intro: 'A manifestação é quase toda favorável. Perguntas de confirmação: ela só precisa dizer que está escrito.',
    avisos: ['Só pergunte se o juiz abrir espaço.'],
    blocos: [
      {
        titulo: 'Perguntas C1 a C6', tipo: 'defesa', itens: [
          { cod: 'C1', pg: 7, t: 'O Conselho considerou a correção da vítima como já admitida. A senhora sabe se o juízo decidiu sobre ela?', obj: 'Técnico não admite alteração da causa de pedir.', fonte: 'Manifestação, p. 1 e 5', k: 'correção da vítima, erro material, juízo decidiu' },
          { cod: 'C2', pg: 7, t: 'A senhora confirma que o laudo não indica data, mecanismo nem autor da lesão?', obj: 'Laudo compatível com a bicicleta.', fonte: 'Manifestação, p. 2; Provas aut. p. 4', k: 'laudo, mecanismo, autor da lesão, bicicleta' },
          { cod: 'C3', pg: 7, t: 'A senhora confirma que os ingressos dão suporte à versão do jogo?', obj: 'Fecha o 15 de maio.', fonte: 'Manifestação, p. 3; Doc. 05', k: 'ingressos, jogo, 15 de maio' },
          { cod: 'C4', pg: 7, t: 'O Conselho recomenda estudo com os dois genitores. O Wagner já foi ouvido por algum técnico?', obj: 'Pai nunca ouvido.', fonte: 'Manifestação, p. 4', k: 'estudo com os dois genitores, pai nunca ouvido' },
          { cod: 'C5', pg: 7, t: 'A senhora confirma que o Conselho recomenda não separar os irmãos?', obj: 'Tese da defesa.', fonte: 'Manifestação, p. 5', k: 'não separar os irmãos, vínculo fraterno' },
          { cod: 'C6', pg: 8, t: 'A senhora confirma que a supervisão das visitas só foi recomendada "caso identificada sua necessidade"?', obj: 'Afastar supervisão automática.', fonte: 'Manifestação, p. 5', k: 'supervisão, visitas supervisionadas' },
        ],
      },
    ],
  },
  {
    id: 'avo', nome: 'Testemunha da autora', papel: 'Provavelmente a avó materna', quem: 'Gui', cat: 'Testemunhas', atalho: 'testemunhas', parte: 4,
    intro: 'Contradita antes do compromisso. Depois, o contra-interrogatório.',
    avisos: ['A contradita vem depois da qualificação e antes do compromisso (CPC, art. 457, § 1º).'],
    fala: { r: 'Contradita', q: 'Gui', t: 'Excelência, a defesa contradita a testemunha, por ser mãe da autora, com fundamento no art. 447, § 2º, inciso I, do CPC. Caso Vossa Excelência entenda necessária a oitiva, requer que seja ouvida como informante, sem compromisso, nos termos dos §§ 4º e 5º.' },
    blocos: [
      {
        titulo: 'Contra-interrogatório A1 a A5', tipo: 'defesa', itens: [
          { cod: 'A1', pg: 8, t: 'É verdade que a senhora passou a morar no apartamento depois dos episódios narrados?', obj: 'Testemunho indireto.', fonte: 'PI p. 4', k: 'avó, morar no apartamento, agosto' },
          { cod: 'A2', pg: 8, t: 'É verdade que a senhora não estava presente quando a sua filha diz ter sido empurrada?', obj: 'Não presenciou.', fonte: 'PI p. 3', k: 'avó, não presenciou, empurrada' },
          { cod: 'A3', pg: 8, t: 'É verdade que a senhora também não estava quando a Beatriz caiu?', obj: 'Não presenciou.', fonte: 'PI p. 3 e 4', k: 'avó, Beatriz caiu' },
          { cod: 'A4', pg: 8, t: 'Então, o que a senhora sabe desses fatos foi a sua filha quem contou?', obj: 'Fechar: só sabe o que ouviu.', fonte: 'PI p. 3 e 4', k: 'avó, ouviu dizer, a filha contou' },
          { cod: 'A5', pg: 8, t: 'É verdade que, desde que a senhora mora lá, nunca presenciou agressão física do Wagner?', obj: 'Ausência de violência atual.', fonte: 'Rel. item 3', k: 'avó, nunca presenciou agressão' },
        ],
      },
    ],
  },
  {
    id: 'maria', nome: 'Maria', papel: 'Síndica, nossa testemunha', quem: 'Gui', cat: 'Testemunhas', atalho: 'testemunhas', parte: 4,
    intro: 'Síndica há 6 anos; mora no condomínio há 15. Viu a queda de bicicleta do Augusto em 13/06/2026. Depois do juiz, peça as perguntas complementares.',
    avisos: [
      'Ela diz que o Augusto "machucou" o braço, nunca que "quebrou". O laudo não fala em fratura.',
      'Ela não diz "pronto-socorro": a Mariana levou o filho "para ser atendido".',
    ],
    fala: { r: 'Pedir perguntas complementares', q: 'Gui', t: 'Pela ordem, Excelência, a defesa requer formular perguntas complementares à testemunha que arrolou, nos termos do art. 459 do CPC.' },
    blocos: [
      {
        titulo: 'Perguntas da defesa', tipo: 'defesa', itens: [
          { cod: 'D1', pg: 16, t: 'A senhora presenciou o acidente do Augusto?', resp: 'Sim. Eu estava na garagem e vi ele cair.', obj: 'Mostrar que o Augusto machucou o braço caindo de bicicleta, na frente dela.', k: 'acidente, bicicleta, garagem' },
          { cod: 'D2', pg: 16, t: 'Como ficou o braço dele?', resp: 'Roxo e inchado. Depois ele andou umas semanas de tipoia.', obj: 'Mostrar como ficou o braço depois da queda: roxo e inchado, depois tipoia.', k: 'braço, roxo, inchado, tipoia' },
          { cod: 'D3', pg: 16, t: 'Quem levou o Augusto ao médico?', resp: 'A mãe dele, a Mariana. Fui eu que interfonei.', obj: 'Mostrar que a própria Mariana desceu e levou o filho para ser atendido.', k: 'médico, interfonou, Mariana levou' },
          { cod: 'D4', pg: 16, t: 'Esse acidente foi registrado?', resp: 'Sim, no livro de ocorrências do condomínio.', obj: 'Mostrar que o acidente está no livro de ocorrências.', k: 'livro de ocorrências, registro' },
          { cod: 'D5', pg: 16, t: 'A senhora sabe desde quando a mãe da Sra. Mariana mora no apartamento?', resp: 'Desde agosto, pelo cadastro da portaria.', obj: 'Mostrar que a mãe da Mariana só se mudou em agosto.', k: 'avó, agosto, cadastro da portaria' },
          { cod: 'D6', pg: 16, t: 'Como a senhora vê o Wagner com os filhos?', resp: 'Um pai presente. Sempre vejo ele com as crianças.', obj: 'Mostrar que o Wagner é um pai presente.', k: 'pai presente' },
        ],
      },
      {
        titulo: 'O que ela responde ao juiz', tipo: 'ref', itens: [
          { cod: 'J1', pg: 16, t: 'A senhora conhece as partes de onde?', resp: 'Sou síndica do prédio onde eles moram há seis anos. Conheço como moradores.' },
          { cod: 'J2', pg: 16, t: 'Tem amizade com algum deles?', resp: 'Não. Trato todos os moradores do mesmo jeito.' },
          { cod: 'J3', pg: 16, t: 'O que a senhora sabe sobre os fatos?', resp: 'No dia 13 de junho, um sábado à tarde, eu estava na garagem e vi o Augusto cair de bicicleta na rampa. Ele caiu sobre o braço, que ficou roxo e inchado. Interfonei para o apartamento, a Mariana desceu e levou ele para ser atendido. Registrei no livro de ocorrências. Fora isso, nunca houve reclamação de briga ou barulho nesse apartamento.', k: 'bicicleta, 13 de junho, rampa' },
          { cod: 'J4', pg: 16, t: 'Algum vizinho já reclamou de gritos ou barulho nesse apartamento?', resp: 'Nunca. Está tudo no livro de ocorrências.', k: 'vizinho, gritos, barulho, reclamação' },
        ],
      },
      {
        titulo: 'Contra-interrogatório da advogada da Mariana', tipo: 'ref', itens: [
          { cod: 'C1', pg: 17, t: 'A senhora sabe o que acontece dentro do apartamento?', resp: 'Não. Falo do que vejo nas áreas comuns e do que está registrado.' },
          { cod: 'C2', pg: 17, t: 'A senhora é amiga do Wagner?', resp: 'Não. Conheço como conheço todos os moradores.' },
          { cod: 'C3', pg: 17, t: 'Quem pediu para a senhora vir aqui?', resp: 'O Wagner me pediu para contar o que eu sei, e estou contando.' },
          { cod: 'C4', pg: 17, t: 'Como a senhora sabe que é o mesmo machucado do laudo?', resp: 'Não sei de laudo. Sei que ele caiu na minha frente e depois andou de tipoia.', nota: 'Resposta-chave. Ela não deve tentar explicar o laudo.', k: 'mesmo machucado, laudo' },
          { cod: 'C5', pg: 17, t: 'O Augusto se machucou em outra ocasião?', resp: 'Que eu saiba, não.' },
          { cod: 'C6', pg: 17, t: 'A falta de registro prova que não houve violência?', resp: 'Não posso dizer o que aconteceu lá dentro. Posso dizer que nunca houve reclamação.' },
          { cod: 'C7', pg: 17, t: 'O que a senhora acha da Mariana?', resp: 'Sempre foi educada comigo. Não tenho nada contra ela.' },
        ],
      },
    ],
  },
  {
    id: 'jacinto', nome: 'Jacinto', papel: 'Intercessor do grupo de jovens, nossa testemunha', quem: 'Gui', cat: 'Testemunhas', atalho: 'testemunhas', parte: 4,
    intro: 'Intercessor do grupo de jovens da Paróquia Nossa Senhora do Socorro há 5 anos. Viu e ouviu a pressão da mãe sobre o Augusto. Depois do juiz, peça as perguntas complementares.',
    avisos: [
      'A roda de conversa foi aberta, em grupo. Não foi direção espiritual nem conversa particular. Isso é importante (CPC, art. 448, II).',
      'Ele não usa a expressão "alienação parental" e não diz onde o Augusto quer morar.',
    ],
    fala: { r: 'Pedir perguntas complementares', q: 'Gui', t: 'Pela ordem, Excelência, a defesa requer formular perguntas complementares à testemunha que arrolou, nos termos do art. 459 do CPC.' },
    blocos: [
      {
        titulo: 'Perguntas da defesa', tipo: 'defesa', itens: [
          { cod: 'D1', pg: 19, t: 'O pai já procurou o senhor? Para quê?', resp: 'Sim, em agosto. Queria se aproximar do filho e saber como participar mais da vida dele.', obj: 'Mostrar que o Wagner procurou se aproximar do filho.', k: 'pai procurou, agosto, se aproximar' },
          { cod: 'D2', pg: 19, t: 'O que o senhor recomendou a ele?', resp: 'O Encontro de Casais com Cristo.', obj: 'Completar o relato da conversa de agosto.', k: 'Encontro de Casais com Cristo, ECC' },
          { cod: 'D3', pg: 19, t: 'O senhor já presenciou alguma situação entre o Augusto e a mãe durante as atividades?', resp: 'Sim. Numa reunião de setembro, a mãe ligou várias vezes. Ele saiu da sala e voltou abalado.', obj: 'Contar a pressão da mãe sobre o Augusto que ele viu pessoalmente.', k: 'mãe ligou, setembro, abalado' },
          { cod: 'D4', pg: 19, t: 'Como o Augusto ficou depois disso?', resp: 'Com os olhos vermelhos. Não quis mais participar naquele dia.', obj: 'Mostrar como o Augusto ficou depois das ligações.', k: 'olhos vermelhos' },
          { cod: 'D5', pg: 19, t: 'O Augusto falou sobre isso em algum momento?', resp: 'Na roda de conversa, na frente de todos, disse que se sentia dividido e que a mãe falava que ele não podia deixá-la sozinha.', obj: 'Trazer o que o Augusto disse em voz alta: sentia-se "dividido".', k: 'roda de conversa, dividido, não podia deixá-la sozinha' },
          { cod: 'D6', pg: 19, t: 'O senhor já viu o Wagner agressivo?', resp: 'Nunca.', obj: 'Mostrar que ele nunca viu o Wagner agressivo.', k: 'agressivo' },
        ],
      },
      {
        titulo: 'O que ele responde ao juiz', tipo: 'ref', itens: [
          { cod: 'J1', pg: 18, t: 'O senhor conhece as partes de onde?', resp: 'Sou intercessor do grupo de jovens da Paróquia Nossa Senhora do Socorro e acompanho todas as reuniões. O Augusto participa há dois anos.' },
          { cod: 'J2', pg: 19, t: 'Tem amizade com algum deles?', resp: 'Não. Conheço da comunidade, como conheço os pais dos outros jovens.' },
          { cod: 'J3', pg: 19, t: 'O que o senhor sabe sobre os fatos?', resp: 'Em agosto, o Wagner me procurou depois da missa. Disse que o filho falava bem de mim e que queria se aproximar mais do Augusto. Recomendei o Encontro de Casais com Cristo. Em setembro, numa reunião de sábado, o celular do Augusto tocou várias vezes; era a mãe. Ele saiu, voltou abalado e não quis mais participar. No fim, na roda de conversa, na frente de todos, disse que se sentia dividido e que a mãe falava que ele não podia deixá-la sozinha. Nunca vi o Wagner agressivo.', k: 'missa, roda de conversa, dividido' },
        ],
      },
      {
        titulo: 'Contra-interrogatório da advogada da Mariana', tipo: 'ref', itens: [
          { cod: 'C1', pg: 19, t: 'O senhor está revelando o que um adolescente lhe confiou?', resp: 'O que um jovem me confia em oração ou em particular fica comigo, e eu não falaria aqui. O que estou contando foi dito em voz alta, na roda de conversa, na frente de todos.', nota: 'Resposta-chave. Ele deve dizer com calma e firmeza.', k: 'sigilo, confiou, direção espiritual' },
          { cod: 'C2', pg: 19, t: 'O senhor sabe o que acontece dentro da casa?', resp: 'Não. Falo do que vejo na igreja.' },
          { cod: 'C3', pg: 20, t: 'O senhor é amigo do Wagner?', resp: 'Não. Conheço da comunidade.' },
          { cod: 'C4', pg: 20, t: 'O Augusto disse que quer morar com o pai?', resp: 'Isso ele nunca disse. Disse que se sentia dividido.' },
          { cod: 'C5', pg: 20, t: 'O senhor tem certeza de que era a mãe ao telefone?', resp: 'Ele mesmo disse, quando voltou, que era a mãe.' },
          { cod: 'C6', pg: 20, t: 'Quem levava o Augusto com mais frequência?', resp: 'Os dois levavam. A mãe com mais frequência, mas o pai sempre participou.' },
          { cod: 'C7', pg: 20, t: 'O Augusto já disse que o pai não gostava do grupo?', resp: 'Ele achava que o pai não ligava muito. Mas foi justamente o pai que me procurou para se aproximar dele.' },
        ],
      },
    ],
  },
  {
    id: 'wagner', nome: 'Wagner', papel: 'Nosso cliente, respostas combinadas', quem: 'Gui', cat: 'Wagner', atalho: 'wagner', parte: 3,
    intro: 'Só o juiz e a advogada da Mariana perguntam ao Wagner. A defesa não pergunta: acompanhe se as respostas batem com o combinado e intervenha só se houver abuso.',
    avisos: [
      'Ele deve responder a todas as perguntas. Se recusar, o juiz pode considerar o fato confessado (CPC, art. 385, § 1º).',
      'Ele nunca diz "legítima defesa" nem que o braço do Augusto "quebrou".',
    ],
    fala: { r: 'Se houver abuso', q: 'Gui', t: 'Pela ordem, Excelência.' },
    blocos: [
      {
        titulo: 'Perguntas prováveis do juiz', tipo: 'ref', itens: [
          { cod: 'J1', pg: 12, t: 'O senhor concorda com o divórcio?', resp: 'Concordo, Excelência. O casamento acabou.', k: 'divórcio' },
          { cod: 'J2', pg: 12, t: 'O senhor aceita o estudo psicossocial?', resp: 'Aceito e peço que seja feito. Quero que os meus filhos sejam ouvidos por quem entende.', k: 'estudo psicossocial' },
          { cod: 'J3', pg: 12, t: 'Como é a sua rotina com os filhos?', resp: 'Conta com naturalidade: escola, jogos do Corinthians com o Augusto, a área de lazer com a Beatriz, o apoio ao EJC.', nota: 'Os detalhes devem ser combinados com ele antes.', k: 'rotina com os filhos, EJC' },
        ],
      },
      {
        titulo: 'Perguntas da advogada da Mariana', tipo: 'ref', itens: [
          { cod: 'A1', pg: 12, t: 'É verdade que o senhor empurrou a Mariana contra a parede?', resp: 'Não. Numa discussão ela veio para cima de mim, e eu segurei os braços dela para me afastar. Nunca quis machucá-la.', k: 'empurrou, parede, agressão' },
          { cod: 'A2', pg: 12, t: 'E os hematomas no braço dela?', resp: 'Eu segurei os braços dela para me afastar. Não tive intenção de machucar.', k: 'hematomas, marcas' },
          { cod: 'A3', pg: 12, t: 'É verdade que o senhor quebrou objetos para intimidá-la?', resp: 'Não. Coisas caíram na confusão da discussão. Ninguém quebrou nada de propósito.', k: 'objetos quebrados, intimidar' },
          { cod: 'A4', pg: 12, t: 'É verdade que o senhor empurrou a Beatriz?', resp: 'Não. Ela entrou de repente, esbarrou em nós dois e caiu. Não se machucou.', k: 'Beatriz, empurrou' },
          { cod: 'A5', pg: 13, t: 'Como o Augusto machucou o braço? Não foi o senhor?', resp: 'Não. Ele caiu de bicicleta na garagem do prédio, em junho. A Mariana levou ele para ser atendido.', nota: 'Pergunta-chave. A versão tem que ser idêntica à da Maria.', k: 'bicicleta, braço do Augusto, garagem' },
          { cod: 'A6', pg: 13, t: 'O senhor sumiu com as crianças e não atendeu o telefone?', resp: 'Levei os dois ao jogo do Corinthians, os ingressos estão no processo. Errei em não avisar a mãe e em não atender, e me comprometo a avisar sempre.', k: 'sumiu, jogo, não atendeu, 15 de maio' },
          { cod: 'A7', pg: 13, t: 'Os ingressos são das 10h42. Por que não avisou a mãe antes?', resp: 'Era para ser surpresa para as crianças. Errei, já reconheci.', k: 'ingressos, 10h42, surpresa' },
          { cod: 'A8', pg: 13, t: 'Quem é Pedro da Silveira, que aparece nos ingressos?', resp: 'Um amigo que tinha os lugares e me cedeu.', nota: 'Resposta sugerida. Precisa ser combinada com ele.', k: 'Pedro da Silveira, amigo' },
          { cod: 'A9', pg: 13, t: 'Camarote, com uma renda de R$ 8.500?', resp: 'Cada ingresso custou R$ 20, está impresso no ingresso. Foi cortesia de um amigo.', k: 'camarote, R$ 20, cortesia' },
          { cod: 'A10', pg: 13, t: 'É verdade que o senhor disse que ela "ia ver o que era ficar sem os filhos"?', resp: 'Não. Nunca disse isso.', k: 'ficar sem os filhos, ameaça' },
          { cod: 'A11', pg: 13, t: 'O senhor acha a terapia dos filhos uma bobagem?', resp: 'Não. Eu apoio. Até me ofereci para pagar um psicólogo particular, está na conversa juntada no processo.', k: 'terapia, bobagem, psicólogo particular' },
          { cod: 'A12', pg: 13, t: 'É verdade que o senhor ganha R$ 20 mil por mês?', resp: 'Não. Recebo pró-labore e a minha parte do lucro: em média R$ 8.500 por mês, como mostra a declaração do contador.', k: 'renda, 20 mil, 8500, DECORE' },
          { cod: 'A13', pg: 13, t: 'Mas o escritório fatura bem mais, não?', resp: 'O escritório fatura cerca de R$ 348 mil por ano, mas isso é da empresa. Paga imposto, funcionário, aluguel, software. O que sobra para mim é o que está na DECORE.', k: 'faturamento, 348 mil, escritório' },
          { cod: 'A14', pg: 13, t: 'O senhor usou a herança dela no escritório?', resp: 'Não. Nunca recebi esse dinheiro e nem sei quanto ela recebeu.', k: 'herança' },
          { cod: 'A15', pg: 13, t: 'O Civic foi comprado com dinheiro do casal?', resp: 'Comprei com o dinheiro da venda do carro que eu tinha antes de casar. Tenho os documentos.', nota: 'Atenção: os documentos da venda do carro antigo não estão nos autos. Se cobrarem, a defesa usa o pedido subsidiário.', k: 'Civic, carro, sub-rogação' },
          { cod: 'A16', pg: 13, t: 'Por que quer os filhos morando com o senhor, se o Augusto quer a mãe?', resp: 'Quero o que for melhor para eles. Peço que os dois sejam ouvidos e aceito o resultado do estudo psicossocial. Só não quero que os irmãos sejam separados.', k: 'guarda, Augusto quer a mãe, irmãos' },
          { cod: 'A17', pg: 14, t: 'O senhor teve um relacionamento fora do casamento?', resp: 'Isso não tem relação com os meus filhos. O divórcio eu já aceitei.', nota: 'Ele não entra em detalhes. Se insistirem, a defesa pede a palavra.', k: 'traição, relacionamento fora do casamento, infidelidade' },
          { cod: 'A18', pg: 14, t: 'O senhor e a Mariana ainda dividem a suíte do casal?', resp: '', nota: 'A combinar com a equipe e com a pergunta que os advogados farão à Mariana. Não consta resposta pronta na base.', k: 'suíte do casal, quartos separados' },
        ],
      },
    ],
  },
];
