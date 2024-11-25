import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity 
} from 'react-native';
import { Snackbar } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const ReservationsScreen = () => {
  const [name, setName] = useState('');
  const [day, setDay] = useState('01');
  const [month, setMonth] = useState('01');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [hour, setHour] = useState('00');
  const [minute, setMinute] = useState('00');
  const [people, setPeople] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarColor, setSnackbarColor] = useState('');

  const generateArray = (start, end) => {
    return Array.from({ length: end - start + 1 }, (_, i) => (start + i).toString().padStart(2, '0'));
  };

  const days = generateArray(1, 31);
  const months = generateArray(1, 12);
  const years = generateArray(new Date().getFullYear(), new Date().getFullYear() + 5);
  const hours = generateArray(0, 23);
  const minutes = generateArray(0, 59);

  const validateFields = () => {
    if (!name || !people || !day || !month || !year || !hour || !minute) {
      setSnackbarMessage('Por favor, completa todos los campos.');
      setSnackbarColor('red');
      setSnackbarVisible(true);
      return false;
    }
    if (isNaN(people) || people <= 0) {
      setSnackbarMessage('La cantidad de personas debe ser un número positivo.');
      setSnackbarColor('red');
      setSnackbarVisible(true);
      return false;
    }
    return true;
  };

  const handleReservation = async () => {
    if (!validateFields()) return;

    const formattedDate = `${day}/${month}/${year}`;
    const formattedTime = `${hour}:${minute}`;
    
    try {
      await addDoc(collection(db, 'reservations'), {
        name,
        date: formattedDate,
        time: formattedTime,
        people: parseInt(people, 10),
      });
      setSnackbarMessage('¡Reserva guardada con éxito!');
      setSnackbarColor('green');
      setSnackbarVisible(true);
      setName('');
      setDay('01');
      setMonth('01');
      setYear(new Date().getFullYear().toString());
      setHour('00');
      setMinute('00');
      setPeople('');
    } catch (error) {
      setSnackbarMessage('Error al guardar la reserva. Inténtalo de nuevo.');
      setSnackbarColor('red');
      setSnackbarVisible(true);
      console.error('Error al guardar la reserva:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Reservaciones</Text>

        {/* Campo Nombre */}
        <Text style={styles.label}>Nombre:</Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre"
          value={name}
          onChangeText={setName}
        />

        {/* Campo Fecha */}
        <Text style={styles.label}>Fecha:</Text>
        <View>
          <View style={styles.titlesContainer}>
            <Text style={styles.pickerTitle}>Día</Text>
            <Text style={styles.pickerTitle}>Mes</Text>
            <Text style={styles.pickerTitle}>Año</Text>
          </View>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={day}
              onValueChange={(value) => setDay(value)}
              style={styles.picker}
            >
              {days.map((d) => (
                <Picker.Item key={d} label={d} value={d} />
              ))}
            </Picker>
            <Picker
              selectedValue={month}
              onValueChange={(value) => setMonth(value)}
              style={styles.picker}
            >
              {months.map((m) => (
                <Picker.Item key={m} label={m} value={m} />
              ))}
            </Picker>
            <Picker
              selectedValue={year}
              onValueChange={(value) => setYear(value)}
              style={styles.picker}
            >
              {years.map((y) => (
                <Picker.Item key={y} label={y} value={y} />
              ))}
            </Picker>
          </View>
        </View>

        {/* Campo Hora */}
        <Text style={styles.label}>Hora:</Text>
        <View>
          <View style={styles.titlesContainer}>
            <Text style={styles.pickerTitle}>Hora</Text>
            <Text style={styles.pickerTitle}>Minuto</Text>
          </View>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={hour}
              onValueChange={(value) => setHour(value)}
              style={styles.picker}
            >
              {hours.map((h) => (
                <Picker.Item key={h} label={h} value={h} />
              ))}
            </Picker>
            <Picker
              selectedValue={minute}
              onValueChange={(value) => setMinute(value)}
              style={styles.picker}
            >
              {minutes.map((min) => (
                <Picker.Item key={min} label={min} value={min} />
              ))}
            </Picker>
          </View>
        </View>

        {/* Campo Cantidad de Personas */}
        <Text style={styles.label}>Cantidad de Personas:</Text>
        <TextInput
          style={styles.input}
          placeholder="Cantidad de Personas"
          value={people}
          keyboardType="numeric"
          onChangeText={setPeople}
        />

        {/* Botón Reservar */}
        <TouchableOpacity style={styles.button} onPress={handleReservation}>
          <Text style={styles.buttonText}>Reservar</Text>
        </TouchableOpacity>
      </View>

      {/* Snackbar */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={{ backgroundColor: snackbarColor }}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    width: '80%',
    maxWidth: 400,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  picker: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#007BFF',
    borderRadius: 5,
    paddingVertical: 10,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  titlesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  pickerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
  },
});

export default ReservationsScreen;