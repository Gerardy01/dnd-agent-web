import { useEffect, useState } from "react";

// interfaces
import type { Monster } from "@/models/monsterInterfaces";

export default function useMonsterDisplayModal(getMonster: () => Promise<Monster | null>) {
    const [monster, setMonster] = useState<Monster | null>(null);

    useEffect(() => {
        getMonsterData();
    }, []);

    const getMonsterData = async () => {
        const data = await getMonster();
        setMonster(data);
    }

    return {
        monster,
    }
}
