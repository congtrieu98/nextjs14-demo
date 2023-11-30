"use client";
import { CompleteFee } from "@/lib/db/schema/feed";
import { trpc } from "@/lib/trpc/client";
import FeeModal from "./FeeModal";


export default function FeeList({ feed }: { feed: CompleteFee[] }) {
  const { data: f } = trpc.feed.getFeed.useQuery(undefined, {
    initialData: { feed },
    refetchOnMount: false,
  });

  if (f.feed.length === 0) {
    return <EmptyState />;
  }

  return (
    <ul>
      {f.feed.map((fee: CompleteFee) => (
        <Fee fee={fee} key={fee.id} />
      ))}
    </ul>
  );
}

const Fee = ({ fee }: { fee: CompleteFee }) => {
  return (
    <li className="flex justify-between my-2">
      <div className="w-full">
        <div>{fee.content}</div>
      </div>
      <FeeModal fee={fee} />
    </li>
  );
};

const EmptyState = () => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-gray-900">No feed</h3>
      <p className="mt-1 text-sm text-gray-500">
        Get started by creating a new fee.
      </p>
      <div className="mt-6">
        <FeeModal emptyState={true} />
      </div>
    </div>
  );
};

