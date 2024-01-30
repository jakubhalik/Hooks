'use client';

import { SignInResponse } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { useErrorState } from '../hooks/ErrorContext';
import { useSecureFormState } from './useSecureFormState';

export function useAuth(
    mode: 'login' | 'register',
    actionCallback: (data: {
        [key: string]: string;
    }) => Promise<SignInResponse | undefined>,
    push?: string
) {
    const router = useRouter();

    const initialData =
        mode === 'login'
            ? { identifier: '', password: '' }
            : { name: '', email: '', password: '' };

    const [data, handleChange, passwordRef] = useSecureFormState(initialData);

    const { showError } = useErrorState();

    const [loading, setLoading] = useState(false);

    const handleSubmit = useCallback(
        async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            setLoading(true);
            try {
                const result = await actionCallback(data);
                if (result) {
                    if ('error' in result) {
                        showError(result.error);
                    } else if (push) {
                        router.push(push);
                    }
                } else {
                    showError('Unexpected error: result is undefined.');
                }
            } catch (err) {
                showError(
                    err instanceof Error ? err.message : 'An error occurred.'
                );
            } finally {
                setLoading(false);
            }
        },
        [data, actionCallback, push, router, showError]
    );

    return {
        loading,
        data,
        handleSubmit,
        handleChange,
        passwordRef,
    };
}
