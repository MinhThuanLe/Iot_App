import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import Sensor from "./screens/Sensor";

export default function App() {
  return (
    <View style={styles.container}>
      

      <Sensor />

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#dcdbdc"
  },
});