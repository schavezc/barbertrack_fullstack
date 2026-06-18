using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BarberTrack.API.Data;
using BarberTrack.API.Models;

namespace BarberTrack.API.Controllers;

public class UpdatePerfilDto
{
    public string Nombre { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? PasswordActual { get; set; }
    public string? PasswordNuevo { get; set; }
}

[ApiController]
[Route("api/[controller]")]
public class ClientesController : ControllerBase
{
    private readonly AppDbContext _context;

    public ClientesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Cliente>> GetCliente(int id)
    {
        var cliente = await _context.Clientes.FindAsync(id);
        if (cliente == null) return NotFound();
        cliente.PasswordHash = string.Empty;
        return cliente;
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdatePerfil(int id, [FromBody] UpdatePerfilDto dto)
    {
        var cliente = await _context.Clientes.FindAsync(id);
        if (cliente == null) return NotFound();

        if (await _context.Clientes.AnyAsync(c => c.Email == dto.Email && c.Id != id))
            return BadRequest("Email ya está en uso");

        cliente.Nombre = dto.Nombre;
        cliente.Email = dto.Email;

        if (!string.IsNullOrEmpty(dto.PasswordNuevo))
        {
            if (string.IsNullOrEmpty(dto.PasswordActual) ||
                !BCrypt.Net.BCrypt.Verify(dto.PasswordActual, cliente.PasswordHash))
                return BadRequest("Contraseña actual incorrecta");

            cliente.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.PasswordNuevo);
        }

        await _context.SaveChangesAsync();
        return Ok(new { mensaje = "Perfil actualizado" });
    }
}