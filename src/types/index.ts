export type id = string;
export type CardTitle = string;
export type CardDescription = string;
export type CardImageUrl = string;
export type Price = number | null;
export type PaymentMethod = 'card' | 'cash';
export type ClientEmail = string;
export type ClientPhone = string;
export type ClientAddress = string;
export type CardsCount = number;

export type CardCategory = 'софт-скил'	| 'другое'	| 'дополнительное'	| 'кнопка'	| 'хард-скил';
export type FormErrors = Partial<Record<keyof IOrderForm, string>>;

export interface IProduct {
	id: id; // id карточки
	description: CardDescription; // описание
	image: CardImageUrl; // ссылка на картинку
	title: CardTitle; // название товара
	category: CardCategory; // категория товара
	price: Price; // цена
	isIncluded?: boolean;
	//index?: number;
}

export interface IProductResponse {
	total: number;
	items: IProduct[];
}

export interface IBasket {
	items: HTMLElement[] | string;
	total: number;
}

export interface IAppState {
	catalog: IProduct[];
	basket: IProduct[];
	order: IOrder;
}

export interface IOrderForm {
	payment: PaymentMethod;
	email: ClientEmail;
	phone: ClientPhone;
	address: ClientAddress;
}

export interface IOrder extends IOrderForm {
	items: id[];
	total: Price;
}
