import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, SafeAreaView,
} from 'react-native';
import { getBarberos } from '../data/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({ navigation }: any) {
  const [barberos, setBarberos] = useState<any[]>([]);
  const [nombre, setNombre] = useState('');

  useEffect(() => {
    getBarberos()
      .then(res => setBarberos(res.data))
      .catch(() => console.log('Error cargando barberos'));

    AsyncStorage.getItem('nombre').then(n => {
      if (n) setNombre(n);
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoRow}>
            <View style={styles.logoBox}>
              <Text style={styles.logoIcon}>✂</Text>
            </View>
            <Text style={styles.logoText}>BARBERTRACK</Text>
          </View>
          <TouchableOpacity
            style={styles.avatar}
            onPress={() => navigation.navigate('Perfil')}
          >
            <Text style={{ color: '#F5A623', fontSize: 18 }}>👤</Text>
          </TouchableOpacity>
        </View>

        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.heroSub}>Hola, {nombre || 'Usuario'} 👋</Text>
          <Text style={styles.heroTitle}>Tu estilo perfecto,</Text>
          <Text style={styles.heroAccent}>sin errores.</Text>
        </View>

        {/* Botones principales */}
        <View style={styles.mainButtons}>
          <TouchableOpacity
            style={styles.mainBtn}
            onPress={() => navigation.navigate('AR')}
          >
            <Text style={styles.mainBtnIcon}>✨</Text>
            <Text style={styles.mainBtnTitle}>Probar{'\n'}Estilos</Text>
            <Text style={styles.mainBtnSub}>IA & Realidad{'\n'}Aumentada</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.mainBtn, styles.mainBtnDark]}
            onPress={() => navigation.navigate('Citas')}
          >
            <Text style={styles.mainBtnIcon}>📅</Text>
            <Text style={styles.mainBtnTitle}>Reservar{'\n'}Cita</Text>
            <Text style={styles.mainBtnSub}>Barberos{'\n'}Premium</Text>
          </TouchableOpacity>
        </View>

        {/* Barberos cercanos */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Barberos Cercanos</Text>
            <TouchableOpacity>
              <Text style={styles.verTodos}>Ver todos {'>'}</Text>
            </TouchableOpacity>
          </View>

          {barberos.length === 0 ? (
            <Text style={styles.noData}>Cargando barberos...</Text>
          ) : (
            barberos.map((barbero) => (
              <TouchableOpacity
                key={barbero.id}
                style={styles.barberoCard}
                onPress={() => navigation.navigate('Citas')}
              >
                <View style={styles.barberoImg} />
                <View style={styles.barberoInfo}>
                  <Text style={styles.barberoNombre}>{barbero.nombre}</Text>
                  <Text style={styles.barberoEsp}>{barbero.especialidad}</Text>
                  <View style={styles.barberoMeta}>
                    <Text style={styles.barberoRating}>⭐ {barbero.rating}</Text>
                    <Text style={styles.barberoUbic}>📍 {barbero.ubicacion}</Text>
                  </View>
                </View>
                <Text style={styles.barberoPrecio}>${barbero.precio}</Text>
              </TouchableOpacity>
            ))
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D0D' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingHorizontal: 20, paddingTop: 16,
  },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoBox: {
    width: 36, height: 36, backgroundColor: '#F5A623',
    borderRadius: 8, justifyContent: 'center', alignItems: 'center',
  },
  logoIcon: { fontSize: 18 },
  logoText: { color: '#fff', fontSize: 18, fontWeight: '800', letterSpacing: 2 },
  avatar: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: '#333', borderWidth: 2, borderColor: '#F5A623',
    justifyContent: 'center', alignItems: 'center',
  },
  hero: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 8 },
  heroSub: { color: '#888', fontSize: 14, marginBottom: 6 },
  heroTitle: { color: '#fff', fontSize: 26, fontWeight: '700' },
  heroAccent: { color: '#F5A623', fontSize: 26, fontWeight: '800' },
  mainButtons: {
    flexDirection: 'row', gap: 12,
    paddingHorizontal: 20, paddingVertical: 20,
  },
  mainBtn: {
    flex: 1, backgroundColor: '#1A1A1A', borderRadius: 16,
    padding: 16, borderWidth: 1, borderColor: '#2A2A2A',
  },
  mainBtnDark: { backgroundColor: '#1A1A1A' },
  mainBtnIcon: { fontSize: 24, marginBottom: 8 },
  mainBtnTitle: { color: '#fff', fontSize: 16, fontWeight: '700', marginBottom: 4 },
  mainBtnSub: { color: '#888', fontSize: 11 },
  section: { paddingHorizontal: 20, paddingBottom: 20 },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 16,
  },
  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },
  verTodos: { color: '#F5A623', fontSize: 13 },
  barberoCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#1A1A1A', borderRadius: 14,
    padding: 12, marginBottom: 12, borderWidth: 1, borderColor: '#2A2A2A',
  },
  barberoImg: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#333' },
  barberoInfo: { flex: 1, marginLeft: 12 },
  barberoNombre: { color: '#fff', fontSize: 14, fontWeight: '700' },
  barberoEsp: { color: '#888', fontSize: 12, marginTop: 2 },
  barberoMeta: { flexDirection: 'row', gap: 12, marginTop: 4 },
  barberoRating: { color: '#F5A623', fontSize: 12 },
  barberoUbic: { color: '#888', fontSize: 12 },
  barberoPrecio: { color: '#F5A623', fontSize: 16, fontWeight: '800' },
  noData: { color: '#888', textAlign: 'center', marginTop: 20 },
});