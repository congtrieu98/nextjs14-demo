import MediList from "@/components/media/MediList";
import NewMediModal from "@/components/media/MediModal";
import { getMedias } from "@/lib/api/media/queries";

export default async function Media() {
  const { media } = await getMedias();

  return (
    <main className="max-w-3xl mx-auto p-5 md:p-0 sm:pt-4">
      <div className="flex justify-between">
        <h1 className="font-semibold text-2xl my-2">Media</h1>
        <NewMediModal />
      </div>
      <MediList media={media} />
    </main>
  );
}
