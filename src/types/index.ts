export type id = string; // идентификатор
export type CardTitle = string; // наименование товара
export type CardDescription = string; // описание товара
export type CardImageUrl = string; // ссылка на изображение
export type Price = number | null; // цена товара
export type PaymentMethod = string; // метод оплаты
export type ClientEmail = string; // электронная почта
export type ClientPhone = string; // телефонный номер
export type ClientAddress = string; // адрес
export type CardsCount = number; // количество товаров в корзине
export type CardCategory = 'софт-скил' | 'другое' | 'дополнительное' | 'кнопка' | 'хард-скил'; // категория товара
export type FormErrors = Partial<Record<keyof TForms, string>>;

export interface IProduct {
	id: id; // id карточки
	description: CardDescription; // описание
	image: CardImageUrl; // ссылка на картинку
	title: CardTitle; // название товара
	category: CardCategory; // категория товара
	price: Price; // цена
}

export interface IProductsCatalog {
	items: IProduct[]; // массив продуктов
}

export interface IBasket {
	items: HTMLElement[] | string; // каталог товаров или надпись "Корзина пуста"
	total: number; // общая сумма товаров
}

export interface IOrder {
	payment: PaymentMethod;
	email: ClientEmail;
	phone: ClientPhone;
	address: ClientAddress;
	items: id[]; // массив идентификаторов товара
	total: number; // сумма заказа
}

export interface IOrderAnswer {
	id: id; // идентификатор заказа
	total: number; // сумма заказа
}

export type TOrderForm = Pick<IOrder, 'payment' | 'address'>; // метод оплаты и адрес пользователя
export type TContactsForm = Pick<IOrder, 'email' | 'phone'>; // email и телефон
export type TForms = TOrderForm & TContactsForm; // форма с данными о пользователе

export type TSuccess = Pick<IBasket, 'total'>; // сумма списанных денег

export interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export interface ISuccessActions {
	onClick: () => void;
}

export interface ICard {
	id: id; // id карточки
	description?: CardDescription; // описание
	image?: CardImageUrl; // ссылка на картинку
	title: CardTitle; // название товара
	category?: CardCategory; // категория товара
	price: Price; // цена
	index: number; // номер продукта в корзине
	changeButton(price: Price, inBasket: boolean): void; // замена текста кнопки в зависимости от статуса
}
