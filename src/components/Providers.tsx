"use client";

import { SessionProvider } from "next-auth/react";
import { createContext, useContext, useState, useCallback, ReactNode } from "react";

// Compare context
interface CompareContextType {
    compareIds: string[];
    addToCompare: (id: string) => void;
    removeFromCompare: (id: string) => void;
    clearCompare: () => void;
    isInCompare: (id: string) => boolean;
}

const CompareContext = createContext<CompareContextType>({
    compareIds: [],
    addToCompare: () => { },
    removeFromCompare: () => { },
    clearCompare: () => { },
    isInCompare: () => false,
});

export function useCompare() {
    return useContext(CompareContext);
}

function CompareProvider({ children }: { children: ReactNode }) {
    const [compareIds, setCompareIds] = useState<string[]>([]);

    const addToCompare = useCallback((id: string) => {
        setCompareIds((prev) => {
            if (prev.includes(id)) return prev;
            if (prev.length >= 3) return prev;
            return [...prev, id];
        });
    }, []);

    const removeFromCompare = useCallback((id: string) => {
        setCompareIds((prev) => prev.filter((cid) => cid !== id));
    }, []);

    const clearCompare = useCallback(() => {
        setCompareIds([]);
    }, []);

    const isInCompare = useCallback(
        (id: string) => compareIds.includes(id),
        [compareIds]
    );

    return (
        <CompareContext.Provider
            value={{ compareIds, addToCompare, removeFromCompare, clearCompare, isInCompare }}
        >
            {children}
        </CompareContext.Provider>
    );
}

export default function Providers({ children }: { children: ReactNode }) {
    return (
        <SessionProvider>
            <CompareProvider>{children}</CompareProvider>
        </SessionProvider>
    );
}
