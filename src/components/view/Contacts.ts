import { ClientEmail, ClientPhone, TContactsForm } from '../../types';
import { IEvents } from '../events/events';
import { Form } from './base/Form';

export class Contacts extends Form<Partial<TContactsForm>> {
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
	}

	set phone(value: ClientPhone) {
		(this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
	}
	set email(value: ClientEmail) {
		(this.container.elements.namedItem('email') as HTMLInputElement).value = value;
	}
}
