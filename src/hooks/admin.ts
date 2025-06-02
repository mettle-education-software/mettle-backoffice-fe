import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import {
    IBackofficeDashboardResponse,
    IProductsResponse,
    CreateMettleProductDTO,
    QueryParams,
    IMettleUsersResponse,
    ILeaderboardResponse,
    IMailchimpListsResponse,
    IMailchimpListTagsResponse,
    IUpdateUserDataDTO,
    IUpdateUserMailchimpTagsDTO,
} from 'interfaces';
import { useNotificationsContext } from 'providers';
import { adminService } from 'services';
import { saveBlobAsFile } from 'utils/filteUtils';

export const useGetBackofficeDashboard = () => {
    return useQuery({
        queryKey: ['get-backoffice-dashboard'],
        queryFn: () => adminService.get<IBackofficeDashboardResponse>('/dashboard').then(({ data }) => data),
    });
};

export const useGetMettleProducts = () => {
    return useQuery({
        queryKey: ['get-mettle-products'],
        queryFn: () => adminService.get<IProductsResponse>('/products').then(({ data }) => data),
    });
};

export const useCreateMettleProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['create-mettle-product'],
        mutationFn: (data: CreateMettleProductDTO) =>
            adminService.post<CreateMettleProductDTO, null>('/products', data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['get-mettle-products'],
            });
            await queryClient.invalidateQueries({
                queryKey: ['get-products-short-list'],
            });
        },
    });
};

export const useDeleteMettleProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['delete-mettle-product'],
        mutationFn: (productUuid: string) => adminService.delete<null>(`/products/${productUuid}`),
        onError: async (error) => {
            console.error(error.message);
            await queryClient.invalidateQueries({
                queryKey: ['get-mettle-products'],
            });
            await queryClient.invalidateQueries({
                queryKey: ['get-products-short-list'],
            });
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['get-mettle-products'],
            });
            await queryClient.invalidateQueries({
                queryKey: ['get-products-short-list'],
            });
        },
    });
};

export const useGetMettleUsers = (params: QueryParams) => {
    return useQuery({
        queryKey: ['get-mettle-users', params],
        queryFn: () => adminService.get<IMettleUsersResponse>('/v2/users', { params }).then(({ data }) => data),
    });
};

export const useGetMelpLeaderboard = () => {
    return useQuery({
        queryKey: ['get-melp-leaderboard'],
        queryFn: () => adminService.get<ILeaderboardResponse>('/users/leaderboard').then(({ data }) => data),
        refetchInterval: 25 * 60 * 1000,
    });
};

export const useGetMailchimpLists = () => {
    return useQuery({
        queryKey: ['get-mailchimp-lists'],
        queryFn: () => adminService.get<IMailchimpListsResponse>('/mailchimp/lists').then(({ data }) => data),
    });
};

export const useGetMailchimpListTags = (listId?: string) => {
    return useQuery({
        enabled: !!listId,
        queryKey: ['get-mailchimp-list-tags', listId],
        queryFn: () =>
            adminService.get<IMailchimpListTagsResponse>(`/mailchimp/lists/${listId}/tags`).then(({ data }) => data),
    });
};

export const useSaveProductMailchimpList = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: { productId: string; listId: string }) =>
            adminService.put(`mailchimp/lists/${data.listId}/products/${data.productId}`),
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['get-mettle-products'],
            });
            await queryClient.invalidateQueries({
                queryKey: ['get-products-short-list'],
            });
        },
    });
};

export const useGetAllMailchimpTags = () => {
    return useQuery({
        queryKey: ['get-all-mailchimp-tags'],
        queryFn: async () => {
            const lists = await adminService.get<IMailchimpListsResponse>('/mailchimp/lists').then(({ data }) => data);
            const allTagsResponses = await Promise.all(
                lists.lists.map(async ({ id }) => {
                    return await adminService.get<IMailchimpListTagsResponse>(`/mailchimp/lists/${id}/tags`);
                }),
            );
            const tags = allTagsResponses.map(({ data }) => data.tags).flat();
            return tags;
        },
    });
};

export const useUpdateMettleUser = () => {
    const queryClient = useQueryClient();
    const { showNotification } = useNotificationsContext();

    return useMutation({
        mutationKey: ['update-mettle-user'],
        mutationFn: ({ userUid, payloadData }: { userUid: string; payloadData: IUpdateUserDataDTO }) =>
            adminService.patch<IUpdateUserDataDTO, { message: string }>(`/users/${userUid}`, payloadData),
        onSuccess: async () => {
            showNotification('success', 'Successo!', 'Usuário atualizado com sucesso!');
            await queryClient.invalidateQueries({
                queryKey: ['get-mettle-users'],
            });
        },
        onError: (error) => {
            const errorMessage = error instanceof AxiosError ? error.response?.data : error?.message;
            showNotification('error', 'Erro!', errorMessage ?? 'Algo deu errado. Tente de novo mais tarde.');
        },
    });
};

export const useUpdateMettleUserMailchimpTags = () => {
    const queryClient = useQueryClient();
    const { showNotification } = useNotificationsContext();

    return useMutation({
        mutationKey: ['update-mettle-mailchimp-tags'],
        mutationFn: ({ userUid, dto }: { userUid: string; dto: IUpdateUserMailchimpTagsDTO }) =>
            adminService.patch<
                IUpdateUserMailchimpTagsDTO,
                {
                    message: string;
                }
            >(`/users/${userUid}/mailchimp-tags`, dto),
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['get-mettle-users'],
            });
            showNotification('success', 'Successo!', 'Tags do Mailchimp atualizadas com sucesso!');
        },
        onError: (error) => {
            const errorMessage = error instanceof AxiosError ? error.response?.data : error?.message;
            showNotification('error', 'Erro!', errorMessage ?? 'Algo deu errado. Tente de novo mais tarde.');
        },
    });
};

export const useApplyProductToUser = () => {
    const queryClient = useQueryClient();
    const { showNotification } = useNotificationsContext();

    return useMutation({
        mutationKey: ['apply-product-to-user'],
        mutationFn: ({ userUid, productUuid }: { userUid: string; productUuid: string }) =>
            adminService.put(`/products/${productUuid}/apply/${userUid}`),
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['get-mettle-users'],
            });
            showNotification('success', 'Successo!', 'Produto adicionado!');
        },
        onError: (error) => {
            const errorMessage = error instanceof AxiosError ? error.response?.data : error?.message;
            showNotification('error', 'Erro!', errorMessage ?? 'Algo deu errado. Tente de novo mais tarde.');
        },
    });
};

export const useDownloadUsersCSV = () => {
    const { showNotification } = useNotificationsContext();

    return useMutation({
        mutationFn: () =>
            adminService.get<string>('/v2/users/report').then(({ data, headers }) => ({
                headers,
                data,
            })),
        onSuccess: ({ data, headers }) => {
            const dataBlob = new Blob([data], {
                type: 'text/csv;charset=utf-8;',
            });
            const contentDisposition = headers['content-disposition'];
            const fileName =
                typeof contentDisposition === 'string' ? contentDisposition.split('filename=')[1] : 'users.csv';
            saveBlobAsFile(dataBlob, fileName.replace(/"/g, ''));
        },
        onError: () => {
            showNotification('error', 'Erro!', 'Algo deu errado. Tente de novo mais tarde.');
        },
    });
};
