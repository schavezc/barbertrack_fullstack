using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BarberTrack.API.Data;
using BarberTrack.API.Models;

namespace BarberTrack.API.Controllers;

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