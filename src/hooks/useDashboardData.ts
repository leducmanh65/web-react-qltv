import { useCallback, useEffect, useState } from 'react';
import { getBestSellers, getRecentlyRead, getWishList, getGenres, getTagsRailway } from '../services/api';
import { Book, Genre } from '../types';
import { seedBestSellers, seedGenres, seedRecentlyRead, seedWishList } from '../data/dashboardSeed';

type DashboardData = {
    bestSellersData: Book[];
    recentlyReadData: Book[];
    wishListData: Book[];
    genreData: Genre[];
    loading: boolean;
    error: Error | null;
    refresh: () => void;
};

const mapBook = (raw: any): Book => ({
    id: raw?.id ?? raw?.bookCode ?? raw?.isbn ?? raw?.title ?? Math.random().toString(),
    title: raw?.title ?? 'Không có tiêu đề',
    author: raw?.author ?? raw?.authorName ?? (raw?.authors?.[0]?.authorName || ''),
    image: raw?.image ?? raw?.thumbnail ?? raw?.coverUrl,
    imageUrl: raw?.imageUrl ?? raw?.thumbnail ?? raw?.coverUrl,
    category: raw?.category?.categoryName ?? raw?.categoryName ?? raw?.tags?.[0]?.tagName,
    genreId: raw?.category?.id ?? raw?.categoryId,
    description: raw?.description,
    publishYear: raw?.publishYear,
    quantity: raw?.availableQuantity ?? raw?.totalQuantity,
});

const mapGenre = (raw: any): Genre => ({
    id: raw?.id ?? raw?.categoryId ?? Math.random(),
    name: raw?.categoryName ?? raw?.name ?? raw?.tagName ?? 'Chủ đề',
    icon: raw?.icon,
});

export default function useDashboardData(userId: string | number = 'me'): DashboardData {
    const [bestSellersData, setBestSellersData] = useState<Book[]>([]);
    const [recentlyReadData, setRecentlyReadData] = useState<Book[]>([]);
    const [wishListData, setWishListData] = useState<Book[]>([]);
    const [genreData, setGenreData] = useState<Genre[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    const hasApiBase = Boolean(process.env.REACT_APP_API_BASE || process.env.REACT_APP_API_URL);
    const hasTagsApi = Boolean(process.env.REACT_APP_TAGS_URL);

    const mapTagsToGenres = (tags: any[]): Genre[] => {
        if (!Array.isArray(tags)) return [];
        return tags.map((t) => ({ id: t.id, name: t.tagName || t.name || 'Chủ đề', icon: t.icon }));
    };

    const fetchAll = useCallback(
        async (signal?: AbortSignal) => {
            setLoading(true);
            setError(null);
            try {
                let bestList: Book[] = seedBestSellers as Book[];
                let recentList: Book[] = seedRecentlyRead as Book[];
                let wishList: Book[] = seedWishList as Book[];
                let genreList: Genre[] = seedGenres as Genre[];

                if (hasApiBase) {
                    const [best, recent, wish] = await Promise.all([
                        getBestSellers(),
                        getRecentlyRead(userId),
                        getWishList(userId),
                    ]);
                    const bestArr = Array.isArray(best) ? best : (best as any)?.items || [];
                    const recentArr = Array.isArray(recent) ? recent : [];
                    const wishArr = Array.isArray(wish) ? wish : [];

                    bestList = bestArr.length ? bestArr.map(mapBook) : seedBestSellers;
                    recentList = recentArr.length ? recentArr.map(mapBook) : seedRecentlyRead;
                    wishList = wishArr.length ? wishArr.map(mapBook) : seedWishList;
                }

                if (hasTagsApi) {
                    const tagsRes = await getTagsRailway();
                    const tags = (tagsRes as any)?.result ?? tagsRes;
                    const mapped = mapTagsToGenres(tags);
                    genreList = mapped.length ? mapped : genreList;
                } else if (hasApiBase) {
                    const genres = await getGenres();
                    const gList = Array.isArray(genres) ? genres : (genres as any)?.items || [];
                    const mapped = gList.map(mapGenre);
                    genreList = mapped.length ? mapped : genreList;
                }

                setBestSellersData(bestList);
                setRecentlyReadData(recentList);
                setWishListData(wishList);
                setGenreData(genreList);

                try {
                    localStorage.setItem('books', JSON.stringify(bestList));
                } catch {
                    // ignore storage errors
                }
            } catch (err: any) {
                if (err?.name === 'AbortError') return;
                setError(err as Error);
                setBestSellersData(seedBestSellers);
                setRecentlyReadData(seedRecentlyRead);
                setWishListData(seedWishList);
                setGenreData(seedGenres);
            } finally {
                setLoading(false);
            }
        },
        [userId, hasApiBase, hasTagsApi],
    );

    useEffect(() => {
        const controller = new AbortController();
        fetchAll(controller.signal);
        return () => controller.abort();
    }, [fetchAll]);

    const refresh = useCallback(() => {
        const controller = new AbortController();
        fetchAll(controller.signal);
    }, [fetchAll]);

    return {
        bestSellersData,
        recentlyReadData,
        wishListData,
        genreData,
        loading,
        error,
        refresh,
    };
}
