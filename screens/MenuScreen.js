import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { getFirestore, collection, onSnapshot } from 'firebase/firestore';

const MenuScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  // Cargar productos del Firestore
  useEffect(() => {
    const db = getFirestore();
    const menuRef = collection(db, 'menu');

    const unsubscribe = onSnapshot(menuRef, (snapshot) => {
      const productsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productsList);
    });

    return () => unsubscribe();
  }, []);

  // Agregar producto al carrito
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingProductIndex = prevCart.findIndex(item => item.id === product.id);

      if (existingProductIndex >= 0) {
        const newCart = [...prevCart];
        newCart[existingProductIndex].quantity += 1;
        return newCart;
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  // Calcular la cantidad total de productos en el carrito
  const totalItemsInCart = cart.reduce((total, item) => total + item.quantity, 0);

  // Navegar a la pantalla de pedidos (carrito)
  const handleNavigateToCart = () => {
    navigation.navigate('Pedidos', { cart, setCart }); // Pasar cart y setCart a la pantalla de pedidos
  };

  // Renderizar cada producto
  const renderItem = ({ item }) => (
    <View style={styles.productContainer}>
      <Image source={{ uri: item.url }} style={styles.productImage} />
      <Text style={styles.productName}>{item.nombre}</Text>
      <Text style={styles.productDescription}>{item.descripcion}</Text>
      <Text style={styles.productPrice}>Bs {item.precio}</Text>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => addToCart(item)}
      >
        <Text style={styles.addButtonText}>Agregar al carrito</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Botón de carrito con el número de productos */}
      <TouchableOpacity
        style={styles.cartButton}
        onPress={handleNavigateToCart}
      >
        <Text style={styles.cartButtonText}>🛒</Text>
        {totalItemsInCart > 0 && (
          <View style={styles.cartCount}>
            <Text style={styles.cartCountText}>{totalItemsInCart}</Text>
          </View>
        )}
      </TouchableOpacity>

      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  cartButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: '#4caf50',
    borderRadius: 30,
    padding: 10,
    zIndex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartButtonText: {
    fontSize: 24,
    color: '#fff',
  },
  cartCount: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#ff6347',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartCountText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  list: {
    paddingBottom: 20,
  },
  productContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#f9f9f9',
  },
  productImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  productDescription: {
    fontSize: 14,
    color: '#555',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
  addButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#4caf50',
    borderRadius: 5,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default MenuScreen;