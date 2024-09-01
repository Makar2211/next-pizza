import { IProduct } from '@/@types/product'
import { pizzaSizes, PizzaType } from '../constants/pizza'

export const getAvalieblePizzaSizes = (items: IProduct['items'], type: PizzaType) => {
	const filteredPizzasByType = items.filter(item => item.pizzaType === type)
	const availabelPizzaSize = pizzaSizes.map((item) => ({
		name: item.name,
		value: item.value,
		disabled: !filteredPizzasByType.some(pizza => Number(pizza.size) === Number(item.value)),
	}))

	return { availabelPizzaSize }
}