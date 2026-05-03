import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

// api
import { authApi } from "@/api";

// stores
import useTokenStore from "@/stores/useTokenStore";

// hooks
import useStaticModal from "@/hooks/global/useStaticModal";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

// interfaces
interface VerificationTokenPayload {
    email: string;
    exp: number;
    iat: number;
}

export default function useVerification() {

    const navigate = useNavigate();
    const { t } = useTranslation();

    const [searchParams] = useSearchParams();
    const { errorModal, serverErrorModal } = useStaticModal();
    const { setAccessToken } = useTokenStore()

    const [pageLoad, setPageLoad] = useState(true);
    const [load, setLoad] = useState(false);

    const [email, setEmail] = useState<string>("");
    const [otp, setOtp] = useState<string>("");
    const [cooldown, setCooldown] = useState<number>(0);
    const [errMsg, setErrMsg] = useState<string>("");

    useEffect(() => {
        handleTokenCheck();
    }, []);

    // Cleanup timer logic on unmount
    useEffect(() => {
        let timer: ReturnType<typeof setInterval>;
        if (cooldown > 0) {
            timer = setInterval(() => {
                setCooldown((prev) => prev - 1);
            }, 1000);
        }
        return () => {
            if (timer) clearInterval(timer);
        };
    }, [cooldown]);

    const handleTokenCheck = () => {
        const token = searchParams.get("token");

        if (!token) {
            navigate("/login");
            return;
        }

        try {
            const decoded = jwtDecode<VerificationTokenPayload>(token);

            const currentTime = Date.now() / 1000;
            if (decoded.exp < currentTime) {
                errorModal(t('global.invalid'), t('verification.expiredToken'));
                navigate("/login");
                return;
            }

            if (!decoded.email) {
                navigate("/login");
                return;
            }

            // Valid token
            setEmail(decoded.email);
            setPageLoad(false);

        } catch (error) {
            // Invalid token format
            navigate("/login");
        }
    }

    const handleChangeOtp = (value: string) => {
        setOtp(value);
    }

    const submitOtp = async () => {
        const numberOtp = Number(otp);
        if (Number.isNaN(numberOtp)) return;

        setLoad(true);

        try {

            const token = searchParams.get("token");
            const [err, data] = await authApi.verifyOtp({
                token: token || "",
                code: numberOtp
            });

            if (err) {

                if (err.status === 401) {
                    errorModal(t('global.invalid'), t('verification.expiredToken'));
                    navigate("/login");
                    return;
                }

                if (err.status === 403) {
                    setErrMsg(err.response.data.userMessage);
                    return;
                }

                serverErrorModal();
                navigate("/login");
                return;
            }

            setAccessToken(data.accessToken);
            navigate("/");

        } finally {
            setLoad(false);
        }
    }

    const handleResendOtp = async () => {
        if (cooldown > 0) return;
        setCooldown(30);

        const [err] = await authApi.generateOtp(email);

        if (!err) return;

        if (err.status === 403) return;

        serverErrorModal();
    }

    return {
        email,
        pageLoad,
        load,
        otp,
        cooldown,
        errMsg,
        handleChangeOtp,
        submitOtp,
        handleResendOtp,
    }
}