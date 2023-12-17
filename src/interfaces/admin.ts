import { IPagination } from './common';

export interface IBackofficeDashboardResponse {
    usersCount: number;
    businessCount: number;
}

export interface IProduct {
    productUuid: string;
    createdAt: Date['toISOString'];
    updatedAt: Date['toISOString'];
    productId: string;
    productName: string;
    productDescription: string;
    productPrice: number;
}

export interface IProductDTO {
    productName: string;
    productDescription: string;
    productPrice: number;
}

export interface IProductsResponse {
    data: IProduct[];
    pagination: IPagination;
}
