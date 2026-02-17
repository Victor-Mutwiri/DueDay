import { IconSymbol } from "@/components/ui/icon-symbol";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.title}>MyMoney</Text>
          <Pressable onPress={() => router.push("/modal/settings")}>
            <IconSymbol name="gearshape.fill" size={22} color="#555" />
          </Pressable>
        </View>

        {/* UPCOMING BILLS */}
        <Text style={styles.sectionTitle}>Upcoming Bills</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.billCard}>
            <Text style={styles.billName}>Netflix</Text>
            <Text style={styles.billDue}>Due Tomorrow</Text>
          </View>

          <View style={styles.billCard}>
            <Text style={styles.billName}>Rent</Text>
            <Text style={styles.billDue}>Due in 5 days</Text>
          </View>
        </ScrollView>

        {/* MONTHLY SUMMARY */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>This Month</Text>
          <Text style={styles.summaryAmount}>Ksh 18,450 spent</Text>
        </View>

        {/* TODAY EXPENSES */}
        <Text style={styles.sectionTitle}>Today</Text>
        <View style={styles.listItem}>
          <Text>Lunch</Text>
          <Text>Ksh 300</Text>
        </View>
        <View style={styles.listItem}>
          <Text>Fuel</Text>
          <Text>Ksh 2,000</Text>
        </View>

        <Text style={styles.todayTotal}>Today Total: Ksh 2,300</Text>

        {/* RECENT ACTIVITY */}
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.listItem}>
          <Text>Netflix paid</Text>
          <Text>Ksh 1,200</Text>
        </View>
        <View style={styles.listItem}>
          <Text>Uber</Text>
          <Text>Ksh 450</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  title: { fontSize: 22, fontWeight: "600" },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 10,
  },

  billCard: {
    backgroundColor: "#eee",
    padding: 16,
    borderRadius: 12,
    marginRight: 12,
    width: 150,
  },

  billName: { fontWeight: "600" },
  billDue: { marginTop: 4, color: "#666" },

  summaryCard: {
    backgroundColor: "#f5f5f5",
    padding: 20,
    borderRadius: 12,
    marginTop: 10,
  },

  summaryTitle: { color: "#666" },
  summaryAmount: { fontSize: 20, fontWeight: "600", marginTop: 4 },

  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderColor: "#ddd",
  },

  todayTotal: {
    marginTop: 10,
    fontWeight: "600",
    textAlign: "right",
  },
});
