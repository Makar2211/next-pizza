import { cartItemDTO } from '../services/dto/cart.dto';

export const calcCartItemTotalPrice = (items: cartItemDTO): number => {
	const totalPriceIngridients = items.ingredients.reduce((acc, ingredient) => acc + ingredient.price, 0)
	return (items.productItem.price + totalPriceIngridients) * items.quantity
}