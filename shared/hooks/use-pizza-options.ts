import React from 'react';
import { mapPizzaType, PizzaSize, pizzaSizes, PizzaType } from '../constants/pizza';
import { calcPizzasPrices } from '../lib/calc-total-pizza-price';
import { IProduct } from '@/@types/product';
import { Variant } from '../components/shared/group-variants';
import { getAvalieblePizzaSizes } from '../lib/get-avaliebel-pizza-sizes';
import { useSet } from 'react-use';




interface RetrunProps {
	size: PizzaSize,
	type: PizzaType,
	setType: (type: PizzaType) => void,
	setSize: (size: PizzaSize) => void,
	availabelPizzaSize: Variant[]
	currentItemId?: number
	selectedIngredients: Set<number>
	addIngredient: (id: number) => void
}

export const usePizzaOptions = (items: IProduct['items']): RetrunProps => {

	const [type, setType] = React.useState<PizzaType>(1);
	const [size, setSize] = React.useState<PizzaSize>(20);
	const [selectedIngredients, { toggle: addIngredient }] = useSet(new Set<number>([]));

	const { availabelPizzaSize } = getAvalieblePizzaSizes(items, type)

	const currentItemId = items.find((item) => item.pizzaType === type && item.size === size)?.id

	React.useEffect(() => {

		const isAvalibelSize = availabelPizzaSize?.find(item => Number(item.value) === size && !item.disabled)
		const availabelSize = availabelPizzaSize?.find(item => !item.disabled)

		if (!isAvalibelSize && availabelSize) {
			setSize(Number(availabelSize.value) as PizzaSize)
		}
	}, [type])

	return { availabelPizzaSize, size, type, currentItemId, setType, setSize, selectedIngredients, addIngredient }
}