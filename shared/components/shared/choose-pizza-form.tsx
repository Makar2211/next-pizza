import React from "react";
import { Ingredient } from "@prisma/client";
import { cn } from "@/shared/lib/utils";
import { Title } from "./title";
import { IProduct } from "@/@types/product";
import { PizzaImage } from "./pizza-image";
import { GroupVariants } from "./group-variants";
import { Button } from "../ui";
import { PizzaSize, PizzaType, pizzaTypes } from "@/shared/constants/pizza";
import { Ingredients } from "./ingredients";
import { usePizzaOptions } from "@/shared/hooks/use-pizza-options";
import { getPizzaDetails } from "@/shared/lib/get-pizza-details";

interface Props {
  imageUrl: string;
  name: string;
  ingredients: Ingredient[];
  items: IProduct["items"];
  loading?: boolean;
  onClickAddCart: (itemId: number, ingredients: number[]) => void;
  className?: string;
}

export const ChoosePizzaForm: React.FC<Props> = ({
  name,
  items,
  imageUrl,
  ingredients,
  loading,
  onClickAddCart,
  className,
}) => {
  //хук опций выбора типа и размера
  const {
    availabelPizzaSize,
    size,
    type,
    currentItemId,
    setType,
    setSize,
    selectedIngredients,
    addIngredient,
  } = usePizzaOptions(items);

  //подсчет цены и детальной инфы о выбранном размере и типа пиццы
  const { totalPrice, textDetaills } = getPizzaDetails(
    type,
    size,
    items,
    ingredients,
    selectedIngredients
  );

  const handleClickAddCart = () => {
    if (currentItemId) {
      onClickAddCart(currentItemId, Array.from(selectedIngredients));
    }
  };
  return (
    <div className={cn(className, "flex flex-1")}>
      <PizzaImage imageUrl={imageUrl} size={size} alt={name} />

      <div className="w-[490px] bg-[#f7f6f5] p-7">
        <Title text={name} size="md" className="font-extrabold mb-1" />

        <p className="text-gray-400">{textDetaills}</p>

        <div className="flex flex-col mt-5 gap-3">
          <GroupVariants
            items={availabelPizzaSize}
            value={String(size)}
            onChange={(value) => setSize(Number(value) as PizzaSize)}
          />
          <GroupVariants
            items={pizzaTypes}
            value={String(type)}
            onChange={(value) => setType(Number(value) as PizzaType)}
          />
        </div>

        <div className="bg-gray-50 p-5 rounded-md h-[300px] overflow-auto scrollbar mt-5">
          <div className="grid grid-cols-3 gap-3">
            {ingredients.map((ingredient) => (
              <Ingredients
                imageUrl={ingredient.imageUrl}
                name={ingredient.name}
                price={ingredient.price}
                onClick={() => addIngredient(ingredient.id)}
                active={selectedIngredients.has(ingredient.id)}
              />
            ))}
          </div>
        </div>

        <Button
          className="h-[55px] px-10 text-base rounded-[18px] w-full mt-10"
          onClick={handleClickAddCart}
          loading={loading}
        >
          Добавить в корзину за {totalPrice} UAH
        </Button>
      </div>
    </div>
  );
};
