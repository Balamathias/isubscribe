"use client";

import React from "react";
import { useGenerateAcount } from "@/lib/react-query/funcs/accounts";
import DynamicModal from "../DynamicModal";
import { Button } from "../ui/button";
import { LucideInfo, LucideLoader, LucideSparkles } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";

interface Props {
  withBVN?: boolean;
  withNIN?: boolean;
}

const GenerateAccount = ({ withBVN = true, withNIN = true }: Props) => {
  const { mutate: generateAccount, isPending } = useGenerateAcount();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const bvn = (formData.get("bvn") as string)?.trim();
    const nin = (formData.get("nin") as string)?.trim();

    generateAccount({ bvn, nin });
  };

  const RenderButton = ({ disabled, onClick }: { disabled: boolean, onClick?: () => void }) => (
    <Button
      className="rounded-full bg-gradient-to-r from-primary to-pink-600 text-white flex items-center gap-1 mt-2.5 w-full"
      variant="secondary"
      size="lg"
      disabled={disabled}
      onClick={onClick}
    >
      {isPending ? (
        <LucideLoader className="animate-spin" size={16} />
      ) : (
        <LucideSparkles size={16} />
      )}
      {isPending ? "Generating..." : "Generate Account"}
    </Button>
  );

  return withBVN || withNIN ? (
    <DynamicModal
      trigger={
        <div className="flex flex-1 w-full" role="button"><RenderButton disabled={isPending} /></div>
      }
      hideDrawerCancel
    >
      <Tabs defaultValue="nin" className="w-full">
        <TabsList className="grid w-full grid-cols-2 gap-2 rounded-xl bg-muted/60 p-1.5">
          {withNIN && (
            <TabsTrigger
              value="nin"
              className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all duration-300"
            >
              NIN
            </TabsTrigger>
          )}
          {withBVN && (
            <TabsTrigger
              value="bvn"
              className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all duration-300"
            >
              BVN
            </TabsTrigger>
          )}
        </TabsList>

        <form className="flex flex-col gap-y-3 mt-4" onSubmit={handleSubmit}>
          {withNIN && (
            <TabsContent value="nin" className="flex flex-col gap-y-3">
              <Label htmlFor="nin" className="text-muted-foreground font-semibold">
                NIN
              </Label>
              <Input
                className="h-12"
                id="nin"
                name="nin"
                required
                minLength={11}
                maxLength={11}
                type="number"
                placeholder="Enter your NIN Number to continue."
              />
              <p className="flex items-center gap-x-1.5 text-muted-foreground text-xs mt-2">
                <LucideInfo /> Please provide your National Identification Number (NIN) for account verification.
              </p>
                <RenderButton disabled={isPending} />
            </TabsContent>
          )}

          {withBVN && (
            <TabsContent value="bvn" className="flex flex-col gap-y-3">
              <Label htmlFor="bvn" className="text-muted-foreground font-semibold">
                BVN
              </Label>
              <Input
                className="h-12"
                id="bvn"
                name="bvn"
                required
                minLength={11}
                maxLength={11}
                type="number"
                placeholder="Enter your BVN Number to continue."
              />
              <p className="flex items-center gap-x-1.5 text-muted-foreground text-xs mt-2">
                <LucideInfo /> Please provide your Bank Verification Number (BVN) for account verification.
              </p>
              <RenderButton disabled={isPending} />
            </TabsContent>
          )}


          <p className="flex items-center gap-x-1.5 text-muted-foreground text-xs">
            <LucideInfo /> As part of the new CBN compliant requirement for reserved accounts, it is required that
            merchants verify their customers BVN or NIN.
          </p>
        </form>
      </Tabs>
    </DynamicModal>
  ) : (
    <RenderButton onClick={() => generateAccount({})} disabled={isPending} />
  );
};

export default GenerateAccount;
