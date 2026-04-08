import { useEffect, useState } from "react";

// interfaces
import type { Feat } from "@/models/featInterfaces";


export default function useFeatDisplayModal(getFeat: () => Promise<Feat | null>) {
    const [feat, setFeat] = useState<Feat | null>(null);

    useEffect(() => {
        getFeatData();
    }, []);

    const getFeatData = async () => {
        const data = await getFeat();
        setFeat(data);
    }

    return {
        feat,
    }
}