import { Product, ProductItem, Ingredient } from '@prisma/client';

export type IProduct = Product & { items: ProductItem[]; ingredients: Ingredient[] };