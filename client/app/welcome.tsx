import { Text, View, Image, StyleSheet } from "react-native";

export default function Welcome() {
  return (
    <View style={styles.outsideWrapper}>
      <View style={styles.bigPixelBox}>
        <Image 
          source={require("./assets/holygames.jpg")} 
          style={styles.logo} 
          resizeMode="contain"
        />
        
        <Text style={styles.title}>WELCOME TO HolyGames!</Text>
        
        <View style={styles.thickDivider} />
        
        <Text style={styles.description}>
          Thank you for choosing HolyGames! You will love the games that look like they were made in the 90s.
        </Text>
        
        <View style={styles.footer}>
          <Text style={styles.signature}>From Berdia the creator itself</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outsideWrapper: {
    alignSelf: "center",
    width: "95%",
    maxWidth: 420,
    marginVertical: 20,
  },
  bigPixelBox: {
    backgroundColor: "#2e2e2e",
    borderWidth: 5,
    borderColor: "#ffffff",
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 12,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: "#f6de5f",
  },
  title: {
    color: "#f6de5f",
    fontSize: 22,
    textAlign: "center",
    fontFamily: "Pixelify",
    lineHeight: 30,
  },
  thickDivider: {
    width: "100%",
    height: 6,
    backgroundColor: "#ffffff",
    marginVertical: 20,
  },
  description: {
    color: "#ffffff",
    fontSize: 14,
    textAlign: "center",
    fontFamily: "Pixelify",
    lineHeight: 24,
    marginBottom: 25,
  },
  footer: {
    width: "100%",
    alignItems: "flex-end",
  },
  signature: {
    color: "#888888",
    fontSize: 10,
    fontFamily: "Pixelify",
    textTransform: "uppercase",
  },
});