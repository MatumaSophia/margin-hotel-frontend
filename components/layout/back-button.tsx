"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BackButtonProps {
  label?: string;
}

// Goes back in browser history, matching how the user arrived at the page.
export const BackButton = ({ label = "Back" }: BackButtonProps) => {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      className="pl-0 hover:pl-0 hover:bg-transparent gap-2 font-semibold"
      onClick={() => router.back()}
    >
      <ArrowLeft className="size-4" />
      {label}
    </Button>
  );
};
