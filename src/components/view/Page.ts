import { Component } from './base/Component';
import { IEvents } from '../events/events';
import { ensureElement } from '../../utils/utils';
import { CardsCount } from '../../types';

interface IPage {
	catalogContainer: HTMLElement[];
	counter: CardsCount;
	locked: boolean;
}

export class Page extends Component<IPage> implements IPage {
	protected _counter: HTMLElement;
	protected _catalog: HTMLElement;
	protected _wrapper: HTMLElement;
	protected _basket: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);
		this._counter = ensureElement('.header__basket-counter', this.container);
		this._catalog = ensureElement('.gallery', this.container);
		this._wrapper = ensureElement('.page__wrapper', this.container);
		this._basket = ensureElement('.header__basket', this.container) as HTMLButtonElement;
		this._basket.addEventListener('click', () => {
			this.events.emit('basket:open');
		});
	}

	set counter(value: CardsCount) {
		this.setText(this._counter, value.toString());
	}

	set catalogContainer(value: HTMLElement[]) {
		this._catalog.replaceChildren(...value);
	}

	set locked(value: boolean) {
		if (value) {
			this.toggleClass(this._wrapper, 'page__wrapper_locked', true);
		} else {
			this.toggleClass(this._wrapper, 'page__wrapper_locked', false);
		}
	}
}
