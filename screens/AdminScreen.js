import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';

const AdminScreen = ({ navigation }) => {
  const [nombre, setNombre] = useState('');
  const [url, setUrl] = useState('');
  const [precio, setPrecio] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [platos, setPlatos] = useState([]);
  const [view, setView] = useState('add');
  const [editing, setEditing] = useState(null);

  const agregarPlato = async () => {
    if (!nombre || !url || !precio || !descripcion) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }

    try {
      const db = getFirestore();
      await addDoc(collection(db, 'menu'), {
        nombre,
        url,
        precio: parseFloat(precio),
        descripcion,
      });

      Alert.alert('Éxito', 'Plato agregado correctamente');
      setNombre('');
      setUrl('');
      setPrecio('');
      setDescripcion('');
      loadPlatos();
    } catch (error) {
      Alert.alert('Error', 'No se pudo agregar el plato');
      console.error(error);
    }
  };

  const loadPlatos = async () => {
    const db = getFirestore();
    const querySnapshot = await getDocs(collection(db, 'menu'));
    const platosList = [];
    querySnapshot.forEach((doc) => {
      platosList.push({ id: doc.id, ...doc.data() });
    });
    setPlatos(platosList);
  };

  const eliminarPlato = async (id) => {
    try {
      const db = getFirestore();
      await deleteDoc(doc(db, 'menu', id));
      Alert.alert('Éxito', 'Plato eliminado correctamente');
      loadPlatos();
    } catch (error) {
      Alert.alert('Error', 'No se pudo eliminar el plato');
      console.error(error);
    }
  };

  const editarPlato = async () => {
    if (!nombre || !url || !precio || !descripcion) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }

    try {
      const db = getFirestore();
      const platoRef = doc(db, 'menu', editing.id);
      await updateDoc(platoRef, {
        nombre,
        url,
        precio: parseFloat(precio),
        descripcion,
      });

      Alert.alert('Éxito', 'Plato actualizado correctamente');
      setEditing(null);
      setNombre('');
      setUrl('');
      setPrecio('');
      setDescripcion('');
      loadPlatos();
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el plato');
      console.error(error);
    }
  };

  const iniciarEdicion = (plato) => {
    setEditing(plato);
    setNombre(plato.nombre);
    setUrl(plato.url);
    setPrecio(plato.precio.toString());
    setDescripcion(plato.descripcion);
    setView('edit');
  };

  useEffect(() => {
    loadPlatos();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Administra el Menú</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.viewButton} onPress={() => setView('view')}>
          <Text style={styles.buttonText}>Ver Menú</Text>
        </TouchableOpacity>
        {view === 'view' || view === 'delete' ? (
          <TouchableOpacity style={styles.addButton} onPress={() => setView('add')}>
            <Text style={styles.buttonText}>Agregar Plato</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {view === 'add' && (
        <View style={styles.formContainer}>
          <TextInput style={styles.input} placeholder="Nombre del plato" value={nombre} onChangeText={setNombre} />
          <TextInput style={styles.input} placeholder="URL de la imagen" value={url} onChangeText={setUrl} />
          <TextInput style={styles.input} placeholder="Precio" value={precio} keyboardType="numeric" onChangeText={setPrecio} />
          <TextInput style={styles.input} placeholder="Descripción" value={descripcion} onChangeText={setDescripcion} />
          <TouchableOpacity style={styles.submitButton} onPress={agregarPlato}>
            <Text style={styles.buttonText}>Agregar Plato</Text>
          </TouchableOpacity>
        </View>
      )}

      {view === 'view' && (
        <View style={styles.listContainer}>
          <FlatList
            data={platos}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.platoItem}>
                <Image source={{ uri: item.url }} style={styles.platoImage} />
                <View style={styles.platoInfo}>
                  <Text style={styles.platoText}>{item.nombre}</Text>
                  <Text>{item.descripcion}</Text>
                  <Text style={styles.platoPrice}>${item.precio}</Text>
                </View>
                <View style={styles.platoActions}>
                  <TouchableOpacity onPress={() => iniciarEdicion(item)} style={styles.iconButton}>
                    <Text style={styles.icon}>✏️</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => eliminarPlato(item.id)} style={styles.iconButton}>
                    <Text style={styles.icon}>❌</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </View>
      )}

      {view === 'edit' && (
        <View style={styles.formContainer}>
          <TextInput style={styles.input} placeholder="Nombre del plato" value={nombre} onChangeText={setNombre} />
          <TextInput style={styles.input} placeholder="URL de la imagen" value={url} onChangeText={setUrl} />
          <TextInput style={styles.input} placeholder="Precio" value={precio} keyboardType="numeric" onChangeText={setPrecio} />
          <TextInput style={styles.input} placeholder="Descripción" value={descripcion} onChangeText={setDescripcion} />
          <TouchableOpacity style={styles.submitButton} onPress={editarPlato}>
            <Text style={styles.buttonText}>Actualizar Plato</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 30,
    paddingHorizontal: 20,
    backgroundColor: '#f0f4f8',
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    width: '100%',
    padding: 14,
    marginBottom: 16,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e1e1e1',
    fontSize: 16,
  },
  formContainer: {
    width: '100%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    marginBottom: 30,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  viewButton: {
    backgroundColor: '#3b82f6',
    padding: 14,
    borderRadius: 10,
    width: '48%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#10B981',
    padding: 14,
    borderRadius: 10,
    width: '48%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  listContainer: {
    flex: 1,
    width: '100%',
    maxHeight: 400, // Limita la altura máxima para habilitar el desplazamiento
    marginBottom: 20,
  },
  platoItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  platoImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  platoInfo: {
    flex: 1,
  },
  platoText: {
    fontSize: 18,
    fontWeight: '600',
  },
  platoPrice: {
    fontSize: 16,
    fontWeight: '500',
    color: '#10B981',
    marginTop: 5,
  },
  platoActions: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconButton: {
    padding: 10,
  },
  icon: {
    fontSize: 20,
  },
});

export default AdminScreen;
