import { useEffect, useState } from "react";

// api
import { accountApi, referenceApi } from "@/api";

// hooks
import useStaticModal from "./useStaticModal";

// stores
import useAccountStore from "@/stores/useAccountStore";
import useReferenceStore from "@/stores/useReferenceStore";



export default function useGlobalLogic() {

    const { serverErrorModal } = useStaticModal();

    const { setAccount } = useAccountStore();
    const { setItemOptions, setEffectOptions, setFeatOptions, setSpellOptions } = useReferenceStore();

    const [pageLoad, setPageLoad] = useState<boolean>(true);
    const [getAccountLoad, setGetAccountLoad] = useState<boolean>(true);
    const [getReferenceLoad, setGetReferenceLoad] = useState<boolean>(true);
    const [getEffectOptionsLoad, setGetEffectOptionsLoad] = useState<boolean>(true);
    const [getFeatOptionsLoad, setGetFeatOptionsLoad] = useState<boolean>(true);
    const [getSpellOptionsLoad, setGetSpellOptionsLoad] = useState<boolean>(true);

    useEffect(() => {
        getAccountData();
        getReferenceData();
        getEffectOptionsData();
        getFeatOptionsData();
        getSpellOptionsData();
    }, []);

    useEffect(() => {
        if (getAccountLoad || getReferenceLoad || getEffectOptionsLoad || getFeatOptionsLoad || getSpellOptionsLoad) return;
        setPageLoad(false);
    }, [getAccountLoad, getReferenceLoad, getEffectOptionsLoad, getFeatOptionsLoad, getSpellOptionsLoad]);

    const getAccountData = async () => {
        setGetAccountLoad(true);

        try {

            const [err, data] = await accountApi.getUserAccoount();

            if (err) {
                serverErrorModal();
                return;
            }

            setAccount({
                accountId: data.accountId,
                username: data.username,
                email: data.email,
            });

        } finally {
            setGetAccountLoad(false);
        }
    }

    const getReferenceData = async () => {
        setGetReferenceLoad(true);

        try {

            const [err, data] = await referenceApi.getItemOptions();

            if (err) {
                serverErrorModal();
                return;
            }

            setItemOptions({
                itemType: data.itemType,
                gearCategories: data.gearCategories,
                weaponCategories: data.weaponCategories,
                armorCategories: data.armorCategories,
                itemRarity: data.itemRarity,
                currencyUnit: data.currencyUnit,
                equipSlot: data.equipSlot,
                itemBonusSelection: data.itemBonusSelection,
            });

        } finally {
            setGetReferenceLoad(false);
        }
    }

    const getEffectOptionsData = async () => {
        setGetEffectOptionsLoad(true);

        try {

            const [err, data] = await referenceApi.getEffectOptions();

            if (err) {
                serverErrorModal();
                return;
            }

            setEffectOptions({
                damageTypes: data.damageTypes,
                immunities: data.immunities,
            });

        } finally {
            setGetEffectOptionsLoad(false);
        }
    }

    const getFeatOptionsData = async () => {
        setGetFeatOptionsLoad(true);

        try {

            const [err, data] = await referenceApi.getFeatOptions();

            if (err) {
                serverErrorModal();
                return;
            }

            setFeatOptions({
                featCategories: data.featCategories,
            });

        } finally {
            setGetFeatOptionsLoad(false);
        }
    }

    const getSpellOptionsData = async () => {
        setGetSpellOptionsLoad(true);

        try {

            const [err, data] = await referenceApi.getSpellOptions();

            if (err) {
                serverErrorModal();
                return;
            }

            setSpellOptions({
                spellSchools: data.spellSchools,
                savingThrowStats: data.savingThrowStats,
            });

        } finally {
            setGetSpellOptionsLoad(false);
        }
    }

    return {
        pageLoad,
    }
}