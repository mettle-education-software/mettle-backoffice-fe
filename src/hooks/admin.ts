import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    IBackofficeDashboardResponse,
    IProductsResponse,
    IProductDTO,
    QueryParams,
    IMettleUsersResponse,
} from 'interfaces';
import { adminService } from 'services';

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
        mutationFn: (data: IProductDTO) => adminService.post<IProductDTO, null>('/products', data),
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
        queryFn: () => adminService.get<IMettleUsersResponse>('/users', { params }).then(({ data }) => data),
    });
};
