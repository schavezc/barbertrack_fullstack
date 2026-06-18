import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, SafeAreaView, Alert, TextInput, ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCliente, updatePerfil } from '../data/api';

export default function PerfilScreen({ navigation }: any) {
  const [clienteId, setClienteId] = useState<number>(0);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [passwordActual, setPasswordActual] = useState('');
  const [passwordNuevo, setPasswordNuevo] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [editando, setEditando] = useState(false);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem('token').then(token => {
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const id = parseInt(payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']);
          setClienteId(id);
          getCliente(id).then(res => {
            setNombre(res.data.nombre);
            setEmail(res.data.email);
            setCargando(false);
          }).catch(() => setCargando(false));
        } catch (e) {
          console.log('Error cargando perfil', e);
          setCargando(false);
        }
      }
    });
  }, []);

  const handleGuardar = async () => {
    if (!nombre.trim()) {
      Alert.alert('Error', 'El nombre no puede estar vacío');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      Alert.alert('Error', 'Ingresa un email válido');
      return;
    }
    if (passwordNuevo && passwordNuevo !== passwordConfirm) {
      Alert.alert('Error', 'Las contraseñas nuevas no coinciden');
      return;
    }
    if (passwordNuevo && passwordNuevo.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);
    try {
      await updatePerfil(clienteId, {
        nombre,
        email,
        passwordActual: passwordActual || null,
        passwordNuevo: passwordNuevo || null,
      });
      await AsyncStorage.setItem('nombre', nombre);
      Alert.alert('¡Listo!', 'Perfil actualizado correctamente');
      setPasswordActual('');
      setPasswordNuevo('');
      setPasswordConfirm('');
      setEditando(false);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data || 'No se pudo actualizar');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert('Cerrar sesión', '¿Estás seguro?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Salir', style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem('token');
          await AsyncStorage.removeItem('nombre');
          navigation.replace('Login');
        }
      }
    ]);
  };

  if (cargando) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator color="#F5A623" size="large" style={{ flex: 1 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backBtn}>{'<'} Volver</Text>
          </TouchableOpacity>
          <Text style={styles.titulo}>Mi Perfil</Text>
          <TouchableOpacity onPress={() => setEditando(!editando)}>
            <Text style={styles.editarBtn}>{editando ? 'Cancelar' : 'Editar'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {nombre ? nombre.charAt(0).toUpperCase() : '?'}
            </Text>
          </View>
          <Text style={styles.nombreDisplay}>{nombre}</Text>
          <Text style={styles.emailDisplay}>{email}</Text>
        </View>

        <View style={styles.seccion}>
          <Text style={styles.seccionTitulo}>Información personal</Text>

          <Text style={styles.label}>Nombre</Text>
          <TextInput
            style={[styles.input, !editando && styles.inputDisabled]}
            value={nombre}
            onChangeText={setNombre}
            editable={editando}
            placeholderTextColor="#666"
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, !editando && styles.inputDisabled]}
            value={email}
            onChangeText={setEmail}
            editable={editando}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#666"
          />
        </View>

        {editando && (
          <View style={styles.seccion}>
            <Text style={styles.seccionTitulo}>Cambiar contraseña</Text>
            <Text style={styles.seccionSub}>Deja en blanco si no quieres cambiarla</Text>

            <Text style={styles.label}>Contraseña actual</Text>
            <TextInput
              style={styles.input}
              value={passwordActual}
              onChangeText={setPasswordActual}
              secureTextEntry
              placeholder="Contraseña actual"
              placeholderTextColor="#666"
            />

            <Text style={styles.label}>Nueva contraseña</Text>
            <TextInput
              style={styles.input}
              value={passwordNuevo}
              onChangeText={setPasswordNuevo}
              secureTextEntry
              placeholder="Nueva contraseña"
              placeholderTextColor="#666"
            />

            <Text style={styles.label}>Confirmar nueva contraseña</Text>
            <TextInput
              style={styles.input}
              value={passwordConfirm}
              onChangeText={setPasswordConfirm}
              secureTextEntry
              placeholder="Confirmar contraseña"
              placeholderTextColor="#666"
            />
          </View>
        )}

        {editando && (
          <TouchableOpacity style={styles.guardarBtn} onPress={handleGuardar} disabled={loading}>
            {loading
              ? <ActivityIndicator color="#000" />
              : <Text style={styles.guardarText}>Guardar cambios</Text>
            }
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Cerrar sesión</Text>
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
  editarBtn: { color: '#F5A623', fontSize: 15, fontWeight: '700' },
  avatarContainer: { alignItems: 'center', paddingVertical: 24 },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: '#F5A623', justifyContent: 'center', alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: { color: '#000', fontSize: 32, fontWeight: '800' },
  nombreDisplay: { color: '#fff', fontSize: 20, fontWeight: '700' },
  emailDisplay: { color: '#888', fontSize: 14, marginTop: 4 },
  seccion: {
    backgroundColor: '#1A1A1A', marginHorizontal: 16,
    marginBottom: 16, borderRadius: 16, padding: 16,
  },
  seccionTitulo: { color: '#fff', fontSize: 16, fontWeight: '700', marginBottom: 4 },
  seccionSub: { color: '#888', fontSize: 12, marginBottom: 12 },
  label: { color: '#888', fontSize: 12, marginBottom: 6, marginTop: 10 },
  input: {
    backgroundColor: '#2A2A2A', borderRadius: 10, padding: 14,
    color: '#fff', fontSize: 15, borderWidth: 1, borderColor: '#333',
  },
  inputDisabled: { opacity: 0.6 },
  guardarBtn: {
    backgroundColor: '#F5A623', marginHorizontal: 16,
    borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginBottom: 12,
  },
  guardarText: { color: '#000', fontSize: 16, fontWeight: '800' },
  logoutBtn: {
    backgroundColor: '#1A1A1A', marginHorizontal: 16,
    borderRadius: 14, paddingVertical: 16, alignItems: 'center',
    marginBottom: 32, borderWidth: 1, borderColor: '#D32F2F',
  },
  logoutText: { color: '#D32F2F', fontSize: 16, fontWeight: '700' },
});