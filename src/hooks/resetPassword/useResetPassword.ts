import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

// Hooks
import { useNavigate, useSearchParams } from "react-router-dom";
import useStaticModal from "@/hooks/global/useStaticModal";
import { useTranslation } from "react-i18next";

// interfaces
interface VerificationTokenPayload {
    email: string;
    exp: number;
    iat: number;
}

export default function useResetPassword() {

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { errorModal } = useStaticModal();

    const [pageLoad, setPageLoad] = useState<boolean>(true);

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

    return {
        pageLoad,
    }
}