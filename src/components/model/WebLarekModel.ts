import {
	CardsCount,
	FormErrors,
	id,
	IWebLarekState,
	TContactsForm,
	TOrderForm,
} from './../../types/index';
import { IOrder, IProduct } from '../../types';
import { Model } from './base/Model';
import { settings } from '../../utils/constants';

export class WebLarekState extends Model<IWebLarekState> implements IWebLarekState {
	catalog: IProduct[];
	order: IOrder = {
		payment: '',
		email: '',
		phone: '',
		address: '',
		items: [],
		total: 0,
	};
	preview: id | null;
	formErrors: FormErrors = {};

	setProducts(items: IProduct[]): void {
		this.catalog = items;
		this.events.emit('products:changed');
	}

	getProduct(id: id): IProduct {
		return this.catalog.find((item) => item.id === id);
	}

	getTotal(): number {
		return this.order.items.reduce((total, itemId) => {
			const product = this.catalog.find((p) => p.id === itemId);
			return total + (product?.price ?? 0);
		}, 0);
	}

	getProductsCount(): CardsCount {
		return this.order.items.length;
	}

	addToBasket(id: id): void {
		this.order.items.push(id);
		this.order.total = this.getTotal();
		this.events.emit('products:changed');
	}

	deleteFromBasket(id: id): void {
		this.order.items = this.order.items.filter((item) => item !== id);
		this.order.total = this.getTotal();
		this.events.emit('products:changed');
	}

	clearBasket(): void {
		this.order = {
			payment: '',
			email: '',
			phone: '',
			address: '',
			items: [],
			total: 0,
		};
		this.events.emit('products:changed');
	}

	inBasket(id: id): boolean {
		return this.order.items.find((item) => item === id) ? true : false;
	}

	validateOrder(): void {
		const errors: typeof this.formErrors = {};
		if (!this.order.payment) {
			errors.payment = settings.formErrors.payment;
		}
		if (!this.order.address) {
			errors.address = settings.formErrors.address;
		}
		this.formErrors = errors;
		this.events.emit('orderFormErrors:change', this.formErrors);
	}

	validateContacts(): void {
		const errors: typeof this.formErrors = {};

		// Валидация email
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!this.order.email) {
			errors.email = settings.formErrors.email;
		} else if (!emailRegex.test(this.order.email)) {
			errors.email = settings.formErrors.emailInvalid;
		}

		// Валидация телефона (минимум 10 цифр, могут быть пробелы, скобки и дефисы)
		const phoneRegex = /^(?:\+7|7|8)[\s\-\(]?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}$/;
		const digitsOnly = this.order.phone.replace(/\D/g, '');
		if (!this.order.phone) {
			errors.phone = settings.formErrors.phone;
		} else if (digitsOnly.length < 10 || !phoneRegex.test(this.order.phone)) {
			errors.phone = settings.formErrors.phoneInvalid;
		}

		this.formErrors = errors;
		this.events.emit('contactsFormErrors:change', this.formErrors);
	}

	setOrderField(field: keyof TOrderForm, value: string): void {
		this.order[field] = value;
		this.validateOrder();
	}

	setContactsField(field: keyof TContactsForm, value: string): void {
		this.order[field] = value;
		this.validateContacts();
	}

	setPreview(item: IProduct): void {
		this.preview = item.id;
		this.emitChanges('preview:changed', item);
	}
}
