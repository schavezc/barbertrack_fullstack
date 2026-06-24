import axios from 'axios';

const API_URL = 'http://192.168.0.33:5226/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const getBarberos = () => api.get('/Barberos');
export const getReservas = () => api.get('/Reservas');
export const getReservasPorCliente = (clienteId: number) => api.get(`/Reservas/cliente/${clienteId}`);
export const getReservasPorBarbero = (barberoId: number) => api.get(`/Reservas/barbero/${barberoId}`);
export const crearReserva = (reserva: any) => api.post('/Reservas', reserva);
export const cambiarEstadoReserva = (id: number, estado: string) =>
  api.patch(`/Reservas/${id}/estado`, { estado });
export const cancelarReserva = (id: number) =>
  api.patch(`/Reservas/${id}/estado`, { estado: 'cancelada' });
export const login = (email: string, password: string) =>
  api.post('/Auth/login', { email, password });
export const register = (nombre: string, email: string, password: string) =>
  api.post('/Auth/register', { nombre, email, password, rol: 'cliente' });
export const registerBarbero = (nombre: string, email: string, password: string) =>
  api.post('/Auth/register', { nombre, email, password, rol: 'barbero' });
export const getCliente = (id: number) => api.get(`/Clientes/${id}`);
export const updatePerfil = (id: number, data: any) => api.put(`/Clientes/${id}`, data);
export const crearResena = (data: any) => api.post('/Resenas', data);
export const getResenasPorBarbero = (barberoId: number) => api.get(`/Resenas/barbero/${barberoId}`);