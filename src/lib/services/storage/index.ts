/**
 * Storage service contract (S3-compatible). Callers depend only on this
 * interface. A mock implementation ships by default and returns coherent
 * placeholder URLs so uploads are demonstrable without real credentials.
 */

export interface UploadInput {
  fileName: string;
  contentType: string;
  sizeBytes: number;
  /** Base64 or object URL in mock mode; a stream/buffer in real mode. */
  data?: string;
  folder?: string;
}

export interface StoredObject {
  key: string;
  url: string;
  contentType: string;
  sizeBytes: number;
}

export interface StorageProvider {
  readonly name: string;
  readonly isMock: boolean;
  upload(input: UploadInput): Promise<StoredObject>;
  getSignedUrl(key: string): Promise<string>;
  remove(key: string): Promise<void>;
}

const PLACEHOLDER_IMG =
  "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=1200&q=80";

class MockStorageProvider implements StorageProvider {
  readonly name = "mock";
  readonly isMock = true;

  async upload(input: UploadInput): Promise<StoredObject> {
    // Simulate network/processing latency.
    await new Promise((r) => setTimeout(r, 500));
    const folder = input.folder ?? "uploads";
    const safe = input.fileName.replace(/[^a-z0-9.\-_]/gi, "-").toLowerCase();
    const key = `${folder}/${safe}`;
    const url = input.contentType.startsWith("image/")
      ? PLACEHOLDER_IMG
      : `https://storage.portfoliougc.local/${key}`;
    return {
      key,
      url,
      contentType: input.contentType,
      sizeBytes: input.sizeBytes,
    };
  }

  async getSignedUrl(key: string): Promise<string> {
    return `https://storage.portfoliougc.local/${key}?signed=demo`;
  }

  async remove(): Promise<void> {
    await new Promise((r) => setTimeout(r, 100));
  }
}

let provider: StorageProvider | null = null;

export function getStorageProvider(): StorageProvider {
  if (provider) return provider;
  // Swap for a real S3 provider when S3_* env vars are present.
  provider = new MockStorageProvider();
  return provider;
}
