import { useEffect, useState } from "react";
import { Form, type FormProps } from "antd";

// hooks
import { useNavigate } from "react-router-dom";
import useStaticModal from "@/hooks/global/useStaticModal";
import useToken from "@/hooks/global/useToken";

// api
import { authApi } from "@/api";

// interfaces
interface LoginForm {
    identifier: string;
    password: string;
}


export default function useLogin() {

    const navigate = useNavigate();
    const { errorModal, serverErrorModal } = useStaticModal();
    const { isLoggedIn } = useToken();

    const [loginForm] = Form.useForm();

    const [loading, setLoading] = useState(false);
    const [pageLoad, setPageLoad] = useState(true);
    const [errorMsg, setErrorMsg] = useState<string>("");

    useEffect(() => {
        checkLoggedIn();
    }, []);

    const checkLoggedIn = async () => {
        const loggedIn = await isLoggedIn();

        if (loggedIn) navigate('/');

        setPageLoad(false);
        return;
    }

    const handleClickSignUp = () => {
        navigate('/register');
    };

    const handleClickForgotPassword = () => {
        navigate('/forgot-password');
    };

    const submitLoginData: FormProps<LoginForm>['onFinish'] = async (values) => {
        setLoading(true);

        try {
            const [err, data] = await authApi.login({
                identifier: values.identifier,
                password: values.password,
            });

            if (err) {
                if (err.status === 400) {
                    const error = err.response.data.schemaErrors ? err.response.data.schemaErrors[0] : undefined;
                    if (!error) return;
                    errorModal(undefined, `${error.field} is ${error.message}`);
                    return;
                }

                if (err.status === 404) {
                    setErrorMsg(err.response.data.userMessage);
                    return;
                }

                serverErrorModal();
                return;
            }

            navigate(`/verification?token=${data.verificationToken}`);

        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = `${import.meta.env.VITE_API_BASE_URL}/google/login`;
    };

    return {
        loginForm,
        loading,
        errorMsg,
        pageLoad,
        handleClickSignUp,
        submitLoginData,
        handleClickForgotPassword,
        handleGoogleLogin,
    }
}