/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, type ReactNode } from 'react';
import { useComparisonEngine, type ServiceResult } from '../hooks/useComparisonEngine';

interface SearchContextType {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    activeTab: string;
    setActiveTab: (tab: string) => void;
    results: ServiceResult[];
    loading: boolean;
    searchTrigger: string;
    setSearchTrigger: (trigger: string) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [activeTab, setActiveTab] = useState('food');
    const [searchTerm, setSearchTerm] = useState('');
    const [searchTrigger, setSearchTrigger] = useState('');

    const { results, loading } = useComparisonEngine({
        searchTerm: searchTrigger,
        category: activeTab
    });

    return (
        <SearchContext.Provider value={{
            searchTerm,
            setSearchTerm,
            activeTab,
            setActiveTab,
            results,
            loading,
            searchTrigger,
            setSearchTrigger
        }}>
            {children}
        </SearchContext.Provider>
    );
};

export const useSearch = () => {
    const context = useContext(SearchContext);
    if (context === undefined) {
        throw new Error('useSearch must be used within a SearchProvider');
    }
    return context;
};
