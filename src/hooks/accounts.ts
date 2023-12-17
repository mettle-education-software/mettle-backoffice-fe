import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ICreateMettleUserDTO, IProfileData, IResponseMessage } from 'interfaces';
import { accountsService } from 'services';

export const useMakeUserAdmin = () => {
    return useMutation({
        mutationKey: ['make-user-admin'],
        mutationFn: (userUid: string) => accountsService.put<null, IResponseMessage>(`/accounts/${userUid}/admin`),
    });
};

export const useCreateMettleUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['create-mettle-user'],
        mutationFn: (data: ICreateMettleUserDTO) =>
            accountsService.post<ICreateMettleUserDTO, IResponseMessage>('/', data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['get-mettle-users'],
            });
        },
    });
};

export const useDeleteMettleUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['delete-mettle-user'],
        mutationFn: (userUid: string) => accountsService.delete<IResponseMessage>(`/${userUid}`),
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['get-mettle-users'],
            });
        },
    });
};

export const useGetUserProfile = (userUid?: string) => {
    return useQuery({
        queryKey: ['get-user-profile', userUid],
        queryFn: () => accountsService.get<IProfileData>(`/users/${userUid}`).then(({ data }) => data),
        enabled: !!userUid,
    });
};
