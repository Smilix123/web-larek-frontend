import { ClientAddress, TOrderForm, PaymentMethod } from '../../types';
import { IEvents } from '../events/events';
import { Form } from './base/Form';

export class Order extends Form<Partial<TOrderForm>> implements TOrderForm {
	protected _buttonCard: HTMLButtonElement;
	protected _buttonCash: HTMLButtonElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._buttonCard = this.container.elements.namedItem('card') as HTMLButtonElement;
		this._buttonCash = this.container.elements.namedItem('cash') as HTMLButtonElement;

		this._buttonCard.addEventListener('click', () => {
			this._buttonCard.classList.add('button_alt-active');
			this._buttonCash.classList.remove('button_alt-active');
			this.onInputChange('payment', this._buttonCard.name);
		});

		this._buttonCash.addEventListener('click', () => {
			this._buttonCash.classList.add('button_alt-active');
			this._buttonCard.classList.remove('button_alt-active');
			this.onInputChange('payment', this._buttonCash.name);
		});
	}

	set address(value: ClientAddress) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value = value;
	}

	set payment(value: PaymentMethod) {
		if (value) {
			this.toggleClass(
				this.container.elements.namedItem(value) as HTMLButtonElement,
				'button_alt-active',
				true
			);
		} else {
			this._buttonCard.classList.remove('button_alt-active');
			this._buttonCash.classList.remove('button_alt-active');
		}
	}
}
