import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import BillForm from "@/components/Add/BillForm";
import ExpenseForm from "@/components/Add/ExpenseForm";
import IncomeForm from "@/components/Add/IncomeForm";
import InvestmentForm from "@/components/Add/InvestmentForm";

type EntryType = "expense" | "bill" | "income" | "investment" | null;

const { width } = Dimensions.get("window");

const ENTRY_OPTIONS = [
  {
    type: "expense",
    title: "Expense",
    icon: "arrow-down-circle",
    color: "#FF6B6B",
    description: "Track money you spent",
  },
  {
    type: "income",
    title: "Income",
    icon: "arrow-up-circle",
    color: "#2ECC71",
    description: "Record money you earned",
  },
  {
    type: "bill",
    title: "Bill",
    icon: "receipt",
    color: "#F39C12",
    description: "Manage upcoming payments",
  },
  {
    type: "investment",
    title: "Investment",
    icon: "trending-up",
    color: "#6C5CE7",
    description: "Log investments & assets",
  },
];

export default function AddModal() {
  const [entryType, setEntryType] = useState<EntryType>(null);

  const handleSelect = async (type: EntryType) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setEntryType(type);
  };

  if (!entryType) {
    return (
      <LinearGradient
        colors={["#0F2027", "#203A43", "#2C5364"]}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={styles.container}>
          <Text style={styles.title}>Track Your Money</Text>
          <Text style={styles.subtitle}>What would you like to add today?</Text>

          <View style={{ marginTop: 30 }}>
            {ENTRY_OPTIONS.map((item, index) => (
              <Animated.View
                key={item.type}
                entering={FadeInDown.delay(index * 120)}
              >
                <Pressable
                  onPress={() => handleSelect(item.type as EntryType)}
                  style={({ pressed }) => [
                    styles.card,
                    pressed && { transform: [{ scale: 0.97 }] },
                  ]}
                >
                  <View
                    style={[
                      styles.iconContainer,
                      { backgroundColor: item.color + "20" },
                    ]}
                  >
                    <Ionicons
                      name={item.icon as any}
                      size={28}
                      color={item.color}
                    />
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <Text style={styles.cardDescription}>
                      {item.description}
                    </Text>
                  </View>

                  <Ionicons name="chevron-forward" size={20} color="#aaa" />
                </Pressable>
              </Animated.View>
            ))}
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  switch (entryType) {
    case "expense":
      return <ExpenseForm onBack={() => setEntryType(null)} />;
    case "bill":
      return <BillForm onBack={() => setEntryType(null)} />;
    case "income":
      return <IncomeForm onBack={() => setEntryType(null)} />;
    case "investment":
      return <InvestmentForm onBack={() => setEntryType(null)} />;
    default:
      return null;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
    marginTop: 20,
  },
  subtitle: {
    fontSize: 15,
    color: "#ccc",
    marginTop: 8,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    padding: 18,
    borderRadius: 18,
    marginBottom: 18,
    backdropFilter: "blur(10px)",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#fff",
  },
  cardDescription: {
    fontSize: 13,
    color: "#aaa",
    marginTop: 4,
  },
});
