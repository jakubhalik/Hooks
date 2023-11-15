'use client';
import { ReactNode, createContext, useContext, useState } from 'react';

type ErrorContextType = {
    error: string | null;
    showError: (message: string | null) => void;
    hideError: () => void;
};

export const ErrorContext = createContext<ErrorContextType | undefined>(
    undefined
);

export const useErrorState = () => {
    const context = useContext(ErrorContext);

    if (!context) {
        throw new Error('useErrorState must be used within an ErrorProvider.');
    }

    return context;
};

interface ErrorProviderProps {
    children: ReactNode;
}

export const ErrorProvider: React.FC<ErrorProviderProps> = ({ children }) => {
    const [error, setError] = useState<string | null>(null);

    const showError = (message: string | null) => {
        setError(message);
    };

    const hideError = () => {
        setError(null);
    };

    return (
        <ErrorContext.Provider value={{ error, showError, hideError }}>
            {children}
        </ErrorContext.Provider>
    );
};
