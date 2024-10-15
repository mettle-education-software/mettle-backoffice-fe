export interface ICreateMettleUserDTO {
    email: string;
    firstName: string;
    lastName: string;
    purchaseDate: string;
}

export interface INotification {
    link: string;
    isRead: boolean;
    description: string;
    title: string;
}

export interface IUserData {
    transactionId: string;
    firstName: string;
    uid: string;
    email: string;
    lastName: string;
    profilePhotoUrl: string;
    isAdmin: boolean;
}

export interface ISettings {
    theme: string;
    remainingResetAttempts: number;
    notifications: boolean;
    remainingPauses: number;
}

export interface IAccountStatus {
    purchaseDate: {
        _seconds: number;
        _nanoseconds: number;
    };
    melpStartDate: {
        _seconds: number;
        _nanoseconds: number;
    };
    isTutorialWatched: boolean;
    purchasedProducts: string[];
    isUserNewApi: boolean;
    payment: string;
    dedaStart: {
        isDedaStartConfirmed: boolean;
        startDates: {
            _seconds: number;
            _nanoseconds: number;
        }[];
    };
    pause: {
        pauseDates: {
            _seconds: number;
            _nanoseconds: number;
        }[];
        lastPauseDate: {
            _seconds: number;
            _nanoseconds: number;
        };
        pauseWeek: string;
        isAccountPaused: boolean;
    };
}

export interface IUserHistory {
    lastInputDate: {
        _seconds: number;
        _nanoseconds: number;
    };
}

export interface IUserPerformanceData {
    lampStartDate: null;
    customStats: unknown;
    generalStats: {
        review: 0;
        dedaQuality: 0;
        overall: 0;
        active: 0;
        passive: 0;
    };
}

export interface IProfileData {
    notifications: INotification[];
    userData: IUserData;
    settings: ISettings;
    accountStatus: IAccountStatus;
    userHistory: IUserHistory;
    unlockedDEDAs: string[];
    performanceData: IUserPerformanceData;
}
