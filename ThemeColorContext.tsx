'use client';

import { ReactNode, createContext, useContext } from 'react';
import useLocalStorage from 'use-local-storage';

type ThemeColorContextType = {
    color: string;
    setColor: (color: string) => void;
};

const ThemeColorContext = createContext<ThemeColorContextType | undefined>(
    undefined
);

export function useColorTheme() {
    const context = useContext(ThemeColorContext);
    if (!context) {
        throw new Error(
            'useColorTheme must be used within a ThemeColorProvider.'
        );
    }
    return context;
}

const COLOR_THEME_KEY = 'color-theme';

interface ThemeColorProviderProps {
    children: ReactNode;
}

export function ThemeColorProvider({ children }: ThemeColorProviderProps) {
    const [color, setColor] = useLocalStorage<string>(COLOR_THEME_KEY, 'blue');

    return (
        <ThemeColorContext.Provider value={{ color, setColor }}>
            {children}
        </ThemeColorContext.Provider>
    );
}
