using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BarberTrack.API.Data;
using BarberTrack.API.Models;

namespace BarberTrack.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BarberosController : ControllerBase
{
    private readonly AppDbContext _context;

    public BarberosController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Barbero>>> GetBarberos()
    {
        return await _context.Barberos.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Barbero>> GetBarbero(int id)
    {
        var barbero = await _context.Barberos.FindAsync(id);
        if (barbero == null) return NotFound();
        return barbero;
    }
}