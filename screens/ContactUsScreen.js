import React from 'react';
import { View, Text, StyleSheet, Linking, Image, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // Para los íconos

const ContactUsScreen = () => {

  const handleWhatsAppRedirect = () => {
    const phoneNumber = '+59176195915'; // Número real de teléfono
    const message = '¡Hola! Me gustaría hacer una consulta.'; // Mensaje opcional
    const url = `https://wa.me/${phoneNumber.replace('+59176195915', '')}?text=${encodeURIComponent(message)}`;
  
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'No se pudo abrir WhatsApp. Asegúrate de que esté instalado.');
    });
  };
  
  // Ejemplo de uso con un botón
  const App = () => (
    <Button title="Contactar por WhatsApp" onPress={handleWhatsAppRedirect} />
  );

  const handleFacebookRedirect = () => {
    const facebookUrl = 'https://facebook.com/tuPagina'; // Cambiar a la URL real de tu Facebook
    Linking.openURL(facebookUrl).catch(() => {
      alert('No se pudo abrir Facebook');
    });
  };

  const handleInstagramRedirect = () => {
    const instagramUrl = 'https://instagram.com/tuUsuario'; // Cambiar a la URL real de tu Instagram
    Linking.openURL(instagramUrl).catch(() => {
      alert('No se pudo abrir Instagram');
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contáctanos</Text>

      {/* Tarjeta de información con imagen y texto */}
      <View style={styles.card}>
        <Image 
          source={{uri: 'https://example.com/your-image.jpg'}} // Cambiar a la URL de la imagen real
          style={styles.image}
        />
        <Text style={styles.cardTitle}>Visítanos</Text>
        <Text style={styles.cardText}>Dirección: Av. Gral. Juan José Torres 123, Tarija, Bolivia.</Text>  {/* Dirección del restaurante */}
      </View>

      {/* Botones de redes sociales */}
      <View style={styles.socialContainer}>
        <TouchableOpacity onPress={handleWhatsAppRedirect} style={[styles.socialButton, { backgroundColor: '#25D366' }]}>
          <FontAwesome name="whatsapp" size={30} color="#fff" />
          <Text style={styles.socialText}>WhatsApp</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={handleFacebookRedirect} style={[styles.socialButton, { backgroundColor: '#3b5998' }]}>
          <FontAwesome name="facebook" size={30} color="#fff" />
          <Text style={styles.socialText}>Facebook</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={handleInstagramRedirect} style={[styles.socialButton, { backgroundColor: '#e4405f' }]}>
          <FontAwesome name="instagram" size={30} color="#fff" />
          <Text style={styles.socialText}>Instagram</Text>
        </TouchableOpacity>
      </View>

      {/* Agregar más secciones si lo deseas */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>También puedes llamarnos al: +123 456 7890</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    alignItems: 'center',
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 12,
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 30,
  },
  socialButton: {
    alignItems: 'center',
    padding: 15,
    borderRadius: 50,
    width: 100,
    marginHorizontal: 10,
  },
  socialText: {
    color: '#fff',
    fontSize: 14,
    marginTop: 8,
  },
  footer: {
    marginTop: 40,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
});

export default ContactUsScreen;
