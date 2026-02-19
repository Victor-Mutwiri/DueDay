import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function StatsScreen() {
  const [entries, setEntries] = useState<any[]>([]);

  const loadEntries = async () => {
    const data = await AsyncStorage.getItem("entries");
    if (data) setEntries(JSON.parse(data));
  };

  useFocusEffect(
    useCallback(() => {
      loadEntries();
    }, []),
  );

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const lastMonthDate = new Date(currentYear, currentMonth - 1, 1);
  const lastMonth = lastMonthDate.getMonth();
  const lastMonthYear = lastMonthDate.getFullYear();

  const isMonth = (date: string, month: number, year: number) => {
    const d = new Date(date);
    return d.getMonth() === month && d.getFullYear() === year;
  };

  const expenses = entries.filter((e) => e.type === "expense");
  const income = entries.filter((e) => e.type === "income");
  const investments = entries.filter((e) => e.type === "investment");

  const thisMonthExpenses = expenses
    .filter((e) => isMonth(e.date, currentMonth, currentYear))
    .reduce((sum, e) => sum + e.amount, 0);

  const lastMonthExpenses = expenses
    .filter((e) => isMonth(e.date, lastMonth, lastMonthYear))
    .reduce((sum, e) => sum + e.amount, 0);

  const thisMonthIncome = income
    .filter((e) => isMonth(e.date, currentMonth, currentYear))
    .reduce((sum, e) => sum + e.amount, 0);

  const savings = thisMonthIncome - thisMonthExpenses;
  const savingsRate =
    thisMonthIncome > 0 ? ((savings / thisMonthIncome) * 100).toFixed(1) : 0;

  const totalInvested = investments.reduce(
    (sum, i) => sum + (i.investedAmount || 0),
    0,
  );

  const totalCurrentValue = investments.reduce(
    (sum, i) => sum + (i.currentValue || i.investedAmount || 0),
    0,
  );

  const investmentGrowth = totalCurrentValue - totalInvested;

  // Category Breakdown
  const categoryMap: any = {};
  expenses.forEach((e) => {
    categoryMap[e.category] = (categoryMap[e.category] || 0) + e.amount;
  });

  const topCategories = Object.entries(categoryMap)
    .sort((a: any, b: any) => b[1] - a[1])
    .slice(0, 3);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F4F6FA" }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HERO */}
        <LinearGradient colors={["#0F172A", "#1E293B"]} style={styles.hero}>
          <Text style={styles.heroTitle}>Financial Insights</Text>
          <Text style={styles.heroAmount}>
            Ksh {thisMonthExpenses.toLocaleString()}
          </Text>
          <Text style={styles.heroSub}>Spent This Month</Text>
        </LinearGradient>

        {/* INCOME / EXPENSE SUMMARY */}
        <View style={styles.row}>
          <View style={styles.card}>
            <Ionicons name="arrow-down-circle" size={24} color="#DC2626" />
            <Text style={styles.cardLabel}>Expenses</Text>
            <Text style={styles.cardAmount}>
              Ksh {thisMonthExpenses.toLocaleString()}
            </Text>
          </View>

          <View style={styles.card}>
            <Ionicons name="arrow-up-circle" size={24} color="#16A34A" />
            <Text style={styles.cardLabel}>Income</Text>
            <Text style={styles.cardAmount}>
              Ksh {thisMonthIncome.toLocaleString()}
            </Text>
          </View>
        </View>

        {/* SAVINGS */}
        <View style={styles.largeCard}>
          <Ionicons name="wallet" size={24} color="#4F46E5" />
          <Text style={styles.largeLabel}>Net Savings</Text>
          <Text
            style={[
              styles.largeAmount,
              { color: savings >= 0 ? "#16A34A" : "#DC2626" },
            ]}
          >
            Ksh {savings.toLocaleString()}
          </Text>
          <Text style={styles.savingsRate}>{savingsRate}% savings rate</Text>
        </View>

        {/* MONTH COMPARISON */}
        <View style={styles.largeCard}>
          <Ionicons name="analytics" size={24} color="#6366F1" />
          <Text style={styles.largeLabel}>Last Month Spending</Text>
          <Text style={styles.largeAmount}>
            Ksh {lastMonthExpenses.toLocaleString()}
          </Text>
        </View>

        {/* INVESTMENTS */}
        <View style={styles.largeCard}>
          <Ionicons name="trending-up" size={24} color="#F59E0B" />
          <Text style={styles.largeLabel}>Total Invested</Text>
          <Text style={styles.largeAmount}>
            Ksh {totalInvested.toLocaleString()}
          </Text>
          <Text
            style={{
              color: investmentGrowth >= 0 ? "#16A34A" : "#DC2626",
              marginTop: 4,
            }}
          >
            Growth: Ksh {investmentGrowth.toLocaleString()}
          </Text>
        </View>

        {/* TOP CATEGORIES */}
        <View style={styles.largeCard}>
          <Ionicons name="pie-chart" size={24} color="#8B5CF6" />
          <Text style={styles.largeLabel}>Top Spending Categories</Text>

          {topCategories.length === 0 && (
            <Text style={{ color: "#888", marginTop: 8 }}>
              No expense data yet
            </Text>
          )}

          {topCategories.map((cat: any, index) => (
            <View key={index} style={styles.categoryRow}>
              <Text style={{ textTransform: "capitalize" }}>{cat[0]}</Text>
              <Text style={{ fontWeight: "600" }}>
                Ksh {cat[1].toLocaleString()}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  hero: {
    padding: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  heroTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },

  heroAmount: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "800",
    marginTop: 10,
  },

  heroSub: {
    color: "rgba(255,255,255,0.7)",
    marginTop: 4,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginTop: -25,
  },

  card: {
    backgroundColor: "#fff",
    width: "48%",
    padding: 18,
    borderRadius: 16,
    elevation: 3,
  },

  cardLabel: {
    marginTop: 8,
    color: "#666",
  },

  cardAmount: {
    fontWeight: "700",
    marginTop: 6,
  },

  largeCard: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 20,
    padding: 20,
    borderRadius: 18,
    elevation: 3,
  },

  largeLabel: {
    color: "#666",
    marginTop: 8,
  },

  largeAmount: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 6,
  },

  savingsRate: {
    marginTop: 6,
    color: "#888",
  },

  categoryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
});
