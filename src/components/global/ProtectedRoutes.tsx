import { Outlet } from "react-router-dom";

import useProtectedRoutes from "@/hooks/global/useProtectedRoutes";

// componetns
import PageLoading from "@/components/global/PageLoading";



export default function ProtectedRoutes() {

    const { pageLoad, loggedIn } = useProtectedRoutes();

    if (pageLoad) {
        return (
            <PageLoading />
        )
    }

    return !pageLoad && loggedIn ? (
        <Outlet />
    ) : <></>
}