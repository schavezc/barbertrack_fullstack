import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput,
  TouchableOpacity, SafeAreaView, Alert, ActivityIndicator, ScrollView,
} from 'react-native';
import { registerBarbero } from '../data/api';

export default function RegisterBarberoScreen({ navigation }: any) {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegistro = async () => {
    if (!nombre.trim()) {
      Alert.alert('Error', 'Ingresa tu nombre');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      Alert.alert('Error', 'Ingresa un email válido');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }
    if (password !== confirmarPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    try {
      await registerBarbero(nombre, email, password);
      Alert.alert(
        '¡Solicitud enviada! ✓',
        'Tu cuenta de barbero fue creada. Ya puedes iniciar sesión.',
        [{ text: 'Iniciar sesión', onPress: () => navigation.replace('Login') }]
      );
    } catch (error: any) {
      Alert.alert('Error', error.response?.data || 'No se pudo registrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>

          {/* Header */}
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>{'<'} Volver</Text>
          </TouchableOpacity>

          {/* Logo */}
          <View style={styles.logoContainer}>
            <View style={styles.logoBox}>
              <Text style={styles.logoIcon}>✂</Text>
            </View>
            <Text style={styles.titulo}>Quiero ser Barbero</Text>
            <Text style={styles.subtitulo}>
              Únete a BarberTrack y gestiona tus citas de forma profesional
            </Text>
          </View>

          {/* Beneficios */}
          <View style={styles.beneficiosCard}>
            <Text style={styles.beneficiosTitulo}>¿Qué obtienes?</Text>
            <Text style={styles.beneficio}>✓  Panel de gestión de citas</Text>
            <Text style={styles.beneficio}>✓  Perfil visible para clientes</Text>
            <Text style={styles.beneficio}>✓  Sistema de reseñas y calificaciones</Text>
            <Text style={styles.beneficio}>✓  Gestión de disponibilidad</Text>
          </View>

          {/* Formulario */}
          <View style={styles.form}>
            <Text style={styles.label}>Nombre completo</Text>
            <TextInput
              style={styles.input}
              placeholder="Tu nombre"
              placeholderTextColor="#666"
              value={nombre}
              onChangeText={setNombre}
            />

            <Text style={styles.label}>Email profesional</Text>
            <TextInput
              style={styles.input}
              placeholder="tu@email.com"
              placeholderTextColor="#666"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.label}>Contraseña</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.inputPassword}
                placeholder="Mínimo 6 caracteres"
                placeholderTextColor="#666"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!mostrarPassword}
              />
              <TouchableOpacity
                style={styles.ojito}
                onPress={() => setMostrarPassword(!mostrarPassword)}
              >
                <Text style={{ fontSize: 18 }}>{mostrarPassword ? '🙈' : '👁️'}</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Confirmar contraseña</Text>
            <TextInput
              style={styles.input}
              placeholder="Repite tu contraseña"
              placeholderTextColor="#666"
              value={confirmarPassword}
              onChangeText={setConfirmarPassword}
              secureTextEntry
            />

            <TouchableOpacity
              style={styles.btn}
              onPress={handleRegistro}
              disabled={loading}
            >
              {loading
                ? <ActivityIndicator color="#000" />
                : <Text style={styles.btnText}>Registrarme como Barbero</Text>
              }
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D0D' },
  content: { paddingHorizontal: 24, paddingBottom: 40 },
  backBtn: { paddingTop: 20, paddingBottom: 8 },
  backText: { color: '#888', fontSize: 14 },
  logoContainer: { alignItems: 'center', marginBottom: 24, marginTop: 8 },
  logoBox: {
    width: 64, height: 64, backgroundColor: '#F5A623',
    borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 12,
  },
  logoIcon: { fontSize: 32 },
  titulo: { color: '#fff', fontSize: 22, fontWeight: '800', textAlign: 'center' },
  subtitulo: { color: '#888', fontSize: 13, marginTop: 6, textAlign: 'center' },
  beneficiosCard: {
    backgroundColor: '#1A1A1A', borderRadius: 14,
    padding: 16, marginBottom: 24, borderWidth: 1, borderColor: '#F5A62340',
  },
  beneficiosTitulo: { color: '#F5A623', fontSize: 14, fontWeight: '700', marginBottom: 10 },
  beneficio: { color: '#fff', fontSize: 13, marginBottom: 6 },
  form: { gap: 8 },
  label: { color: '#888', fontSize: 12, marginBottom: 4, marginTop: 8 },
  input: {
    backgroundColor: '#1A1A1A', borderRadius: 12, padding: 16,
    color: '#fff', fontSize: 15, borderWidth: 1, borderColor: '#2A2A2A',
  },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#1A1A1A', borderRadius: 12,
    borderWidth: 1, borderColor: '#2A2A2A',
  },
  inputPassword: { flex: 1, padding: 16, color: '#fff', fontSize: 15 },
  ojito: { paddingHorizontal: 14 },
  btn: {
    backgroundColor: '#F5A623', borderRadius: 12,
    paddingVertical: 16, alignItems: 'center', marginTop: 16,
  },
  btnText: { color: '#000', fontSize: 16, fontWeight: '800' },
});