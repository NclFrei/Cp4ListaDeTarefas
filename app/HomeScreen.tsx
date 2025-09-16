import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { db, auth } from '../src/firebase';
import { collection, addDoc, onSnapshot, query, where, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const [tarefa, setTarefa] = useState('');
  const [listaTarefas, setListaTarefas] = useState([]);
  const router = useRouter();
  const usuario = auth.currentUser;

  // Buscar tarefas em tempo real para o usuário logado
  useEffect(() => {
    if (!usuario) return;
    const q = query(collection(db, 'tarefas'), where('uid', '==', usuario.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tarefas = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setListaTarefas(tarefas);
    });

    return () => unsubscribe();
  }, [usuario]);

  // Adicionar tarefa
  const adicionarTarefa = async () => {
    if (!tarefa.trim()) return;
    try {
      await addDoc(collection(db, 'tarefas'), {
        uid: usuario.uid,
        nome: tarefa,
        concluida: false,
      });
      setTarefa('');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível adicionar a tarefa.');
    }
  };

  // Marcar tarefa como concluída
  const toggleTarefa = async (id, concluida) => {
    const docRef = doc(db, 'tarefas', id);
    await updateDoc(docRef, { concluida: !concluida });
  };

  // Deletar tarefa
  const deletarTarefa = async (id) => {
    const docRef = doc(db, 'tarefas', id);
    await deleteDoc(docRef);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Minhas Tarefas</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Digite sua tarefa"
          value={tarefa}
          onChangeText={setTarefa}
        />
        <Button title="Adicionar" onPress={adicionarTarefa} />
      </View>

      <FlatList
        data={listaTarefas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <TouchableOpacity onPress={() => toggleTarefa(item.id, item.concluida)}>
              <Text style={[styles.textoItem, item.concluida && { textDecorationLine: 'line-through' }]}>
                {item.nome}
              </Text>
            </TouchableOpacity>
            <Button title="Excluir" color="red" onPress={() => deletarTarefa(item.id)} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  titulo: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  inputContainer: { flexDirection: 'row', marginBottom: 20 },
  input: { flex: 1, borderWidth: 1, borderColor: '#333', borderRadius: 8, paddingHorizontal: 10 },
  item: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 },
  textoItem: { fontSize: 16 },
});
