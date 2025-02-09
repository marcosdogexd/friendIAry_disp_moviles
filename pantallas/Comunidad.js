import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList } from "react-native";
import { collection, addDoc, onSnapshot, updateDoc, doc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { FontAwesome } from "@expo/vector-icons";
import styles from "../styles/ComunidadEstilos";
import { RecyclerViewBackedScrollViewComponent } from "react-native";

export default function Comunidad() {
  const [comentario, setComentario] = useState("");
  const [comentarios, setComentarios] = useState([]);
  const usuarioActual = auth.currentUser?.uid;

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "comentarios"), (snapshot) => {
      setComentarios(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const publicarComentario = async () => {
    if (comentario.trim() === "") return;
    await addDoc(collection(db, "comentarios"), {
      texto: comentario,
      usuarioId: usuarioActual,
      likes: [],
      dislikes: [],
      timestamp: new Date()
    });
    setComentario("");
  };

  const manejarReaccion = async (id, tipo) => {
    const comentarioRef = doc(db, "comentarios", id);
    const comentarioSnap = await getDoc(comentarioRef);
    if (!comentarioSnap.exists()) return;
    const data = comentarioSnap.data();
    
    let likes = data.likes || [];
    let dislikes = data.dislikes || [];

    if (tipo === "like") {
      if (likes.includes(usuarioActual)) return;
      likes.push(usuarioActual);
      dislikes = dislikes.filter(uid => uid !== usuarioActual);
    } else {
      if (dislikes.includes(usuarioActual)) return;
      dislikes.push(usuarioActual);
      likes = likes.filter(uid => uid !== usuarioActual);
    }
    
    await updateDoc(comentarioRef, { likes, dislikes });
  };

  return (
    <View style={styles.container}>
      
      <FlatList
        data={comentarios}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.comentario}>
            <Text style={styles.textoComentario}>{item.texto}</Text>
            <Text style={styles.usuarioComentario}>Anónimo</Text>
            <View style={styles.reacciones}>
              <TouchableOpacity onPress={() => manejarReaccion(item.id, "like")}>
                <FontAwesome name="thumbs-up" size={20} color="green" />
                <Text>{item.likes.length}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => manejarReaccion(item.id, "dislike")}>
                <FontAwesome name="thumbs-down" size={20} color="red" />
                <Text>{item.dislikes.length}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        
      />
      <TextInput
        style={styles.input}
        placeholder="Escribe un comentario..."
        value={comentario}
        onChangeText={setComentario}
      />
      <TouchableOpacity style={styles.botonPublicar} onPress={publicarComentario}>
        <Text style={styles.textoBoton}>Publicar</Text>
      </TouchableOpacity>
    </View>
  );
}
