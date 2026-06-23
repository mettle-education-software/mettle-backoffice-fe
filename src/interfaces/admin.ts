import { IPagination } from './common';

export interface IBackofficeDashboardResponse {
    usersCount: number;
    businessCount: number;
}

export interface MettleProduct extends Record<string, string> {
    productUuid: string;
    productId: string;
    productName: string;
    productDescription: string;
    checkoutUrl: string;
    status: string;
    contentfulEntryId: string;
    createdAt: string;
    updatedAt: string;
    webhookEndpoint: string;
}

export interface CreateMettleProductDTO {
    productName: string;
    productDescription: string;
    checkoutUrl: string;
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
    customClaims: {
        roles: string[];
    };
    last_login: string | null;
    last_time_active: string | null;
    overall_performance: number;
    melp_status: MelpStatus;
    status: string;
    lastLogin: string;
    // TODO -> ADD ENUM LATER
}

export interface IUpdateUserDataDTO {
    firstName?: string;
    lastName?: string;
    email?: string;
}

export interface IMettleUsersResponse {
    data: IMettleUser[];
    pagination: IPagination;
}

export interface IProductsResponse {
    data: MettleProduct[];
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
