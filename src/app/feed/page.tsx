import FeeList from "@/components/feed/FeeList";
import NewFeeModal from "@/components/feed/FeeModal";
import { getFees } from "@/lib/api/feed/queries";
import { checkAuth } from "@/lib/auth/utils";

export default async function Feed() {
  await checkAuth();
  const { feed } = await getFees();  

  return (
    <main className="max-w-3xl mx-auto p-5 md:p-0 sm:pt-4">
      <div className="flex justify-between">
        <h1 className="font-semibold text-2xl my-2">Feed</h1>
        <NewFeeModal />
      </div>
      <FeeList feed={feed} />
    </main>
  );
}
