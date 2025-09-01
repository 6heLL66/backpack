import { useMutation } from "@tanstack/react-query";
import { AuthService, OpenAPI } from "../../api";
import { useAuthStore } from "./store";
import { useEffect } from "react";

export const useRefreshTokens = () => {
    const { tokens, login, user, logout, isAuthenticated } = useAuthStore();
    const refreshMutation = useMutation({
        mutationFn: () => AuthService.refreshApiAuthRefreshPost({ requestBody: { refresh_token: tokens?.refresh_token! } }),
        onSuccess: (data) => {
            login(user!, data);
        },
        onError: () => {
            logout();
        }
    })

    OpenAPI.TOKEN = tokens?.access_token ?? ''

    useEffect(() => {
        let interval: number;
        if (user && tokens?.refresh_token) {
            refreshMutation.mutate();
            interval = setInterval(() => {
                refreshMutation.mutate();
            }, 1000 * 60 * 5);
        }

        return () => clearInterval(interval);
    }, [isAuthenticated])
}