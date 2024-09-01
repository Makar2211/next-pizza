import { IProduct } from '@/@types/product';
import { mapPizzaType, PizzaSize, PizzaType } from '../constants/pizza';
import { calcPizzasPrices } from './calc-total-pizza-price';

export const getPizzaDetails = (type: PizzaType, size: PizzaSize, items: IProduct['items'], ingredients: IProduct['ingredients'], selectedIngredients: Set<number>) => {
	const totalPrice = calcPizzasPrices(type, size, items, ingredients, selectedIngredients)
	const textDetaills = `${size} см, ${mapPizzaType[type].toLocaleLowerCase()} пицца`;

	return { totalPrice, textDetaills }
}