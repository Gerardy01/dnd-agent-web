import { useEffect, useState } from "react"

// hooks
import useToken from "@/hooks/global/useToken";
import { useNavigate } from "react-router-dom";


export default function useProtectedRoutes() {

    const navigate = useNavigate();
    const { isLoggedIn } = useToken();

    const [pageLoad, setPageLoad] = useState<boolean>(true);
    const [loggedIn, setLoggedIn] = useState<boolean>(false);

    useEffect(() => {
        checkLoggedIn();
    }, []);

    const checkLoggedIn = async () => {
        const loggedInRes = await isLoggedIn();

        if (!loggedInRes) return navigate("/login");

        setLoggedIn(true);
        setPageLoad(false);
    }

    return {
        pageLoad,
        loggedIn,
    }
}