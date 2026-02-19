import { saveEntryToStorage } from "@/utilis/storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Props {
  onBack: () => void;
}

export default function InvestmentForm({ onBack }: Props) {
  const router = useRouter();

  const [assetName, setAssetName] = useState("");
  const [amount, setAmount] = useState("");
  const [platform, setPlatform] = useState("");

  const handleSave = async () => {
    if (!assetName || !amount) {
      Alert.alert("Missing info", "Please fill required fields");
      return;
    }

    const entry = {
      id: Date.now().toString(),
      type: "investment",
      assetName,
      amount: parseFloat(amount),
      platform,
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
          Add Investment
        </Text>

        <Text>Asset Name</Text>
        <TextInput
          style={inputStyle}
          value={assetName}
          onChangeText={setAssetName}
        />

        <Text>Amount Invested</Text>
        <TextInput
          style={inputStyle}
          keyboardType="decimal-pad"
          value={amount}
          onChangeText={setAmount}
        />

        <Text>Platform (Optional)</Text>
        <TextInput
          style={inputStyle}
          value={platform}
          onChangeText={setPlatform}
        />

        <Pressable style={buttonStyle} onPress={handleSave}>
          <Text style={{ color: "#fff", fontWeight: "700" }}>
            Save Investment
          </Text>
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
