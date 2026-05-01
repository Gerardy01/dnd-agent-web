
import { useEffect, useState } from "react";

// interfaces
import type { Faction } from "@/models/factionInterfaces";


export default function useFactionDisplayModal(getFaction: () => Promise<Faction | null>) {
    const [faction, setFaction] = useState<Faction | null>(null);

    useEffect(() => {
        getFactionData();
    }, []);

    const getFactionData = async () => {
        const data = await getFaction();
        setFaction(data);
    }

    return {
        faction,
    }
}
