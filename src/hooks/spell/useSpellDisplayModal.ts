import { useEffect, useState } from "react";

// interfaces
import type { Spell } from "@/models/spellInterfaces";

export default function useSpellDisplayModal(getSpell: () => Promise<Spell | null>) {
    const [spell, setSpell] = useState<Spell | null>(null);

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
