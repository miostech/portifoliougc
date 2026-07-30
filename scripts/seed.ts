/**
 * Seed script — popula a base de dados com dados realistas para desenvolvimento.
 *
 * Como executar (com MongoDB a correr):
 *   npx tsx scripts/seed.ts
 *
 * O script é idempotente: limpa os documentos existentes antes de inserir.
 */

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

// ---- Modelos ----
const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, default: "user" },
    plan: { type: String, default: "none" },
    subscriptionStatus: { type: String, default: "inactive" },
    onboarded: { type: Boolean, default: false },
    suspended: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

const PortfolioSchema = new mongoose.Schema(
  {
    userId: mongoose.Schema.Types.ObjectId,
    slug: { type: String, unique: true },
    templateSlug: { type: String, default: "minimal" },
    published: { type: Boolean, default: false },
    profile: mongoose.Schema.Types.Mixed,
    ai: mongoose.Schema.Types.Mixed,
    score: { total: Number, updatedAt: Date },
    theme: { accent: String, font: String },
    sections: [{ key: String, enabled: Boolean, order: Number }],
    categories: [String],
    testimonials: mongoose.Schema.Types.Mixed,
    clients: mongoose.Schema.Types.Mixed,
    cases: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

const MediaSchema = new mongoose.Schema(
  {
    userId: mongoose.Schema.Types.ObjectId,
    portfolioId: mongoose.Schema.Types.ObjectId,
    type: { type: String, default: "video" },
    url: String,
    thumbnail: String,
    title: String,
    description: String,
    category: String,
    niche: String,
    format: String,
    product: String,
    brand: String,
    order: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    hidden: { type: Boolean, default: false },
    status: { type: String, default: "ready" },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const AnalyticsEventSchema = new mongoose.Schema(
  { portfolioId: mongoose.Schema.Types.ObjectId, type: String, meta: mongoose.Schema.Types.Mixed },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);
const Portfolio = mongoose.models.Portfolio || mongoose.model("Portfolio", PortfolioSchema);
const Media = mongoose.models.Media || mongoose.model("Media", MediaSchema);
const AnalyticsEvent = mongoose.models.AnalyticsEvent || mongoose.model("AnalyticsEvent", AnalyticsEventSchema);

// ---- Dados demo ----

const HASH = await bcrypt.hash("Demo1234!", 10);

const CREATORS = [
  {
    user: {
      name: "Sofia Martins",
      email: "sofia@demo.portifoliougc.pt",
      password: HASH,
      role: "user",
      plan: "pro",
      subscriptionStatus: "active",
      onboarded: true,
    },
    portfolio: {
      slug: "sofia-martins",
      templateSlug: "creator",
      published: true,
      profile: {
        fullName: "Sofia Martins",
        username: "sofiacriadora",
        photo: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400",
        city: "Lisboa",
        country: "Portugal",
        languages: ["Português", "Inglês"],
        niches: ["Beleza", "Skincare", "Lifestyle"],
        ageRange: "25-34",
        pronouns: "ela/dela",
        experience: "2-3 anos",
        contentTypes: ["Vídeo vertical", "Unboxing", "Review"],
        brandSegments: ["Beauty", "Cosmética", "Bem-estar"],
        communicationStyle: "próximo",
        travelAvailability: false,
        productAvailability: true,
        bio: "Criadora UGC focada em beleza e lifestyle autêntico.",
        socials: [
          { platform: "Instagram", url: "https://instagram.com/sofiacriadora" },
          { platform: "TikTok", url: "https://tiktok.com/@sofiacriadora" },
        ],
        equipment: ["iPhone 14 Pro", "Ring light", "Tripé", "Microfone lapela"],
      },
      ai: {
        headline: "Criadora de conteúdo UGC especializada em beleza e skincare",
        professionalBio:
          "Sou Sofia Martins, criadora de conteúdo UGC focada em beleza e lifestyle. Produzo vídeos autênticos que geram conexão real com o público e resultado para as marcas, cuidando de tudo — do roteiro à edição.",
        aboutMe:
          "Comecei a criar conteúdo por paixão em histórias de beleza e hoje ajudo marcas a mostrarem os seus produtos de forma real e envolvente. Gosto de entender o objetivo de cada campanha e traduzi-lo em vídeos que parecem recomendações de uma amiga.",
        specialties: [
          "Beleza e skincare",
          "Unboxing e reviews honestas",
          "Storytelling de produto",
          "Vídeos verticais para Reels e TikTok",
        ],
        brandDescription:
          "Se procura uma criadora que entrega conteúdo UGC autêntico, com boa comunicação e prazos cumpridos, o meu trabalho é feito para si.",
        ctaPrimary: "Vamos criar algo juntos",
        ctaContact: "Fale com a Sofia",
        generatedAt: new Date(),
      },
      score: { total: 82, updatedAt: new Date() },
      theme: { accent: null, font: null },
      sections: [
        { key: "hero", enabled: true, order: 0 },
        { key: "about", enabled: true, order: 1 },
        { key: "specialties", enabled: true, order: 2 },
        { key: "videos", enabled: true, order: 3 },
        { key: "cases", enabled: true, order: 4 },
        { key: "clients", enabled: true, order: 5 },
        { key: "testimonials", enabled: true, order: 6 },
        { key: "equipment", enabled: true, order: 7 },
        { key: "contact", enabled: true, order: 8 },
      ],
      testimonials: [
        {
          author: "Ana Costa",
          role: "Brand Manager — Glowly",
          quote:
            "A Sofia entregou o conteúdo antes do prazo e superou todas as expectativas. As views do vídeo foram 3× acima da média da nossa conta.",
        },
        {
          author: "Ricardo Faria",
          role: "Fundador — SerumNova",
          quote:
            "Profissional, criativa e com ótima comunicação. Recomendo sem hesitar para qualquer marca de beleza.",
        },
      ],
      clients: [
        { name: "Glowly", logo: null },
        { name: "SerumNova", logo: null },
        { name: "NaturalSkin", logo: null },
      ],
      cases: [
        {
          title: "Lançamento sérum Glowly",
          brand: "Glowly",
          description:
            "Campanha de lançamento com 3 vídeos UGC para Reels e TikTok. Foco em demonstração e resultados reais.",
          result: "+240% de visitas ao produto em 48h",
          thumbnail: null,
        },
      ],
    },
    media: [
      {
        type: "video",
        url: "https://www.w3schools.com/html/mov_bbb.mp4",
        thumbnail: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400",
        title: "Review sérum vitamina C",
        description: "Testei durante 30 dias — resultado honesto",
        category: "Review",
        niche: "Skincare",
        format: "review",
        product: "Sérum vitamina C",
        brand: "Glowly",
        featured: true,
        order: 0,
        status: "ready",
      },
      {
        type: "video",
        url: "https://www.w3schools.com/html/mov_bbb.mp4",
        thumbnail: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400",
        title: "Unboxing rotina noturna",
        description: "Abrindo a nova rotina noturna da SerumNova",
        category: "Unboxing",
        niche: "Skincare",
        format: "unboxing",
        product: "Kit rotina noturna",
        brand: "SerumNova",
        featured: false,
        order: 1,
        status: "ready",
      },
      {
        type: "video",
        url: "https://www.w3schools.com/html/mov_bbb.mp4",
        thumbnail: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400",
        title: "Tutorial: Base hidratante perfeita",
        description: "Como aplicar para durar o dia todo",
        category: "Tutorial",
        niche: "Beleza",
        format: "tutorial",
        product: "Base hidratante",
        brand: "NaturalSkin",
        featured: false,
        order: 2,
        status: "ready",
      },
    ],
    visits: 47,
  },
  {
    user: {
      name: "Beatriz Oliveira",
      email: "beatriz@demo.portifoliougc.pt",
      password: HASH,
      role: "user",
      plan: "essencial",
      subscriptionStatus: "active",
      onboarded: true,
    },
    portfolio: {
      slug: "beatriz-oliveira",
      templateSlug: "minimal",
      published: true,
      profile: {
        fullName: "Beatriz Oliveira",
        username: "beatrizugc",
        photo: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400",
        city: "Porto",
        country: "Portugal",
        languages: ["Português"],
        niches: ["Fitness", "Bem-estar", "Nutrição"],
        ageRange: "18-24",
        pronouns: "ela/dela",
        experience: "1 ano",
        contentTypes: ["Vídeo vertical", "Demonstração"],
        brandSegments: ["Fitness", "Alimentação saudável"],
        communicationStyle: "energético",
        travelAvailability: true,
        productAvailability: true,
        bio: "Apaixonada por fitness e bem-estar, crio conteúdo autêntico para marcas saudáveis.",
        socials: [
          { platform: "Instagram", url: "https://instagram.com/beatrizugc" },
        ],
        equipment: ["iPhone 13", "Tripé"],
      },
      ai: {
        headline: "Criadora UGC especializada em fitness e bem-estar",
        professionalBio:
          "Sou Beatriz Oliveira, criadora de conteúdo UGC para marcas de fitness e bem-estar. Faço vídeos que mostram produtos em uso real, com energia e autenticidade.",
        aboutMe:
          "O fitness é parte da minha vida há anos e adoro partilhar essa jornada de forma honesta. Crio conteúdo que inspire, informe e converta.",
        specialties: ["Fitness e treino", "Nutrição e suplementação", "Bem-estar e lifestyle"],
        brandDescription:
          "Trabalho com marcas de fitness que querem chegar a um público jovem e ativo com conteúdo real e motivador.",
        ctaPrimary: "Vamos trabalhar juntos",
        ctaContact: "Contactar a Beatriz",
        generatedAt: new Date(),
      },
      score: { total: 61, updatedAt: new Date() },
      theme: { accent: null, font: null },
      sections: [
        { key: "hero", enabled: true, order: 0 },
        { key: "about", enabled: true, order: 1 },
        { key: "videos", enabled: true, order: 2 },
        { key: "contact", enabled: true, order: 3 },
      ],
      testimonials: [],
      clients: [{ name: "FitBrand", logo: null }],
      cases: [],
    },
    media: [
      {
        type: "video",
        url: "https://www.w3schools.com/html/mov_bbb.mp4",
        thumbnail: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400",
        title: "Proteína em pó — vale a pena?",
        description: "Review honesta depois de 1 mês",
        category: "Review",
        niche: "Fitness",
        format: "review",
        product: "Proteína whey",
        brand: "FitBrand",
        featured: true,
        order: 0,
        status: "ready",
      },
    ],
    visits: 18,
  },
];

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@portifoliougc.pt";

async function seed() {
  const uri = process.env.MONGODB_URI ?? "mongodb://localhost:27017/portifoliougc";
  console.log("🌱 A conectar a MongoDB…");
  await mongoose.connect(uri);
  console.log("✅ Conectado.");

  // Limpar coleções
  console.log("🗑️  A limpar dados existentes…");
  await Promise.all([
    User.deleteMany({}),
    Portfolio.deleteMany({}),
    Media.deleteMany({}),
    AnalyticsEvent.deleteMany({}),
  ]);

  // Admin
  console.log("👤 A criar admin…");
  await User.create({
    name: "Admin",
    email: ADMIN_EMAIL,
    password: HASH,
    role: "admin",
    plan: "pro",
    subscriptionStatus: "active",
    onboarded: true,
  });

  // Criadores demo
  for (const creator of CREATORS) {
    console.log(`👩 A criar ${creator.user.name}…`);
    const user = await User.create(creator.user);

    const portfolio = await Portfolio.create({
      ...creator.portfolio,
      userId: user._id,
    });

    for (const [i, m] of creator.media.entries()) {
      await Media.create({ ...m, userId: user._id, portfolioId: portfolio._id, order: i });
    }

    // Analytics simulados
    const events = [];
    for (let i = 0; i < creator.visits; i++) {
      const daysAgo = Math.floor(Math.random() * 14);
      const d = new Date();
      d.setDate(d.getDate() - daysAgo);
      events.push({ portfolioId: portfolio._id, type: "visit", createdAt: d });
    }
    for (let i = 0; i < Math.floor(creator.visits * 0.2); i++) {
      events.push({ portfolioId: portfolio._id, type: "social_click" });
    }
    if (events.length > 0) await AnalyticsEvent.insertMany(events);

    console.log(`   ✅ Portfólio "${portfolio.slug}" com ${creator.media.length} vídeos e ${events.length} eventos`);
  }

  console.log("\n🎉 Seed completo!");
  console.log(`   Admin: ${ADMIN_EMAIL} / Demo1234!`);
  console.log(`   Sofia: sofia@demo.portifoliougc.pt / Demo1234!`);
  console.log(`   Beatriz: beatriz@demo.portifoliougc.pt / Demo1234!`);
  await mongoose.disconnect();
}

seed().catch((e) => { console.error(e); process.exit(1); });
