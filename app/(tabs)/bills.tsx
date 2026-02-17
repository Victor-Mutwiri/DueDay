import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BillsScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.title}>Bills</Text>

        {/* DUE SOON */}
        <Text style={styles.sectionTitle}>Due Soon</Text>
        <View style={styles.billItem}>
          <Text>Netflix</Text>
          <Text>Due Tomorrow</Text>
        </View>

        {/* UPCOMING */}
        <Text style={styles.sectionTitle}>Upcoming</Text>
        <View style={styles.billItem}>
          <Text>Internet</Text>
          <Text>Feb 28</Text>
        </View>

        {/* PAID */}
        <Text style={styles.sectionTitle}>Paid</Text>
        <View style={styles.billItem}>
          <Text>Electricity</Text>
          <Text>Paid</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },

  title: { fontSize: 22, fontWeight: "600", marginBottom: 10 },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 10,
  },

  billItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderColor: "#ddd",
  },
});
