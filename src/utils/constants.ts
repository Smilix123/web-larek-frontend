// Для публикации на гитхабе

export const API_URL = `https://larek-api.nomoreparties.co/api/weblarek`;
export const CDN_URL = `https://larek-api.nomoreparties.co/content/weblarek`;

// export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
// export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

export const settings = {
	currency: 'синапсов', // название валюты в род.падеже
	formErrors: {
		phone: 'Необходимо указать телефон',
		email: 'Необходимо указать email',
		address: 'Необходимо указать адрес',
		payment: 'Необходимо выбрать способ оплаты',
	},
	card: {
		noPrice: 'Бесценно',
	},
	buyButtonValues: {
		add: 'Купить',
		delete: 'Удалить из корзины',
		disabled: 'Недоступно',
	},
	basket: {
		empty: 'Корзина пуста',
	},
	categories: {
		'софт-скил': 'card__category_soft',
		другое: 'card__category_other',
		дополнительное: 'card__category_additional',
		кнопка: 'card__category_button',
		'хард-скил': 'card__category_hard',
	},
};
