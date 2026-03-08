import { useState } from "react";
import { Form, type FormProps } from "antd";

// hooks
import { useNavigate } from "react-router-dom";
import useStaticModal from "../global/useStaticModal";

// api
import { accountApi } from "@/api";

// interfaces
interface RegisterForm {
    email: string;
    password: string;
}


export default function useRegister() {

    const navigate = useNavigate();
    const { errorModal, serverErrorModal } = useStaticModal();

    const [registerForm] = Form.useForm();

    const [load, setLoad] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const handleClickSignIn = () => {
        navigate('/login');
    }

    const submitRegisterData: FormProps<RegisterForm>['onFinish'] = async (values) => {
        setLoad(true);

        try {
            const [err, data] = await accountApi.register({
                email: values.email,
                password: values.password
            });

            if (err) {
                if (err.status === 400) {
                    const error = err.response.data.schemaErrors ? err.response.data.schemaErrors[0] : undefined;
                    if (!error) return;
                    errorModal(undefined, `${error.field} is ${error.message}`);
                    return;
                }

                if (err.status === 409) {
                    setErrorMsg(err.response.data.userMessage);
                    return;
                }

                serverErrorModal();
                return;
            }

            navigate(`/verification?token=${data.verificationToken}`);

        } finally {
            setLoad(false);
        }
    }

    return {
        load,
        registerForm,
        errorMsg,
        handleClickSignIn,
        submitRegisterData,
    }
}