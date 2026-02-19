import { saveEntryToStorage } from "@/utilis/storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Props {
  onBack: () => void;
}

export default function IncomeForm({ onBack }: Props) {
  const router = useRouter();

  const [source, setSource] = useState("");
  const [amount, setAmount] = useState("");

  const handleSave = async () => {
    if (!source || !amount) {
      Alert.alert("Missing info", "Please fill all fields");
      return;
    }

    const entry = {
      id: Date.now().toString(),
      type: "income",
      source,
      amount: parseFloat(amount),
      date: new Date().toISOString(),
    };

    await saveEntryToStorage(entry);
    router.dismiss();
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ padding: 16 }}>
        <Pressable onPress={onBack}>
          <Text style={{ color: "#007AFF", marginBottom: 10 }}>← Back</Text>
        </Pressable>

        <Text style={{ fontSize: 20, fontWeight: "700", marginBottom: 20 }}>
          Add Income
        </Text>

        <Text>Income Source</Text>
        <TextInput style={inputStyle} value={source} onChangeText={setSource} />

        <Text>Amount</Text>
        <TextInput
          style={inputStyle}
          keyboardType="decimal-pad"
          value={amount}
          onChangeText={setAmount}
        />

        <Pressable style={buttonStyle} onPress={handleSave}>
          <Text style={{ color: "#fff", fontWeight: "700" }}>Save Income</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const inputStyle = {
  backgroundColor: "#f5f5f5",
  borderRadius: 12,
  padding: 14,
  marginBottom: 16,
};

const buttonStyle = {
  backgroundColor: "#007AFF",
  padding: 16,
  borderRadius: 12,
  alignItems: "center" as const,
};
