import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  SafeAreaView, TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getResenasPorBarbero } from '../../data/api';

export default function BarberoResenasScreen({ navigation }: any) {
  const [resenas, setResenas] = useState<any[]>([]);
  const [promedio, setPromedio] = useState<number>(0);

  useEffect(() => {
    AsyncStorage.getItem('token').then(token => {
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const id = parseInt(payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']);
        getResenasPorBarbero(id).then(res => {
          setResenas(res.data);
          if (res.data.length > 0) {
            const avg = res.data.reduce((acc: number, r: any) => acc + r.calificacion, 0) / res.data.length;
            setPromedio(Math.round(avg * 10) / 10);
          }
        });
      }
    });
  }, []);

  const renderEstrellas = (cal: number) => {
    return '⭐'.repeat(cal) + '☆'.repeat(5 - cal);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backBtn}>{'<'} Volver</Text>
          </TouchableOpacity>
          <Text style={styles.titulo}>Mis Reseñas</Text>
          <View style={{ width: 60 }} />
        </View>

        {/* Promedio */}
        <View style={styles.promedioCard}>
          <Text style={styles.promedioNum}>{promedio || '—'}</Text>
          <Text style={styles.promedioEstrellas}>
            {promedio ? renderEstrellas(Math.round(promedio)) : '☆☆☆☆☆'}
          </Text>
          <Text style={styles.promedioSub}>{resenas.length} reseñas</Text>
        </View>

        {/* Lista */}
        <View style={styles.lista}>
          {resenas.length === 0 ? (
            <Text style={styles.vacio}>Aún no tienes reseñas</Text>
          ) : (
            resenas.map(resena => (
              <View key={resena.id} style={styles.resenaCard}>
                <View style={styles.resenaHeader}>
                  <Text style={styles.estrellas}>{renderEstrellas(resena.calificacion)}</Text>
                  <Text style={styles.fecha}>
                    {new Date(resena.fechaResena).toLocaleDateString('es-PE')}
                  </Text>
                </View>
                {resena.comentario ? (
                  <Text style={styles.comentario}>"{resena.comentario}"</Text>
                ) : (
                  <Text style={styles.sinComentario}>Sin comentario</Text>
                )}
              </View>
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
    alignItems: 'center', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 8,
  },
  backBtn: { color: '#888', fontSize: 14 },
  titulo: { color: '#fff', fontSize: 18, fontWeight: '800' },
  promedioCard: {
    backgroundColor: '#1A1A1A', marginHorizontal: 20, marginVertical: 16,
    borderRadius: 16, padding: 24, alignItems: 'center',
    borderWidth: 1, borderColor: '#2A2A2A',
  },
  promedioNum: { color: '#F5A623', fontSize: 48, fontWeight: '800' },
  promedioEstrellas: { fontSize: 24, marginVertical: 8 },
  promedioSub: { color: '#888', fontSize: 14 },
  lista: { paddingHorizontal: 20, paddingBottom: 20 },
  resenaCard: {
    backgroundColor: '#1A1A1A', borderRadius: 14,
    padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#2A2A2A',
  },
  resenaHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 8,
  },
  estrellas: { fontSize: 16 },
  fecha: { color: '#888', fontSize: 12 },
  comentario: { color: '#fff', fontSize: 14, fontStyle: 'italic' },
  sinComentario: { color: '#666', fontSize: 13 },
  vacio: { color: '#888', textAlign: 'center', marginTop: 40, fontSize: 15 },
});