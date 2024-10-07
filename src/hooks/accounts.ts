import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { ICreateMettleUserDTO, IProfileData, IResponseMessage } from 'interfaces';
import { accountsService } from 'services';

export const useMakeUserAdmin = () => {
    return useMutation({
        mutationKey: ['make-user-admin'],
        mutationFn: (userUid: string) => accountsService.put<null, IResponseMessage>(`/${userUid}/admin`),
    });
};

export const useCreateMettleUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['create-mettle-user'],
        mutationFn: (data: ICreateMettleUserDTO) =>
            accountsService.post<ICreateMettleUserDTO, IResponseMessage>('/v2', data),
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
        mutationFn: ({
            userUid,
            shouldSendEmailNotification,
        }: {
            userUid: string;
            shouldSendEmailNotification?: boolean;
        }) => {
            console.log('sending data with ', { shouldNotSendEmail: !shouldSendEmailNotification });
            return accountsService.delete<IResponseMessage, { shouldNotSendEmail: boolean }>(`/v2/${userUid}`, {
                data: { shouldNotSendEmail: !shouldSendEmailNotification },
            });
        },
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

export const useUpdateProfilePhoto = () => {
    return useMutation({
        mutationKey: ['update-profile-photo'],
        mutationFn: ({ userUid, data }: { userUid: string; data: FormData }) =>
            accountsService.put<FormData, IResponseMessage>(`/${userUid}/profile`, data),
    });
};

export const useDeleteProfilePhoto = () => {
    return useMutation({
        mutationKey: ['delete-profile-photo'],
        mutationFn: (userUid: string) => accountsService.delete<IResponseMessage>(`/${userUid}/profile`),
    });
};

export const useGetUserDetails = (userUid?: string) => {
    return useQuery({
        queryKey: ['get-user-details'],
        queryFn: () => accountsService.get<IProfileData>(`/users/${userUid}`).then(({ data }) => data),
        enabled: !!userUid,
    });
};

export const useUpdateUserPassword = () => {
    return useMutation({
        mutationKey: ['update-user-password'],
        mutationFn: ({ userUid, data }: { userUid: string; data: { password: string } }) =>
            accountsService.post<{ password: string }, IResponseMessage>(`/users/${userUid}/password`, data),
        onError: (error: AxiosError) => error,
    });
};

export const useUpdateUserEmail = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['update-user-email'],
        mutationFn: ({ userUid, data }: { userUid: string; data: { email: string } }) =>
            accountsService.post<{ email: string }, IResponseMessage>(`/users/${userUid}/email`, data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['get-user-details'],
            });
        },
    });
};
