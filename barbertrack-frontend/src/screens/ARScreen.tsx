import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  SafeAreaView, Animated, ScrollView,
} from 'react-native';

const colores = [
  { nombre: 'Tinado', color: '#4A4A4A' },
  { nombre: 'Azul Oscuro', color: '#1B3A6B' },
  { nombre: 'Cobrizo', color: '#B5651D' },
  { nombre: 'Ceniza', color: '#9E9E9E' },
];

const categorias = ['Cabello', 'Barba', 'Color'];

export default function ARScreen({ navigation }: any) {
  const [analizando, setAnalizando] = useState(true);
  const [categoriaActiva, setCategoriaActiva] = useState('Color');
  const [colorSeleccionado, setColorSeleccionado] = useState(0);
  const pulseAnim = new Animated.Value(1);

  useEffect(() => {
    // Simular análisis de facciones
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.2, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    ).start();

    const timer = setTimeout(() => setAnalizando(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  if (analizando) {
    return (
      <View style={styles.analizandoContainer}>
        <Animated.View style={[styles.faceIcon, { transform: [{ scale: pulseAnim }] }]}>
          <Text style={styles.faceEmoji}>◻</Text>
          <View style={styles.faceCorner1} />
          <View style={styles.faceCorner2} />
          <View style={styles.faceCorner3} />
          <View style={styles.faceCorner4} />
        </Animated.View>
        <Text style={styles.analizandoText}>ANALIZANDO FACCIONES...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>✨ AR Studio</Text>
        <TouchableOpacity style={styles.cameraBtn}>
          <Text style={styles.cameraIcon}>📷</Text>
        </TouchableOpacity>
      </View>

      {/* Vista AR simulada */}
      <View style={styles.arView}>
        <View style={styles.faceOverlay}>
          <Text style={styles.faceOverlayText}>👤</Text>
          <View style={[styles.colorOverlay, { backgroundColor: colores[colorSeleccionado].color + '60' }]} />
        </View>
      </View>

      {/* Panel inferior */}
      <View style={styles.panel}>
        {/* Categorías */}
        <View style={styles.categorias}>
          {categorias.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => setCategoriaActiva(cat)}
            >
              <Text style={[
                styles.categoriaText,
                categoriaActiva === cat && styles.categoriaActiva,
              ]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Colores */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.coloresRow}>
          {colores.map((col, idx) => (
            <TouchableOpacity
              key={col.nombre}
              style={styles.colorItem}
              onPress={() => setColorSeleccionado(idx)}
            >
              <View style={[
                styles.colorCircle,
                { backgroundColor: col.color },
                colorSeleccionado === idx && styles.colorSelected,
              ]} />
              <Text style={styles.colorNombre}>{col.nombre}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Botón aplicar */}
        <TouchableOpacity
          style={styles.aplicarBtn}
          onPress={() => navigation.navigate('Citas')}
        >
          <Text style={styles.aplicarText}>✓  Aplicar y Reservar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  analizandoContainer: {
    flex: 1, backgroundColor: '#0D0D0D',
    justifyContent: 'center', alignItems: 'center',
  },
  faceIcon: { marginBottom: 32, position: 'relative' },
  faceEmoji: { fontSize: 80, color: '#F5A623' },
  faceCorner1: {
    position: 'absolute', top: 0, left: 0,
    width: 16, height: 16, borderTopWidth: 3, borderLeftWidth: 3, borderColor: '#F5A623',
  },
  faceCorner2: {
    position: 'absolute', top: 0, right: 0,
    width: 16, height: 16, borderTopWidth: 3, borderRightWidth: 3, borderColor: '#F5A623',
  },
  faceCorner3: {
    position: 'absolute', bottom: 0, left: 0,
    width: 16, height: 16, borderBottomWidth: 3, borderLeftWidth: 3, borderColor: '#F5A623',
  },
  faceCorner4: {
    position: 'absolute', bottom: 0, right: 0,
    width: 16, height: 16, borderBottomWidth: 3, borderRightWidth: 3, borderColor: '#F5A623',
  },
  analizandoText: { color: '#F5A623', fontSize: 14, letterSpacing: 3, fontWeight: '600' },
  container: { flex: 1, backgroundColor: '#0D0D0D' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12,
  },
  backBtn: { padding: 8 },
  backText: { color: '#fff', fontSize: 20, fontWeight: '700' },
  headerTitle: { color: '#fff', fontSize: 16, fontWeight: '700' },
  cameraBtn: { padding: 8 },
  cameraIcon: { fontSize: 20 },
  arView: {
    flex: 1, backgroundColor: '#1A1A1A',
    margin: 16, borderRadius: 20, overflow: 'hidden',
    justifyContent: 'center', alignItems: 'center',
  },
  faceOverlay: { alignItems: 'center', justifyContent: 'center' },
  faceOverlayText: { fontSize: 120 },
  colorOverlay: {
    position: 'absolute', top: 0, width: 120, height: 60,
    borderRadius: 30,
  },
  panel: {
    backgroundColor: '#1A1A1A', borderTopLeftRadius: 24,
    borderTopRightRadius: 24, padding: 20,
  },
  categorias: {
    flexDirection: 'row', justifyContent: 'center',
    gap: 24, marginBottom: 16,
  },
  categoriaText: { color: '#888', fontSize: 14, fontWeight: '600' },
  categoriaActiva: { color: '#fff', borderBottomWidth: 2, borderBottomColor: '#F5A623', paddingBottom: 4 },
  coloresRow: { marginBottom: 20 },
  colorItem: { alignItems: 'center', marginRight: 20 },
  colorCircle: { width: 44, height: 44, borderRadius: 22, marginBottom: 6 },
  colorSelected: { borderWidth: 3, borderColor: '#F5A623' },
  colorNombre: { color: '#888', fontSize: 11 },
  aplicarBtn: {
    backgroundColor: '#F5A623', borderRadius: 14,
    paddingVertical: 16, alignItems: 'center',
  },
  aplicarText: { color: '#000', fontSize: 16, fontWeight: '800' },
});