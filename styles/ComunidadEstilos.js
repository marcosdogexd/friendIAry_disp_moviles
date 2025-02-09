import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    padding: 10,
  },
  input: {
    backgroundColor: "#fff8dc",
    padding:10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#CCC",
    marginBottom: 10,
  },
  botonPublicar: {
    backgroundColor: "#FF8C42",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  textoBoton: {
    color: "#FFF",
    fontWeight: "bold",
  },
  comentario: {
    backgroundColor: "#FFF",
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    borderWidth: 5,
    borderColor: "#DDD",
  },
  textoComentario: {
    fontSize: 16,
    marginBottom: 5,
  },
  usuarioComentario: {
    fontSize: 12,
    color: "#777",
  },
  reacciones: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 5,
  },
});
