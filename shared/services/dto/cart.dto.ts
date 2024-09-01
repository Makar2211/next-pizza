import { Cart, CartItem, Ingredient, Product, ProductItem } from '@prisma/client';
import { pizzaSizes } from './../../constants/pizza';

export type cartItemDTO = CartItem & {
	productItem: ProductItem & {
		product: Product
	}
	ingredients: Ingredient[]
}

export interface CartDTO extends Cart {
	items: cartItemDTO[]
}


export interface CreateCartItemValues {
	productItemId: number;
	ingredients?: number[]
}