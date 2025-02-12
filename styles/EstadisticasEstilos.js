import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#FFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    backgroundColor: "#FF8C42",
    borderRadius: 5,
  },
  backText: {
    fontSize: 16,
    color: "#FFF",
    marginRight: 5,
  },
  summary: {
    fontSize: 16,
    marginTop: 10,
    textAlign: "center",
  },
  noDataText: {
    fontSize: 14,
    textAlign: "center",
    color: "#888",
  },
});