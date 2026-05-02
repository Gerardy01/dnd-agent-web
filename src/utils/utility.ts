
// enums
import { RarityEnum, CurrencyUnitEnum } from "./enums";

// interfaces
import { type ErrorResponse } from "@/models/globalInterfaces";

export const catchFetchError = <T>(promise: Promise<T>): Promise<[undefined, T] | [ErrorResponse]> => {
    return promise.then(data => {
        return [undefined, data] as [undefined, T]
    }).catch(err => {
        return [err];
    });
}

export const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
        case RarityEnum.COMMON: return '#7f8c8d';
        case RarityEnum.UNCOMMON: return '#27ae60';
        case RarityEnum.RARE: return '#562973';
        case RarityEnum.VERY_RARE: return '#d35400';
        case RarityEnum.LEGENDARY: return '#f39c12';
        case RarityEnum.ARTIFACT: return '#e74c3c';
        default: return '#562973';
    }
}

export const getCurrencyColor = (currency: string) => {
    switch (currency.toLowerCase()) {
        case CurrencyUnitEnum.COPPER: return '#B77729';
        case CurrencyUnitEnum.SILVER: return '#A5A9B4';
        case CurrencyUnitEnum.ELECTRUM: return '#59A5A9';
        case CurrencyUnitEnum.GOLD: return '#D4AF37';
        case CurrencyUnitEnum.PLATINUM: return '#BCC6CC';
        default: return '#D4AF37';
    }
}

export const numberFormat = (number: number) => {
    return number.toLocaleString();
}

export const getCRColor = (cr: number) => {
    if (cr === 0) return '#bdc3c7';
    if (cr <= 4) return '#2ecc71';
    if (cr <= 10) return '#f1c40f';
    if (cr <= 16) return '#e67e22';
    return '#e74c3c';
}