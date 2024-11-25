import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { auth, db } from './firebaseConfig';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import WelcomeScreen from "./screens/WelcomeScreen";
import MenuScreen from "./screens/MenuScreen";
import ReservationsScreen from "./screens/ReservationsScreen";
import OrdersScreen from "./screens/OrdersScreen";
import PromotionsScreen from "./screens/PromotionsScreen";

import ContactUsScreen from "./screens/ContactUsScreen";
import AdminScreen from "./screens/AdminScreen";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const DrawerNavigator = ({ onLogout }) => {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Welcome" component={WelcomeScreen} />
      <Drawer.Screen name="Menu" component={MenuScreen} />
      <Drawer.Screen name="Reservas" component={ReservationsScreen} />
      <Drawer.Screen name="Pedidos" component={OrdersScreen} />
      <Drawer.Screen name="Promociones" component={PromotionsScreen} />
      <Drawer.Screen name="Contáctanos" component={ContactUsScreen} />
      <Drawer.Screen 
        name="Cerrar Sesión" 
        component={() => (
          <TouchableOpacity onPress={onLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        )}
      />
    </Drawer.Navigator>
  );
};

const App = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      try {
        if (user) {
          // Verificar el rol del usuario en Firestore
          const userDoc = await getDoc(doc(db, 'usuarios', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setRole(userData.rol); // Ahora coincide con los valores 'admin' o 'cliente' de Firestore
            console.log('Rol del usuario:', userData.rol); // Para debugging
          }
        } else {
          setRole(null);
        }
        setUser(user);
      } catch (error) {
        console.error('Error al obtener el rol del usuario:', error);
      } finally {
        if (initializing) setInitializing(false);
      }
    });

    return unsubscribe;
  }, [initializing]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setRole(null);
      console.log("Sesión cerrada con éxito");
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  if (initializing) return null; // Evita mostrar la app antes de que se determine si el usuario está autenticado.

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          role === 'admin' ? (
            <Stack.Screen 
              name="Admin" 
              component={AdminScreen}
              options={{
                headerLeft: null,
                headerRight: () => (
                  <TouchableOpacity 
                    onPress={handleLogout}
                    style={{ marginRight: 10 }}
                  >
                    <Text>Cerrar Sesión</Text>
                  </TouchableOpacity>
                ),
              }}
            />
          ) : (
            <Stack.Screen 
              name="Main" 
              options={{ headerShown: false }}
            >
              {() => <DrawerNavigator onLogout={handleLogout} />}
            </Stack.Screen>
          )
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  logoutButton: {
    padding: 16,
    backgroundColor: '#ff6347',
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default App;
