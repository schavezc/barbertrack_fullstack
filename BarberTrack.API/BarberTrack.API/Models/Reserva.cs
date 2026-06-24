using System.Text.Json.Serialization;

namespace BarberTrack.API.Models;

public class Reserva
{
    public int Id { get; set; }
    public int ClienteId { get; set; }

    [JsonIgnore]
    public Cliente? Cliente { get; set; }

    public int BarberoId { get; set; }

    [JsonIgnore]
    public Barbero? Barbero { get; set; }

    public DateTime Fecha { get; set; }
    public string Hora { get; set; } = string.Empty;
    public string Estilo { get; set; } = string.Empty;
    public string Estado { get; set; } = "pendiente";
    // pendiente → confirmada → completada → reseñada

    public Resena? Resena { get; set; }
}