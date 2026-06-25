using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BarberTrack.API.Data;
using BarberTrack.API.Models;

namespace BarberTrack.API.Controllers;

public class LoginDto
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class RegisterDto
{
    public string Nombre { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string Rol { get; set; } = "cliente";
}

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _config;

    public AuthController(AppDbContext context, IConfiguration config)
    {
        _context = context;
        _config = config;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        if (await _context.Clientes.AnyAsync(c => c.Email == dto.Email))
            return BadRequest("Email ya registrado");

        var cliente = new Cliente
        {
            Nombre = dto.Nombre,
            Email = dto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Rol = dto.Rol
        };

        _context.Clientes.Add(cliente);
        await _context.SaveChangesAsync();

        if (dto.Rol == "barbero")
        {
            var barbero = new Barbero
            {
                Nombre = dto.Nombre,
                Especialidad = "Por definir",
                Precio = 0,
                Rating = 0,
                Ubicacion = "Por definir",
                Disponible = false
            };
            _context.Barberos.Add(barbero);
            await _context.SaveChangesAsync();

            // Vincular cliente con su perfil de barbero
            cliente.BarberoId = barbero.Id;
            await _context.SaveChangesAsync();
        }

        return Ok(new { mensaje = "Registro exitoso" });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        var cliente = await _context.Clientes
            .FirstOrDefaultAsync(c => c.Email == dto.Email);

        if (cliente == null || !BCrypt.Net.BCrypt.Verify(dto.Password, cliente.PasswordHash))
            return Unauthorized("Credenciales incorrectas");

        var token = GenerarToken(cliente);
        return Ok(new { token, nombre = cliente.Nombre, rol = cliente.Rol });
    }

    private string GenerarToken(Cliente cliente)
    {
        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, cliente.Id.ToString()),
            new Claim(ClaimTypes.Email, cliente.Email),
            new Claim(ClaimTypes.Name, cliente.Nombre),
            new Claim(ClaimTypes.Role, cliente.Rol),
            new Claim("BarberoId", cliente.BarberoId?.ToString() ?? "0"),
        };
        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: creds
        );
        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}