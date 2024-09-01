"use client"
import React from 'react';
import { FilterChecboxProps, FilterCheckbox } from './filter-checkbox';
import { Button, Input, Skeleton } from '../ui';

type Item = FilterChecboxProps

interface Props {
	title: string;
	items: Item[];
	defaultItems?: Item[];
	limit?: number;
	loading?: boolean;
	values?: Set<string>;
	searchInputPlaceholder?: string;
	onClickCheckbox?: (id: string) => void;
	defaultValue?: string[];
	className?: string;
	name?: string

}

export const CheckboxFiltersGroup: React.FC<Props> = ({
	title,
	items,
	defaultItems,
	limit = 5,
	searchInputPlaceholder = 'Поиск...',
	className,
	loading,
	onClickCheckbox,
	values,
	name,
	defaultValue
}) => {

	const [showAll, setShowAll] = React.useState(false)
	const [searchValue, setSearchValue] = React.useState('')

	const onChangeSearchInput = (event: React.FormEvent<HTMLInputElement>) => {
		setSearchValue(event.currentTarget.value)
	}

	if (loading) {
		return <div className={className}>
			<p className='font-bold mb-3'>{title}</p>
			<div>
				{
					...[...new Array(limit)].map((_, index) => (
						<Skeleton
							key={index}
							className='mb-4 h-6'
						/>

					))

				}
				<Skeleton className='w-28 mb-4 h-5'
				/>
			</div>



		</div>
	}

	const list = showAll ? items.filter(item => item.text.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase())) : defaultItems?.slice(0, limit)
	return (
		<div className={className}>
			<p className="font-bold mb-3">{title}</p>
			{
				showAll && <div className="mb-5">
					<Input
						placeholder={searchInputPlaceholder}
						className="bg-gray-50 border-none"
						onChange={onChangeSearchInput}
					/>
				</div>
			}

			<div className="flex flex-col gap-4 max-h-96 pr-2 overflow-auto scrollbar">
				{
					(list || items).map((item, index) => (
						<FilterCheckbox
							key={index}
							text={item.text}
							value={item.value}
							name={name}
							endAdornment={item.endAdornment}
							checked={values?.has(item.value)}
							onCheckedChange={() => onClickCheckbox?.(item.value)}
						/>
					))
				}

			</div>

			{
				items.length > limit && (
					<div className={showAll ? 'border-t border-t-neutral-100 mt-4' : ''}>
						<button onClick={() => setShowAll(!showAll)} className='text-primary mt-3' >{showAll ? 'Скрыть' : '+ Показать всё '}</button>
					</div>
				)
			}
		</div>)
};