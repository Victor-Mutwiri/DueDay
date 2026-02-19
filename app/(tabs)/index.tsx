import { IconSymbol } from "@/components/ui/icon-symbol";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const router = useRouter();
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

  const today = new Date();

  const isThisMonth = (date: string) => {
    const d = new Date(date);
    return (
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    );
  };

  const expenses = entries.filter((e) => e.type === "expense");
  const income = entries.filter((e) => e.type === "income");
  const bills = entries.filter((e) => e.type === "bill");

  const monthExpenses = expenses
    .filter((e) => isThisMonth(e.date))
    .reduce((sum, e) => sum + e.amount, 0);

  const monthIncome = income
    .filter((e) => isThisMonth(e.date))
    .reduce((sum, e) => sum + e.amount, 0);

  const balance = monthIncome - monthExpenses;

  const upcomingBills = bills.filter((b) => b.status === "upcoming");

  const recentActivity = [...entries]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F4F6FA" }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HERO HEADER */}
        <LinearGradient colors={["#4F46E5", "#6366F1"]} style={styles.hero}>
          <View style={styles.heroTop}>
            <Text style={styles.appName}>MyMoney</Text>
            <Pressable onPress={() => router.push("/modal/settings")}>
              <IconSymbol name="gearshape.fill" size={22} color="#fff" />
            </Pressable>
          </View>

          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balance}>Ksh {balance.toLocaleString()}</Text>
        </LinearGradient>

        {/* KPI CARDS */}
        <View style={styles.kpiRow}>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>Income</Text>
            <Text style={[styles.kpiAmount, { color: "#16A34A" }]}>
              + Ksh {monthIncome.toLocaleString()}
            </Text>
          </View>

          <View style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>Expenses</Text>
            <Text style={[styles.kpiAmount, { color: "#DC2626" }]}>
              - Ksh {monthExpenses.toLocaleString()}
            </Text>
          </View>
        </View>

        {/* UPCOMING BILLS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Bills</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {upcomingBills.length === 0 && (
              <Text style={{ color: "#888" }}>No upcoming bills</Text>
            )}

            {upcomingBills.map((bill) => (
              <View key={bill.id} style={styles.billCard}>
                <Text style={styles.billName}>{bill.name}</Text>
                <Text style={styles.billAmount}>Ksh {bill.amount}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* RECENT ACTIVITY */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>

          {recentActivity.map((item) => {
            const isExpense = item.type === "expense";
            const isIncome = item.type === "income";

            return (
              <View key={item.id} style={styles.activityItem}>
                <View>
                  <Text style={styles.activityTitle}>
                    {item.description ||
                      item.name ||
                      item.source ||
                      item.category}
                  </Text>
                  <Text style={styles.activityType}>
                    {item.type.toUpperCase()}
                  </Text>
                </View>

                <Text
                  style={[
                    styles.activityAmount,
                    {
                      color: isExpense
                        ? "#DC2626"
                        : isIncome
                          ? "#16A34A"
                          : "#111",
                    },
                  ]}
                >
                  {isExpense && "- "}
                  {isIncome && "+ "}
                  Ksh {(item.amount ?? item.investedAmount)?.toLocaleString()}
                </Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  hero: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  heroTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  appName: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },

  balanceLabel: {
    color: "rgba(255,255,255,0.8)",
    marginTop: 30,
  },

  balance: {
    fontSize: 34,
    fontWeight: "800",
    color: "#fff",
    marginTop: 6,
  },

  kpiRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginTop: -25,
  },

  kpiCard: {
    backgroundColor: "#fff",
    width: "48%",
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },

  kpiLabel: {
    color: "#777",
    fontSize: 13,
  },

  kpiAmount: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 6,
  },

  section: {
    paddingHorizontal: 16,
    marginTop: 25,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },

  billCard: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 16,
    marginRight: 12,
    width: 170,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  billName: {
    fontWeight: "600",
    fontSize: 15,
  },

  billAmount: {
    marginTop: 6,
    fontWeight: "700",
  },

  activityItem: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  activityTitle: {
    fontWeight: "600",
    fontSize: 15,
  },

  activityType: {
    fontSize: 11,
    color: "#888",
    marginTop: 4,
  },

  activityAmount: {
    fontWeight: "700",
    fontSize: 15,
  },
});
