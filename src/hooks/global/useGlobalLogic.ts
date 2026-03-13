import { useEffect, useState } from "react";

// api
import { accountApi } from "@/api";

// hooks
import useStaticModal from "./useStaticModal";

// stores
import useAccountStore from "@/stores/useAccountStore";



export default function useGlobalLogic() {

    const { serverErrorModal } = useStaticModal();

    const { setAccount } = useAccountStore();

    const [pageLoad, setPageLoad] = useState<boolean>(true);
    const [getAccountLoad, setGetAccountLoad] = useState<boolean>(true);

    useEffect(() => {
        getAccountData();
    }, []);

    useEffect(() => {
        if (getAccountLoad) return;
        setPageLoad(false);
    }, [getAccountLoad]);

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

    return {
        pageLoad,
    }
}