import { useCallback, useEffect, useState } from 'react';
import { router } from '@inertiajs/react';

interface UseInfiniteScrollOptions {
    initialData: any[];
    endpoint: string;
    threshold?: number;
    enabled?: boolean;
    onLoad?: (newData: any[]) => void;
}

interface UseInfiniteScrollReturn {
    data: any[];
    loading: boolean;
    hasMore: boolean;
    loadMore: () => void;
    resetData: (newData: any[]) => void;
}

export function useInfiniteScroll({
    initialData,
    endpoint,
    threshold = 300,
    enabled = true,
    onLoad,
}: UseInfiniteScrollOptions): UseInfiniteScrollReturn {
    const [data, setData] = useState<any[]>(initialData);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [nextPage, setNextPage] = useState<number | null>(2);
    const [loadedAllInitial, setLoadedAllInitial] = useState(false);

    const loadMore = useCallback(async () => {
        if (loading || !enabled) return;

        setLoading(true);
        try {
            const url = new URL(endpoint, window.location.origin);
            
            if (loadedAllInitial) {
                // Load random data after all initial data is loaded
                url.searchParams.set('load_random', 'true');
            } else if (nextPage) {
                // Load next page of initial data
                url.searchParams.set('page', nextPage.toString());
            }

            const response = await fetch(url.toString(), {
                method: 'GET',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to load data');
            }

            const result = await response.json();
            const newBugs = result.bugs || [];

            if (newBugs.length > 0) {
                setData(prevData => {
                    const existingIds = new Set(prevData.map(item => item.id));
                    const uniqueNewBugs = newBugs.filter((bug: any) => !existingIds.has(bug.id));
                    return [...prevData, ...uniqueNewBugs];
                });
                onLoad?.(newBugs);
            }

            // Update pagination state
            if (!loadedAllInitial && !result.has_more) {
                setLoadedAllInitial(true);
                setNextPage(null);
                // Continue with random loading
                setHasMore(true);
            } else if (!loadedAllInitial) {
                setNextPage(result.next_page);
                setHasMore(result.has_more);
            }
            // For random loading, always has more
            
        } catch (error) {
            console.error('Error loading more data:', error);
        } finally {
            setLoading(false);
        }
    }, [loading, enabled, endpoint, nextPage, loadedAllInitial, onLoad]);

    const resetData = useCallback((newData: any[]) => {
        setData(newData);
        setLoadedAllInitial(false);
        setNextPage(2);
        setHasMore(true);
    }, []);

    useEffect(() => {
        if (!enabled) return;

        const handleScroll = () => {
            const scrollTop = window.pageYOffset;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;

            if (scrollTop + windowHeight >= documentHeight - threshold && hasMore && !loading) {
                loadMore();
            }
        };

        const throttle = (func: Function, limit: number) => {
            let inThrottle: boolean;
            return function(this: any, ...args: any[]) {
                if (!inThrottle) {
                    func.apply(this, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        };

        const throttledHandleScroll = throttle(handleScroll, 200);
        window.addEventListener('scroll', throttledHandleScroll);

        return () => {
            window.removeEventListener('scroll', throttledHandleScroll);
        };
    }, [hasMore, loading, loadMore, threshold, enabled]);

    return {
        data,
        loading,
        hasMore,
        loadMore,
        resetData,
    };
}