import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BillsScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8FAFC" }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Bills</Text>
        <Text style={styles.subtitle}>
          Track and manage your monthly payments
        </Text>

        {/* SUMMARY CARD */}
        <LinearGradient
          colors={["#6366F1", "#4F46E5"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.summaryCard}
        >
          <View>
            <Text style={styles.summaryLabel}>Total Due This Month</Text>
            <Text style={styles.summaryAmount}>Ksh 8,750</Text>
          </View>
          <Ionicons name="wallet" size={36} color="#fff" />
        </LinearGradient>

        {/* DUE SOON */}
        <Text style={styles.sectionTitle}>Due Soon</Text>
        <View style={styles.card}>
          <BillItem
            icon="logo-netflix"
            iconLib="ion"
            name="Netflix"
            date="Due Tomorrow"
            status="urgent"
          />
        </View>

        {/* UPCOMING */}
        <Text style={styles.sectionTitle}>Upcoming</Text>
        <View style={styles.card}>
          <BillItem
            icon="wifi"
            iconLib="ion"
            name="Internet"
            date="Feb 28"
            status="normal"
          />
        </View>

        {/* PAID */}
        <Text style={styles.sectionTitle}>Paid</Text>
        <View style={styles.card}>
          <BillItem
            icon="flash"
            iconLib="material"
            name="Electricity"
            date="Paid"
            status="paid"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function BillItem({ icon, iconLib, name, date, status }) {
  const statusColor =
    status === "urgent" ? "#EF4444" : status === "paid" ? "#10B981" : "#6B7280";

  return (
    <View style={styles.billItem}>
      <View style={styles.left}>
        <View style={styles.iconWrapper}>
          {iconLib === "material" ? (
            <MaterialCommunityIcons name={icon} size={22} color="#4F46E5" />
          ) : (
            <Ionicons name={icon} size={22} color="#4F46E5" />
          )}
        </View>
        <View>
          <Text style={styles.billName}>{name}</Text>
          <Text style={[styles.billDate, { color: statusColor }]}>{date}</Text>
        </View>
      </View>

      {status === "urgent" && (
        <View style={[styles.badge, { backgroundColor: "#FEE2E2" }]}>
          <Text style={[styles.badgeText, { color: "#EF4444" }]}>Urgent</Text>
        </View>
      )}

      {status === "paid" && (
        <Ionicons name="checkmark-circle" size={22} color="#10B981" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },

  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 4,
    color: "#111827",
  },

  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 20,
  },

  summaryCard: {
    padding: 20,
    borderRadius: 18,
    marginBottom: 25,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  summaryLabel: {
    color: "#E0E7FF",
    fontSize: 13,
  },

  summaryAmount: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "700",
    marginTop: 4,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: "#374151",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 3,
  },

  billItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconWrapper: {
    backgroundColor: "#EEF2FF",
    padding: 10,
    borderRadius: 12,
    marginRight: 12,
  },

  billName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },

  billDate: {
    fontSize: 13,
    marginTop: 2,
  },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },

  badgeText: {
    fontSize: 11,
    fontWeight: "600",
  },
});
