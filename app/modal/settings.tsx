import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsModal() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.subtitle}>Settings</Text>

        <View style={styles.option}>
          <Text style={styles.optionText}>Profile</Text>
        </View>

        <View style={styles.option}>
          <Text style={styles.optionText}>Preferences</Text>
        </View>

        <View style={styles.option}>
          <Text style={styles.optionText}>About</Text>
        </View>

        <Pressable
          style={[styles.option, styles.closeBtn]}
          onPress={() => router.dismiss()}
        >
          <Text style={[styles.optionText, { color: "#007AFF" }]}>Close</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },

  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },

  option: {
    backgroundColor: "#f5f5f5",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },

  optionText: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    color: "#000",
  },

  closeBtn: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#007AFF",
  },
});
