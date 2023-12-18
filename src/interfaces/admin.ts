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
