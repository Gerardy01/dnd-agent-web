import { useState } from "react";

export default function useSubclassCard() {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const handleHover = (index: number | null): void => {
        setHoveredIndex(index);
    };

    return {
        hoveredIndex,
        handleHover,
    };
}
