namespace BarberTrack.API.Models;

public class Resena
{
    public int Id { get; set; }
    public int ReservaId { get; set; }
    public Reserva Reserva { get; set; } = null!;
    public int ClienteId { get; set; }
    public Cliente Cliente { get; set; } = null!;
    public int BarberoId { get; set; }
    public Barbero Barbero { get; set; } = null!;
    public int Calificacion { get; set; } // 1 al 5
    public string Comentario { get; set; } = string.Empty;
    public DateTime FechaResena { get; set; } = DateTime.UtcNow;
}