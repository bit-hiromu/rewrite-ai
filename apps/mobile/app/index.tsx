import { View, Text, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";

// トップ画面（Week 1: 動作確認用プレースホルダー）
// Week 2 でリライトUIに差し替える
export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>RewriteAI</Text>
      <Text style={styles.subtitle}>AIを活用した文章リライト・翻訳ツール</Text>
      <StatusBar style="auto" />
    </View>
  );
}

// StyleSheet.create: React Native のスタイル定義
// CSSに似ているが、カバレッジや型安全のため StyleSheet.create を使う
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f9fafb",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    color: "#6b7280",
  },
});
