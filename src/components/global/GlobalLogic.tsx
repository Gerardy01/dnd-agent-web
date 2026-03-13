import { Outlet } from "react-router-dom";

// hooks
import useGlobalLogic from "@/hooks/global/useGlobalLogic";

// components
import PageLoading from "@/components/global/PageLoading";
import InitModal from "@/components/global/InitModal";

export default function GlobalLogic() {

    const {
        pageLoad,
    } = useGlobalLogic();

    if (pageLoad) {
        return (
            <PageLoading />
        )
    }

    return (
        <>
            <InitModal />
            <Outlet />
        </>
    )
}