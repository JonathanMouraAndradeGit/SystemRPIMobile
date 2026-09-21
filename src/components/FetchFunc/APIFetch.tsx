import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
export default async function apiFetch(url:any, options:any = {}) {
    const token = await AsyncStorage.getItem("token");

    const response = await fetch(url, {
        ...options,

        headers: {
            "Content-Type": "application/json",

            ...options.headers,

            ...(token
                ? {
                      Authorization: `Bearer ${token}`,
                  }
                : {}),
        },
    });

    if (response.status === 401) {
        await AsyncStorage.multiRemove([
            "token",
            "user",
        ]);

        const error:any = new Error(
            "Sessão expirada."
        );

        error.status = 401;
        router.replace("/Login");
        throw error;
        
    }

    return response;
}
/*
import AsyncStorage from "@react-native-async-storage/async-storage";

export default async function apiFetch(url:any, options:any = {}) {
    const token = await AsyncStorage.getItem("token");

    const response = await fetch(url, {
        ...options,

        headers: {
            "Content-Type": "application/json",

            ...options.headers,

            ...(token
                ? {
                      Authorization: `Bearer ${token}`,
                  }
                : {}),
        },
    });

    if (response.status === 401) {
        await AsyncStorage.multiRemove([
            "token",
            "user",
        ]);

        return null;
    }

    return response;
}*/