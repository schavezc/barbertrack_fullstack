import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, SafeAreaView, Alert, TextInput, ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { crearResena } from '../data/api';

export default function DejarResenaScreen({ route, navigation }: any) {
  const { reserva } = route.params;
  const [calificacion, setCalificacion] = useState(0);
  const [comentario, setComentario] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEnviar = async () => {
    if (calificacion === 0) {
      Alert.alert('Error', 'Selecciona una calificación');
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return;
      const payload = JSON.parse(atob(token.split('.')[1]));
      const clienteId = parseInt(payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']);

      await crearResena({
        reservaId: reserva.id,
        clienteId,
        barberoId: reserva.barberoId,
        calificacion,
        comentario,
      });

      Alert.alert('¡Gracias! ⭐', 'Tu reseña fue enviada correctamente', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data || 'No se pudo enviar la reseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backBtn}>{'<'} Volver</Text>
          </TouchableOpacity>
          <Text style={styles.titulo}>Dejar Reseña</Text>
          <View style={{ width: 60 }} />
        </View>

        {/* Info de la cita */}
        <View style={styles.citaCard}>
          <Text style={styles.citaTitulo}>✂ {reserva.estilo}</Text>
          <Text style={styles.citaInfo}>con {reserva.barbero?.nombre || 'Barbero'}</Text>
          <Text style={styles.citaInfo}>📅 {new Date(reserva.fecha).toLocaleDateString('es-PE')} — 🕐 {reserva.hora}</Text>
        </View>

        {/* Calificación */}
        <View style={styles.seccion}>
          <Text style={styles.seccionTitulo}>¿Cómo fue tu experiencia?</Text>
          <View style={styles.estrellasRow}>
            {[1, 2, 3, 4, 5].map(i => (
              <TouchableOpacity key={i} onPress={() => setCalificacion(i)}>
                <Text style={[styles.estrella, i <= calificacion && styles.estrellaActiva]}>
                  ⭐
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.calificacionLabel}>
            {calificacion === 0 ? 'Toca para calificar' :
              calificacion === 1 ? 'Muy malo' :
              calificacion === 2 ? 'Malo' :
              calificacion === 3 ? 'Regular' :
              calificacion === 4 ? 'Bueno' : 'Excelente'}
          </Text>
        </View>

        {/* Comentario */}
        <View style={styles.seccion}>
          <Text style={styles.seccionTitulo}>Comentario (opcional)</Text>
          <TextInput
            style={styles.comentarioInput}
            placeholder="Cuéntanos tu experiencia..."
            placeholderTextColor="#666"
            value={comentario}
            onChangeText={setComentario}
            multiline
            numberOfLines={4}
          />
        </View>

        <TouchableOpacity
          style={styles.enviarBtn}
          onPress={handleEnviar}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color="#000" />
            : <Text style={styles.enviarText}>Enviar reseña</Text>
          }
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D0D' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 8,
  },
  backBtn: { color: '#888', fontSize: 14 },
  titulo: { color: '#fff', fontSize: 18, fontWeight: '800' },
  citaCard: {
    backgroundColor: '#1A1A1A', marginHorizontal: 16, marginVertical: 12,
    borderRadius: 14, padding: 16, borderWidth: 1, borderColor: '#F5A62340',
  },
  citaTitulo: { color: '#fff', fontSize: 16, fontWeight: '700', marginBottom: 6 },
  citaInfo: { color: '#888', fontSize: 13, marginBottom: 4 },
  seccion: {
    backgroundColor: '#1A1A1A', marginHorizontal: 16,
    marginBottom: 16, borderRadius: 16, padding: 16,
  },
  seccionTitulo: { color: '#fff', fontSize: 15, fontWeight: '700', marginBottom: 16 },
  estrellasRow: { flexDirection: 'row', gap: 12, justifyContent: 'center', marginBottom: 12 },
  estrella: { fontSize: 36, opacity: 0.3 },
  estrellaActiva: { opacity: 1 },
  calificacionLabel: { color: '#F5A623', textAlign: 'center', fontSize: 14, fontWeight: '600' },
  comentarioInput: {
    backgroundColor: '#2A2A2A', borderRadius: 10, padding: 14,
    color: '#fff', fontSize: 15, borderWidth: 1, borderColor: '#333',
    textAlignVertical: 'top', minHeight: 100,
  },
  enviarBtn: {
    backgroundColor: '#F5A623', marginHorizontal: 16,
    borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginBottom: 32,
  },
  enviarText: { color: '#000', fontSize: 16, fontWeight: '800' },
});