import { IconSymbol } from "@/components/ui/icon-symbol";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type EntryType = "expense" | "bill" | "income" | "investment" | null;

const EXPENSE_CATEGORIES = [
  { id: "food", label: "Food", icon: "🍔" },
  { id: "transport", label: "Transport", icon: "🚗" },
  { id: "utilities", label: "Utilities", icon: "💡" },
  { id: "entertainment", label: "Entertainment", icon: "🎬" },
  { id: "health", label: "Health", icon: "💊" },
  { id: "shopping", label: "Shopping", icon: "🛍️" },
  { id: "subscriptions", label: "Subscriptions", icon: "📱" },
  { id: "other", label: "Other", icon: "📌" },
];

const BILL_CATEGORIES = [
  { id: "electricity", label: "Electricity", icon: "💡" },
  { id: "internet", label: "Internet", icon: "📡" },
  { id: "phone", label: "Phone", icon: "📱" },
  { id: "rent", label: "Rent", icon: "🏠" },
  { id: "insurance", label: "Insurance", icon: "🛡️" },
  { id: "water", label: "Water", icon: "💧" },
  { id: "gas", label: "Gas", icon: "🔥" },
  { id: "subscription", label: "Subscription", icon: "🎥" },
];

const INVESTMENT_CATEGORIES = [
  { id: "stocks", label: "Stocks", icon: "📈" },
  { id: "crypto", label: "Crypto", icon: "₿" },
  { id: "savings", label: "Savings Account", icon: "🏦" },
  { id: "mutual_funds", label: "Mutual Funds", icon: "💼" },
  { id: "real_estate", label: "Real Estate", icon: "🏢" },
  { id: "retirement", label: "Retirement Fund", icon: "👴" },
  { id: "bonds", label: "Bonds", icon: "📊" },
  { id: "other", label: "Other", icon: "📌" },
];

const PAYMENT_METHODS = [
  { id: "cash", label: "Cash", icon: "💵" },
  { id: "mpesa", label: "M-Pesa", icon: "📱" },
  { id: "bank", label: "Bank", icon: "🏦" },
  { id: "card", label: "Card", icon: "💳" },
  { id: "other", label: "Other", icon: "📌" },
];

const INCOME_TYPES = [
  { id: "salary", label: "Salary", icon: "💼" },
  { id: "freelance", label: "Freelance", icon: "🎨" },
  { id: "business", label: "Business", icon: "🏢" },
  { id: "gift", label: "Gift", icon: "🎁" },
  { id: "other", label: "Other", icon: "📌" },
];

const BILL_FREQUENCIES = [
  { id: "weekly", label: "Weekly" },
  { id: "biweekly", label: "Bi-weekly" },
  { id: "monthly", label: "Monthly" },
  { id: "quarterly", label: "Quarterly" },
  { id: "annual", label: "Annual" },
];

const BILL_STATUSES = [
  { id: "upcoming", label: "Upcoming", icon: "⏳" },
  { id: "paid", label: "Paid", icon: "✅" },
  { id: "skipped", label: "Skipped", icon: "⏭️" },
];

export default function AddModal() {
  const router = useRouter();
  const [step, setStep] = useState<"type" | "entry">("type");
  const [entryType, setEntryType] = useState<EntryType>(null);

  // Expense fields
  const [expAmount, setExpAmount] = useState("");
  const [expCategory, setExpCategory] = useState<string | null>(null);
  const [expDesc, setExpDesc] = useState("");
  const [expPaymentMethod, setExpPaymentMethod] = useState<string | null>(null);
  const [expDate, setExpDate] = useState(new Date());
  const [expDatePickerOpen, setExpDatePickerOpen] = useState(false);

  // Bill fields
  const [billAmount, setBillAmount] = useState("");
  const [billCategory, setBillCategory] = useState<string | null>(null);
  const [billName, setBillName] = useState("");
  const [billDueDate, setBillDueDate] = useState<Date | null>(null);
  const [billDueDatePickerOpen, setBillDueDatePickerOpen] = useState(false);
  const [billFrequency, setBillFrequency] = useState("monthly");
  const [billStatus, setBillStatus] = useState("upcoming");
  const [billPaymentMethod, setBillPaymentMethod] = useState<string | null>(
    null,
  );

  // Income fields
  const [incAmount, setIncAmount] = useState("");
  const [incSource, setIncSource] = useState("");
  const [incType, setIncType] = useState<string | null>(null);
  const [incDate, setIncDate] = useState(new Date());
  const [incDatePickerOpen, setIncDatePickerOpen] = useState(false);

  // Investment fields
  const [invAmount, setInvAmount] = useState("");
  const [invCategory, setInvCategory] = useState<string | null>(null);
  const [invDesc, setInvDesc] = useState("");
  const [invCurrentValue, setInvCurrentValue] = useState("");
  const [invDate, setInvDate] = useState(new Date());
  const [invDatePickerOpen, setInvDatePickerOpen] = useState(false);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-KE", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const handleExpenseDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setExpDatePickerOpen(false);
    }
    if (selectedDate) {
      setExpDate(selectedDate);
    }
  };

  const handleBillDueDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setBillDueDatePickerOpen(false);
    }
    if (selectedDate) {
      setBillDueDate(selectedDate);
    }
  };

  const handleIncomeDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setIncDatePickerOpen(false);
    }
    if (selectedDate) {
      setIncDate(selectedDate);
    }
  };

  const handleInvestmentDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setInvDatePickerOpen(false);
    }
    if (selectedDate) {
      setInvDate(selectedDate);
    }
  };

  const handleSaveExpense = async () => {
    if (!expAmount || !expCategory) {
      Alert.alert("Missing info", "Please enter amount and select category");
      return;
    }

    const entry = {
      id: Date.now().toString(),
      type: "expense",
      amount: parseFloat(expAmount),
      category: expCategory,
      description: expDesc,
      paymentMethod: expPaymentMethod || null,
      date: expDate.toISOString(),
    };

    await saveEntry(entry);
  };

  const handleSaveBill = async () => {
    if (!billAmount || !billCategory || !billName) {
      Alert.alert(
        "Missing info",
        "Please enter amount, name, and select category",
      );
      return;
    }

    const entry = {
      id: Date.now().toString(),
      type: "bill",
      amount: parseFloat(billAmount),
      category: billCategory,
      name: billName,
      dueDate: billDueDate ? billDueDate.toISOString() : null,
      frequency: billFrequency,
      status: billStatus,
      paymentMethod: billPaymentMethod || null,
      date: new Date().toISOString(),
    };

    await saveEntry(entry);
  };

  const handleSaveIncome = async () => {
    if (!incAmount || !incSource) {
      Alert.alert("Missing info", "Please enter amount and source");
      return;
    }

    const entry = {
      id: Date.now().toString(),
      type: "income",
      amount: parseFloat(incAmount),
      source: incSource,
      incomeType: incType || null,
      date: incDate.toISOString(),
    };

    await saveEntry(entry);
  };

  const handleSaveInvestment = async () => {
    if (!invAmount || !invCategory) {
      Alert.alert("Missing info", "Please enter amount and select category");
      return;
    }

    const entry = {
      id: Date.now().toString(),
      type: "investment",
      investedAmount: parseFloat(invAmount),
      currentValue: invCurrentValue ? parseFloat(invCurrentValue) : null,
      category: invCategory,
      description: invDesc,
      date: invDate.toISOString(),
    };

    await saveEntry(entry);
  };

  const saveEntry = async (entry: any) => {
    try {
      const existingData = await AsyncStorage.getItem("entries");
      const entries = existingData ? JSON.parse(existingData) : [];
      entries.push(entry);
      await AsyncStorage.setItem("entries", JSON.stringify(entries));

      Alert.alert("Success", "Entry saved successfully!");
      router.dismiss();
    } catch (error) {
      Alert.alert("Error", "Failed to save entry");
      console.error(error);
    }
  };

  if (step === "type") {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Track Your Money</Text>
          <Pressable onPress={() => router.dismiss()}>
            <IconSymbol name="xmark" size={24} color="#666" />
          </Pressable>
        </View>

        <View style={styles.typeGridContainer}>
          <View style={styles.typeRow}>
            <Pressable
              style={styles.typeCard}
              onPress={() => {
                setEntryType("expense");
                setStep("entry");
              }}
            >
              <Text style={styles.typeEmoji}>💰</Text>
              <Text style={styles.typeLabel}>Expense</Text>
              <Text style={styles.typeHint}>Quick spend</Text>
            </Pressable>

            <Pressable
              style={styles.typeCard}
              onPress={() => {
                setEntryType("bill");
                setStep("entry");
              }}
            >
              <Text style={styles.typeEmoji}>📋</Text>
              <Text style={styles.typeLabel}>Bill</Text>
              <Text style={styles.typeHint}>Recurring</Text>
            </Pressable>
          </View>

          <View style={styles.typeRow}>
            <Pressable
              style={styles.typeCard}
              onPress={() => {
                setEntryType("income");
                setStep("entry");
              }}
            >
              <Text style={styles.typeEmoji}>💵</Text>
              <Text style={styles.typeLabel}>Income</Text>
              <Text style={styles.typeHint}>Money in</Text>
            </Pressable>

            <Pressable
              style={styles.typeCard}
              onPress={() => {
                setEntryType("investment");
                setStep("entry");
              }}
            >
              <Text style={styles.typeEmoji}>📈</Text>
              <Text style={styles.typeLabel}>Investment</Text>
              <Text style={styles.typeHint}>Growth</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // EXPENSE ENTRY
  if (entryType === "expense") {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <Pressable onPress={() => setStep("type")}>
              <Text style={styles.backBtn}>← Back</Text>
            </Pressable>
            <Text style={styles.stepTitle}>💰 Add Expense</Text>
            <Pressable onPress={() => router.dismiss()}>
              <IconSymbol name="xmark" size={24} color="#666" />
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={styles.entryContent}>
            <View style={styles.amountSection}>
              <Text style={styles.label}>Amount (Ksh)</Text>
              <TextInput
                style={styles.amountInput}
                placeholder="0"
                keyboardType="decimal-pad"
                value={expAmount}
                onChangeText={setExpAmount}
                placeholderTextColor="#ccc"
                autoFocus
              />
            </View>

            <View style={styles.categorySection}>
              <Text style={styles.label}>Category</Text>
              <View style={styles.categoryGrid}>
                {EXPENSE_CATEGORIES.map((cat) => (
                  <Pressable
                    key={cat.id}
                    style={[
                      styles.categoryBtn,
                      expCategory === cat.id && styles.categoryBtnActive,
                    ]}
                    onPress={() => setExpCategory(cat.id)}
                  >
                    <Text style={styles.categoryEmoji}>{cat.icon}</Text>
                    <Text
                      style={[
                        styles.categoryText,
                        expCategory === cat.id && styles.categoryTextActive,
                      ]}
                    >
                      {cat.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.categorySection}>
              <Text style={styles.label}>Payment Method (optional)</Text>
              <View style={styles.categoryGrid}>
                {PAYMENT_METHODS.map((method) => (
                  <Pressable
                    key={method.id}
                    style={[
                      styles.categoryBtn,
                      expPaymentMethod === method.id &&
                        styles.categoryBtnActive,
                    ]}
                    onPress={() => setExpPaymentMethod(method.id)}
                  >
                    <Text style={styles.categoryEmoji}>{method.icon}</Text>
                    <Text
                      style={[
                        styles.categoryText,
                        expPaymentMethod === method.id &&
                          styles.categoryTextActive,
                      ]}
                    >
                      {method.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.descSection}>
              <Text style={styles.label}>Expense Date</Text>
              <Pressable
                style={styles.dateBtn}
                onPress={() => setExpDatePickerOpen(true)}
              >
                <IconSymbol name="calendar" size={20} color="#007AFF" />
                <Text style={styles.dateBtnText}>{formatDate(expDate)}</Text>
              </Pressable>
              {expDatePickerOpen && (
                <DateTimePicker
                  value={expDate}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={handleExpenseDateChange}
                />
              )}
            </View>

            <View style={styles.descSection}>
              <Text style={styles.label}>Notes (optional)</Text>
              <TextInput
                style={styles.descInput}
                placeholder="e.g., Lunch at cafe"
                value={expDesc}
                onChangeText={setExpDesc}
                placeholderTextColor="#ccc"
              />
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <Pressable
              style={({ pressed }) => [
                styles.saveBtn,
                { opacity: pressed ? 0.8 : 1 },
              ]}
              onPress={handleSaveExpense}
            >
              <Text style={styles.saveBtnText}>Save Expense</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    );
  }

  // BILL ENTRY
  if (entryType === "bill") {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <Pressable onPress={() => setStep("type")}>
              <Text style={styles.backBtn}>← Back</Text>
            </Pressable>
            <Text style={styles.stepTitle}>📋 Add Bill</Text>
            <Pressable onPress={() => router.dismiss()}>
              <IconSymbol name="xmark" size={24} color="#666" />
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={styles.entryContent}>
            <View style={styles.row}>
              <View style={[styles.amountSection, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.label}>Amount (Ksh)</Text>
                <TextInput
                  style={styles.amountInput}
                  placeholder="0"
                  keyboardType="decimal-pad"
                  value={billAmount}
                  onChangeText={setBillAmount}
                  placeholderTextColor="#ccc"
                  autoFocus
                />
              </View>
            </View>

            <View style={styles.descSection}>
              <Text style={styles.label}>Bill Name</Text>
              <TextInput
                style={styles.descInput}
                placeholder="e.g., Netflix"
                value={billName}
                onChangeText={setBillName}
                placeholderTextColor="#ccc"
              />
            </View>

            <View style={styles.categorySection}>
              <Text style={styles.label}>Category</Text>
              <View style={styles.categoryGrid}>
                {BILL_CATEGORIES.map((cat) => (
                  <Pressable
                    key={cat.id}
                    style={[
                      styles.categoryBtn,
                      billCategory === cat.id && styles.categoryBtnActive,
                    ]}
                    onPress={() => setBillCategory(cat.id)}
                  >
                    <Text style={styles.categoryEmoji}>{cat.icon}</Text>
                    <Text
                      style={[
                        styles.categoryText,
                        billCategory === cat.id && styles.categoryTextActive,
                      ]}
                    >
                      {cat.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.categorySection}>
              <Text style={styles.label}>Frequency</Text>
              <View style={styles.optionGrid}>
                {BILL_FREQUENCIES.map((freq) => (
                  <Pressable
                    key={freq.id}
                    style={[
                      styles.optionBtn,
                      billFrequency === freq.id && styles.optionBtnActive,
                    ]}
                    onPress={() => setBillFrequency(freq.id)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        billFrequency === freq.id && styles.optionTextActive,
                      ]}
                    >
                      {freq.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.categorySection}>
              <Text style={styles.label}>Status</Text>
              <View style={styles.optionGrid}>
                {BILL_STATUSES.map((status) => (
                  <Pressable
                    key={status.id}
                    style={[
                      styles.optionBtn,
                      billStatus === status.id && styles.optionBtnActive,
                    ]}
                    onPress={() => setBillStatus(status.id)}
                  >
                    <Text style={styles.optionEmoji}>{status.icon}</Text>
                    <Text
                      style={[
                        styles.optionText,
                        billStatus === status.id && styles.optionTextActive,
                      ]}
                    >
                      {status.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.categorySection}>
              <Text style={styles.label}>Payment Method (optional)</Text>
              <View style={styles.categoryGrid}>
                {PAYMENT_METHODS.map((method) => (
                  <Pressable
                    key={method.id}
                    style={[
                      styles.categoryBtn,
                      billPaymentMethod === method.id &&
                        styles.categoryBtnActive,
                    ]}
                    onPress={() => setBillPaymentMethod(method.id)}
                  >
                    <Text style={styles.categoryEmoji}>{method.icon}</Text>
                    <Text
                      style={[
                        styles.categoryText,
                        billPaymentMethod === method.id &&
                          styles.categoryTextActive,
                      ]}
                    >
                      {method.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.descSection}>
              <Text style={styles.label}>Due Date (optional)</Text>
              <Pressable
                style={styles.dateBtn}
                onPress={() => setBillDueDatePickerOpen(true)}
              >
                <IconSymbol name="calendar" size={20} color="#007AFF" />
                <Text style={styles.dateBtnText}>
                  {billDueDate ? formatDate(billDueDate) : "Select due date"}
                </Text>
              </Pressable>
              {billDueDatePickerOpen && (
                <DateTimePicker
                  value={billDueDate || new Date()}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={handleBillDueDateChange}
                />
              )}
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <Pressable
              style={({ pressed }) => [
                styles.saveBtn,
                { opacity: pressed ? 0.8 : 1 },
              ]}
              onPress={handleSaveBill}
            >
              <Text style={styles.saveBtnText}>Save Bill</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    );
  }

  // INCOME ENTRY
  if (entryType === "income") {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <Pressable onPress={() => setStep("type")}>
              <Text style={styles.backBtn}>← Back</Text>
            </Pressable>
            <Text style={styles.stepTitle}>💵 Add Income</Text>
            <Pressable onPress={() => router.dismiss()}>
              <IconSymbol name="xmark" size={24} color="#666" />
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={styles.entryContent}>
            <View style={styles.amountSection}>
              <Text style={styles.label}>Amount (Ksh)</Text>
              <TextInput
                style={styles.amountInput}
                placeholder="0"
                keyboardType="decimal-pad"
                value={incAmount}
                onChangeText={setIncAmount}
                placeholderTextColor="#ccc"
                autoFocus
              />
            </View>

            <View style={styles.descSection}>
              <Text style={styles.label}>Income Source</Text>
              <TextInput
                style={styles.descInput}
                placeholder="e.g., Primary Job, Freelance Project"
                value={incSource}
                onChangeText={setIncSource}
                placeholderTextColor="#ccc"
              />
            </View>

            <View style={styles.categorySection}>
              <Text style={styles.label}>Income Type (optional)</Text>
              <View style={styles.categoryGrid}>
                {INCOME_TYPES.map((type) => (
                  <Pressable
                    key={type.id}
                    style={[
                      styles.categoryBtn,
                      incType === type.id && styles.categoryBtnActive,
                    ]}
                    onPress={() => setIncType(type.id)}
                  >
                    <Text style={styles.categoryEmoji}>{type.icon}</Text>
                    <Text
                      style={[
                        styles.categoryText,
                        incType === type.id && styles.categoryTextActive,
                      ]}
                    >
                      {type.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.descSection}>
              <Text style={styles.label}>Income Date</Text>
              <Pressable
                style={styles.dateBtn}
                onPress={() => setIncDatePickerOpen(true)}
              >
                <IconSymbol name="calendar" size={20} color="#007AFF" />
                <Text style={styles.dateBtnText}>{formatDate(incDate)}</Text>
              </Pressable>
              {incDatePickerOpen && (
                <DateTimePicker
                  value={incDate}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={handleIncomeDateChange}
                />
              )}
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <Pressable
              style={({ pressed }) => [
                styles.saveBtn,
                { opacity: pressed ? 0.8 : 1 },
              ]}
              onPress={handleSaveIncome}
            >
              <Text style={styles.saveBtnText}>Save Income</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    );
  }

  // INVESTMENT ENTRY
  if (entryType === "investment") {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <Pressable onPress={() => setStep("type")}>
              <Text style={styles.backBtn}>← Back</Text>
            </Pressable>
            <Text style={styles.stepTitle}>📈 Add Investment</Text>
            <Pressable onPress={() => router.dismiss()}>
              <IconSymbol name="xmark" size={24} color="#666" />
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={styles.entryContent}>
            <View style={styles.amountSection}>
              <Text style={styles.label}>Initial Investment (Ksh)</Text>
              <TextInput
                style={styles.amountInput}
                placeholder="0"
                keyboardType="decimal-pad"
                value={invAmount}
                onChangeText={setInvAmount}
                placeholderTextColor="#ccc"
                autoFocus
              />
            </View>

            <View style={styles.categorySection}>
              <Text style={styles.label}>Investment Type</Text>
              <View style={styles.categoryGrid}>
                {INVESTMENT_CATEGORIES.map((cat) => (
                  <Pressable
                    key={cat.id}
                    style={[
                      styles.categoryBtn,
                      invCategory === cat.id && styles.categoryBtnActive,
                    ]}
                    onPress={() => setInvCategory(cat.id)}
                  >
                    <Text style={styles.categoryEmoji}>{cat.icon}</Text>
                    <Text
                      style={[
                        styles.categoryText,
                        invCategory === cat.id && styles.categoryTextActive,
                      ]}
                    >
                      {cat.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.descSection}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={styles.descInput}
                placeholder="e.g., Apple Stock, Equity Mutual Fund"
                value={invDesc}
                onChangeText={setInvDesc}
                placeholderTextColor="#ccc"
              />
            </View>

            <View style={styles.descSection}>
              <Text style={styles.label}>Current Value (optional)</Text>
              <TextInput
                style={styles.descInput}
                placeholder="Leave blank if same as investment"
                keyboardType="decimal-pad"
                value={invCurrentValue}
                onChangeText={setInvCurrentValue}
                placeholderTextColor="#ccc"
              />
            </View>

            <View style={styles.descSection}>
              <Text style={styles.label}>Investment Date</Text>
              <Pressable
                style={styles.dateBtn}
                onPress={() => setInvDatePickerOpen(true)}
              >
                <IconSymbol name="calendar" size={20} color="#007AFF" />
                <Text style={styles.dateBtnText}>{formatDate(invDate)}</Text>
              </Pressable>
              {invDatePickerOpen && (
                <DateTimePicker
                  value={invDate}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={handleInvestmentDateChange}
                />
              )}
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <Pressable
              style={({ pressed }) => [
                styles.saveBtn,
                { opacity: pressed ? 0.8 : 1 },
              ]}
              onPress={handleSaveInvestment}
            >
              <Text style={styles.saveBtnText}>Save Investment</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#f0f0f0",
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    textAlign: "center",
    flex: 1,
  },

  stepTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    textAlign: "center",
    flex: 1,
  },

  backBtn: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007AFF",
  },

  typeGridContainer: {
    padding: 16,
    justifyContent: "center",
    flex: 1,
  },

  typeRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },

  typeCard: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#e5e5e5",
  },

  typeEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },

  typeLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
    marginBottom: 4,
  },

  typeHint: {
    fontSize: 12,
    color: "#999",
  },

  entryContent: {
    padding: 16,
    paddingBottom: 100,
  },

  row: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },

  amountSection: {
    marginBottom: 24,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },

  amountInput: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 24,
    fontWeight: "700",
    color: "#000",
    borderWidth: 2,
    borderColor: "#e5e5e5",
  },

  categorySection: {
    marginBottom: 24,
  },

  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  categoryBtn: {
    width: "30%",
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#e5e5e5",
  },

  categoryBtnActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },

  categoryEmoji: {
    fontSize: 28,
    marginBottom: 4,
  },

  categoryText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },

  categoryTextActive: {
    color: "#fff",
  },

  optionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  optionBtn: {
    flex: 1,
    minWidth: "48%",
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 2,
    borderColor: "#e5e5e5",
    alignItems: "center",
  },

  optionBtnActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },

  optionEmoji: {
    fontSize: 18,
    marginBottom: 4,
  },

  optionText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },

  optionTextActive: {
    color: "#fff",
  },

  descSection: {
    marginBottom: 16,
  },

  descInput: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#000",
    borderWidth: 2,
    borderColor: "#e5e5e5",
  },

  dateBtn: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: "#e5e5e5",
    alignItems: "center",
    gap: 10,
  },

  dateBtnText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    flex: 1,
  },

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#f0f0f0",
  },

  saveBtn: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },

  saveBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
});
