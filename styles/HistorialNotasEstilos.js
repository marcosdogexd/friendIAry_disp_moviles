import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    padding: 20,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 60,
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
    marginBottom: 10,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  changeModeButton: {
    backgroundColor: "#FF8C42",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginLeft: 8,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  separator: {
    height: 2,
    backgroundColor: "#FF8C42",
    marginVertical: 10,
  },
  noteItem: {
    flexDirection: "row",
    backgroundColor: "#F6F6F6",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "space-between",
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  noteDescription: {
    fontSize: 14,
    color: "#888",
  },
  noteIcon: {
    width: 40,
    height: 40,
  },
  modeText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
    fontStyle: "italic",
  },
});