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
