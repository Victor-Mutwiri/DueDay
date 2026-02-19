import { getEntriesFromStorage } from "@/utilis/storage";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  const router = useRouter();
  const [entries, setEntries] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, []),
  );

  const loadData = async () => {
    const data = await getEntriesFromStorage();
    setEntries(data || []);
  };

  const today = new Date();

  const expenses = entries.filter((e) => e.type === "expense");
  const income = entries.filter((e) => e.type === "income");
  const bills = entries.filter((e) => e.type === "bill");
  const investments = entries.filter((e) => e.type === "investment");

  const monthExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const monthIncome = income.reduce((sum, e) => sum + e.amount, 0);

  const balance = monthIncome - monthExpenses;

  const upcomingBills = bills
    .filter((bill) => new Date(bill.dueDate) >= today)
    .sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
    );

  const recentEntries = [...entries]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* BALANCE */}
        <View style={styles.hero}>
          <Text style={styles.heroLabel}>Current Balance</Text>
          <Text style={styles.heroAmount}>Ksh {balance.toLocaleString()}</Text>
        </View>

        {/* MONTH SUMMARY */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>This Month</Text>

          <View style={styles.summaryCard}>
            <Text>Income: Ksh {monthIncome.toLocaleString()}</Text>
            <Text>Expenses: Ksh {monthExpenses.toLocaleString()}</Text>
          </View>
        </View>

        {/* UPCOMING BILLS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Bills</Text>

          {upcomingBills.length === 0 && (
            <Text style={styles.empty}>No upcoming bills</Text>
          )}

          {upcomingBills.map((bill) => {
            const due = new Date(bill.dueDate);
            const daysLeft = Math.ceil(
              (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
            );

            return (
              <View key={bill.id} style={styles.itemCard}>
                <View>
                  <Text style={styles.itemTitle}>{bill.name}</Text>
                  <Text style={styles.itemSub}>Due in {daysLeft} days</Text>
                </View>
                <Text style={styles.amount}>
                  Ksh {bill.amount.toLocaleString()}
                </Text>
              </View>
            );
          })}
        </View>

        {/* INVESTMENTS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Investments</Text>

          {investments.length === 0 && (
            <Text style={styles.empty}>No investments yet</Text>
          )}

          {investments.map((inv) => {
            const displayValue = inv.currentValue || inv.amount || 0;
            return (
              <View key={inv.id} style={styles.itemCard}>
                <View>
                  <Text style={styles.itemTitle}>{inv.name}</Text>
                  <Text style={styles.itemSub}>{inv.description}</Text>
                </View>
                <Text style={styles.amount}>
                  Ksh {displayValue.toLocaleString()}
                </Text>
              </View>
            );
          })}
        </View>

        {/* RECENT ACTIVITY */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>

          {recentEntries.map((entry) => (
            <View key={entry.id} style={styles.itemCard}>
              <Text style={styles.itemTitle}>
                {entry.description || entry.name}
              </Text>
              <Text
                style={[
                  styles.amount,
                  {
                    color: entry.type === "expense" ? "#DC2626" : "#16A34A",
                  },
                ]}
              >
                {entry.type === "expense" ? "-" : "+"}Ksh{" "}
                {entry.amount?.toLocaleString()}
              </Text>
            </View>
          ))}
        </View>

        <View style={{ height: 60 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  hero: {
    padding: 24,
    backgroundColor: "#111827",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  heroLabel: {
    color: "#9CA3AF",
  },
  heroAmount: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "800",
    marginTop: 8,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 14,
  },
  summaryCard: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 18,
  },
  itemCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  itemTitle: {
    fontWeight: "600",
  },
  itemSub: {
    color: "#64748B",
    fontSize: 12,
    marginTop: 4,
  },
  amount: {
    fontWeight: "700",
  },
  empty: {
    color: "#94A3B8",
  },
});
