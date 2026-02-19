import { useState } from "react";
import { Pressable, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import BillForm from "@/components/Add/BillForm";
import ExpenseForm from "@/components/Add/ExpenseForm";
import IncomeForm from "@/components/Add/IncomeForm";
import InvestmentForm from "@/components/Add/InvestmentForm";

type EntryType = "expense" | "bill" | "income" | "investment" | null;

export default function AddModal() {
  const [entryType, setEntryType] = useState<EntryType>(null);

  if (!entryType) {
    return (
      <SafeAreaView style={{ flex: 1, padding: 20 }}>
        <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 20 }}>
          Track Your Money
        </Text>

        {["expense", "bill", "income", "investment"].map((type) => (
          <Pressable
            key={type}
            onPress={() => setEntryType(type as EntryType)}
            style={{
              padding: 20,
              backgroundColor: "#f5f5f5",
              borderRadius: 14,
              marginBottom: 12,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "600" }}>
              {type.toUpperCase()}
            </Text>
          </Pressable>
        ))}
      </SafeAreaView>
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
