using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BarberTrack.API.Data;
using BarberTrack.API.Models;

namespace BarberTrack.API.Controllers;

public class CrearResenaDto
{
    public int ReservaId { get; set; }
    public int ClienteId { get; set; }
    public int BarberoId { get; set; }
    public int Calificacion { get; set; }
    public string Comentario { get; set; } = string.Empty;
}

[ApiController]
[Route("api/[controller]")]
public class ResenasController : ControllerBase
{
    private readonly AppDbContext _context;

    public ResenasController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("barbero/{barberoId}")]
    public async Task<ActionResult<IEnumerable<Resena>>> GetResenasPorBarbero(int barberoId)
    {
        return await _context.Resenas
            .Where(r => r.BarberoId == barberoId)
            .ToListAsync();
    }

    [HttpPost]
    public async Task<IActionResult> CrearResena([FromBody] CrearResenaDto dto)
    {
        // Verificar que la reserva existe y está completada
        var reserva = await _context.Reservas.FindAsync(dto.ReservaId);
        if (reserva == null) return NotFound("Reserva no encontrada");
        if (reserva.Estado != "completada")
            return BadRequest("Solo puedes reseñar citas completadas");

        // Verificar que no haya reseña previa
        var yaReseno = await _context.Resenas.AnyAsync(r => r.ReservaId == dto.ReservaId);
        if (yaReseno) return BadRequest("Ya dejaste una reseña para esta cita");

        if (dto.Calificacion < 1 || dto.Calificacion > 5)
            return BadRequest("La calificación debe ser entre 1 y 5");

        var resena = new Resena
        {
            ReservaId = dto.ReservaId,
            ClienteId = dto.ClienteId,
            BarberoId = dto.BarberoId,
            Calificacion = dto.Calificacion,
            Comentario = dto.Comentario,
            FechaResena = DateTime.UtcNow
        };

        _context.Resenas.Add(resena);

        // Actualizar estado de la reserva
        reserva.Estado = "reseñada";

        // Actualizar rating del barbero
        var promedioRating = await _context.Resenas
            .Where(r => r.BarberoId == dto.BarberoId)
            .AverageAsync(r => (double)r.Calificacion);

        var barbero = await _context.Barberos.FindAsync(dto.BarberoId);
        if (barbero != null)
            barbero.Rating = Math.Round(promedioRating, 1);

        await _context.SaveChangesAsync();
        return Ok(new { mensaje = "Reseña guardada correctamente" });
    }
}