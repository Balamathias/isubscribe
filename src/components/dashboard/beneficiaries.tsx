"use client";

import React, { useEffect, useMemo, useRef } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useBeneficiaries } from "@/lib/react-query/funcs/beneficiaries";
import { Button } from "@/components/ui/button";
import { useNetwork } from "@/providers/data/sub-data-provider";
import { LucideUser2 } from "lucide-react";

interface Props {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  inputRef: React.RefObject<HTMLInputElement>;
}

const calculateSimilarity = (input: string, target: string): number => {
  if (!input) return 0;
  let score = 0;
  for (let i = 0; i < input.length; i++) {
    if (target[i] === input[i]) score++;
  }
  return score / target.length;
};

const BeneficiariesDropdown = ({ isOpen, setIsOpen, inputRef }: Props) => {
  const { data: beneficiaries } = useBeneficiaries();
  const { mobileNumber, setMobileNumber } = useNetwork();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const sortedBeneficiaries = useMemo(() => {
    if (!beneficiaries || !mobileNumber) return beneficiaries || [];
    return beneficiaries
      .map((phone) => ({
        phone,
        score: calculateSimilarity(mobileNumber, phone),
      }))
      .sort((a, b) => b.score - a.score)
      .map(({ phone }) => phone);
  }, [beneficiaries, mobileNumber]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, setIsOpen, inputRef]);

  if (!sortedBeneficiaries.length) return null;

  return (
    <Popover open={isOpen}>
      <PopoverTrigger asChild>
        <div />
      </PopoverTrigger>
      <PopoverContent
        ref={dropdownRef}
        className="absolute z-10 max-h-60 w-[300px] overflow-auto bg-card shadow-lg rounded-xl border-none"
        sideOffset={4}
        align="start"
        style={{
          top: inputRef.current?.offsetTop! + inputRef.current?.offsetHeight!,
          left: inputRef.current?.offsetLeft!,
          position: "absolute",
        }}
      >
        <div className="flex flex-col gap-y-2 p-2">
          {sortedBeneficiaries.map((phone) => (
            <Button
              key={phone}
              variant="ghost"
              className="w-full justify-start text-left px-4 hover:opacity-60 transition-all flex items-center gap-x-2"
              onClick={() => {
                setMobileNumber(phone);
                setIsOpen(false);
              }}
            >
              <LucideUser2 size={14} className="text-primary dark:text-violet-400" /> {phone}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default BeneficiariesDropdown;
