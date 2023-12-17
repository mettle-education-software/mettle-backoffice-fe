import { useQuery } from '@tanstack/react-query';
import { TProductsShortList } from 'interfaces';
import { shortListService } from 'services';

export const useGetProductsShortList = () => {
    return useQuery({
        queryKey: ['get-products-short-list'],
        queryFn: () => shortListService.get<TProductsShortList>('/products').then(({ data }) => data),
    });
};
