'use client';

import { ReactNode, createContext, useContext, useState } from 'react';
import {
    ShowComponentState,
    ShowComponentType,
} from '../../../types/showComponent';

const ShowComponentContext = createContext<ShowComponentType | undefined>(
    undefined
);

export const useShowComponent = (): ShowComponentType => {
    const context = useContext(ShowComponentContext);
    if (!context) {
        throw new Error(
            'useShowComponent must be used within a ShowComponentProvider.'
        );
    }
    return context;
};

interface ShowComponentProviderProps {
    children: ReactNode;
}

export const ShowComponentProvider: React.FC<ShowComponentProviderProps> = ({
    children,
}) => {
    const [showComponent, setShowComponent] =
        useState<ShowComponentState>('INITIAL');

    return (
        <ShowComponentContext.Provider
            value={{ showComponent, setShowComponent }}
        >
            {children}
        </ShowComponentContext.Provider>
    );
};
