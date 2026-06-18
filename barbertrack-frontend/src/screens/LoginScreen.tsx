import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput,
  TouchableOpacity, SafeAreaView, Alert, ActivityIndicator,
} from 'react-native';
import { login, register } from '../data/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }: any) {
  const [isLogin, setIsLogin] = useState(true);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [mostrarPassword, setMostrarPassword] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Completa todos los campos');
      return;
    }
    if (!email.includes('@')) {
      Alert.alert('Error', 'Ingresa un email válido');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }
    setLoading(true);
    try {
      if (isLogin) {
        const res = await login(email, password);
        await AsyncStorage.setItem('token', res.data.token);
        await AsyncStorage.setItem('nombre', res.data.nombre);
        navigation.replace('Main');
      } else {
        if (!nombre.trim()) {
          Alert.alert('Error', 'Ingresa tu nombre');
          return;
        }
        await register(nombre, email, password);
        Alert.alert('¡Listo!', 'Cuenta creada, inicia sesión');
        setIsLogin(true);
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data || 'Algo salió mal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>

        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logoBox}>
            <Text style={styles.logoIcon}>✂</Text>
          </View>
          <Text style={styles.logoText}>BARBERTRACK</Text>
          <Text style={styles.logoSub}>Tu estilo perfecto, sin errores.</Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, isLogin && styles.tabActivo]}
            onPress={() => setIsLogin(true)}
          >
            <Text style={[styles.tabText, isLogin && styles.tabTextActivo]}>
              Iniciar Sesión
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, !isLogin && styles.tabActivo]}
            onPress={() => setIsLogin(false)}
          >
            <Text style={[styles.tabText, !isLogin && styles.tabTextActivo]}>
              Registrarse
            </Text>
          </TouchableOpacity>
        </View>

        {/* Formulario */}
        <View style={styles.form}>
          {!isLogin && (
            <TextInput
              style={styles.input}
              placeholder="Nombre completo"
              placeholderTextColor="#666"
              value={nombre}
              onChangeText={setNombre}
            />
          )}
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#666"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {/* Contraseña con ojito */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputPassword}
              placeholder="Contraseña"
              placeholderTextColor="#666"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!mostrarPassword}
            />
            <TouchableOpacity
              style={styles.ojito}
              onPress={() => setMostrarPassword(!mostrarPassword)}
            >
              <Text style={{ fontSize: 18 }}>
                {mostrarPassword ? '🙈' : '👁️'}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.btn}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color="#000" />
              : <Text style={styles.btnText}>
                  {isLogin ? 'Entrar' : 'Crear cuenta'}
                </Text>
            }
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D0D' },
  content: { flex: 1, paddingHorizontal: 24, justifyContent: 'center' },
  logoContainer: { alignItems: 'center', marginBottom: 48 },
  logoBox: {
    width: 64, height: 64, backgroundColor: '#F5A623',
    borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 12,
  },
  logoIcon: { fontSize: 32 },
  logoText: { color: '#fff', fontSize: 24, fontWeight: '800', letterSpacing: 3 },
  logoSub: { color: '#888', fontSize: 13, marginTop: 6 },
  tabs: {
    flexDirection: 'row', backgroundColor: '#1A1A1A',
    borderRadius: 12, padding: 4, marginBottom: 24,
  },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  tabActivo: { backgroundColor: '#F5A623' },
  tabText: { color: '#888', fontWeight: '600' },
  tabTextActivo: { color: '#000' },
  form: { gap: 12 },
  input: {
    backgroundColor: '#1A1A1A', borderRadius: 12, padding: 16,
    color: '#fff', fontSize: 15, borderWidth: 1, borderColor: '#2A2A2A',
  },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#1A1A1A', borderRadius: 12,
    borderWidth: 1, borderColor: '#2A2A2A',
  },
  inputPassword: {
    flex: 1, padding: 16, color: '#fff', fontSize: 15,
  },
  ojito: { paddingHorizontal: 14 },
  btn: {
    backgroundColor: '#F5A623', borderRadius: 12,
    paddingVertical: 16, alignItems: 'center', marginTop: 8,
  },
  btnText: { color: '#000', fontSize: 16, fontWeight: '800' },
});