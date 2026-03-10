
// api
import { authApi } from "@/api";

// stores
import useTokenStore from "@/stores/useTokenStore"

export default function useToken() {

    const { accessToken, setAccessToken } = useTokenStore();

    const isLoggedIn = async (): Promise<boolean> => {
        if (accessToken) return true;

        const [err, data] = await authApi.getAccessToken();

        if (err) return false;

        setAccessToken(data.accessToken);

        return true;
    }

    return {
        isLoggedIn,
    }
}