import type { Metadata } from "next";
import { VIDEO_MODELS, MODEL_NICHES, MODEL_FORMATS } from "@/lib/video-models";
import { getFavouriteIds } from "@/lib/actions/video";
import { PageHeader } from "@/components/app/page-header";
import { ModelLibrary } from "@/components/video/model-library";

export const metadata: Metadata = { title: "Modelos de vídeos" };

export default async function ModelosPage() {
  let favourites: string[] = [];
  try {
    favourites = await getFavouriteIds();
  } catch {
    favourites = [];
  }

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Modelos de vídeos"
        description="Não sabe o que gravar? Explore modelos UGC por nicho, formato e objetivo — com roteiro pronto e personalizável por IA."
      />
      <ModelLibrary
        models={VIDEO_MODELS}
        niches={MODEL_NICHES}
        formats={MODEL_FORMATS}
        initialFavourites={favourites}
      />
    </div>
  );
}
