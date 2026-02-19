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

type IncomeFrequency =
  | "one_time"
  | "daily"
  | "weekly"
  | "bi_weekly"
  | "monthly"
  | "quarterly"
  | "semi_annually"
  | "annually";

const frequencyOptions: { label: string; value: IncomeFrequency }[] = [
  { label: "One-time", value: "one_time" },
  { label: "Daily", value: "daily" },
  { label: "Weekly", value: "weekly" },
  { label: "Bi-Weekly", value: "bi_weekly" },
  { label: "Monthly", value: "monthly" },
  { label: "Quarterly", value: "quarterly" },
  { label: "Semi-Annual", value: "semi_annually" },
  { label: "Annual", value: "annually" },
];

export default function IncomeForm({ onBack }: Props) {
  const router = useRouter();

  const [source, setSource] = useState("");
  const [amount, setAmount] = useState("");
  const [frequency, setFrequency] = useState<IncomeFrequency>("monthly");

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);

  const [includeInAnalysis, setIncludeInAnalysis] = useState(false);

  const [notes, setNotes] = useState("");

  const handleSave = async () => {
    if (!source || !amount) {
      Alert.alert("Missing info", "Please complete required fields");
      return;
    }

    const entry = {
      id: Date.now().toString(),
      type: "income",
      source,
      amount: parseFloat(amount),
      frequency,
      startDate: startDate ? startDate.toISOString() : undefined,
      includeInAnalysis,
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
          <Text style={{ color: "#0f172a", marginBottom: 20 }}>← Back</Text>
        </Pressable>

        <Text style={styles.header}>Income (Optional)</Text>

        <Text style={styles.helperText}>
          Adding income is completely optional. We will never calculate balances
          unless you allow it.
        </Text>

        {/* BASIC INFO */}
        <View style={styles.card}>
          <Text style={styles.label}>Income Source *</Text>
          <TextInput
            style={styles.input}
            placeholder="Salary, Business, Side Hustle..."
            value={source}
            onChangeText={setSource}
          />

          <Text style={styles.label}>Amount *</Text>
          <TextInput
            style={styles.input}
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={setAmount}
          />
        </View>

        {/* FREQUENCY */}
        <View style={styles.card}>
          <Text style={styles.label}>Frequency</Text>
          <View style={styles.rowWrap}>
            {frequencyOptions.map((item) => (
              <Pressable
                key={item.value}
                style={[
                  styles.pill,
                  frequency === item.value && styles.pillActive,
                ]}
                onPress={() => setFrequency(item.value)}
              >
                <Text
                  style={{
                    color: frequency === item.value ? "#fff" : "#0f172a",
                  }}
                >
                  {item.label}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={[styles.label, { marginTop: 15 }]}>
            Start Date (Optional)
          </Text>

          <Pressable
            style={styles.dateButton}
            onPress={() => setShowPicker(true)}
          >
            <Text>{startDate ? startDate.toDateString() : "Select date"}</Text>
          </Pressable>

          {showPicker && (
            <DateTimePicker
              value={startDate || new Date()}
              mode="date"
              display="default"
              onChange={(e, selectedDate) => {
                setShowPicker(Platform.OS === "ios");
                if (selectedDate) setStartDate(selectedDate);
              }}
            />
          )}
        </View>

        {/* PRIVACY CONTROL */}
        <View style={styles.card}>
          <View style={styles.switchRow}>
            <Text style={{ fontWeight: "600" }}>
              Use income for overview calculations
            </Text>
            <Switch
              value={includeInAnalysis}
              onValueChange={setIncludeInAnalysis}
            />
          </View>

          <Text style={styles.smallText}>
            If enabled, we will compare income against expenses. Otherwise, we
            will only show expense summaries.
          </Text>
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
          <Text style={styles.saveText}>Save Income</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 10,
  },
  helperText: {
    fontSize: 13,
    color: "#64748b",
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
  },
  pill: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: "#e2e8f0",
  },
  pillActive: {
    backgroundColor: "#0f172a",
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateButton: {
    backgroundColor: "#f1f5f9",
    padding: 14,
    borderRadius: 14,
  },
  smallText: {
    marginTop: 10,
    fontSize: 12,
    color: "#64748b",
  },
  saveButton: {
    backgroundColor: "#0f172a",
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
