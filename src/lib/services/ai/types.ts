/**
 * AI service contract. The rest of the app depends only on this interface,
 * never on a concrete provider. A mock provider ships by default so the whole
 * product is demonstrable without credentials; a real provider (e.g. Anthropic)
 * can be dropped in behind the same interface.
 */

export interface PortfolioCopyInput {
  fullName: string;
  niches: string[];
  city?: string;
  country?: string;
  languages?: string[];
  contentTypes?: string[];
  communicationStyle?: string;
  experience?: string;
  equipment?: string[];
  rawBio?: string;
}

export interface PortfolioCopy {
  headline: string;
  professionalBio: string;
  aboutMe: string;
  specialties: string[];
  brandDescription: string;
  ctaPrimary: string;
  ctaContact: string;
}

export interface VideoMetadataInput {
  fileName?: string;
  niche?: string;
  format?: string;
  product?: string;
  brand?: string;
}

export interface VideoMetadata {
  title: string;
  description: string;
  category: string;
  suggestedThumbnailLabel: string;
}

export interface ScriptInput {
  baseModelTitle?: string;
  product: string;
  brand?: string;
  niche: string;
  audience?: string;
  mainBenefit?: string;
  problemSolved?: string;
  tone?: string;
  durationSeconds?: number;
  onCamera?: boolean;
  objective?: string;
  platform?: string;
}

export interface GeneratedScriptResult {
  title: string;
  objective: string;
  hook: string;
  script: string;
  scenes: { order: number; description: string; shot: string; line?: string }[];
  voiceOver: string;
  framing: string;
  cta: string;
  caption: string;
  recordingTips: string[];
}

export interface ScoreInputPortfolio {
  hasPhoto: boolean;
  hasHeadline: boolean;
  hasBio: boolean;
  hasAboutMe: boolean;
  nicheCount: number;
  equipmentCount: number;
  videoCount: number;
  formatDiversity: number;
  nicheDiversity: number;
  thumbnailQuality: number; // 0-1
  caseCount: number;
  testimonialCount: number;
  clientCount: number;
  hasCta: boolean;
  contactCount: number;
  socialCount: number;
  daysSinceUpdate: number;
}

export interface ScoreCategory {
  key: string;
  label: string;
  score: number; // 0-100
  weight: number;
}

export interface PortfolioScoreResult {
  total: number; // 0-100
  categories: ScoreCategory[];
  strengths: string[];
  message: string;
}

export interface PortfolioSuggestion {
  id: string;
  title: string;
  description: string;
  priority: "alta" | "media" | "baixa";
  /** Where the CTA should take the user. */
  actionHref: string;
  actionLabel: string;
}

export interface AssistantInput {
  action: string;
  prompt: string;
  context?: Record<string, unknown>;
}

export interface AssistantResult {
  text: string;
}

export interface AIProvider {
  readonly name: string;
  readonly isMock: boolean;
  generatePortfolioCopy(input: PortfolioCopyInput): Promise<PortfolioCopy>;
  generateVideoMetadata(input: VideoMetadataInput): Promise<VideoMetadata>;
  customizeVideoScript(input: ScriptInput): Promise<GeneratedScriptResult>;
  calculatePortfolioScore(
    input: ScoreInputPortfolio
  ): Promise<PortfolioScoreResult>;
  generatePortfolioSuggestions(
    input: ScoreInputPortfolio
  ): Promise<PortfolioSuggestion[]>;
  runAssistant(input: AssistantInput): Promise<AssistantResult>;
}
