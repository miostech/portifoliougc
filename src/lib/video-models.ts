import type { PlanKey } from "@/lib/plans";

export type Difficulty = "iniciante" | "intermedia" | "avancado";

export interface VideoScene {
  order: number;
  description: string;
  shot: string;
  line?: string;
}

export interface VideoModel {
  id: string; // slug
  title: string;
  niche: string;
  format: string;
  objective: string;
  difficulty: Difficulty;
  durationSeconds: number;
  onCamera: boolean;
  equipment: string[];
  minPlan: PlanKey;
  description: string;
  hook: string;
  script: string;
  scenes: VideoScene[];
  framing: string;
  lighting: string;
  editing: string;
  voiceOver: string;
  cta: string;
  caption: string;
  tips: string[];
  preview: { from: string; to: string };
}

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  iniciante: "Iniciante",
  intermedia: "Intermédio",
  avancado: "Avançado",
};

const scenes = (arr: [string, string, string?][]): VideoScene[] =>
  arr.map(([description, shot, line], i) => ({ order: i + 1, description, shot, line }));

export const VIDEO_MODELS: VideoModel[] = [
  {
    id: "unboxing-skincare-primeira-impressao",
    title: "Unboxing de skincare com primeira impressão",
    niche: "Beleza e skincare",
    format: "Unboxing",
    objective: "Gerar desejo mostrando a embalagem e a primeira reação ao produto.",
    difficulty: "iniciante",
    durationSeconds: 30,
    onCamera: true,
    equipment: ["iPhone", "Ring light"],
    minPlan: "essencial",
    description:
      "Um unboxing autêntico que combina a estética da embalagem com uma reação genuína — o formato que mais converte para marcas de beleza.",
    hook: "“Chegou o skincare mais falado do momento — será que vale o hype?”",
    script:
      "Abre segurando a caixa fechada com o gancho. Abre a embalagem devagar, mostrando os detalhes. Aplica uma pequena quantidade e reage com sinceridade. Fecha com o convite à ação.",
    scenes: scenes([
      ["Gancho com a caixa fechada", "Close no rosto e na caixa, luz frontal", "“Será que vale o hype?”"],
      ["Abertura da embalagem", "Detalhe das mãos a abrir, plano cenital"],
      ["Primeira aplicação e reação", "Close no rosto", "“Repara na textura…”"],
      ["CTA final", "Plano médio, sorriso", "“Conta se queres o review completo!”"],
    ]),
    framing: "Vertical 9:16, produto sempre no terço superior.",
    lighting: "Luz natural difusa ou ring light frontal suave.",
    editing: "Cortes rápidos na abertura, zoom no detalhe da textura.",
    voiceOver: "Chegou o skincare mais falado do momento. Abre comigo e repara na textura — no fim conta se queres o review completo.",
    cta: "Guarda este vídeo e segue para o review completo.",
    caption: "Unboxing do queridinho do momento 💜 Vale o hype? #skincare #ugc #unboxing",
    tips: [
      "Grava a abertura em dois takes para escolher a reação mais natural.",
      "Limpa a embalagem antes para evitar reflexos.",
    ],
    preview: { from: "oklch(0.7 0.14 350)", to: "oklch(0.75 0.1 20)" },
  },
  {
    id: "tutorial-maquiagem-5-passos",
    title: "Tutorial de maquilhagem em 5 passos",
    niche: "Maquiagem",
    format: "Tutorial",
    objective: "Demonstrar domínio técnico e o resultado do produto num passo a passo.",
    difficulty: "intermedia",
    durationSeconds: 45,
    onCamera: true,
    equipment: ["iPhone", "Ring light", "Tripé"],
    minPlan: "essencial",
    description:
      "Um tutorial rápido e didático que mostra o produto em uso real, com foco no antes e depois de cada passo.",
    hook: "“Maquilhagem para o dia a dia em 5 passos — o 3.º muda tudo.”",
    script:
      "Mostra o rosto sem maquilhagem. Aplica cada produto numerado com legenda. Revela o resultado final e reforça o CTA.",
    scenes: scenes([
      ["Rosto natural + gancho", "Close frontal", "“O 3.º passo muda tudo.”"],
      ["Passos 1 a 4 com legendas", "Close, cortes por passo"],
      ["Passo 5 e revelação", "Plano médio"],
      ["CTA", "Close, sorriso", "“Guarda para tentares depois!”"],
    ]),
    framing: "Vertical 9:16, rosto centrado, tripé fixo.",
    lighting: "Ring light frontal a 45°.",
    editing: "Legendas numeradas por passo, transição por corte seco.",
    voiceOver: "Maquilhagem para o dia a dia em 5 passos. Começa pela base, e repara no passo 3.",
    cta: "Guarda este tutorial para tentares em casa.",
    caption: "Rotina de maquilhagem em 5 passos 💄 Qual é o teu passo favorito? #maquiagem #tutorial #ugc",
    tips: ["Mantém o telemóvel fixo num tripé para os passos ficarem alinhados.", "Usa luz constante para não variar o tom entre cortes."],
    preview: { from: "oklch(0.68 0.16 15)", to: "oklch(0.72 0.14 350)" },
  },
  {
    id: "antes-depois-moda-styling",
    title: "Antes e depois de styling de moda",
    niche: "Moda",
    format: "Antes e depois",
    objective: "Mostrar a transformação com uma peça ou marca de roupa.",
    difficulty: "iniciante",
    durationSeconds: 20,
    onCamera: true,
    equipment: ["iPhone", "Tripé"],
    minPlan: "essencial",
    description: "Transição de look ‘antes’ para ‘depois’ que valoriza a peça e prende a atenção nos primeiros segundos.",
    hook: "“De pijama a arrasar em 3 segundos.”",
    script: "Começa com o look casual, faz a transição com um gesto e revela o look final montado com a peça em destaque.",
    scenes: scenes([
      ["Look ‘antes’ + gancho", "Plano inteiro", "“De pijama a arrasar…”"],
      ["Transição", "Corte com movimento de mão"],
      ["Look ‘depois’", "Plano inteiro, giro"],
    ]),
    framing: "Vertical 9:16, corpo inteiro, espaço acima da cabeça.",
    lighting: "Luz natural junto a uma janela.",
    editing: "Transição por bater de mão ou giro, ao ritmo da música.",
    voiceOver: "",
    cta: "Segue para mais ideias de look.",
    caption: "Transformação de look ✨ Qual preferes? #moda #ootd #ugc",
    tips: ["Marca o ponto de transição com um gesto claro.", "Mantém o mesmo enquadramento antes e depois."],
    preview: { from: "oklch(0.6 0.12 285)", to: "oklch(0.66 0.14 320)" },
  },
  {
    id: "rotina-fitness-manha",
    title: "Rotina fitness da manhã",
    niche: "Fitness",
    format: "Rotina",
    objective: "Associar o produto a um estilo de vida saudável e consistente.",
    difficulty: "intermedia",
    durationSeconds: 40,
    onCamera: true,
    equipment: ["iPhone", "Tripé", "Estabilizador"],
    minPlan: "essencial",
    description: "Uma sequência dinâmica da rotina matinal onde o produto aparece de forma natural.",
    hook: "“A rotina de 20 minutos que mudou os meus treinos.”",
    script: "Mostra o despertar, a preparação (produto em uso), o treino e o resultado/sensação final.",
    scenes: scenes([
      ["Despertar + gancho", "Plano médio", "“20 minutos que mudaram os meus treinos.”"],
      ["Preparação com o produto", "Detalhe do produto"],
      ["Treino em movimento", "Plano aberto, estabilizador"],
      ["Sensação final + CTA", "Close", "“Testa e conta o resultado!”"],
    ]),
    framing: "Vertical 9:16, planos variados.",
    lighting: "Luz natural da manhã.",
    editing: "Cortes ao ritmo, contador de tempo no ecrã.",
    voiceOver: "A rotina de 20 minutos que mudou os meus treinos — e o segredo está na preparação.",
    cta: "Guarda e testa amanhã de manhã.",
    caption: "Rotina fitness da manhã 💪 Fazes treino em jejum? #fitness #rotina #ugc",
    tips: ["Usa um estabilizador para os planos em movimento.", "Grava com boa luz natural logo cedo."],
    preview: { from: "oklch(0.62 0.14 160)", to: "oklch(0.68 0.13 200)" },
  },
  {
    id: "review-honesto-alimentacao",
    title: "Review honesto de produto alimentar",
    niche: "Alimentação",
    format: "Review",
    objective: "Construir confiança com uma opinião sincera e detalhada.",
    difficulty: "iniciante",
    durationSeconds: 35,
    onCamera: true,
    equipment: ["iPhone", "Ring light"],
    minPlan: "essencial",
    description: "Uma prova real com reação honesta — o formato que mais gera credibilidade em alimentação.",
    hook: "“Testei durante uma semana para te contar a verdade.”",
    script: "Apresenta o produto, prova, reage com sinceridade e dá um veredicto claro no final.",
    scenes: scenes([
      ["Apresentação + gancho", "Close com o produto", "“Testei uma semana para te contar a verdade.”"],
      ["Prova e reação", "Close no rosto"],
      ["Veredicto", "Plano médio", "“Recomendo? Fica até ao fim.”"],
    ]),
    framing: "Vertical 9:16, produto e rosto no enquadramento.",
    lighting: "Luz natural ou ring light suave.",
    editing: "Corta silêncios, destaca a reação.",
    voiceOver: "Testei este produto uma semana inteira para te contar a verdade — sem filtros.",
    cta: "Segue para reviews honestas sem filtros.",
    caption: "Review honesto 🍫 Aprovado ou reprovado? #review #alimentacao #ugc",
    tips: ["A reação sincera vale mais que o guião.", "Evita luz que altere a cor do alimento."],
    preview: { from: "oklch(0.7 0.13 60)", to: "oklch(0.72 0.12 40)" },
  },
  {
    id: "demonstracao-tech-3-funcoes",
    title: "Demonstração de tecnologia: 3 funções úteis",
    niche: "Tecnologia",
    format: "Demonstração",
    objective: "Mostrar o valor prático de um produto tech de forma clara.",
    difficulty: "avancado",
    durationSeconds: 50,
    onCamera: true,
    equipment: ["iPhone", "Tripé", "Microfone"],
    minPlan: "pro",
    description: "Uma demonstração objetiva com três funções que resolvem problemas reais do dia a dia.",
    hook: "“3 funções deste gadget que ninguém te mostra.”",
    script: "Enuncia o problema, demonstra cada função numerada e termina com o benefício geral.",
    scenes: scenes([
      ["Problema + gancho", "Close com o produto", "“3 funções que ninguém te mostra.”"],
      ["Funções 1 a 3", "Detalhe de ecrã/produto, legendas"],
      ["Benefício + CTA", "Plano médio", "“Vale cada cêntimo — link na bio.”"],
    ]),
    framing: "Vertical 9:16, detalhe do ecrã bem legível.",
    lighting: "Luz uniforme, sem reflexos no ecrã.",
    editing: "Zoom nas funções, legendas técnicas curtas.",
    voiceOver: "Três funções deste gadget que ninguém te mostra — e que vão poupar-te tempo todos os dias.",
    cta: "Vê o link na bio para saber mais.",
    caption: "3 funções escondidas 🤯 Já conhecias? #tech #gadget #ugc",
    tips: ["Usa microfone externo para clareza.", "Limpa o ecrã e evita reflexos na gravação."],
    preview: { from: "oklch(0.62 0.12 230)", to: "oklch(0.68 0.13 260)" },
  },
  {
    id: "storytelling-financas-primeiro-investimento",
    title: "Storytelling: o meu primeiro investimento",
    niche: "Finanças",
    format: "Storytelling",
    objective: "Criar conexão emocional apresentando uma app/serviço financeiro.",
    difficulty: "intermedia",
    durationSeconds: 45,
    onCamera: true,
    equipment: ["iPhone", "Microfone"],
    minPlan: "pro",
    description: "Uma narrativa pessoal que humaniza o produto e reduz a barreira do tema financeiro.",
    hook: "“Tinha medo de investir — até descobrir isto.”",
    script: "Conta o receio inicial, a descoberta da solução e a transformação, mostrando a app em uso.",
    scenes: scenes([
      ["Contexto + gancho", "Close, tom intimista", "“Tinha medo de investir…”"],
      ["Descoberta da app", "Detalhe do ecrã"],
      ["Transformação + CTA", "Plano médio", "“Hoje invisto todos os meses.”"],
    ]),
    framing: "Vertical 9:16, tom próximo.",
    lighting: "Luz quente e suave.",
    editing: "Ritmo mais lento, música emotiva.",
    voiceOver: "Durante anos tive medo de investir. Até que uma app simples mudou a minha relação com o dinheiro.",
    cta: "Começa pequeno — o link está na bio.",
    caption: "A minha história com o dinheiro 💸 Também tinhas medo? #financas #investir #ugc",
    tips: ["Fala como se contasses a uma amiga.", "Protege dados sensíveis no ecrã."],
    preview: { from: "oklch(0.6 0.1 160)", to: "oklch(0.64 0.12 200)" },
  },
  {
    id: "voiceover-viagens-destino",
    title: "Voice-over de viagem: um destino em 6 planos",
    niche: "Viagens",
    format: "Voice-over",
    objective: "Inspirar e posicionar uma marca de viagens ou hotelaria.",
    difficulty: "intermedia",
    durationSeconds: 30,
    onCamera: false,
    equipment: ["iPhone", "Estabilizador"],
    minPlan: "essencial",
    description: "Uma montagem cinematográfica com narração em off — ideal para quem prefere não aparecer.",
    hook: "“Se só tens 48 horas neste destino, faz isto.”",
    script: "Seis planos curtos do destino com narração que guia o espectador pela experiência.",
    scenes: scenes([
      ["Plano de chegada + gancho", "Plano aberto, movimento suave", "“Se só tens 48 horas…”"],
      ["4 planos da experiência", "Detalhes e panorâmicas"],
      ["Plano final + CTA", "Pôr do sol", "“Guarda para a próxima viagem.”"],
    ]),
    framing: "Vertical 9:16, planos estáveis.",
    lighting: "Luz natural, hora dourada.",
    editing: "Transições suaves, música ambiente.",
    voiceOver: "Se só tens 48 horas neste destino, começa pelo miradouro ao nascer do sol e termina com o pôr do sol na baía.",
    cta: "Guarda este roteiro para a próxima viagem.",
    caption: "48 horas neste paraíso 🌅 Já foste? #viagens #travel #ugc",
    tips: ["Grava planos extra para ter margem na edição.", "Estabiliza os movimentos para um look cinematográfico."],
    preview: { from: "oklch(0.68 0.13 200)", to: "oklch(0.72 0.12 230)" },
  },
  {
    id: "problema-solucao-casa-organizacao",
    title: "Problema e solução: organização em casa",
    niche: "Casa e decoração",
    format: "Problema e solução",
    objective: "Mostrar como um produto resolve um problema comum do lar.",
    difficulty: "iniciante",
    durationSeconds: 25,
    onCamera: true,
    equipment: ["iPhone", "Tripé"],
    minPlan: "essencial",
    description: "Estrutura clássica problema→solução, altamente partilhável em decoração e organização.",
    hook: "“Se a tua despensa é um caos, isto é para ti.”",
    script: "Mostra o problema (desorganização), aplica a solução (produto) e revela o resultado organizado.",
    scenes: scenes([
      ["Problema + gancho", "Plano do caos", "“Se a tua despensa é um caos…”"],
      ["Aplicação da solução", "Time-lapse da organização"],
      ["Resultado + CTA", "Plano do resultado", "“Guarda para copiar!”"],
    ]),
    framing: "Vertical 9:16, mesmo ângulo antes/depois.",
    lighting: "Luz natural uniforme.",
    editing: "Time-lapse na organização.",
    voiceOver: "Se a tua despensa é um caos, estes organizadores mudam tudo em 10 minutos.",
    cta: "Guarda este vídeo para copiares em casa.",
    caption: "Antes e depois da despensa 🧺 Precisavas disto? #organizacao #casa #ugc",
    tips: ["Usa o mesmo ângulo no antes e depois.", "Um time-lapse valoriza a transformação."],
    preview: { from: "oklch(0.7 0.08 120)", to: "oklch(0.72 0.1 160)" },
  },
  {
    id: "gravacao-ecra-produto-digital",
    title: "Gravação de ecrã: produto digital em ação",
    niche: "Produtos digitais",
    format: "Gravação de tela",
    objective: "Demonstrar uma app ou software sem precisar de aparecer.",
    difficulty: "iniciante",
    durationSeconds: 40,
    onCamera: false,
    equipment: ["Computador", "Software de edição"],
    minPlan: "essencial",
    description: "Screen recording com narração — perfeito para SaaS e produtos digitais, sem aparição.",
    hook: "“Esta ferramenta poupa-me 2 horas por dia.”",
    script: "Mostra o ecrã a resolver uma tarefa real, passo a passo, com narração clara.",
    scenes: scenes([
      ["Gancho sobre o benefício", "Screen recording", "“Poupa-me 2 horas por dia.”"],
      ["Fluxo passo a passo", "Screen recording com zoom"],
      ["Resultado + CTA", "Screen recording", "“Testa grátis — link na bio.”"],
    ]),
    framing: "Vertical 9:16 ou 1:1 conforme a plataforma.",
    lighting: "N/A (captura de ecrã).",
    editing: "Zoom nos cliques importantes, legendas de apoio.",
    voiceOver: "Esta ferramenta poupa-me duas horas por dia — deixa-me mostrar-te o fluxo completo.",
    cta: "Testa grátis pelo link na bio.",
    caption: "A ferramenta que me poupa 2h/dia ⏱️ Já conhecias? #produtividade #saas #ugc",
    tips: ["Aumenta o cursor e o zoom para leitura fácil.", "Grava o áudio à parte para melhor qualidade."],
    preview: { from: "oklch(0.6 0.12 285)", to: "oklch(0.64 0.12 250)" },
  },
  {
    id: "lista-beneficios-maternidade",
    title: "Lista de benefícios: essenciais para mães",
    niche: "Maternidade",
    format: "Lista de benefícios",
    objective: "Apresentar um produto através de uma lista prática e acolhedora.",
    difficulty: "iniciante",
    durationSeconds: 30,
    onCamera: true,
    equipment: ["iPhone", "Ring light"],
    minPlan: "essencial",
    description: "Uma lista rápida de benefícios reais, com tom próximo e acolhedor.",
    hook: "“3 coisas que só uma mãe entende sobre este produto.”",
    script: "Enumera três benefícios com exemplos reais do dia a dia, terminando com recomendação.",
    scenes: scenes([
      ["Gancho", "Close, tom próximo", "“3 coisas que só uma mãe entende.”"],
      ["Benefícios 1 a 3", "Detalhe do produto em uso"],
      ["Recomendação + CTA", "Plano médio", "“Guarda para o enxoval!”"],
    ]),
    framing: "Vertical 9:16.",
    lighting: "Luz suave e quente.",
    editing: "Legendas por benefício, ritmo calmo.",
    voiceOver: "Três coisas que só uma mãe entende sobre este produto — e por que virou essencial aqui em casa.",
    cta: "Guarda para o teu enxoval.",
    caption: "Essenciais para mães 🤍 O que acrescentavas? #maternidade #maes #ugc",
    tips: ["Mostra o produto em uso real com o bebé.", "Tom acolhedor gera mais partilhas."],
    preview: { from: "oklch(0.74 0.08 40)", to: "oklch(0.76 0.07 20)" },
  },
  {
    id: "gancho-viral-bem-estar",
    title: "Gancho viral: rotina de bem-estar",
    niche: "Bem-estar",
    format: "Gancho viral",
    objective: "Maximizar retenção nos primeiros segundos com um gancho forte.",
    difficulty: "avancado",
    durationSeconds: 20,
    onCamera: true,
    equipment: ["iPhone", "Ring light"],
    minPlan: "pro",
    description: "Foco total no gancho e na retenção — estrutura pensada para viralizar.",
    hook: "“Faz isto 30 segundos por dia e agradeces-me depois.”",
    script: "Gancho impactante, demonstração rápida do hábito com o produto e loop para reter.",
    scenes: scenes([
      ["Gancho impactante", "Close, energia alta", "“Faz isto 30 segundos por dia…”"],
      ["Demonstração rápida", "Cortes dinâmicos"],
      ["Loop/CTA", "Close", "“Segue para não esqueceres.”"],
    ]),
    framing: "Vertical 9:16, rosto próximo.",
    lighting: "Ring light frontal.",
    editing: "Cortes muito rápidos, texto grande no ecrã.",
    voiceOver: "Faz isto 30 segundos por dia e agradeces-me depois — é o hábito mais subestimado do bem-estar.",
    cta: "Segue para não te esqueceres deste hábito.",
    caption: "O hábito de 30 segundos 🌿 Vais testar? #bemestar #wellness #ugc",
    tips: ["Grava vários ganchos e escolhe o mais forte nos testes.", "Texto grande melhora a retenção sem som."],
    preview: { from: "oklch(0.66 0.12 160)", to: "oklch(0.7 0.11 140)" },
  },
];

export function getVideoModel(id: string): VideoModel | undefined {
  return VIDEO_MODELS.find((m) => m.id === id);
}

// Filter facets derived from the catalog.
export const MODEL_NICHES = Array.from(new Set(VIDEO_MODELS.map((m) => m.niche)));
export const MODEL_FORMATS = Array.from(new Set(VIDEO_MODELS.map((m) => m.format)));
