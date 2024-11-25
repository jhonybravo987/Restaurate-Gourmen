import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';

const WelcomeScreen = () => {
  return (
    <ImageBackground
      source={require('../assets/fondo.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.welcomeText}>¡Bienvenido a Restaurante Gourmet!</Text>
        <Text style={styles.description}>
          En Restaurante Gourmet, te ofrecemos experiencias culinarias únicas con los sabores más exquisitos y un ambiente inigualable. Descubre la combinación perfecta entre tradición y modernidad.
        </Text>
      </View>
      <Text style={styles.sectionTitle}>Más de Nosotros</Text>
      <ScrollView
        horizontal={Dimensions.get('window').width < 768} // Scrolling horizontal para pantallas pequeñas
        contentContainerStyle={styles.cardContainer}
        showsHorizontalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Image source={require('../assets/pizza.jpg')} style={styles.cardImage} />
          <Text style={styles.cardTitle}>Chef Destacado</Text>
          <Text style={styles.cardDescription}>
            Conoce a nuestro chef, un maestro en fusionar los sabores tradicionales con técnicas modernas.
          </Text>
        </View>
        <View style={styles.card}>
          <Image source={require('../assets/tacos.jpg')} style={styles.cardImage} />
          <Text style={styles.cardTitle}>Platos Exclusivos</Text>
          <Text style={styles.cardDescription}>
            Descubre nuestras especialidades, preparadas con los ingredientes más frescos y de alta calidad.
          </Text>
        </View>
        <View style={styles.card}>
          <Image source={require('../assets/sushi.jpg')} style={styles.cardImage} />
          <Text style={styles.cardTitle}>Ambiente Único</Text>
          <Text style={styles.cardDescription}>
            Vive una experiencia inolvidable en nuestro restaurante, diseñado para tu comodidad y disfrute.
          </Text>
        </View>
      </ScrollView>
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
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 20,
    borderRadius: 15,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#ff6347',
    textAlign: 'center',
    marginBottom: 15,
  },
  description: {
    color: '#333',
    fontSize: 16,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 20,
    marginVertical: 15,
  },
  cardContainer: {
    flexDirection: Dimensions.get('window').width < 768 ? 'row' : 'row-wrap', // Apila tarjetas en web
    justifyContent: Dimensions.get('window').width >= 768 ? 'space-evenly' : 'flex-start',
    paddingHorizontal: 20,
    flexWrap: 'wrap',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginRight: Dimensions.get('window').width < 768 ? 15 : 0,
    marginBottom: 15,
    width: Dimensions.get('window').width < 768 ? 250 : '30%', // Responsivo para web y móvil
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 150,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff6347',
    marginVertical: 10,
    marginLeft: 10,
  },
  cardDescription: {
    fontSize: 14,
    color: '#555',
    marginHorizontal: 10,
    marginBottom: 10,
    textAlign: 'justify',
  },
});

export default WelcomeScreen;
