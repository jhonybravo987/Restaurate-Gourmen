import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const db = getFirestore();

const SignupScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); 
  const [error, setError] = useState('');

  const handleSignup = async () => {
    try {

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);


      const userId = userCredential.user.uid;

      await setDoc(doc(db, 'usuarios', userId), {
        email: email,
        nombre: name,
        rol: 'cliente', 
        fecha_creacion: new Date(),
      });

      alert('Cuenta creada con éxito');
      navigation.replace('Welcome');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <ImageBackground 
      source={require('../assets/negrocielo.jpg')} 
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Registro</Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}

        {/* Campo para el nombre */}
        <TextInput
          placeholder="Nombre"
          placeholderTextColor="#black"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />

        {/* Campo para el email */}
        <TextInput
          placeholder="Email"
          placeholderTextColor="#black"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
        />

        {/* Campo para la contraseña */}
        <TextInput
          placeholder="Contraseña"
          placeholderTextColor="#black"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />

        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>Registrarse</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.loginButton]}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={[styles.buttonText, styles.loginText]}>Iniciar Sesión</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 20,
    borderRadius: 12,
    width: '90%',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#fff',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    color: '#495057',
  },
  button: {
    backgroundColor: '#ff6347',
    paddingVertical: 12,
    borderRadius: 25, 
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginButton: {
    backgroundColor: '#333',
  },
  loginText: {
    color: '#fff',
  },
  error: {
    color: '#ff0000',
    fontSize: 14,
    marginBottom: 12,
    textAlign: 'center',
  },
});

export default SignupScreen;
