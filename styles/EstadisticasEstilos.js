import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#FFF",
    padding: 20,
    alignItems: "center",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginBottom: 10,
    marginTop: 50,
  },
  backText: {
    fontSize: 18,
    marginLeft: 5,
    fontWeight: "bold",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  summaryContainer: {
    backgroundColor: "#FFEBE7",
    padding: 15,
    borderRadius: 10,
    width: "95%",
    alignItems: "center",
    marginBottom: 20,
  },
  summaryText: {
    fontSize: 16,
    textAlign: "center",
    color: "#333",
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 15,
    marginBottom: 10,
  },
  analysisContainer: {
    marginTop: 20,
    width: "100%",
  },
  analysisBox: {
    backgroundColor: "#F8F8F8",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
    width: "95%",
    alignSelf: "center",
  },
  analysisTitle: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
  },
  analysisText: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
  },
});