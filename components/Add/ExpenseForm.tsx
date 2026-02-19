import { saveEntryToStorage } from "@/utilis/storage";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

interface Props {
  onBack: () => void;
}

const CATEGORIES = [
  "Food",
  "Transport",
  "Entertainment",
  "Shopping",
  "Bills",
  "Health",
  "Car",
  "Other",
];

const PAYMENT_METHODS = [
  { label: "Cash", icon: "cash-outline" },
  { label: "Debit", icon: "card-outline" },
  { label: "Credit", icon: "card" },
  { label: "Mpesa", icon: "phone-portrait-outline" },
  { label: "Loan", icon: "wallet-outline" },
];

export default function ExpenseForm({ onBack }: Props) {
  const router = useRouter();

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [date, setDate] = useState(new Date());
  const [showDate, setShowDate] = useState(false);
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");

  const handleSave = async () => {
    if (!amount || !category || !paymentMethod) {
      Alert.alert(
        "Missing Information",
        "Amount, category and payment method are required.",
      );
      return;
    }

    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    const entry = {
      id: Date.now().toString(),
      type: "expense",
      amount: parseFloat(amount),
      category,
      paymentMethod,
      date: date.toISOString(),
      description,
      notes,
      createdAt: new Date().toISOString(),
    };

    await saveEntryToStorage(entry);
    router.dismiss();
  };

  return (
    <LinearGradient
      colors={["#0F2027", "#203A43", "#FF6B6B"]}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <Animated.View entering={FadeInDown.duration(600)}>
            <Pressable onPress={onBack}>
              <Text style={{ color: "#fff", marginBottom: 20 }}>← Back</Text>
            </Pressable>

            <Text style={styles.title}>Add Expense</Text>

            {/* AMOUNT */}
            <BlurView intensity={30} tint="light" style={styles.card}>
              <Text style={styles.label}>Amount *</Text>
              <TextInput
                style={styles.input}
                keyboardType="decimal-pad"
                placeholder="0.00"
                placeholderTextColor="#999"
                value={amount}
                onChangeText={setAmount}
              />
            </BlurView>

            {/* CATEGORY */}
            <BlurView intensity={30} tint="light" style={styles.card}>
              <Text style={styles.label}>Category *</Text>
              <View style={styles.chipContainer}>
                {CATEGORIES.map((item) => (
                  <Pressable
                    key={item}
                    onPress={() => {
                      Haptics.selectionAsync();
                      setCategory(item);
                    }}
                    style={[
                      styles.chip,
                      category === item && styles.selectedChip,
                    ]}
                  >
                    <Text
                      style={{
                        color: category === item ? "#fff" : "#333",
                        fontWeight: "600",
                      }}
                    >
                      {item}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </BlurView>

            {/* PAYMENT METHOD */}
            <BlurView intensity={30} tint="light" style={styles.card}>
              <Text style={styles.label}>Payment Method *</Text>
              <View style={styles.chipContainer}>
                {PAYMENT_METHODS.map((item) => (
                  <Pressable
                    key={item.label}
                    onPress={() => {
                      Haptics.selectionAsync();
                      setPaymentMethod(item.label);
                    }}
                    style={[
                      styles.chip,
                      paymentMethod === item.label && styles.selectedChip,
                    ]}
                  >
                    <Ionicons
                      name={item.icon as any}
                      size={16}
                      color={paymentMethod === item.label ? "#fff" : "#333"}
                    />
                    <Text
                      style={{
                        marginLeft: 6,
                        color: paymentMethod === item.label ? "#fff" : "#333",
                      }}
                    >
                      {item.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </BlurView>

            {/* DATE */}
            <BlurView intensity={30} tint="light" style={styles.card}>
              <Text style={styles.label}>Date *</Text>
              <Pressable
                onPress={() => setShowDate(true)}
                style={styles.dateButton}
              >
                <Text>{date.toDateString()}</Text>
              </Pressable>

              {showDate && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="default"
                  onChange={(_, selectedDate) => {
                    setShowDate(false);
                    if (selectedDate) setDate(selectedDate);
                  }}
                />
              )}
            </BlurView>

            {/* DESCRIPTION */}
            <BlurView intensity={30} tint="light" style={styles.card}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Lunch at Java"
                placeholderTextColor="#999"
                value={description}
                onChangeText={setDescription}
              />
            </BlurView>

            {/* NOTES */}
            <BlurView intensity={30} tint="light" style={styles.card}>
              <Text style={styles.label}>Notes (Optional)</Text>
              <TextInput
                style={[styles.input, { height: 80 }]}
                multiline
                value={notes}
                onChangeText={setNotes}
              />
            </BlurView>

            {/* SAVE */}
            <Pressable style={styles.saveButton} onPress={handleSave}>
              <Text style={{ color: "#fff", fontWeight: "700" }}>
                Save Expense
              </Text>
            </Pressable>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 20,
  },
  card: {
    padding: 16,
    borderRadius: 20,
    marginBottom: 16,
    overflow: "hidden",
  },
  label: {
    fontWeight: "700",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.6)",
    borderRadius: 12,
    padding: 12,
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: "#eee",
    marginRight: 8,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  selectedChip: {
    backgroundColor: "#FF6B6B",
  },
  dateButton: {
    backgroundColor: "#eee",
    padding: 12,
    borderRadius: 12,
  },
  saveButton: {
    backgroundColor: "#FF6B6B",
    padding: 18,
    borderRadius: 18,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 40,
  },
});
