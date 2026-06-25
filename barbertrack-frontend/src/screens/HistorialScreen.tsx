import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, SafeAreaView, Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getReservasPorCliente, cancelarReserva } from '../data/api';

export default function HistorialScreen({ navigation }: any) {
  const [reservas, setReservas] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarReservas();
  }, []);

  const cargarReservas = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const clienteId = parseInt(payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']);
        const res = await getReservasPorCliente(clienteId);
        setReservas(res.data);
      }
    } catch (e) {
      console.log('Error cargando historial', e);
    } finally {
      setCargando(false);
    }
  };

  const handleCancelar = (reservaId: number) => {
    Alert.alert('Cancelar reserva', '¿Estás seguro?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Sí, cancelar', style: 'destructive',
        onPress: async () => {
          try {
            await cancelarReserva(reservaId);
            cargarReservas();
          } catch (e) {
            Alert.alert('Error', 'No se pudo cancelar');
          }
        }
      }
    ]);
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'pendiente': return { bg: '#F5A62320', text: '#F5A623' };
      case 'confirmada': return { bg: '#3B82F620', text: '#3B82F6' };
      case 'completada': return { bg: '#4ADE8020', text: '#4ADE80' };
      case 'cancelada': return { bg: '#EF444420', text: '#EF4444' };
      case 'reseñada': return { bg: '#A855F720', text: '#A855F7' };
      default: return { bg: '#88888820', text: '#888' };
    }
  };

  if (cargando) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.noData}>Cargando...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <Text style={styles.titulo}>🕐  Mi Historial</Text>
        </View>

        {reservas.length === 0 ? (
          <Text style={styles.noData}>No tienes reservas aún</Text>
        ) : (
          reservas.map((item) => {
            const estadoStyle = getEstadoColor(item.estado);
            return (
              <View key={item.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.fecha}>
                    {new Date(item.fecha).toLocaleDateString('es-PE')}
                  </Text>
                  <View style={[styles.estadoBadge, { backgroundColor: estadoStyle.bg }]}>
                    <Text style={[styles.estadoText, { color: estadoStyle.text }]}>
                      {item.estado}
                    </Text>
                  </View>
                </View>

                <View style={styles.cardBody}>
                  <View style={styles.imgPlaceholder} />
                  <View style={styles.info}>
                    <Text style={styles.estilo}>{item.estilo}</Text>
                    <Text style={styles.hora}>🕐 {item.hora}</Text>
                    <Text style={styles.barbero}>
                      ✂ {item.barbero?.nombre || 'Barbero no asignado'}
                    </Text>
                    <Text style={styles.ubicacion}>
                      📍 {item.barbero?.ubicacion || ''}
                    </Text>
                  </View>
                </View>

                <View style={styles.cardFooter}>
                  {item.estado === 'pendiente' && (
                    <TouchableOpacity
                      style={styles.cancelarBtn}
                      onPress={() => handleCancelar(item.id)}
                    >
                      <Text style={styles.cancelarText}>✕ Cancelar</Text>
                    </TouchableOpacity>
                  )}
                  {item.estado === 'completada' && (
                    <TouchableOpacity
                      style={styles.resenaBtn}
                      onPress={() => navigation.navigate('DejarResena', { reserva: item })}
                    >
                      <Text style={styles.resenaBtnText}>⭐ Dejar reseña</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={styles.repetirBtn}
                    onPress={() => navigation.navigate('Citas')}
                  >
                    <Text style={styles.repetirBtnText}>🔄 Repetir</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D0D' },
  header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 8 },
  titulo: { color: '#fff', fontSize: 22, fontWeight: '800' },
  noData: { color: '#888', textAlign: 'center', marginTop: 40, fontSize: 15 },
  card: {
    backgroundColor: '#1A1A1A', marginHorizontal: 16,
    marginBottom: 16, borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: '#2A2A2A',
  },
  cardHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 14,
  },
  fecha: { color: '#888', fontSize: 13 },
  estadoBadge: {
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8,
  },
  estadoText: { fontSize: 12, fontWeight: '700' },
  cardBody: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  imgPlaceholder: { width: 56, height: 56, borderRadius: 12, backgroundColor: '#333' },
  info: { flex: 1, marginLeft: 12 },
  estilo: { color: '#fff', fontSize: 16, fontWeight: '700' },
  hora: { color: '#F5A623', fontSize: 13, marginTop: 4 },
  barbero: { color: '#fff', fontSize: 13, marginTop: 4 },
  ubicacion: { color: '#888', fontSize: 12, marginTop: 2 },
  cardFooter: { flexDirection: 'row', gap: 10 },
  cancelarBtn: {
    flex: 1, paddingVertical: 12, borderRadius: 12,
    backgroundColor: '#EF444420', borderWidth: 1,
    borderColor: '#EF4444', alignItems: 'center',
  },
  cancelarText: { color: '#EF4444', fontSize: 14, fontWeight: '700' },
  resenaBtn: {
    flex: 1, paddingVertical: 12, borderRadius: 12,
    backgroundColor: '#F5A62320', borderWidth: 1,
    borderColor: '#F5A623', alignItems: 'center',
  },
  resenaBtnText: { color: '#F5A623', fontSize: 14, fontWeight: '700' },
  repetirBtn: {
    flex: 1, paddingVertical: 12, borderRadius: 12,
    backgroundColor: '#1A1A1A', borderWidth: 1,
    borderColor: '#444', alignItems: 'center',
  },
  repetirBtnText: { color: '#fff', fontSize: 14, fontWeight: '600' },
});