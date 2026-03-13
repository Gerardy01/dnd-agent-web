import { useEffect, useState } from "react";
import { Form, type FormProps } from "antd";
import { jwtDecode } from "jwt-decode";

// api
import { accountApi } from "@/api";

// Hooks
import { useNavigate, useSearchParams } from "react-router-dom";
import useStaticModal from "@/hooks/global/useStaticModal";
import { useTranslation } from "react-i18next";
import useNotification from "@/hooks/global/useNotification";

// interfaces
interface VerificationTokenPayload {
    email: string;
    exp: number;
    iat: number;
}
interface ResetPasswordFrom {
    password: string;
    confirmPassword: string;
}

export default function useResetPassword() {

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { errorModal, serverErrorModal } = useStaticModal();
    const { successNotification } = useNotification();

    const [resetPassForm] = Form.useForm();

    const [pageLoad, setPageLoad] = useState<boolean>(true);
    const [load, setLoad] = useState<boolean>(false);

    useEffect(() => {
        handleTokenCheck();
    }, []);

    const handleTokenCheck = () => {
        const token = searchParams.get("token");

        if (!token) {
            navigate("/forgot-password");
            return;
        }

        try {
            const decoded = jwtDecode<VerificationTokenPayload>(token);

            const currentTime = Date.now() / 1000;
            if (decoded.exp < currentTime) {
                errorModal(t('global.invalid'), t('resetPassword.expiredToken'));
                navigate("/forgot-password");
                return;
            }

            if (!decoded.email) {
                navigate("/forgot-password");
                return;
            }

            setPageLoad(false);

        } catch {
            navigate("/forgot-password");
        }
    }

    const submitResetPassword: FormProps<ResetPasswordFrom>['onFinish'] = async (values) => {
        const token = searchParams.get("token");

        setLoad(true);

        try {
            const [err] = await accountApi.resetPassword({
                token: token || "",
                newPassword: values.password
            });

            if (err) {

                if (err.status === 401 || err.status === 404) {
                    errorModal(t('global.invalid'), t('resetPassword.expiredToken'));
                    navigate("/forgot-password");
                    return;
                }

                serverErrorModal();
                navigate("forgot-password");
                return;
            }

            successNotification(t('global.success'), t('resetPassword.success'));
            navigate('/login');

        } finally {
            setLoad(false);
        }
    }

    return {
        pageLoad,
        load,
        resetPassForm,
        submitResetPassword,
    }
}