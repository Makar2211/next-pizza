import { useRouter, useSearchParams } from 'next/navigation'
import { useSet } from 'react-use';
import React from 'react';

interface PropsPriceRange {
	priceFrom?: number;
	priceTo?: number;
}
interface QueryFilters extends PropsPriceRange {
	pizzaTypes: string;
	sizes: string;
	selectedIngredients: string
}

interface Filters {
	sizes: Set<string>;
	pizzaTypes: Set<string>;
	selectedIngredients: Set<string>;
	price: PropsPriceRange
}


export const useFilters = () => {
	const searchParams = useSearchParams() as unknown as Map<keyof QueryFilters, string>

	// филтр ингредиентов 
	const [selectedIngredients, { toggle: toggleIngredients }] = useSet(new Set<string>(searchParams.get('selectedIngredients')?.split(',')));

	// филтр размеров пицц
	const [sizes, { toggle: toggleSizes }] = useSet(new Set<string>(searchParams.get('sizes') ? searchParams.get('sizes')?.split(',') : []));

	// филтр типов пицц
	const [pizzaTypes, { toggle: togglePizzaTypes }] = useSet(new Set<string>(searchParams.get('pizzaTypes') ? searchParams.get('pizzaTypes')?.split(',') : []));

	// филтр цены
	const [price, setPrices] = React.useState<PropsPriceRange>({
		priceFrom: Number(searchParams.get('priceFrom')) || undefined,
		priceTo: Number(searchParams.get('priceTo')) || undefined,

	})

	const onChangePrice = (name: keyof PropsPriceRange, value: number) => {
		setPrices({
			...price,
			[name]: value
		})
	}

	const filters = {
		...price,
		selectedIngredients: Array.from(selectedIngredients),
		sizes: Array.from(sizes),
		pizzaTypes: Array.from(pizzaTypes)
	}
	return {
		sizes,
		pizzaTypes,
		selectedIngredients,
		price,
		setPrices,
		setPizzaTypes: togglePizzaTypes,
		setIngredients: toggleIngredients,
		setSizes: toggleSizes,
		onChangePrice,
		filters


	}
}