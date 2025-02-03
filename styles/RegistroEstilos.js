import { StyleSheet } from "react-native";

export default StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 30,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Oscurece el fondo
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#FFF",
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    color: "#FFF",
    marginBottom: 12,
  },
  button: {
    width: "100%",
    paddingVertical: 15,
    borderRadius: 8,
    backgroundColor: "#FF8C42",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  linkText: {
    marginTop: 15,
    color: "#FFF",
    fontSize: 14,
  },
});