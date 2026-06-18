import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, SafeAreaView, Alert,
} from 'react-native';
import { getBarberos, crearReserva } from '../data/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const diasSemana = ['JUE', 'VIE', 'SAB', 'DOM', 'LL'];
const numeroDias = ['14', '15', '16', '17', '1'];
const horarios = ['09:00', '10:00', '11:30', '13:00', '15:00', '16:30', '18:00'];

export default function CitasScreen() {
  const [diaSeleccionado, setDiaSeleccionado] = useState(0);
  const [horaSeleccionada, setHoraSeleccionada] = useState('');
  const [barberoSeleccionado, setBarberoSeleccionado] = useState('');
  const [barberos, setBarberos] = useState<any[]>([]);
  const [clienteId, setClienteId] = useState<number>(0);

  useEffect(() => {
    getBarberos()
      .then(res => setBarberos(res.data.filter((b: any) => b.disponible)))
      .catch(() => console.log('Error cargando barberos'));

    AsyncStorage.getItem('token').then(token => {
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const id = parseInt(payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']);
          setClienteId(id);
        } catch (e) {
          console.log('Error decodificando token', e);
        }
      }
    });
  }, []);

  const handleReservar = async () => {
    if (!horaSeleccionada || !barberoSeleccionado) {
      Alert.alert('Completa la reserva', 'Selecciona un horario y un barbero.');
      return;
    }
    try {
      await crearReserva({
        clienteId: clienteId,
        barberoId: parseInt(barberoSeleccionado),
        fecha: new Date().toISOString(),
        hora: horaSeleccionada,
        estilo: 'Fade',
        estado: 'pendiente',
      });
      Alert.alert('¡Reserva confirmada! ✓', `Cita el ${numeroDias[diaSeleccionado]} de Mayo a las ${horaSeleccionada}`);
      setHoraSeleccionada('');
      setBarberoSeleccionado('');
    } catch (error: any) {
      console.log('Error:', error.response?.data || error.message);
      Alert.alert('Error', 'No se pudo guardar la reserva');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <Text style={styles.titulo}>Reservar Cita</Text>
        </View>

        <View style={styles.seccion}>
          <View style={styles.seccionHeader}>
            <Text style={styles.seccionTitulo}>📅  Fecha</Text>
            <Text style={styles.mes}>Mayo 2026</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.diasRow}>
              {diasSemana.map((dia, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[styles.diaBtn, diaSeleccionado === idx && styles.diaBtnActivo]}
                  onPress={() => setDiaSeleccionado(idx)}
                >
                  <Text style={[styles.diaNombre, diaSeleccionado === idx && styles.diaTextoActivo]}>
                    {dia}
                  </Text>
                  <Text style={[styles.diaNumero, diaSeleccionado === idx && styles.diaTextoActivo]}>
                    {numeroDias[idx]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        <View style={styles.seccion}>
          <Text style={styles.seccionTitulo}>🕐  Horario</Text>
          <View style={styles.horariosGrid}>
            {horarios.map((hora) => (
              <TouchableOpacity
                key={hora}
                style={[styles.horaBtn, horaSeleccionada === hora && styles.horaBtnActivo]}
                onPress={() => setHoraSeleccionada(hora)}
              >
                <Text style={[styles.horaText, horaSeleccionada === hora && styles.horaTextActivo]}>
                  {hora}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.seccion}>
          <Text style={styles.seccionTitulo}>Barberos Disponibles</Text>
          {barberos.map((barbero) => (
            <TouchableOpacity
              key={barbero.id}
              style={[
                styles.barberoCard,
                barberoSeleccionado === String(barbero.id) && styles.barberoCardActivo,
              ]}
              onPress={() => setBarberoSeleccionado(String(barbero.id))}
            >
              <View style={styles.barberoImg} />
              <View style={styles.barberoInfo}>
                <View style={styles.ratingBadge}>
                  <Text style={styles.ratingText}>⭐ {barbero.rating}</Text>
                </View>
                <Text style={styles.barberoNombre}>{barbero.nombre}</Text>
                <Text style={styles.barberoEsp}>{barbero.especialidad}</Text>
                <Text style={styles.barberoUbic}>📍 {barbero.ubicacion}</Text>
              </View>
              <Text style={styles.barberoPrecio}>${barbero.precio}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.reservarBtn} onPress={handleReservar}>
          <Text style={styles.reservarText}>Confirmar Reserva</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D0D' },
  header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 8 },
  titulo: { color: '#fff', fontSize: 22, fontWeight: '800' },
  seccion: {
    backgroundColor: '#1A1A1A', marginHorizontal: 16,
    marginBottom: 16, borderRadius: 16, padding: 16,
  },
  seccionHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  seccionTitulo: { color: '#fff', fontSize: 16, fontWeight: '700', marginBottom: 12 },
  mes: { color: '#888', fontSize: 14 },
  diasRow: { flexDirection: 'row', gap: 8 },
  diaBtn: {
    alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16,
    borderRadius: 12, backgroundColor: '#2A2A2A', minWidth: 56,
  },
  diaBtnActivo: { backgroundColor: '#F5A623' },
  diaNombre: { color: '#888', fontSize: 11, fontWeight: '600', marginBottom: 4 },
  diaNumero: { color: '#fff', fontSize: 18, fontWeight: '800' },
  diaTextoActivo: { color: '#000' },
  horariosGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  horaBtn: {
    paddingVertical: 10, paddingHorizontal: 16,
    borderRadius: 10, backgroundColor: '#2A2A2A',
    borderWidth: 1, borderColor: '#333',
  },
  horaBtnActivo: { backgroundColor: '#F5A623', borderColor: '#F5A623' },
  horaText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  horaTextActivo: { color: '#000' },
  barberoCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#2A2A2A', borderRadius: 14,
    padding: 12, marginBottom: 10, borderWidth: 1, borderColor: '#333',
  },
  barberoCardActivo: { borderColor: '#F5A623', backgroundColor: '#2A2010' },
  barberoImg: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#555' },
  barberoInfo: { flex: 1, marginLeft: 12 },
  ratingBadge: {
    backgroundColor: '#F5A62320', alignSelf: 'flex-start',
    paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, marginBottom: 4,
  },
  ratingText: { color: '#F5A623', fontSize: 11, fontWeight: '700' },
  barberoNombre: { color: '#fff', fontSize: 14, fontWeight: '700' },
  barberoEsp: { color: '#888', fontSize: 12, marginTop: 2 },
  barberoUbic: { color: '#666', fontSize: 11, marginTop: 2 },
  barberoPrecio: { color: '#F5A623', fontSize: 18, fontWeight: '800' },
  reservarBtn: {
    backgroundColor: '#F5A623', marginHorizontal: 16,
    marginBottom: 24, borderRadius: 16, paddingVertical: 18, alignItems: 'center',
  },
  reservarText: { color: '#000', fontSize: 16, fontWeight: '800' },
});