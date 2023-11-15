'use client';
import { createContext, useContext, useState } from 'react';

type SidebarContextType = {
    sidebarOpened: boolean;
    setSidebarOpened: React.Dispatch<React.SetStateAction<boolean>>;
};
const SidebarContext = createContext<SidebarContextType | undefined>(undefined);
type SidebarProviderProps = { children: React.ReactNode };
export const SidebarProvider: React.FC<SidebarProviderProps> = ({
    children,
}) => {
    const [sidebarOpened, setSidebarOpened] = useState(true);
    return (
        <SidebarContext.Provider value={{ sidebarOpened, setSidebarOpened }}>
            {children}
        </SidebarContext.Provider>
    );
};
export const useSidebarOpened = (): SidebarContextType => {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error(
            'useSidebarOpened must be used within a SidebarProvider.'
        );
    }
    return context;
};
