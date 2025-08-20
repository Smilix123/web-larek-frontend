import { TSuccess, ISuccessActions, Price } from '../../types';
import { Component } from './base/Component';
import { settings } from '../../utils/constants';
import { ensureElement, formatNumberWithSeparator as formatNumber } from '../../utils/utils';

export class Success extends Component<TSuccess> {
	protected _close: HTMLElement;
	protected _total: HTMLElement;

	constructor(container: HTMLElement, actions?: ISuccessActions) {
		super(container);

		this._close = ensureElement<HTMLElement>('.order-success__close', this.container);

		this._total = ensureElement<HTMLElement>('.order-success__description', this.container);

		if (actions?.onClick) {
			this._close.addEventListener('click', actions.onClick);
		}
	}

	set total(value: Price) {
		this.setText(this._total, 'Списано ' + formatNumber(value) + ' ' + settings.currency);
	}
}
