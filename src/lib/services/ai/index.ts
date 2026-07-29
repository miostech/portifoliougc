import type { AIProvider } from "./types";
import { MockAIProvider } from "./mock";

export * from "./types";

let provider: AIProvider | null = null;

/**
 * Returns the active AI provider. Uses the mock provider unless a real
 * provider is configured (e.g. ANTHROPIC_API_KEY set). The real provider can
 * be added later behind the same AIProvider interface without touching callers.
 */
export function getAIProvider(): AIProvider {
  if (provider) return provider;

  // Placeholder for a real provider. When ANTHROPIC_API_KEY exists we would
  // return a `new AnthropicAIProvider()` here. Until then, mock everywhere.
  provider = new MockAIProvider();
  return provider;
}

export const aiIsMock = (): boolean => getAIProvider().isMock;
