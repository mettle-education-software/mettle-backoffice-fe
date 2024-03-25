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

export interface IMettleUser {
    accountStatus: {
        purchasedProducts: string[];
        purchaseDate: {
            _seconds: number;
            _nanoseconds: number;
        };
        isUserNewApi: boolean;
        melpStartDate: {
            _seconds: number;
            _nanoseconds: number;
        };
        payment: string;
        dedaStart: {
            isDedaStartConfirmed: boolean;
            startDates: any[];
        };
        isTutorialWatched: boolean;
        pause: {
            pauseDates: any[];
            lastPauseDate: null;
            pauseWeek: null;
            isAccountPaused: boolean;
        };
    };
    settings: {
        remainingPauses: number;
        theme: string;
        remainingResetAttempts: number;
        notifications: boolean;
    };
    userData: {
        firstName: string;
        lastName: string;
        uid: string;
        email: string;
        transactionId: string;
        profilePhotoUrl: null;
    };
    unlockedDEDAs: string[];
    notifications: {
        link: string;
        isRead: boolean;
        description: string;
        title: string;
    }[];
    currentTime: {
        currentDay: number;
        currentWeek: number;
        daysSinceMelpBegin: number;
        daysSinceFirstPurchase: number;
    };
    metadata: {
        mailchimp: {
            listId: string;
            tags: string[];
        };
    };
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
