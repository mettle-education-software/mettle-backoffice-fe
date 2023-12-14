import { Rule } from 'rc-field-form/es/interface';
import React from 'react';

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type QueryParams = Record<string, unknown>;

interface Cancel {
    message: string;
}

export type HTTPOptions = {
    params?: QueryParams;
    data?: unknown;
    cancelToken?: {
        promise: Promise<Cancel>;
        reason?: Cancel;
        throwIfRequested(): void;
    };
    headers?: Record<string, string>;
};

export interface HTTPResponse<T> {
    status: number;
    statusText: string;
    data: T;
}

export interface HTTPError<T = Record<string, string[]>> {
    status: number;
    message: string;
}

export interface HTTPClient {
    get<T>(url: string, options?: HTTPOptions): Promise<HTTPResponse<T>>;

    post<D, R>(url: string, data?: D, options?: HTTPOptions): Promise<HTTPResponse<R>>;

    put<D, R>(url: string, data?: D, options?: HTTPOptions): Promise<HTTPResponse<R>>;

    patch<D, R>(url: string, data?: D, options?: HTTPOptions): Promise<HTTPResponse<R>>;

    delete<T>(url: string, options?: HTTPOptions): Promise<HTTPResponse<T>>;
}

export interface IPagination {
    total: number;
    pageSize: number;
    pageOffset: number;
}

export enum EnglishLevel {
    BASIC = 'Básico',
    INTERMEDIATE = 'Intermediário',
    ADVANCED = 'Avançado',
}

export enum AvailableProducts {
    MELP = 'MELP',
    // TWO_LESSONS = 'Aula 2X na semana',
    // THREE_LESSONS = 'Aula 3X na semana',
    // FOUR_LESSONS = 'Aula 4X na semana',
    // FIVE_LESSONS = 'Aula 5X na semana',
}

export interface IFormObject {
    key: string;
    itemProps: {
        name: string;
        label: string;
        rules?: Rule[];
    };
    fieldProps: Record<string, any>;
    Field: React.FC<React.PropsWithoutRef<any>>;
}
