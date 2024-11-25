import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, Alert, Modal, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import QRCode from "react-native-qrcode-svg";

const OrdersScreen = ({ route, navigation }) => {
  const { cart: initialCart, setCart: updateCart } = route.params;

  const [cart, setCart] = useState(initialCart);
  const [totalPrice, setTotalPrice] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [showQRCode, setShowQRCode] = useState(false);
  const [qrValue, setQrValue] = useState(null);
  const [showCardForm, setShowCardForm] = useState(false);
  const [cardDetails, setCardDetails] = useState({ name: "", cardNumber: "", expiration: "", cvv: "" });

  useEffect(() => {
    const calculateTotalPrice = () => {
      const total = cart.reduce((sum, item) => sum + item.precio * item.quantity, 0);
      setTotalPrice(total);
    };
    calculateTotalPrice();

    updateCart(cart);
  }, [cart]);

  useEffect(() => {
    setCart(initialCart);
  }, [initialCart]);

  const removeItemFromCart = (productId) => {
    const updatedCart = cart
      .map((item) => {
        if (item.id === productId) {
          if (item.quantity > 1) {
            return { ...item, quantity: item.quantity - 1 };
          }
          return null;
        }
        return item;
      })
      .filter((item) => item !== null);
    setCart(updatedCart);
  };

  const handlePaymentMethod = (method) => {
    setPaymentMethod(method);
    if (method === "qr") {
      const uniqueQRValue = `Compra-${new Date().getTime()}-${Math.random()}`;
      setQrValue(uniqueQRValue);
      setShowQRCode(true);
    } else if (method === "card") {
      setShowCardForm(true); // Mostrar el formulario de pago con tarjeta
    }
  };

  const confirmCardPayment = () => {
    Alert.alert("Pago confirmado", "El pago se realizó con éxito.");
    setCart([]); // Vaciar el carrito
    setShowCardForm(false); // Cerrar el formulario
  };

  const cancelCardPayment = () => {
    setShowCardForm(false); // Cerrar el formulario sin modificar el carrito
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItemContainer}>
      {item.url && <Image source={{ uri: item.url }} style={styles.cartItemImage} />}
      <View style={styles.cartItemInfo}>
        <Text style={styles.cartItemName}>{item.nombre}</Text>
        <Text style={styles.cartItemPrice}>Bs {item.precio}</Text>
        <Text style={styles.cartItemQuantity}>Cantidad: {item.quantity}</Text>
      </View>

      <TouchableOpacity onPress={() => removeItemFromCart(item.id)} style={styles.removeButton}>
        <Ionicons name="trash-bin" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("Menu")}>
          <Ionicons name="arrow-back-circle" size={30} color="#000" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={cart}
        renderItem={renderCartItem}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        contentContainerStyle={styles.cartList}
      />

      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total: Bs {totalPrice.toFixed(2)}</Text>
      </View>

      <View style={styles.paymentContainer}>
        <Text style={styles.paymentText}>Selecciona el método de pago:</Text>
        <View style={styles.paymentButtons}>
          <TouchableOpacity
            style={[styles.paymentButton, styles.qrButton]}
            onPress={() => handlePaymentMethod("qr")}
          >
            <Ionicons name="qr-code" size={30} color="#fff" />
            <Text style={styles.paymentButtonText}>Pago por QR</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.paymentButton, styles.cardButton]}
            onPress={() => handlePaymentMethod("card")}
          >
            <Ionicons name="card" size={30} color="#fff" />
            <Text style={styles.paymentButtonText}>Pago por Tarjeta</Text>
          </TouchableOpacity>
        </View>
      </View>

      {showQRCode && qrValue && (
        <Modal transparent={true} animationType="slide" visible={showQRCode}>
          <View style={styles.qrModal}>
            <QRCode value={qrValue} size={200} logoBackgroundColor="transparent" />
            <Text style={styles.qrText}>Escanea el QR para realizar el pago</Text>
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowQRCode(false)}>
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )}

      {showCardForm && (
        <Modal transparent={true} animationType="slide" visible={showCardForm}>
          <View style={styles.cardModal}>
            <Text style={styles.modalTitle}>Formulario de Pago</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre en la tarjeta"
              value={cardDetails.name}
              onChangeText={(text) => setCardDetails({ ...cardDetails, name: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Número de tarjeta"
              keyboardType="numeric"
              value={cardDetails.cardNumber}
              onChangeText={(text) => setCardDetails({ ...cardDetails, cardNumber: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Fecha de expiración (MM/AA)"
              value={cardDetails.expiration}
              onChangeText={(text) => setCardDetails({ ...cardDetails, expiration: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="CVV"
              keyboardType="numeric"
              value={cardDetails.cvv}
              onChangeText={(text) => setCardDetails({ ...cardDetails, cvv: text })}
            />
            <View style={styles.formButtons}>
              <TouchableOpacity style={styles.confirmButton} onPress={confirmCardPayment}>
                <Text style={styles.confirmButtonText}>Confirmar Pago</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={cancelCardPayment}>
                <Text style={styles.cancelButtonText}>Cancelar Pago</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  backButton: {
    marginRight: 15,
  },
  cartItemContainer: {
    flexDirection: "row",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#f9f9f9",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cartItemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
  },
  cartItemInfo: {
    flex: 1,
  },
  cartItemName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  cartItemPrice: {
    fontSize: 16,
    fontWeight: "bold",
  },
  cartItemQuantity: {
    fontSize: 14,
    marginTop: 5,
  },
  removeButton: {
    padding: 10,
  },
  paymentContainer: {
    marginTop: 20,
  },
  paymentText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  paymentButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  paymentButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  qrButton: {
    backgroundColor: "#4caf50",
  },
  cardButton: {
    backgroundColor: "#007bff",
  },
  paymentButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  qrModal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  qrText: {
    marginTop: 20,
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#ff4444",
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cardModal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 10,
  },
  formButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    width: "100%",
  },
  confirmButton: {
    flex: 1,
    backgroundColor: "#4caf50",
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: "center",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#ff4444",
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});


export default OrdersScreen;
