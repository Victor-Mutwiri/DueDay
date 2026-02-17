import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function StatsScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>Stats</Text>

        <View style={styles.card}>
          <Text style={styles.label}>This Month</Text>
          <Text style={styles.amount}>Ksh 18,450</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Last Month</Text>
          <Text style={styles.amount}>Ksh 16,200</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },

  title: { fontSize: 22, fontWeight: "600", marginBottom: 20 },

  card: {
    backgroundColor: "#f5f5f5",
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
  },

  label: { color: "#666" },
  amount: { fontSize: 20, fontWeight: "600", marginTop: 4 },
});
