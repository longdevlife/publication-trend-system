import { ScrollView, Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-6">
        <Text className="text-3xl font-bold text-foreground">
          Publication Trend
        </Text>
        <Text className="mt-2 text-muted-foreground">
          Your pocket companion for academic discovery.
        </Text>

        <View className="mt-8 gap-4">
          <Card title="Search papers" desc="Keyword + semantic search across millions of papers." />
          <Card title="Follow topics" desc="Get notified when new papers match your interests." />
          <Card title="AI reports" desc="View grounded analytical reports on the go." />
        </View>
      </View>
    </ScrollView>
  );
}

function Card({ title, desc }: { title: string; desc: string }) {
  return (
    <View className="rounded-lg border border-border bg-white p-4">
      <Text className="text-base font-semibold text-foreground">{title}</Text>
      <Text className="mt-1 text-sm text-muted-foreground">{desc}</Text>
    </View>
  );
}
