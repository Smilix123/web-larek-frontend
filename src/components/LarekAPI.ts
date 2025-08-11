import { Api } from './base/api';
import { IOrder, IProduct, IProductResponse } from '../types';

export interface ILarekAPI {
	getProducts(): Promise<IProductResponse>;
	getProductById(id: string): Promise<IProduct>;
	setOrder(order: IOrder): Promise<IOrder>;
}

export class LarekAPI extends Api implements ILarekAPI {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	getProducts(): Promise<IProductResponse> {
		return this.get<IProductResponse>(`/product`).then(
			(items: IProductResponse) => {
				items.items.forEach((item: IProduct) => {
					item.image = this.cdn + item.image;
				});
				return items;
			}
		);
	}

	getProductById(id: string): Promise<IProduct> {
		return this.get<IProduct>(`/product/${id}`);
	}

	setOrder(order: IOrder): Promise<IOrder> {
		return this.post<IOrder>(`/order`, order);
	}
}
