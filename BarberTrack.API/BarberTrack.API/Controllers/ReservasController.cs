using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BarberTrack.API.Data;
using BarberTrack.API.Models;

namespace BarberTrack.API.Controllers;

public class CambiarEstadoDto
{
    public string Estado { get; set; } = string.Empty;
}

[ApiController]
[Route("api/[controller]")]
public class ReservasController : ControllerBase
{
    private readonly AppDbContext _context;

    public ReservasController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Reserva>>> GetReservas()
    {
        return await _context.Reservas
            .Include(r => r.Barbero)
            .Include(r => r.Cliente)
            .ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Reserva>> GetReserva(int id)
    {
        var reserva = await _context.Reservas
            .Include(r => r.Barbero)
            .Include(r => r.Cliente)
            .FirstOrDefaultAsync(r => r.Id == id);
        if (reserva == null) return NotFound();
        return reserva;
    }

    [HttpGet("cliente/{clienteId}")]
    public async Task<ActionResult<IEnumerable<Reserva>>> GetReservasPorCliente(int clienteId)
    {
        return await _context.Reservas
            .Include(r => r.Barbero)
            .Where(r => r.ClienteId == clienteId)
            .OrderByDescending(r => r.Fecha)
            .ToListAsync();
    }

    [HttpGet("barbero/{barberoId}")]
    public async Task<ActionResult<IEnumerable<Reserva>>> GetReservasPorBarbero(int barberoId)
    {
        return await _context.Reservas
            .Include(r => r.Cliente)
            .Where(r => r.BarberoId == barberoId)
            .OrderByDescending(r => r.Fecha)
            .ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<Reserva>> CrearReserva(Reserva reserva)
    {
        _context.Reservas.Add(reserva);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetReserva), new { id = reserva.Id }, reserva);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> ActualizarReserva(int id, Reserva reserva)
    {
        if (id != reserva.Id) return BadRequest();
        _context.Entry(reserva).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpPatch("{id}/estado")]
    public async Task<IActionResult> CambiarEstado(int id, [FromBody] CambiarEstadoDto dto)
    {
        var reserva = await _context.Reservas.FindAsync(id);
        if (reserva == null) return NotFound();

        var estadosValidos = new[] { "pendiente", "confirmada", "completada", "cancelada" };
        if (!estadosValidos.Contains(dto.Estado))
            return BadRequest("Estado no válido");

        reserva.Estado = dto.Estado;
        await _context.SaveChangesAsync();
        return Ok(new { mensaje = $"Estado actualizado a {dto.Estado}" });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> EliminarReserva(int id)
    {
        var reserva = await _context.Reservas.FindAsync(id);
        if (reserva == null) return NotFound();
        _context.Reservas.Remove(reserva);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}