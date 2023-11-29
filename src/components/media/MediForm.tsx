"use client";

import { Medi, NewMediParams, insertMediParams } from "@/lib/db/schema/media";
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

const MediForm = ({
  medi,
  closeModal,
}: {
  medi?: Medi;
  closeModal: () => void;
}) => {
  const { toast } = useToast();
  
  const editing = !!medi?.id;

  const router = useRouter();
  const utils = trpc.useContext();

  const form = useForm<z.infer<typeof insertMediParams>>({
    // latest Zod release has introduced a TS error with zodResolver
    // open issue: https://github.com/colinhacks/zod/issues/2663
    // errors locally but not in production
    resolver: zodResolver(insertMediParams),
    defaultValues: medi ?? {
      url: "",
     feedId: ""
    },
  });

  const onSuccess = async (action: "create" | "update" | "delete") => {
    await utils.media.getMedia.invalidate();
    router.refresh();
    closeModal();toast({
      title: 'Success',
      description: `Medi ${action}d!`,
      variant: "default",
    });
  };

  const { mutate: createMedi, isLoading: isCreating } =
    trpc.media.createMedi.useMutation({
      onSuccess: () => onSuccess("create"),
    });

  const { mutate: updateMedi, isLoading: isUpdating } =
    trpc.media.updateMedi.useMutation({
      onSuccess: () => onSuccess("update"),
    });

  const { mutate: deleteMedi, isLoading: isDeleting } =
    trpc.media.deleteMedi.useMutation({
      onSuccess: () => onSuccess("delete"),
    });

  const handleSubmit = (values: NewMediParams) => {
    if (editing) {
      updateMedi({ ...values, id: medi.id });
    } else {
      createMedi(values);
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className={"space-y-8"}>
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (<FormItem>
              <FormLabel>Url</FormLabel>
                <FormControl>
            <Input {...field} />
          </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="feedId"
          render={({ field }) => (<FormItem>
              <FormLabel>Feed Id</FormLabel>
                <FormControl>
            <Input {...field} />
          </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
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
            onClick={() => deleteMedi({ id: medi.id })}
          >
            Delet{isDeleting ? "ing..." : "e"}
          </Button>
        ) : null}
      </form>
    </Form>
  );
};

export default MediForm;
