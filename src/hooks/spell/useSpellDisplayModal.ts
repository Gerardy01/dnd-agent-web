import { useEffect, useState } from "react";

// interfaces
import type { WorkshopSpellReturn } from "@/models/spellInterfaces";

export default function useSpellDisplayModal(getSpell: () => Promise<WorkshopSpellReturn | null>) {
    const [spell, setSpell] = useState<WorkshopSpellReturn | null>(null);

    useEffect(() => {
        getSpellData();
    }, []);

    const getSpellData = async () => {
        const data = await getSpell();
        setSpell(data);
    }

    return {
        spell,
    }
}
