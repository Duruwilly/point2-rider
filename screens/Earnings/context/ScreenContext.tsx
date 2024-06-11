import { Dispatch, SetStateAction, createContext, useContext, useState } from "react";

type ScreenContextReturnType = {
    handleTab: ({ tab, path }: { tab: string, path: string }) => void,
    selectedTab: string,
    category: string,
    setCategory: Dispatch<SetStateAction<string>>,
    setSelectedTab: Dispatch<SetStateAction<string>>
}

const ScreenContext = createContext<ScreenContextReturnType | null>(null)

const ScreenContextProvider = ({ children }: any) => {
    const [selectedTab, setSelectedTab] = useState("All");
    const [category, setCategory] = useState("All");

    const handleTab = ({ tab, path }: { tab: string, path: string }) => {
        setSelectedTab(tab);
        setCategory(path);
    };

    return (
        <ScreenContext.Provider
            value={{
                handleTab,
                selectedTab,
                category,
                setSelectedTab,
                setCategory
            }}
        >
            {children}
        </ScreenContext.Provider>
    )
}

export const useScreenContext = () => useContext(ScreenContext) as ScreenContextReturnType

export default ScreenContextProvider