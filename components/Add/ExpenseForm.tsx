import { saveEntryToStorage } from "@/utilis/storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Props {
  onBack: () => void;
}

export default function ExpenseForm({ onBack }: Props) {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  const handleSave = async () => {
    if (!amount || !category) {
      Alert.alert("Missing info", "Please enter amount and category");
      return;
    }

    const entry = {
      id: Date.now().toString(),
      type: "expense",
      amount: parseFloat(amount),
      category,
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
          Add Expense
        </Text>

        <Text>Amount</Text>
        <TextInput
          style={{
            backgroundColor: "#f5f5f5",
            borderRadius: 12,
            padding: 14,
            marginBottom: 20,
          }}
          keyboardType="decimal-pad"
          value={amount}
          onChangeText={setAmount}
        />

        <Pressable
          style={{
            backgroundColor: "#007AFF",
            padding: 16,
            borderRadius: 12,
            alignItems: "center",
          }}
          onPress={handleSave}
        >
          <Text style={{ color: "#fff", fontWeight: "700" }}>Save Expense</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
