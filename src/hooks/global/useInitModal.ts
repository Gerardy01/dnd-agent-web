import { useState } from "react";
import type { FormProps } from "antd";

// stores
import useAccountStore from "@/stores/useAccountStore";
import useStaticModal from "@/hooks/global/useStaticModal";

// api
import { accountApi } from "@/api";

// interfaces
interface UsernameForm {
    username: string;
}

export default function useInitModal() {

    const { errorModal, serverErrorModal } = useStaticModal();

    const { username, setUsername } = useAccountStore();

    const [load, setLoad] = useState<boolean>(false);

    const [termsChecked, setTermsChecked] = useState<boolean>(false);
    const [errMsg, setErrMsg] = useState<string>("");

    const handleTermsChecked = (value: boolean) => {
        setTermsChecked(value);
    }

    const submitUsernameData: FormProps<UsernameForm>['onFinish'] = async (values) => {

        setLoad(true);

        try {

            const [err, data] = await accountApi.changeUsername(values.username);

            if (err) {

                if (err.status === 400) {
                    const error = err.response.data.schemaErrors ? err.response.data.schemaErrors[0] : undefined;
                    if (!error) return;
                    errorModal(undefined, `${error.field} is ${error.message}`);
                    return;
                }

                if (err.status === 409) {
                    setErrMsg(err.response.data.userMessage);
                    return;
                }

                serverErrorModal();
                return;
            }

            setUsername(data.username);

        } finally {
            setLoad(false);
        }
    }

    return {
        username,
        termsChecked,
        load,
        errMsg,
        handleTermsChecked,
        submitUsernameData,
    }
}