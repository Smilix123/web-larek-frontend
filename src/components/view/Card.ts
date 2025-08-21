import { CardCategory, CardImageUrl, CardTitle, ICard, ICardActions, id, Price } from '../../types';
import { settings } from '../../utils/constants';
import { formatNumberWithSeparator as formatNumber } from '../../utils/utils';
import { Component } from './base/Component';

export class Card extends Component<ICard> implements ICard {
	protected _title: HTMLElement;
	protected _image?: HTMLImageElement;
	protected _description?: HTMLElement;
	protected _category?: HTMLElement;
	protected _button?: HTMLButtonElement;
	protected _price: HTMLElement;
	protected _itemIndex?: HTMLElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container);

		this._title = container.querySelector('.card__title');
		this._image = container.querySelector('.card__image');
		this._description = container.querySelector('.card__text');
		this._category = container.querySelector('.card__category');
		this._button = container.querySelector('.card__button');
		this._price = container.querySelector('.card__price');
		this._itemIndex = container.querySelector('.basket__item-index');

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}
	set id(value: id) {
		this.container.dataset.id = value;
	}

	set title(value: CardTitle) {
		this.setText(this._title, value);
	}

	set image(value: CardImageUrl) {
		this.setImage(this._image, value, this.title);
	}

	set category(value: CardCategory) {
		this.setText(this._category, value);
		this.toggleClass(this._category, settings.categories[value]);
	}

	set price(value: Price) {
		let priceText = '';
		if (!value) {
			priceText = settings.card.noPrice;
			this.toggleButton(true);
		} else {
			priceText = formatNumber(value) + ' ' + settings.currency;
		}
		this.setText(this._price, priceText);
	}

	set index(value: number) {
		this.setText(this._itemIndex, String(value));
	}

	changeButton(price: Price, inBasket: boolean): void {
		if (!price) {
			this.setText(this._button, settings.buyButtonValues.disabled);
			this.toggleButton(true);
		} else {
			if (inBasket) {
				this.setText(this._button, settings.buyButtonValues.delete);
			} else {
				this.setText(this._button, settings.buyButtonValues.add);
			}
		}
	}

	toggleButton(state: boolean) {
		this.setDisabled(this._button, state);
	}
}
