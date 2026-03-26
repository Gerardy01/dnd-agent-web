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
    const { setItemOptions, setEffectOptions } = useReferenceStore();

    const [pageLoad, setPageLoad] = useState<boolean>(true);
    const [getAccountLoad, setGetAccountLoad] = useState<boolean>(true);
    const [getReferenceLoad, setGetReferenceLoad] = useState<boolean>(true);
    const [getEffectOptionsLoad, setGetEffectOptionsLoad] = useState<boolean>(true);

    useEffect(() => {
        getAccountData();
        getReferenceData();
        getEffectOptionsData();
    }, []);

    useEffect(() => {
        if (getAccountLoad || getReferenceLoad || getEffectOptionsLoad) return;
        setPageLoad(false);
    }, [getAccountLoad, getReferenceLoad, getEffectOptionsLoad]);

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

    return {
        pageLoad,
    }
}