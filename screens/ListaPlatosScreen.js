import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Alert, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { getFirestore, collection, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';

const ListaPlatosScreen = () => {
  const [platos, setPlatos] = useState([]);
  const [platoSeleccionado, setPlatoSeleccionado] = useState(null);
  const [nombre, setNombre] = useState('');
  const [url, setUrl] = useState('');
  const [precio, setPrecio] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const db = getFirestore();

  const cargarPlatos = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'menu'));
      const lista = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPlatos(lista);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los platos');
      console.error(error);
    }
  };

  const seleccionarPlato = (plato) => {
    setPlatoSeleccionado(plato);
    setNombre(plato.nombre);
    setUrl(plato.url);
    setPrecio(plato.precio.toString());
    setDescripcion(plato.descripcion);
  };

  const cancelarEdicion = () => {
    setPlatoSeleccionado(null);
    setNombre('');
    setUrl('');
    setPrecio('');
    setDescripcion('');
  };

  const guardarCambios = async () => {
    if (!nombre || !url || !precio || !descripcion) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }

    try {
      const platoRef = doc(db, 'menu', platoSeleccionado.id);
      await updateDoc(platoRef, {
        nombre,
        url,
        precio: parseFloat(precio),
        descripcion,
      });

      Alert.alert('Éxito', 'Plato actualizado correctamente');
      cargarPlatos();
      cancelarEdicion();
    } catch (error) {
      Alert.alert('Error', 'No se pudieron guardar los cambios');
      console.error(error);
    }
  };

  const eliminarPlato = async (id) => {
    try {
      await deleteDoc(doc(db, 'menu', id));
      Alert.alert('Éxito', 'Plato eliminado correctamente');
      cargarPlatos();
    } catch (error) {
      Alert.alert('Error', 'No se pudo eliminar el plato');
      console.error(error);
    }
  };

  useEffect(() => {
    cargarPlatos();
  }, []);

  return (
    <View style={styles.container}>
      {platoSeleccionado ? (
        <View style={styles.formContainer}>
          <Text style={styles.title}>Editar Plato</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre del plato"
            value={nombre}
            onChangeText={setNombre}
          />
          <TextInput
            style={styles.input}
            placeholder="URL de la imagen"
            value={url}
            onChangeText={setUrl}
          />
          <TextInput
            style={styles.input}
            placeholder="Precio"
            value={precio}
            keyboardType="numeric"
            onChangeText={setPrecio}
          />
          <TextInput
            style={styles.input}
            placeholder="Descripción"
            value={descripcion}
            onChangeText={setDescripcion}
          />
          <Button title="Guardar Cambios" onPress={guardarCambios} />
          <Button title="Cancelar" onPress={cancelarEdicion} color="red" />
        </View>
      ) : (
        <FlatList
          data={platos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Text style={styles.itemText}>{item.nombre}</Text>
              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  style={styles.buttonEdit}
                  onPress={() => seleccionarPlato(item)}
                >
                  <Text style={styles.buttonText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.buttonDelete}
                  onPress={() => eliminarPlato(item.id)}
                >
                  <Text style={styles.buttonText}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  formContainer: {
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    elevation: 3,
  },
  itemText: {
    fontSize: 16,
  },
  buttonsContainer: {
    flexDirection: 'row',
  },
  buttonEdit: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  buttonDelete: {
    backgroundColor: '#F44336',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ListaPlatosScreen;
