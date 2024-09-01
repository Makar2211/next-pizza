import { Api } from '@/shared/services/api-client'
import { Ingredient } from '@prisma/client'
import React from 'react'


interface ReturnProps {
	ingredients: Ingredient[]
	loading: boolean
}

export const useIngredients = (): ReturnProps => {
	const [ingredients, setIngredients] = React.useState<Ingredient[]>([])
	const [loading, setLoading] = React.useState<boolean>(true)
	React.useEffect(() => {
		(async () => {
			try {
				setLoading(true)
				const items = await Api.ingredients.getAll()
				setIngredients(items)
			} catch (error) {
				console.error(error)
			} finally {
				setLoading(false)
			}
		})()

	}, [])

	return { ingredients, loading }
}