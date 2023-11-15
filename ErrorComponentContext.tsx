'use client';
import { ReactNode, createContext, useContext, useState } from 'react';

type ErrorComponentContextType = {
    errorComponentOpened: boolean;
    openErrorComponent: () => void;
    closeErrorComponent: () => void;
};

const ErrorComponentContext = createContext<
    ErrorComponentContextType | undefined
>(undefined);

export const useErrorComponentOpened = () => {
    const context = useContext(ErrorComponentContext);

    if (!context) {
        throw new Error(
            'useErrorComponentOpened must be used within an ErrorComponentProvider.'
        );
    }

    return context;
};
interface ErrorComponentProviderProps {
    children: ReactNode;
}

export const ErrorComponentProvider: React.FC<ErrorComponentProviderProps> = ({
    children,
}) => {
    const [errorComponentOpened, setErrorComponentOpened] =
        useState<boolean>(false);

    const openErrorComponent = () => {
        setErrorComponentOpened(true);
    };

    const closeErrorComponent = () => {
        setErrorComponentOpened(false);
    };

    return (
        <ErrorComponentContext.Provider
            value={{
                errorComponentOpened,
                openErrorComponent,
                closeErrorComponent,
            }}
        >
            {children}
        </ErrorComponentContext.Provider>
    );
};
