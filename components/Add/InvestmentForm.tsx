import { saveEntryToStorage } from "@/utilis/storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Props {
  onBack: () => void;
}

type InvestmentCategory =
  | "savings"
  | "stocks"
  | "mutual_fund"
  | "sacco"
  | "crypto"
  | "real_estate"
  | "business"
  | "other";

const categories: { label: string; value: InvestmentCategory }[] = [
  { label: "Savings", value: "savings" },
  { label: "Stocks", value: "stocks" },
  { label: "Mutual Fund", value: "mutual_fund" },
  { label: "SACCO", value: "sacco" },
  { label: "Crypto", value: "crypto" },
  { label: "Real Estate", value: "real_estate" },
  { label: "Business", value: "business" },
  { label: "Other", value: "other" },
];

export default function InvestmentForm({ onBack }: Props) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [category, setCategory] = useState<InvestmentCategory>("savings");
  const [platform, setPlatform] = useState("");

  const [currentValue, setCurrentValue] = useState("");
  const [initialAmount, setInitialAmount] = useState("");

  const [hasGoal, setHasGoal] = useState(false);
  const [targetAmount, setTargetAmount] = useState("");
  const [targetDate, setTargetDate] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);

  const [notes, setNotes] = useState("");

  const handleSave = async () => {
    if (!name || !currentValue) {
      Alert.alert("Missing info", "Please complete required fields");
      return;
    }

    const entry = {
      id: Date.now().toString(),
      type: "investment",
      name,
      category,
      platform,
      currentValue: parseFloat(currentValue),
      initialAmount: initialAmount ? parseFloat(initialAmount) : undefined,
      targetAmount:
        hasGoal && targetAmount ? parseFloat(targetAmount) : undefined,
      targetDate: hasGoal && targetDate ? targetDate.toISOString() : undefined,
      notes,
      createdAt: new Date().toISOString(),
    };

    await saveEntryToStorage(entry);
    router.dismiss();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f8fafc" }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Pressable onPress={onBack}>
          <Text style={{ color: "#16a34a", marginBottom: 20 }}>← Back</Text>
        </Pressable>

        <Text style={styles.header}>Savings / Investment</Text>

        {/* BASIC INFO */}
        <View style={styles.card}>
          <Text style={styles.label}>Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Emergency Fund, Apple Shares..."
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>Category</Text>
          <View style={styles.rowWrap}>
            {categories.map((item) => (
              <Pressable
                key={item.value}
                style={[
                  styles.pill,
                  category === item.value && styles.pillActive,
                ]}
                onPress={() => setCategory(item.value)}
              >
                <Text
                  style={{
                    color: category === item.value ? "#fff" : "#0f172a",
                  }}
                >
                  {item.label}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.label}>Platform (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Bank, Broker, SACCO name..."
            value={platform}
            onChangeText={setPlatform}
          />
        </View>

        {/* VALUE SECTION */}
        <View style={styles.card}>
          <Text style={styles.label}>Current Value *</Text>
          <TextInput
            style={styles.input}
            keyboardType="decimal-pad"
            value={currentValue}
            onChangeText={setCurrentValue}
          />

          <Text style={styles.label}>Initial Amount (Optional)</Text>
          <TextInput
            style={styles.input}
            keyboardType="decimal-pad"
            value={initialAmount}
            onChangeText={setInitialAmount}
          />
        </View>

        {/* GOAL SECTION */}
        <View style={styles.card}>
          <View style={styles.switchRow}>
            <Text style={{ fontWeight: "600" }}>Set Target Goal</Text>
            <Switch value={hasGoal} onValueChange={setHasGoal} />
          </View>

          {hasGoal && (
            <>
              <Text style={styles.label}>Target Amount</Text>
              <TextInput
                style={styles.input}
                keyboardType="decimal-pad"
                value={targetAmount}
                onChangeText={setTargetAmount}
              />

              <Text style={styles.label}>Target Date</Text>
              <Pressable
                style={styles.dateButton}
                onPress={() => setShowPicker(true)}
              >
                <Text>
                  {targetDate ? targetDate.toDateString() : "Select date"}
                </Text>
              </Pressable>

              {showPicker && (
                <DateTimePicker
                  value={targetDate || new Date()}
                  mode="date"
                  display="default"
                  onChange={(e, selectedDate) => {
                    setShowPicker(Platform.OS === "ios");
                    if (selectedDate) setTargetDate(selectedDate);
                  }}
                />
              )}
            </>
          )}
        </View>

        {/* NOTES */}
        <View style={styles.card}>
          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={[styles.input, { height: 80 }]}
            multiline
            value={notes}
            onChangeText={setNotes}
          />
        </View>

        <Pressable style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveText}>Save</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 20,
    marginBottom: 20,
    elevation: 2,
  },
  label: {
    fontWeight: "600",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#f1f5f9",
    padding: 14,
    borderRadius: 14,
    marginBottom: 14,
  },
  rowWrap: {
    flexDirection: "row",
    flexWrap: "wrap" as const,
    gap: 10,
    marginBottom: 10,
  },
  pill: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: "#e2e8f0",
  },
  pillActive: {
    backgroundColor: "#16a34a",
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  dateButton: {
    backgroundColor: "#f1f5f9",
    padding: 14,
    borderRadius: 14,
    marginBottom: 14,
  },
  saveButton: {
    backgroundColor: "#16a34a",
    padding: 18,
    borderRadius: 20,
    alignItems: "center" as const,
    marginBottom: 40,
  },
  saveText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
