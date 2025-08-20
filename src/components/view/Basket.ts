import { IBasket, id, IProduct } from '../../types';
import { settings } from '../../utils/constants';
import {
	createElement,
	ensureElement,
	formatNumberWithSeparator as formatNumber,
} from '../../utils/utils';
import { Component } from './base/Component';
import { IEvents } from '../events/events';

export class Basket extends Component<IBasket> implements IBasket {
	protected _basketList: HTMLElement;
	protected _button: HTMLButtonElement;
	protected _total: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);
		this._basketList = ensureElement('.basket__list', this.container);
		this._button = ensureElement('.basket__button', this.container) as HTMLButtonElement;
		this._total = ensureElement('.basket__price', this.container);
		this._button.addEventListener('click', () => {
			this.events.emit('order:open');
		});
	}

	set items(items: HTMLElement[]) {
		if (items.length) {
			this._basketList.replaceChildren(...items);
			this.setDisabled(this._button, false);
		} else {
			this._basketList.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: settings.basket.empty,
				})
			);
			this.setDisabled(this._button, true);
		}
	}

	set total(value: number) {
		this.setText(this._total, formatNumber(value) + ' ' + settings.currency);
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
		this.deleteButton = ensureElement('.basket__item-delete', this.container) as HTMLButtonElement;
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

	set price(value: number) {
		this.setText(this.cardPrice, value);
	}
}
