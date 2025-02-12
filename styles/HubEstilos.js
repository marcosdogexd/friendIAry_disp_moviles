import { StyleSheet } from "react-native";

export default StyleSheet.create({
    
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#F9F9F9",
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 20,
    },
    statusText: {
      fontSize: 16,
      color: "#666",
      marginTop: 10,
    },
    timerText: {
      fontSize: 16,
      color: "red",
      fontWeight: "bold",
      marginTop: 10,
    },
    moodContainer: {
      backgroundColor: "#EAEAEA",
      borderRadius: 15,
      padding: 20,
      alignItems: "center",
      width: "90%",
      marginBottom: 20,
    },
    moodText: {
      fontSize: 16,
      marginBottom: 10,
      fontWeight: "500",
    },
    moodIcons: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
    },
    moodIcon: {
      width: 50,
      height: 50,
    },
    selectedMood: {
      borderWidth: 2,
      borderColor: "#FF8C42",
      borderRadius: 10,
    },
    tabBar: {
      backgroundColor: "#FFE5D9",
      paddingBottom: 5,
      height: 60,
    },
  });