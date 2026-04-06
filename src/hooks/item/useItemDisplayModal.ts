import { useEffect, useState } from "react";

// interfaces
import type { Item } from "@/models/itemInterfaces";


export default function useItemDisplayModal(getItem: () => Promise<Item | null>) {
    const [item, setItem] = useState<Item | null>(null);

    useEffect(() => {
        getItemData();
    }, []);

    const getItemData = async () => {
        const data = await getItem();
        setItem(data);
    }

    return {
        item,
    }
}

