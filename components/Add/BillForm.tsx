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
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Props {
  onBack: () => void;
}

type Recurrence =
  | "weekly"
  | "monthly"
  | "quarterly"
  | "semi_annually"
  | "annually";

const recurrenceOptions: { label: string; value: Recurrence }[] = [
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
  { label: "Quarterly", value: "quarterly" },
  { label: "Semi-Annual", value: "semi_annually" },
  { label: "Annual", value: "annually" },
];

const reminderOptions = [
  { label: "1 Day", value: "1_day" },
  { label: "3 Days", value: "3_days" },
  { label: "1 Week", value: "1_week" },
  { label: "2 Weeks", value: "2_weeks" },
];

export default function BillForm({ onBack }: Props) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);

  const [recurrence, setRecurrence] = useState<Recurrence>("monthly");
  const [reminders, setReminders] = useState<string[]>(["1_day"]);

  const toggleReminder = (value: string) => {
    if (reminders.includes(value)) {
      setReminders(reminders.filter((r) => r !== value));
    } else {
      setReminders([...reminders, value]);
    }
  };

  const handleSave = async () => {
    if (!name || !amount || !dueDate) {
      Alert.alert("Missing info", "Please complete required fields");
      return;
    }

    const entry = {
      id: Date.now().toString(),
      type: "bill",
      name,
      amount: parseFloat(amount),
      description,
      notes,
      paymentMethod,
      dueDate: dueDate.toISOString(),
      recurrence,
      reminders,
      createdAt: new Date().toISOString(),
    };

    await saveEntryToStorage(entry);
    router.dismiss();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f8fafc" }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Pressable onPress={onBack}>
          <Text style={{ color: "#007AFF", marginBottom: 20 }}>← Back</Text>
        </Pressable>

        <Text style={styles.header}>New Recurring Bill</Text>

        {/* BASIC INFO CARD */}
        <View style={styles.card}>
          <Text style={styles.label}>Bill Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Netflix, Rent..."
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>Amount *</Text>
          <TextInput
            style={styles.input}
            keyboardType="decimal-pad"
            placeholder="0.00"
            value={amount}
            onChangeText={setAmount}
          />
        </View>

        {/* DATE + RECURRENCE CARD */}
        <View style={styles.card}>
          <Text style={styles.label}>First Due Date *</Text>

          <Pressable
            style={styles.dateButton}
            onPress={() => setShowPicker(true)}
          >
            <Text style={{ color: dueDate ? "#000" : "#94a3b8" }}>
              {dueDate ? dueDate.toDateString() : "Select date"}
            </Text>
          </Pressable>

          {showPicker && (
            <DateTimePicker
              value={dueDate || new Date()}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowPicker(Platform.OS === "ios");
                if (selectedDate) setDueDate(selectedDate);
              }}
            />
          )}

          <Text style={[styles.label, { marginTop: 20 }]}>Recurrence</Text>

          <View style={styles.rowWrap}>
            {recurrenceOptions.map((option) => (
              <Pressable
                key={option.value}
                style={[
                  styles.pill,
                  recurrence === option.value && styles.pillActive,
                ]}
                onPress={() => setRecurrence(option.value)}
              >
                <Text
                  style={{
                    color: recurrence === option.value ? "#fff" : "#0f172a",
                  }}
                >
                  {option.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* REMINDER CARD */}
        <View style={styles.card}>
          <Text style={styles.label}>Remind Me Before</Text>

          <View style={styles.rowWrap}>
            {reminderOptions.map((option) => (
              <Pressable
                key={option.value}
                style={[
                  styles.pill,
                  reminders.includes(option.value) && styles.pillActive,
                ]}
                onPress={() => toggleReminder(option.value)}
              >
                <Text
                  style={{
                    color: reminders.includes(option.value)
                      ? "#fff"
                      : "#0f172a",
                  }}
                >
                  {option.label}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.helperText}>
            You will always receive a reminder on the due date.
          </Text>
        </View>

        {/* OPTIONAL DETAILS */}
        <View style={styles.card}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.input}
            value={description}
            onChangeText={setDescription}
          />

          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={[styles.input, { height: 80 }]}
            multiline
            value={notes}
            onChangeText={setNotes}
          />

          <Text style={styles.label}>Payment Method</Text>
          <TextInput
            style={styles.input}
            value={paymentMethod}
            onChangeText={setPaymentMethod}
          />
        </View>

        <Pressable style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveText}>Save Bill</Text>
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
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
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
  dateButton: {
    backgroundColor: "#f1f5f9",
    padding: 16,
    borderRadius: 14,
  },
  rowWrap: {
    flexDirection: "row",
    flexWrap: "wrap" as const,
    gap: 10,
  },
  pill: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: "#e2e8f0",
  },
  pillActive: {
    backgroundColor: "#2563eb",
  },
  helperText: {
    marginTop: 10,
    fontSize: 12,
    color: "#64748b",
  },
  saveButton: {
    backgroundColor: "#2563eb",
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
