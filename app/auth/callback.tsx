import { router } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";

export default function AuthCallback() {
  useEffect(() => {
    console.log(" === AUTH CALLBACK MOUNTED === ");
    const timer = setTimeout(() => {
      console.log(" === AUTH CALLBACK REDIRECTING TO ACCOUNT === ");

      router.replace("/account");
    }, 3000);

    return () => {
      console.log(" === AUTH CALLBACK UNMOUNTED === ");
      clearTimeout(timer);
    };
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#0b0f14",
        padding: 24,
      }}
    >
      <ActivityIndicator
        size="large"
        color="#22C55E"
        style={{ marginBottom: 20 }}
      />

      <Text
        style={{
          color: "#22C55E",
          fontSize: 22,
          fontWeight: "700",
          margin: 12,
          textAlign: "center",
        }}
      >
        Email verified successfully
      </Text>

      <Text
        style={{
          color: "#A1A1AA",
          fontSize: 16,
          textAlign: "center",
          lineHeight: 24,
        }}
      >
        Your email address has been verified.
        {"\n"}
        {"\n"}
        You can now sign in to your life manager account.
      </Text>
    </View>
  );
}
