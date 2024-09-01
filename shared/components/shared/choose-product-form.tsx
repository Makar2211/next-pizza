import React from "react";
import { Title } from "./title";
import { cn } from "@/shared/lib/utils";
import { Button } from "../ui";

interface Props {
  imageUrl: string;
  name: string;
  items: any[];
  loading?: boolean;
  onSubmit?: VoidFunction;
  className?: string;
  price: number;
}

export const ChooseProductForm: React.FC<Props> = ({
  name,
  items,
  imageUrl,
  loading,
  onSubmit,
  className,
  price,
}) => {
  return (
    <div className={cn(className, "flex flex-1")}>
      <div className="flex items-center justify-center flex-1 relative w-full">
        <img
          src={imageUrl}
          alt={name}
          className="relative left-2 top-2 transition-all z-10 duration-300 w-[350px] h-[350px]"
        />
      </div>

      <div className="w-[490px] bg-[#f7f6f5] p-7">
        <Title text={name} size="md" className="font-extrabold mb-1" />

        <Button
          onClick={onSubmit}
          className="h-[55px] px-10 text-base rounded-[18px] w-full mt-10"
          loading={loading}
        >
          Добавить в корзину за {price} ₽
        </Button>
      </div>
    </div>
  );
};
