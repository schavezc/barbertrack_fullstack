namespace BarberTrack.API.Models;

public class Barbero
{
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string Especialidad { get; set; } = string.Empty;
    public decimal Precio { get; set; }
    public double Rating { get; set; }
    public string Ubicacion { get; set; } = string.Empty;
    public bool Disponible { get; set; } = true;
    public ICollection<Reserva> Reservas { get; set; } = new List<Reserva>();
}