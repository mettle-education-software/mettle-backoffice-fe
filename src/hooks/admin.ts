import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { IBackofficeDashboardResponse, IProductsResponse, IProductDTO } from 'interfaces';
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
        },
    });
};
