import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, SafeAreaView,
} from 'react-native';
import { getReservas } from '../data/api';

export default function HistorialScreen({ navigation }: any) {
  const [reservas, setReservas] = useState<any[]>([]);

  useEffect(() => {
    getReservas()
      .then(res => setReservas(res.data))
      .catch(() => console.log('Error cargando historial'));
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <Text style={styles.titulo}>🕐  Mi Historial</Text>
        </View>

        {reservas.length === 0 ? (
          <Text style={styles.noData}>No tienes reservas aún</Text>
        ) : (
          reservas.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.fecha}>
                  {new Date(item.fecha).toLocaleDateString('es-PE')}
                </Text>
                <View style={styles.estadoBadge}>
                  <Text style={styles.estadoText}>{item.estado}</Text>
                </View>
              </View>

              <View style={styles.cardBody}>
                <View style={styles.imgPlaceholder} />
                <View style={styles.info}>
                  <Text style={styles.estilo}>{item.estilo}</Text>
                  <Text style={styles.hora}>🕐 {item.hora}</Text>
                  <Text style={styles.barbero}>Barbero ID: {item.barberoId}</Text>
                </View>
              </View>

              <View style={styles.cardFooter}>
                <TouchableOpacity
                  style={styles.arBtn}
                  onPress={() => navigation.navigate('AR')}
                >
                  <Text style={styles.arBtnText}>Ver en AR</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.repetirBtn}
                  onPress={() => navigation.navigate('Citas')}
                >
                  <Text style={styles.repetirBtnText}>🔄  Repetir</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
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
    backgroundColor: '#1B4332', paddingHorizontal: 10,
    paddingVertical: 4, borderRadius: 8,
  },
  estadoText: { color: '#4ADE80', fontSize: 12, fontWeight: '700' },
  cardBody: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  imgPlaceholder: { width: 56, height: 56, borderRadius: 12, backgroundColor: '#333' },
  info: { flex: 1, marginLeft: 12 },
  estilo: { color: '#fff', fontSize: 16, fontWeight: '700' },
  hora: { color: '#F5A623', fontSize: 13, marginTop: 4 },
  barbero: { color: '#888', fontSize: 12, marginTop: 2 },
  cardFooter: { flexDirection: 'row', gap: 10 },
  arBtn: {
    flex: 1, paddingVertical: 12, borderRadius: 12,
    borderWidth: 1, borderColor: '#444', alignItems: 'center',
  },
  arBtnText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  repetirBtn: {
    flex: 1, paddingVertical: 12, borderRadius: 12,
    backgroundColor: '#F5A62320', borderWidth: 1,
    borderColor: '#F5A623', alignItems: 'center',
  },
  repetirBtnText: { color: '#F5A623', fontSize: 14, fontWeight: '700' },
});