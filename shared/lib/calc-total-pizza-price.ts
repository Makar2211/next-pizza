import { IProduct } from '@/@types/product';
import { mapPizzaType, PizzaSize, PizzaType } from '../constants/pizza';

/**
 * Функчия подсчета цены пиццы
 * @param type - тип теста выбранной пиццы
 * @param size - размер выбранной пиццы
 * @param items - список вариаций
 * @param ingredients - список ингредиентов 
 * @param selectedIngredients - выбранные ингридиенты
 * @returns - общая стоимость пиццы
 */

export const calcPizzasPrices = (type: PizzaType, size: PizzaSize, items: IProduct['items'], ingredients: IProduct['ingredients'], selectedIngredients: Set<number>) => {
	const pizzaPrice = items.find(item => item.pizzaType === type && item.size === size)?.price || 0
	const totalIngredientsPrice = ingredients.filter(ingredient => selectedIngredients.has(ingredient.id)).reduce((acc, ingredient) => acc + ingredient.price, 0)

	return pizzaPrice + totalIngredientsPrice

}