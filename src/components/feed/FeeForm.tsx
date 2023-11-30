/* eslint-disable @next/next/no-img-element */
"use client";

import { Fee, NewFeeParams, insertFeeParams } from "@/lib/db/schema/feed";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { z } from "zod";

import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useDropzone } from "react-dropzone";
import { useCallback, useEffect, useState } from "react";
import { uploadVercel } from "@/lib/utils";
import { ArrowUpTrayIcon, XMarkIcon } from "@heroicons/react/24/solid";

interface FileWithPreview extends File {
  preview?: string;
}

const FeeForm = ({
  fee,
  closeModal,
}: {
  fee?: Fee;
  closeModal: () => void;
}) => {
  const { toast } = useToast();

  const editing = !!fee?.id;

  const router = useRouter();
  const utils = trpc.useContext();
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof insertFeeParams>>({
    // latest Zod release has introduced a TS error with zodResolver
    // open issue: https://github.com/colinhacks/zod/issues/2663
    // errors locally but not in production
    resolver: zodResolver(insertFeeParams),
    defaultValues: fee ?? {
      content: "",
    },
  });

  const onSuccess = async (action: "create" | "update" | "delete") => {
    await utils.feed.getFeed.invalidate();
    router.refresh();
    closeModal();
    toast({
      title: "Success",
      description: `Fee ${action}d!`,
      variant: "default",
    });
  };

  const mutation = trpc.media.createMedi.useMutation();
  const { mutate: createFee, isLoading: isCreating } =
    trpc.feed.createFee.useMutation({
      onSuccess: async ({ fee }) => {
        if (files.length > 0 && fee) {
          files.forEach((file: FileWithPreview) => {
            if (file.preview) {
              const feedId = fee.id;
              mutation.mutate({ feedId: feedId, url: file.preview });
            }
          });
          onSuccess("create");
        }
      }
    });

  const { mutate: updateFee, isLoading: isUpdating } =
    trpc.feed.updateFee.useMutation({
      onSuccess: () => onSuccess("update"),
    });

  const { mutate: deleteFee, isLoading: isDeleting } =
    trpc.feed.deleteFee.useMutation({
      onSuccess: () => onSuccess("delete"),
    });

  const onDrop = useCallback((acceptedFiles: Array<FileWithPreview>) => {
    // console.log(acceptedFiles)
    if (acceptedFiles?.length > 0) {
      Promise.all(
        acceptedFiles.map((file: FileWithPreview) => uploadVercel(file))
      ).then((result: string[]) => {
        setFiles((previousFiles) => [
          ...previousFiles,
          ...result.map((item, index) =>
            Object.assign(acceptedFiles[index], { preview: item })
          ),
        ]);
        setLoading(false);
      });
      setLoading(true);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [],
    },
    maxSize: 1024 * 1000,
    onDrop,
  });

  const handleSubmit = (values: NewFeeParams) => {
    if (editing) {
      updateFee({ ...values, id: fee.id });
    } else {
      createFee(values);
    }
  };

  useEffect(() => {
    return () =>
      files.forEach((file: FileWithPreview) =>
        URL.revokeObjectURL(file.preview as string)
      );
  }, [files]);

  const removeFile = (name: string) => {
    setFiles((files) => files.filter((file) => file.name !== name));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className={"space-y-8"}>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <div>Image</div>
        <section className="border border-gray-100 p-5 rounded-xl shadow-md">
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center gap-4">
              <ArrowUpTrayIcon className="w-5 h-5 fill-current" />
              {isDragActive ? (
                <p>Drop the files here ...</p>
              ) : (
                <p>Drag & drop files here, or click to select files</p>
              )}
            </div>
          </div>
          {/* Accepted files */}
          <h3 className="title text-lg font-semibold text-neutral-600 mt-10 border-b pb-3">
            Accepted Files
          </h3>
          <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-10">
            {files.map((file: FileWithPreview) => (
              <li
                key={file.name}
                className="relative h-[100px] rounded-md shadow-lg"
              >
                {loading ? (
                  <svg
                    className="absolute top-10 right-6 animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="#000000"
                      stroke-width="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  <img
                    src={file.preview}
                    alt={file.name}
                    onLoad={() => {
                      URL.revokeObjectURL(file.preview as string);
                    }}
                    className="h-[100px] w-[100px] object-contain rounded-md"
                  />
                )}

                <button
                  type="button"
                  className="w-7 h-7 border border-secondary-400 bg-secondary-400 rounded-full flex justify-center items-center absolute -top-3 -right-3 transition-colors bg-red-500"
                  onClick={() => removeFile(file.name)}
                >
                  <XMarkIcon className="w-5 h-5 fill-white hover:fill-secondary-400 transition-colors" />
                </button>
                <div className=" text-neutral-500 text-[12px] font-medium">
                  {file.name}
                </div>
              </li>
            ))}
          </ul>
        </section>
        <Button
          type="submit"
          className="mr-1"
          disabled={isCreating || isUpdating}
        >
          {editing
            ? `Sav${isUpdating ? "ing..." : "e"}`
            : `Creat${isCreating ? "ing..." : "e"}`}
        </Button>
        {editing ? (
          <Button
            type="button"
            variant={"destructive"}
            onClick={() => deleteFee({ id: fee.id })}
          >
            Delet{isDeleting ? "ing..." : "e"}
          </Button>
        ) : null}
      </form>
    </Form>
  );
};

export default FeeForm;
