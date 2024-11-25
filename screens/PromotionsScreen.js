import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  Image, 
  ActivityIndicator 
} from "react-native";

const PromotionsScreen = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Datos de ejemplo simulando promociones
  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        // Simulación de una API con datos
        const data = [
          {
            id: 1,
            title: "2x1 en Pizzas",
            description: "Disfruta de 2 pizzas por el precio de 1 este fin de semana.",
            image: "https://images.pexels.com/photos/825661/pexels-photo-825661.jpeg",
            expiryDate: "2024-11-30",
          },
          {
            id: 2,
            title: "Descuento en Hamburguesas",
            description: "20% de descuento en todas nuestras hamburguesas.",
            image: "https://images.pexels.com/photos/1639564/pexels-photo-1639564.jpeg",
            expiryDate: "2024-12-15",
          },
          {
            id: 3,
            title: "Bebidas Gratis",
            description: "Una bebida gratis al comprar un combo familiar.",
            image: "https://images.pexels.com/photos/628776/pexels-photo-628776.jpeg",
            expiryDate: "2024-12-01",
          },
        ];
        setPromotions(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  const renderPromotionItem = ({ item }) => (
    <View style={styles.promotionCard}>
      <Image source={{ uri: item.image }} style={styles.promotionImage} />
      <View style={styles.promotionContent}>
        <Text style={styles.promotionTitle}>{item.title}</Text>
        <Text style={styles.promotionDescription}>{item.description}</Text>
        <Text style={styles.promotionExpiry}>Expira: {item.expiryDate}</Text>
      </View>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Promociones</Text>
      <FlatList
        data={promotions}
        renderItem={renderPromotionItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.promotionList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f8f8f8",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  promotionList: {
    paddingBottom: 20,
  },
  promotionCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 20,
    overflow: "hidden",
    elevation: 5, // Sombra para Android
    shadowColor: "#000", // Sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  promotionImage: {
    width: "100%",
    height: 150,
  },
  promotionContent: {
    padding: 15,
  },
  promotionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  promotionDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  promotionExpiry: {
    fontSize: 12,
    color: "#999",
    textAlign: "right",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default PromotionsScreen;
