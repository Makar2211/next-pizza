"use client";
import React from "react";
import qs from "qs";
import { useRouter } from "next/navigation";
import { Title } from "./title";
import { Input } from "../ui";
import { RangeSlider } from "./range-sider";
import { CheckboxFiltersGroup } from "./checkbox-filters-group";
import { useIngredients } from "@/shared/hooks/use-ingredients";
import { useFilters } from "@/shared/hooks/use-filters";

interface Props {
  className?: string;
}

export const Filters: React.FC<Props> = ({ className }) => {
  const router = useRouter();
  const [isMounted, setIsMounted] = React.useState(false);
  const { ingredients, loading } = useIngredients();
  const {
    sizes,
    pizzaTypes,
    selectedIngredients,
    price,
    setPrices,
    setPizzaTypes,
    setIngredients,
    setSizes,
    onChangePrice,
  } = useFilters();

  React.useEffect(() => {
    if (isMounted) {
      const filters = {
        ...price,
        ingredients: Array.from(selectedIngredients),
        sizes: Array.from(sizes),
        pizzaTypes: Array.from(pizzaTypes),
      };
      const queryString = qs.stringify(filters, {
        arrayFormat: "comma",
      });
      router.push(`?${queryString}`, {
        scroll: false,
      });
    }
    setIsMounted(true);
  }, [selectedIngredients, sizes, pizzaTypes, price]);
  return (
    <div className={className}>
      <Title text="Фильтрация" size="sm" className="mb-5 font-bold" />

      {/* Верхние чекбоксы */}
      <CheckboxFiltersGroup
        title="Тип теста"
        name="pizzaTypes"
        className="mb-5"
        onClickCheckbox={setPizzaTypes}
        values={pizzaTypes}
        items={[
          { text: "Тонкое", value: "1" },
          { text: "Традиционное", value: "2" },
        ]}
      />
      <CheckboxFiltersGroup
        title="Размеры"
        name="pizzaTypes"
        className="mb-5"
        onClickCheckbox={setSizes}
        values={sizes}
        items={[
          { text: "20 см", value: "20" },
          { text: "30 см", value: "30" },
          { text: "40 см", value: "40" },
        ]}
      />

      {/* Фильр цен*/}
      <div className="mt-5 border-y border-y-neutral-100 py-6 pb-7">
        <p className="font-bold mb-3">Цена от и до:</p>
        <div className="flex gap-3 mb-5">
          <Input
            type="number"
            placeholder="0"
            min={0}
            max={1000}
            value={String(price.priceFrom)}
            onChange={(e) => onChangePrice("priceFrom", Number(e.target.value))}
          />
          <Input
            type="number"
            min={100}
            max={1000}
            placeholder="5000"
            value={String(price.priceTo)}
            onChange={(e) => onChangePrice("priceTo", Number(e.target.value))}
          />
        </div>

        <RangeSlider
          min={0}
          max={1000}
          step={10}
          value={[price.priceFrom || 0, price.priceTo || 1000]}
          onValueChange={([from, to]) =>
            setPrices({ priceFrom: from, priceTo: to })
          }
        />
      </div>

      {/* Нижние чекбоксы */}
      <CheckboxFiltersGroup
        title="Ингридиенты"
        className="mt-5"
        limit={5}
        defaultItems={ingredients.slice(0, 6).map((ingredient) => ({
          text: ingredient.name,
          value: String(ingredient.id),
        }))}
        items={ingredients.map((ingredient) => ({
          text: ingredient.name,
          value: String(ingredient.id),
        }))}
        loading={loading}
        name="ingredients"
        onClickCheckbox={setIngredients}
        values={selectedIngredients}
      />
    </div>
  );
};
