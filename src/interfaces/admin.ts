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

export enum MelpStatusEnum {
    MELP_BEGIN = 'Início do IMERSO',
    CAN_START_DEDA = 'DEDA pode começar',
    DEDA_STARTED = 'DEDA iniciado',
    DEDA_STARTED_NOT_BEGUN = 'DEDA aguardando início',
    DEDA_PAUSED = 'DEDA pausado',
    DEDA_FINISHED = 'DEDA finalizado',
}

export type MelpStatus = keyof typeof MelpStatusEnum;

export interface IMettleUser {
    created_at: string;
    user_uid: string;
    email: string;
    first_name: string;
    last_name: string;
    mailchimp_metadata?: {
        tags?: string[];
        listId?: string;
    };
    last_login: string | null;
    last_time_active: string | null;
    overall_performance: number;
    melp_status: MelpStatus;
    status: string;
    // TODO -> ADD ENUM LATER
}

export interface IMailchimpListsResponse {
    lists: {
        id: string;
        name: string;
    }[];
}

export interface IMailchimpListTagsResponse {
    tags: {
        id: number;
        name: string;
    }[];
}

export interface IUpdateUserDataDTO {
    firstName?: string;
    lastName?: string;
    email?: string;
}

export interface IUpdateUserMailchimpTagsDTO {
    listId: string;
    tags: {
        name: string;
        status: 'active' | 'inactive';
    }[];
}

export interface IMettleUsersResponse {
    data: IMettleUser[];
    pagination: IPagination;
}

export interface IProductsResponse {
    data: IProduct[];
    pagination: IPagination;
}

export interface ILeaderUser {
    currentMelpDay: number;
    email: string;
    performanceOverall: number;
    score: number;
    uid: string;
}

export interface ILeaderboardResponse {
    data: ILeaderUser[];
}
