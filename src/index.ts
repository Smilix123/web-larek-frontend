import { EventEmitter } from './components/events/events';
import { Modal } from './components/view/base/Modal';
import { Basket } from './components/view/Basket';
import { WebLarekState } from './components/model/WebLarekModel';
import { Page } from './components/view/Page';
import { WebLarekAPI } from './components/api/WebLarekApi';
import './scss/styles.scss';
import { IProduct, IProductsCatalog, TContactsForm, TOrderForm } from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Order } from './components/view/Order';
import { Contacts } from './components/view/Contacts';
import { Card } from './components/view/Card';
import { Success } from './components/view/Success';

// Enum для всех событий приложения
enum Events {
	ProductsChanged = 'products:changed',
	CardSelect = 'card:select',
	PreviewChanged = 'preview:changed',
	BasketChanged = 'basket:changed',
	BasketOpen = 'basket:open',
	BasketDelete = 'basket:delete',
	OrderOpen = 'order:open',
	OrderSubmit = 'order:submit',
	ContactsSubmit = 'contacts:submit',
	ModalOpen = 'modal:open',
	ModalClose = 'modal:close',
	OrderFormErrorsChange = 'orderFormErrors:change',
	ContactsFormErrorsChange = 'contactsFormErrors:change',
}

// Инициализация api
const api = new WebLarekAPI(CDN_URL, API_URL);

// Инициализация брокера событий
const events = new EventEmitter();

// Модель данных приложения
const appData = new WebLarekState({}, events);

// Чтобы мониторить все события, для отладки
/* events.onAll(({ eventName, data }) => {
	console.log(eventName, data);
}); */

// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderFormTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsFormTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const orderSuccessTemplate = ensureElement<HTMLTemplateElement>('#success');

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Переиспользуемые части интерфейса
const order = new Order(cloneTemplate(orderFormTemplate), events);
const contacts = new Contacts(cloneTemplate(contactsFormTemplate), events);
const basket = new Basket(cloneTemplate(basketTemplate), events);

// Бизнес-логика

// изменение данных в каталоге товаров
events.on<IProductsCatalog>(Events.ProductsChanged, () => {
	page.catalogContainer = appData.catalog.map((item) => {
		const card = new Card(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit(Events.CardSelect, item),
		});
		return card.render({
			id: item.id,
			title: item.title,
			image: item.image,
			description: item.description,
			price: item.price,
			category: item.category,
		});
	});

	page.counter = appData.getProductsCount();
});

// реакция на клик на карточку каталога на странице
events.on(Events.CardSelect, (item: IProduct) => {
	appData.setPreview(item);
});

events.on(Events.PreviewChanged, (item: IProduct) => {
	const card = new Card(cloneTemplate(cardPreviewTemplate), {
		onClick: () => {
			events.emit(Events.BasketChanged, item);
			modal.close();
		},
	});
	card.changeButton(item.price, appData.inBasket(item.id));
	modal.render({
		content: card.render({
			id: item.id,
			title: item.title,
			image: item.image,
			description: item.description,
			price: item.price,
			category: item.category,
		}),
	});
});

// открыть модалку с корзиной
events.on(Events.BasketOpen, () => {
	basket.items = appData.order.items.map((id, index) => {
		const item = appData.getProduct(id);
		const card = new Card(cloneTemplate(cardBasketTemplate), {
			onClick: () => events.emit(Events.BasketDelete, item),
		});
		return card.render({
			id: item.id,
			title: item.title,
			price: item.price,
			index: index + 1,
		});
	});
	basket.total = appData.getTotal();

	modal.render({
		content: basket.render({}),
	});
});

// реакция на клик "Купить" или "Удалить из корзины" в модальном окне просмотра продукта
events.on(Events.BasketChanged, (item: IProduct) => {
	if (appData.inBasket(item.id)) {
		appData.deleteFromBasket(item.id);
	} else {
		appData.addToBasket(item.id);
	}
});

// реакция на клик на иконку удаления продукта в корзине
events.on(Events.BasketDelete, (item: IProduct) => {
	appData.deleteFromBasket(item.id);
	events.emit(Events.BasketOpen);
});

// реакция на клик на кнопку "Оформить" в корзине
events.on(Events.OrderOpen, () => {
	modal.render({
		content: order.render({
			payment: appData.order.payment,
			address: appData.order.address,
			valid: !!appData.order.payment && !!appData.order.address,
			errors: [],
		}),
	});
});

// реакция на клики по кнопкам "Онлайн", "При получении" и на ввод текста в поле "Адрес"
events.on(/^order\..*:change/, (data: { field: keyof TOrderForm; value: string }) => {
	appData.setOrderField(data.field, data.value);
});

// реакция на изменение состояния валидации формы выбора оплаты и ввода адреса доставки
events.on(Events.OrderFormErrorsChange, (errors: Partial<TOrderForm>) => {
	order.valid = Object.keys(errors).length > 0 ? false : true;
	order.errors = Object.values(errors)
		.filter((i) => !!i)
		.join('; ');
});

// реакция на кнопку "Далее" в модальном окне первого шага оформления заказа
events.on(Events.OrderSubmit, () => {
	modal.render({
		content: contacts.render({
			phone: appData.order.phone,
			email: appData.order.email,
			valid: !!appData.order.phone && !!appData.order.email,
			errors: [],
		}),
	});
});

// реакция на ввод текста в поля "Телефон" и "Email"
events.on(/^contacts\..*:change/, (data: { field: keyof TContactsForm; value: string }) => {
	appData.setContactsField(data.field, data.value);
});

// реакция на изменение состояния валидации формы ввода номера телефона и email
events.on(Events.ContactsFormErrorsChange, (errors: Partial<TContactsForm>) => {
	contacts.valid = Object.keys(errors).length > 0 ? false : true;
	contacts.errors = Object.values(errors)
		.filter((i) => !!i)
		.join('; ');
});

// реакция на кнопку "Оплатить" в модальном окне второго шага оформления заказа
events.on(Events.ContactsSubmit, () => {
	api
		.sendOrder(appData.order)
		.then((result) => {
			appData.clearBasket();
			const success = new Success(cloneTemplate(orderSuccessTemplate), {
				onClick: () => {
					modal.close();
				},
			});

			modal.render({
				content: success.render({ total: result.total }),
			});
		})
		.catch(console.error);
});

// блокировка прокрутки страницы если открыто модальное окно
events.on(Events.ModalOpen, () => {
	page.locked = true;
});

// разблокировка
events.on(Events.ModalClose, () => {
	page.locked = false;
});

// первоначальная загрузка каталога товаров
api
	.getProducts()
	.then((data) => {
		appData.setProducts(data);
	})
	.catch(console.error);
