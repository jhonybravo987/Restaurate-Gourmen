import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ImageBackground, 
  ActivityIndicator, 
  Animated 
} from 'react-native';
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0)); // Animación de opacidad

  const showMessage = (message, type = 'welcome') => {
    if (type === 'error') setError(message);
    if (type === 'welcome') setWelcomeMessage(message);

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start(() => {
          if (type === 'error') setError('');
          if (type === 'welcome') setWelcomeMessage('');
        });
      }, 3000);
    });
  };

  const handleLogin = async () => {
    if (!email || !password) {
      showMessage('Por favor, ingresa tu correo y contraseña.', 'error');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const db = getFirestore();
      const userDoc = await getDoc(doc(db, 'usuarios', user.uid));

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const rol = userData.rol;

        const welcomeText = rol === 'admin' ? 'Bienvenido Administrador' : 'Bienvenido Cliente';
        showMessage(welcomeText, 'welcome');
        setTimeout(() => navigation.replace('Main'), 3000); // Navegar después de mostrar el mensaje
      } else {
        showMessage('No se encontró información del usuario.', 'error');
      }
    } catch (err) {
      showMessage(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    alert('Funcionalidad de recuperación de contraseña aún no implementada.');
  };

  return (
    <ImageBackground 
      source={require('../assets/ondas.jpg')} 
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Inicio de Sesión</Text>

        {/* Mensaje de error flotante */}
        {error ? (
          <Animated.View style={[styles.messageContainer, styles.errorContainer, { opacity: fadeAnim }]}>
            <Text style={styles.messageText}>{error}</Text>
          </Animated.View>
        ) : null}

        {/* Mensaje de bienvenida flotante */}
        {welcomeMessage ? (
          <Animated.View style={[styles.messageContainer, styles.welcomeContainer, { opacity: fadeAnim }]}>
            <Text style={styles.messageText}>{welcomeMessage}</Text>
          </Animated.View>
        ) : null}

        <TextInput
          placeholder="Email"
          placeholderTextColor="#000"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
        />
        <TextInput
          placeholder="Contraseña"
          placeholderTextColor="#000"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Iniciar Sesión</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.signupButton]}
          onPress={() => navigation.navigate('Signup')}
        >
          <Text style={[styles.buttonText, styles.signupText]}>Registrarse</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={styles.forgotPassword}>¿Olvidaste tu contraseña?</Text>
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
    backgroundColor: 'rgba(255, 255, 255, 0.85)', // Fondo claro con transparencia
    padding: 20,
    borderRadius: 15,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#333',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    backgroundColor: '#f7f7f7', // Fondo claro
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    fontSize: 16,
    color: '#495057',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    backgroundColor: '#4CAF50', // Color verde moderno
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1.2,
  },
  signupButton: {
    backgroundColor: '#007BFF', // Azul suave
    marginTop: 15,
  },
  signupText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  forgotPassword: {
    color: '#555',
    marginTop: 15,
    textDecorationLine: 'underline',
    fontSize: 14,
  },
  messageContainer: {
    position: 'absolute',
    top: 20,
    padding: 12,
    borderRadius: 10,
    width: '90%',
    alignSelf: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 69, 58, 0.9)', // Rojo suave
  },
  welcomeContainer: {
    backgroundColor: 'rgba(50, 205, 50, 0.9)', // Verde suave
  },
  messageText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
});


export default LoginScreen;
