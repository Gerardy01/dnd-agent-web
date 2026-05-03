import { useEffect, useState } from "react";
import type { FormProps } from "antd";

// Hooks
import { useNavigate } from "react-router-dom";
import useStaticModal from "@/hooks/global/useStaticModal";
import useToken from "@/hooks/global/useToken";

// api
import { accountApi } from "@/api";

// interfaces
interface ForgotPasswordForm {
    email: string;
}

export default function useForgotPassword() {

    const navigate = useNavigate();
    const { serverErrorModal } = useStaticModal();
    const { isLoggedIn } = useToken();

    const [pageLoad, setPageLoad] = useState<boolean>(true);
    const [load, setLoad] = useState<boolean>(false);
    const [errorMsg, setErrorMsg] = useState<string>("");
    const [success, setSuccess] = useState<boolean>(false);

    useEffect(() => {
        checkLoggedIn();
    }, []);

    const checkLoggedIn = async () => {
        const loggedIn = await isLoggedIn();

        if (loggedIn) {
            navigate('/');
            return;
        }

        setPageLoad(false);
        return;
    }

    const handleForgotPassword: FormProps<ForgotPasswordForm>['onFinish'] = async (values) => {

        setLoad(true);

        try {
            const [err] = await accountApi.forgotPasswordRequest(values.email);

            if (err) {

                if (err.status === 404) {
                    setErrorMsg(err.response.data.message);
                    return;
                }

                serverErrorModal();
                return;
            }

            setErrorMsg("");
            setSuccess(true);

        } finally {
            setLoad(false);
        }
    }

    const backToLogin = () => {
        navigate('/login');
    }

    return {
        pageLoad,
        load,
        errorMsg,
        success,
        handleForgotPassword,
        backToLogin,
    }
}