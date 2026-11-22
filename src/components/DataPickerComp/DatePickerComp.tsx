import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import {
    Platform,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface DatePickerProps {
    form: any;
    handleChange: (name: string, value: string) => void;
}

export default function DatePickerComp({
    handleChange,
    form
}: DatePickerProps) {
    const [showPicker, setShowPicker] = useState(false);

    const handleDateChange = (event: any, selectedDate?: Date) => {
        setShowPicker(false);

        if (event.type === "set" && selectedDate) {
            const year = selectedDate.getFullYear();
            const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
            const day = String(selectedDate.getDate()).padStart(2, "0");

            handleChange(
                "dataReferencia",
                `${year}-${month}-${day}`
            );
        }
    };

    if (Platform.OS === "web") {
        return (
            <View>
                <Text>Data da Ocorrência</Text>

                <input
                    type="date"
                    value={form.dataReferencia || ""}
                    max={new Date().toISOString().split("T")[0]}
                    onChange={(event) =>
                        handleChange(
                            "dataReferencia",
                            event.target.value
                        )
                    }
                    style={{
                        width: "100%",
                        height: 45,
                        padding: 10,
                        border: "1px solid #ccc",
                        borderRadius: 8,
                        fontSize: 16,
                        boxSizing: "border-box",
                    }}
                />
            </View>
        );
    }

    return (
        <View>
            <Text>Data da Ocorrência</Text>

            <TouchableOpacity
                onPress={() => setShowPicker(true)}
                style={{
                    borderWidth: 1,
                    borderColor: "#ccc",
                    borderRadius: 8,
                    padding: 14,
                }}
            >
                <Text>
                    {form.dataReferencia || "AAAA-MM-DD"}
                </Text>
            </TouchableOpacity>

            {showPicker && (
                <DateTimePicker
                    value={
                        form.dataReferencia
                            ? new Date(form.dataReferencia + "T12:00:00")
                            : new Date()
                    }
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                    maximumDate={new Date()}
                />
            )}
        </View>
    );
}