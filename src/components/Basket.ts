import { IBasket, id, IProduct, Price } from '../types';
import { settings } from '../utils/constants';
import { ensureElement } from '../utils/utils';
import { Component } from './base/Component';
import { IEvents } from './base/events';

export class Basket extends Component<IBasket> {
	protected basketList: HTMLElement;
	protected orderButton: HTMLButtonElement;
	protected totalPrice: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);
		this.basketList = ensureElement('.basket__list', this.container);
		this.orderButton = ensureElement('.basket__button',this.container) as HTMLButtonElement;
		this.totalPrice = ensureElement('.basket__price', this.container);
		this.orderButton.addEventListener('click', () => {
			this.events.emit('order:open');
		});
	}

	set items(value: HTMLElement[] | string) {
		this.basketList.replaceChildren(...value);
	}

	set total(value: number) {
		this.setText(this.totalPrice, `${value} ${settings.currency}`);
	}

	set button(state: boolean) {
		this.setDisabled(this.orderButton, state);
	}
}

export class CardBasket extends Component<IProduct> {
	protected basketItemIndex: HTMLElement;
	protected productId: string;
	protected cardTitle: HTMLElement;
	protected cardPrice: HTMLElement;
	protected deleteButton: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);
		this.basketItemIndex = ensureElement('.basket__item-index', this.container);
		this.cardTitle = ensureElement('.card__title', this.container);
		this.cardPrice = ensureElement('.card__price', this.container);
		this.deleteButton = ensureElement('.basket__item-delete',this.container) as HTMLButtonElement;
		this.deleteButton.addEventListener('click', () => {
			this.events.emit('basketItem:remove', this);
		});
	}

	set id(value: id) {
		this.productId = value;
	}

	get id() {
		return this.productId;
	}

	set index(value: number) {
		this.setText(this.basketItemIndex, value.toString());
	}

	set title(value: string) {
		this.setText(this.cardTitle, value);
	}

	set price(value: Price) {
		this.setText(this.cardPrice, value);
	}
}
