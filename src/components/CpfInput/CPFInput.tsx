import React from "react";
import { TextInput } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import TxtInput from "../TXTInput/TxtInput";

function formatCPF(value:any) {
    const numbers = value
        .replace(/\D/g, "")
        .slice(0, 11);

    return numbers
        .replace(/^(\d{3})(\d)/, "$1.$2")
        .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
        .replace(/\.(\d{3})(\d)/, ".$1-$2");
}

export default function CpfInput({
    value,
    onChange,
    ...props
}:any) {
    const handleChange = (text:any) => {
        const formattedValue = formatCPF(text);

        onChange?.(formattedValue);
    };

    return (
        <TxtInput
            {...props}
            value={value}
            onChangeText={handleChange}
            maxLength={14}
            keyboardType="numeric"
            logo={
                <MaterialCommunityIcons
                    name="card-account-details-outline"
                    size={24}
                    color="#3c6a48"
                />
            }
        />
    );
}