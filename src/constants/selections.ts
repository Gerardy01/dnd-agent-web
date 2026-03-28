

export const DICE_SELECTION = [
    4,
    6,
    8,
    10,
    12,
    20,
] as const;
export type DiceSelection = typeof DICE_SELECTION[number];