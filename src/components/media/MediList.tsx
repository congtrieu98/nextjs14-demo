"use client";
import { CompleteMedi } from "@/lib/db/schema/media";
import { trpc } from "@/lib/trpc/client";
import MediModal from "./MediModal";
import { Key } from "react";


export default function MediList({ media }: { media: CompleteMedi[] }) {
  const { data: m } = trpc.media.getMedia.useQuery(undefined, {
    initialData: { media },
    refetchOnMount: false,
  });

  if (m.media.length === 0) {
    return <EmptyState />;
  }

  return (
    <ul>
      {m.media.map((medi: { id: Key | null | undefined; }) => (
        <Medi medi={medi} key={medi.id} />
      ))}
    </ul>
  );
}

const Medi = ({ medi }: { medi: CompleteMedi }) => {
  return (
    <li className="flex justify-between my-2">
      <div className="w-full">
        <div>{medi.url}</div>
      </div>
      <MediModal medi={medi} />
    </li>
  );
};

const EmptyState = () => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-gray-900">No media</h3>
      <p className="mt-1 text-sm text-gray-500">
        Get started by creating a new medi.
      </p>
      <div className="mt-6">
        <MediModal emptyState={true} />
      </div>
    </div>
  );
};

