import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getReservasPorBarbero, cambiarEstadoReserva } from '../../data/api';

export default function BarberoHomeScreen({ navigation }: any) {
  const [reservas, setReservas] = useState<any[]>([]);
  const [nombre, setNombre] = useState('');
  const [barberoId, setBarberoId] = useState<number>(0);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    const token = await AsyncStorage.getItem('token');
    const nombreGuardado = await AsyncStorage.getItem('nombre');
    if (nombreGuardado) setNombre(nombreGuardado);

    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const id = parseInt(payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']);
      setBarberoId(id);
      const res = await getReservasPorBarbero(id);
      setReservas(res.data);
    }
  };

  const handleCambiarEstado = async (reservaId: number, nuevoEstado: string) => {
    try {
      await cambiarEstadoReserva(reservaId, nuevoEstado);
      cargarDatos();
    } catch (error) {
      console.log('Error cambiando estado', error);
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'pendiente': return '#F5A623';
      case 'confirmada': return '#3B82F6';
      case 'completada': return '#4ADE80';
      case 'cancelada': return '#EF4444';
      case 'reseñada': return '#A855F7';
      default: return '#888';
    }
  };

  const reservasPendientes = reservas.filter(r => r.estado === 'pendiente');
  const reservasConfirmadas = reservas.filter(r => r.estado === 'confirmada');
  const reservasHoy = reservas.filter(r => {
    const hoy = new Date().toDateString();
    return new Date(r.fecha).toDateString() === hoy;
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.saludo}>Hola, {nombre} ✂</Text>
            <Text style={styles.subtitulo}>Panel de Barbero</Text>
          </View>
          <TouchableOpacity
            style={styles.perfilBtn}
            onPress={() => navigation.navigate('PerfilBarbero')}
          >
            <Text style={{ fontSize: 18 }}>👤</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>{reservasPendientes.length}</Text>
            <Text style={styles.statLabel}>Pendientes</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>{reservasConfirmadas.length}</Text>
            <Text style={styles.statLabel}>Confirmadas</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>{reservasHoy.length}</Text>
            <Text style={styles.statLabel}>Hoy</Text>
          </View>
        </View>

        {/* Citas pendientes */}
        {reservasPendientes.length > 0 && (
          <View style={styles.seccion}>
            <Text style={styles.seccionTitulo}>⏳ Citas Pendientes</Text>
            {reservasPendientes.map(reserva => (
              <View key={reserva.id} style={styles.citaCard}>
                <View style={styles.citaHeader}>
                  <Text style={styles.citaCliente}>
                    {reserva.cliente?.nombre || 'Cliente'}
                  </Text>
                  <View style={[styles.estadoBadge, { backgroundColor: getEstadoColor(reserva.estado) + '30' }]}>
                    <Text style={[styles.estadoText, { color: getEstadoColor(reserva.estado) }]}>
                      {reserva.estado}
                    </Text>
                  </View>
                </View>
                <Text style={styles.citaInfo}>✂ {reserva.estilo}</Text>
                <Text style={styles.citaInfo}>🕐 {reserva.hora}</Text>
                <Text style={styles.citaInfo}>📅 {new Date(reserva.fecha).toLocaleDateString('es-PE')}</Text>
                <View style={styles.citaBotones}>
                  <TouchableOpacity
                    style={styles.confirmarBtn}
                    onPress={() => handleCambiarEstado(reserva.id, 'confirmada')}
                  >
                    <Text style={styles.confirmarText}>✓ Confirmar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.rechazarBtn}
                    onPress={() => handleCambiarEstado(reserva.id, 'cancelada')}
                  >
                    <Text style={styles.rechazarText}>✕ Rechazar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Citas confirmadas */}
        {reservasConfirmadas.length > 0 && (
          <View style={styles.seccion}>
            <Text style={styles.seccionTitulo}>✅ Citas Confirmadas</Text>
            {reservasConfirmadas.map(reserva => (
              <View key={reserva.id} style={styles.citaCard}>
                <View style={styles.citaHeader}>
                  <Text style={styles.citaCliente}>
                    {reserva.cliente?.nombre || 'Cliente'}
                  </Text>
                  <View style={[styles.estadoBadge, { backgroundColor: getEstadoColor(reserva.estado) + '30' }]}>
                    <Text style={[styles.estadoText, { color: getEstadoColor(reserva.estado) }]}>
                      {reserva.estado}
                    </Text>
                  </View>
                </View>
                <Text style={styles.citaInfo}>✂ {reserva.estilo}</Text>
                <Text style={styles.citaInfo}>🕐 {reserva.hora}</Text>
                <Text style={styles.citaInfo}>📅 {new Date(reserva.fecha).toLocaleDateString('es-PE')}</Text>
                <TouchableOpacity
                  style={styles.completarBtn}
                  onPress={() => handleCambiarEstado(reserva.id, 'completada')}
                >
                  <Text style={styles.completarText}>✓ Marcar como completada</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {reservas.length === 0 && (
          <View style={styles.vacio}>
            <Text style={styles.vacioText}>No tienes citas aún</Text>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D0D' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16,
  },
  saludo: { color: '#fff', fontSize: 20, fontWeight: '800' },
  subtitulo: { color: '#F5A623', fontSize: 13, marginTop: 2 },
  perfilBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: '#333', borderWidth: 2, borderColor: '#F5A623',
    justifyContent: 'center', alignItems: 'center',
  },
  statsRow: {
    flexDirection: 'row', gap: 12,
    paddingHorizontal: 20, marginBottom: 20,
  },
  statCard: {
    flex: 1, backgroundColor: '#1A1A1A', borderRadius: 14,
    padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#2A2A2A',
  },
  statNum: { color: '#F5A623', fontSize: 28, fontWeight: '800' },
  statLabel: { color: '#888', fontSize: 12, marginTop: 4 },
  seccion: { paddingHorizontal: 20, marginBottom: 20 },
  seccionTitulo: { color: '#fff', fontSize: 16, fontWeight: '700', marginBottom: 12 },
  citaCard: {
    backgroundColor: '#1A1A1A', borderRadius: 14,
    padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#2A2A2A',
  },
  citaHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 10,
  },
  citaCliente: { color: '#fff', fontSize: 16, fontWeight: '700' },
  estadoBadge: {
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8,
  },
  estadoText: { fontSize: 12, fontWeight: '700' },
  citaInfo: { color: '#888', fontSize: 13, marginBottom: 4 },
  citaBotones: { flexDirection: 'row', gap: 10, marginTop: 12 },
  confirmarBtn: {
    flex: 1, backgroundColor: '#4ADE8020', borderRadius: 10,
    paddingVertical: 10, alignItems: 'center', borderWidth: 1, borderColor: '#4ADE80',
  },
  confirmarText: { color: '#4ADE80', fontWeight: '700' },
  rechazarBtn: {
    flex: 1, backgroundColor: '#EF444420', borderRadius: 10,
    paddingVertical: 10, alignItems: 'center', borderWidth: 1, borderColor: '#EF4444',
  },
  rechazarText: { color: '#EF4444', fontWeight: '700' },
  completarBtn: {
    backgroundColor: '#F5A62320', borderRadius: 10, marginTop: 12,
    paddingVertical: 12, alignItems: 'center', borderWidth: 1, borderColor: '#F5A623',
  },
  completarText: { color: '#F5A623', fontWeight: '700' },
  vacio: { alignItems: 'center', paddingTop: 60 },
  vacioText: { color: '#888', fontSize: 16 },
});