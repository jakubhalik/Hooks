import { useCallback, useState } from 'react';
import { useErrorState } from './ErrorContext';
import { ErrorResponse, useFetch } from './useFetch';

type FetchConfig = {
    stateKey: string;
    endpoint: string;
    attribute?: string;
};

type ReturnConfig<T> = {
    [key: string]: [T, React.Dispatch<React.SetStateAction<T>>, string];
};

type NameResponse = {
    data?: { name: string }[];
    error?: ErrorResponse;
};

type UseGetAndSetReturnType<T> = ReturnConfig<T> & {
    fetchData: (stateKey: string) => Promise<void>;
    endpoints: Record<string, string>;
};

export default function useGetAndSet(
    fetchConfigs: FetchConfig[]
): UseGetAndSetReturnType<string[]> {
    const { fetchApi } = useFetch();

    const [states, setStates] = useState<Record<string, string[]>>({});

    const { showError } = useErrorState();

    const fetchData = useCallback(
        async (stateKey: string) => {
            const config = fetchConfigs.find((c) => c.stateKey === stateKey);

            if (!config) {
                showError(`No configuration found for stateKey: ${stateKey}.`);

                console.error(
                    `No configuration found for stateKey: ${stateKey}.`
                );
                return;
            }

            const { endpoint, attribute } = config;

            const response = await fetchApi<NameResponse>(endpoint, {
                method: 'GET',
            });

            if ('data' in response && Array.isArray(response.data)) {
                const data = response.data.map((item) =>
                    attribute ? item[attribute] : item.name
                );

                setStates((prev) => ({ ...prev, [stateKey]: data }));

                const displayKey = stateKey
                    .replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1 $2')
                    .replace(/^\w/, (c) => c.toUpperCase());

                console.log(`${displayKey}:`, data);
            } else if ('error' in response) {
                showError(`Error fetching ${stateKey}. ${response.error}`);
            }
        },
        [fetchApi, fetchConfigs, showError]
    );

    const result: ReturnConfig<string[]> = {};

    fetchConfigs.forEach((config) => {
        const { stateKey, endpoint } = config;

        const setStateForKey = (newState: React.SetStateAction<string[]>) => {
            setStates((prev) => ({
                ...prev,
                [stateKey]: newState as string[],
            }));
        };

        result[config.stateKey] = [
            states[stateKey] || [],
            setStateForKey,
            endpoint,
        ];
    });

    return {
        ...result,
        fetchData,
        endpoints: fetchConfigs.reduce(
            (acc, { stateKey, endpoint }) => ({ ...acc, [stateKey]: endpoint }),
            {}
        ),
    } as UseGetAndSetReturnType<string[]>;
}
