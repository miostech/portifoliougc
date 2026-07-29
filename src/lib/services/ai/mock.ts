import type {
  AIProvider,
  AssistantInput,
  AssistantResult,
  GeneratedScriptResult,
  PortfolioCopy,
  PortfolioCopyInput,
  PortfolioScoreResult,
  PortfolioSuggestion,
  ScoreCategory,
  ScoreInputPortfolio,
  ScriptInput,
  VideoMetadata,
  VideoMetadataInput,
} from "./types";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

function nicheLabel(niches: string[]): string {
  if (niches.length === 0) return "criação de conteúdo";
  if (niches.length === 1) return niches[0].toLowerCase();
  return `${niches.slice(0, -1).join(", ").toLowerCase()} e ${niches[
    niches.length - 1
  ].toLowerCase()}`;
}

/**
 * Mock AI provider. Returns coherent, realistic Portuguese content derived
 * from the inputs — never Lorem Ipsum. Deterministic where it matters
 * (scoring), varied where it helps (copy).
 */
export class MockAIProvider implements AIProvider {
  readonly name = "mock";
  readonly isMock = true;

  async generatePortfolioCopy(
    input: PortfolioCopyInput
  ): Promise<PortfolioCopy> {
    await wait(600);
    const firstName = input.fullName.split(" ")[0] || "Criadora";
    const niches = nicheLabel(input.niches);
    const local = [input.city, input.country].filter(Boolean).join(", ");

    return {
      headline: `Criadora de conteúdo UGC especializada em ${niches}`,
      professionalBio: `Sou ${input.fullName}, criadora de conteúdo UGC focada em ${niches}. Produzo vídeos autênticos que geram conexão e resultado para marcas, cuidando de tudo — do roteiro à edição.${
        local ? ` Baseada em ${local}.` : ""
      }`,
      aboutMe: `Comecei a criar conteúdo por paixão em contar histórias e hoje ajudo marcas a mostrarem os seus produtos de forma real e envolvente. Gosto de entender o objetivo de cada campanha e traduzi-lo em vídeos que parecem recomendações de uma amiga — porque é assim que o público de hoje decide o que comprar.`,
      specialties: dedupe([
        ...input.niches.slice(0, 4),
        "Vídeos verticais para Reels e TikTok",
        "Unboxing e reviews honestas",
        "Storytelling de produto",
      ]).slice(0, 6),
      brandDescription: `Se procura uma criadora que entrega conteúdo UGC autêntico, com boa comunicação e prazos cumpridos, o meu trabalho é feito para si. Trabalho lado a lado com a sua equipa para criar vídeos que convertem e representam a sua marca com cuidado.`,
      ctaPrimary: "Vamos criar algo juntos",
      ctaContact: `Fale com a ${firstName}`,
    };
  }

  async generateVideoMetadata(
    input: VideoMetadataInput
  ): Promise<VideoMetadata> {
    await wait(500);
    const product = input.product || "o produto";
    const niche = input.niche || "lifestyle";
    const format = input.format || "review";
    const titles: Record<string, string> = {
      unboxing: `Unboxing: primeira impressão de ${product}`,
      review: `Testei ${product} durante uma semana — o resultado`,
      tutorial: `Como usar ${product} no dia a dia`,
      demonstracao: `${product} em ação: o antes e depois`,
    };
    return {
      title: titles[format] ?? `${product}: a minha experiência real`,
      description: `Vídeo UGC de ${format} sobre ${product}, no nicho de ${niche}. Formato vertical, linguagem próxima e foco no benefício principal para o público.`,
      category: capitalize(niche),
      suggestedThumbnailLabel: `${capitalize(format)} · ${capitalize(niche)}`,
    };
  }

  async customizeVideoScript(
    input: ScriptInput
  ): Promise<GeneratedScriptResult> {
    await wait(800);
    const product = input.product || "o produto";
    const brand = input.brand ? ` da ${input.brand}` : "";
    const benefit = input.mainBenefit || "resolver um problema real do dia a dia";
    const onCam = input.onCamera ?? true;
    const duration = input.durationSeconds ?? 30;

    return {
      title: `${capitalize(input.objective || "Review")} de ${product}${brand}`,
      objective:
        input.objective ||
        `Apresentar ${product} destacando ${benefit} e gerar interesse de compra.`,
      hook: `"Ninguém te contou isto sobre ${product}..."`,
      script: `Abre com o gancho olhando para a câmara. Mostra ${product}${brand} em uso real, fala de ${benefit} com um exemplo concreto e termina com um convite claro à ação. Mantém o tom ${
        input.tone || "próximo e honesto"
      }.`,
      scenes: [
        {
          order: 1,
          description: "Gancho — problema ou curiosidade",
          shot: onCam ? "Close no rosto, luz natural" : "Detalhe do produto na mão",
          line: `"Ninguém te contou isto sobre ${product}..."`,
        },
        {
          order: 2,
          description: `Demonstração de ${product} em uso`,
          shot: "Plano médio, movimento suave",
          line: `"Repara no que acontece quando..."`,
        },
        {
          order: 3,
          description: `Benefício principal: ${benefit}`,
          shot: "Detalhe do resultado / antes e depois",
        },
        {
          order: 4,
          description: "CTA final",
          shot: onCam ? "Close, sorriso, direto à câmara" : "Produto + texto na tela",
          line: "Corre que o link está na bio!",
        },
      ],
      voiceOver: `Sabes aquele problema chato? Eu resolvi com ${product}${brand}. Em ${duration} segundos mostro-te como ${benefit}. Fica até ao fim.`,
      framing: "Vertical 9:16, boa iluminação frontal, foco no produto e no rosto.",
      cta: "Guarda este vídeo e vê o link na bio.",
      caption: `${product}${brand} virou queridinho aqui 💜 Conta se também queres testar! #ugc #${(
        input.niche || "lifestyle"
      ).replace(/\s+/g, "")}`,
      recordingTips: [
        "Grava em ambiente com luz natural, de manhã ou fim de tarde.",
        "Faz 2 ou 3 takes do gancho e escolhe o mais natural.",
        "Fala como se estivesses a recomendar a uma amiga.",
        "Estabiliza o telemóvel com um tripé para os planos de produto.",
      ],
    };
  }

  async calculatePortfolioScore(
    p: ScoreInputPortfolio
  ): Promise<PortfolioScoreResult> {
    await wait(400);
    const categories: ScoreCategory[] = [
      {
        key: "perfil",
        label: "Perfil",
        weight: 0.2,
        score: pct([
          p.hasPhoto,
          p.hasHeadline,
          p.hasBio,
          p.hasAboutMe,
          p.nicheCount > 0,
          p.equipmentCount > 0,
        ]),
      },
      {
        key: "conteudo",
        label: "Conteúdo",
        weight: 0.35,
        score: clamp(
          p.videoCount * 12 +
            p.formatDiversity * 10 +
            p.nicheDiversity * 6 +
            p.thumbnailQuality * 20
        ),
      },
      {
        key: "prova-social",
        label: "Prova social",
        weight: 0.25,
        score: clamp(
          p.caseCount * 18 + p.testimonialCount * 16 + p.clientCount * 12
        ),
      },
      {
        key: "conversao",
        label: "Conversão",
        weight: 0.12,
        score: pct([p.hasCta, p.contactCount > 0, p.socialCount >= 2]),
      },
      {
        key: "atualizacao",
        label: "Atualização",
        weight: 0.08,
        score: p.daysSinceUpdate <= 30 ? 100 : p.daysSinceUpdate <= 90 ? 60 : 25,
      },
    ];

    const total = Math.round(
      categories.reduce((sum, c) => sum + c.score * c.weight, 0)
    );

    const strengths: string[] = [];
    if (p.hasPhoto && p.hasHeadline) strengths.push("Perfil bem apresentado");
    if (p.videoCount >= 3) strengths.push("Boa quantidade de vídeos");
    if (p.testimonialCount > 0) strengths.push("Tem prova social");
    if (p.hasCta) strengths.push("Chamada para ação definida");
    if (strengths.length === 0) strengths.push("Bom ponto de partida");

    return {
      total,
      categories,
      strengths,
      message: scoreMessage(total),
    };
  }

  async generatePortfolioSuggestions(
    p: ScoreInputPortfolio
  ): Promise<PortfolioSuggestion[]> {
    await wait(300);
    const s: PortfolioSuggestion[] = [];
    const add = (
      cond: boolean,
      sugg: Omit<PortfolioSuggestion, "id">
    ) => {
      if (cond) s.push({ id: `sg-${s.length + 1}`, ...sugg });
    };

    add(p.videoCount < 2, {
      title: "Adicione dois vídeos de demonstração",
      description:
        "Marcas querem ver o seu trabalho. Suba pelo menos dois vídeos com boa qualidade.",
      priority: "alta",
      actionHref: "/app/conteudos",
      actionLabel: "Adicionar vídeos",
    });
    add(p.testimonialCount === 0, {
      title: "Inclua pelo menos um depoimento",
      description: "Um depoimento real aumenta muito a sua credibilidade.",
      priority: "alta",
      actionHref: "/app/conteudos",
      actionLabel: "Adicionar depoimento",
    });
    add(!p.hasCta, {
      title: "Adicione um CTA mais direto",
      description: "Diga às marcas exatamente o próximo passo para trabalhar consigo.",
      priority: "media",
      actionHref: "/app/portfolio/editor",
      actionLabel: "Editar CTA",
    });
    add(p.equipmentCount === 0, {
      title: "Complete a seção de equipamentos",
      description: "Mostrar o seu setup transmite profissionalismo.",
      priority: "media",
      actionHref: "/app/onboarding",
      actionLabel: "Adicionar equipamentos",
    });
    add(p.thumbnailQuality < 0.6, {
      title: "Melhore as thumbnails dos vídeos",
      description: "Thumbnails nítidas e coerentes deixam o portfólio mais premium.",
      priority: "baixa",
      actionHref: "/app/conteudos",
      actionLabel: "Rever thumbnails",
    });

    return s;
  }

  async runAssistant(input: AssistantInput): Promise<AssistantResult> {
    await wait(700);
    const map: Record<string, string> = {
      "melhorar-bio":
        "Aqui está uma versão mais forte da sua bio: mantém o tom próximo, começa pelo valor que entrega às marcas e termina com uma prova concreta. Quer que eu gere 3 variações?",
      "criar-headline":
        "Sugestão de headline: \"Criadora UGC que transforma produtos em histórias que vendem\". Posso adaptar ao seu nicho principal.",
      "mensagem-marca":
        "Olá [Marca], adoro o que fazem em [categoria]. Sou criadora UGC e preparei algumas ideias de vídeo para os vossos produtos. Posso enviar o meu portfólio e uma proposta rápida?",
    };
    return {
      text:
        map[input.action] ??
        `Claro! Sobre "${input.prompt}": aqui vai uma sugestão prática e pronta a usar. (No modo de demonstração, as respostas são simuladas — ligue uma chave de IA para respostas reais.)`,
    };
  }
}

// ---- helpers ----
function dedupe(arr: string[]): string[] {
  return Array.from(new Set(arr.filter(Boolean)));
}
function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
function clamp(n: number, max = 100): number {
  return Math.max(0, Math.min(max, Math.round(n)));
}
function pct(bools: boolean[]): number {
  if (bools.length === 0) return 0;
  return Math.round((bools.filter(Boolean).length / bools.length) * 100);
}
function scoreMessage(total: number): string {
  if (total >= 85) return "O seu portfólio está pronto para impressionar marcas.";
  if (total >= 70)
    return "O seu portfólio está quase pronto para impressionar marcas.";
  if (total >= 50)
    return "Bom começo! Faltam alguns detalhes para elevar o seu portfólio.";
  return "Vamos completar o seu portfólio para atrair as primeiras marcas.";
}
