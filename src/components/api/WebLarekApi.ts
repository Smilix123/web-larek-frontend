import { Api } from './base/api';
import { IOrder, IOrderAnswer, IProduct, IProductsCatalog } from '../../types';
import { replaceSvgWithPng } from '../../utils/utils';

export interface IWebLarekAPI {
	getProducts(): Promise<IProduct[]>;
	sendOrder(data: Partial<IOrder>): Promise<IOrderAnswer>;
}

export class WebLarekAPI extends Api implements IWebLarekAPI {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	getProducts(): Promise<IProduct[]> {
		return this.get('/product').then((data: IProductsCatalog) =>
			data.items.map((item) => ({
				...item,
				image: replaceSvgWithPng(this.cdn + item.image),
			}))
		);
	}

	sendOrder(data: Partial<IOrder>): Promise<IOrderAnswer> {
		return this.post('/order', data).then((data: IOrderAnswer) => data);
	}
}
