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

  // 📌 Estilo para cada ítem de la lista de notas
  noteItem: {
    flexDirection: "row",
    backgroundColor: "#F6F6F6",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "space-between",
  },
  noteContentContainer: {
    flex: 1, // Para evitar que empuje la imagen
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
    alignSelf: "center", // Evita que la imagen se mueva
  },
  modeText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
    fontStyle: "italic",
  },

  // 📌 Estilos para el Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "85%",
    maxHeight: "75%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
  },
  modalDate: {
    fontSize: 14,
    color: "#777",
    textAlign: "center",
    marginBottom: 10,
  },
  modalContentContainer: {
    maxHeight: 250,
  },
  modalScrollView: {
    paddingHorizontal: 5,
  },
  modalContent: {
    fontSize: 16,
    color: "#333",
    textAlign: "justify",
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: "#FF8C42",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },

  analysisButton: {
    alignSelf: "center", // Centra el botón en la pantalla
    borderWidth: 2, // Contorno del botón
    borderColor: "#FF6347", // Color tomate
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 15, // Espacio arriba y abajo
  },
  
  analysisButtonText: {
    color: "#000", // Texto negro
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  stateContainer: {
    backgroundColor: "#FFDDC1", // Fondo color durazno suave
    padding: 15,
    borderRadius: 10,
    marginVertical: 20,
    borderWidth: 2,
    borderColor: "#FF6347", // Borde rojo tomate
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  
  stateTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#D84315", // Naranja oscuro
    textAlign: "center",
    marginBottom: 5,
  },
  
  stateText: {
    fontSize: 16,
    color: "#5D4037", // Marrón oscuro
    textAlign: "center",
    fontStyle: "italic",
  },
  
  
});