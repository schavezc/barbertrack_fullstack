using Microsoft.EntityFrameworkCore;
using BarberTrack.API.Models;

namespace BarberTrack.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Barbero> Barberos { get; set; }
    public DbSet<Cliente> Clientes { get; set; }
    public DbSet<Reserva> Reservas { get; set; }
    public DbSet<Resena> Resenas { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Seed data barberos
        modelBuilder.Entity<Barbero>().HasData(
            new Barbero { Id = 1, Nombre = "Alex 'The Fade' Turner", Especialidad = "Fade & Lineup", Precio = 35, Rating = 4.9, Ubicacion = "Downtown", Disponible = true },
            new Barbero { Id = 2, Nombre = "David Chen", Especialidad = "Classic & Pompadour", Precio = 30, Rating = 4.7, Ubicacion = "Midtown", Disponible = true },
            new Barbero { Id = 3, Nombre = "Marcus Williams", Especialidad = "Skin Fade & Design", Precio = 40, Rating = 4.8, Ubicacion = "Uptown", Disponible = false }
        );

        // Evitar cascada múltiple en Resenas
        modelBuilder.Entity<Resena>()
            .HasOne(r => r.Reserva)
            .WithOne(r => r.Resena)
            .HasForeignKey<Resena>(r => r.ReservaId)
            .OnDelete(DeleteBehavior.NoAction);

        modelBuilder.Entity<Resena>()
            .HasOne(r => r.Cliente)
            .WithMany()
            .HasForeignKey(r => r.ClienteId)
            .OnDelete(DeleteBehavior.NoAction);

        modelBuilder.Entity<Resena>()
            .HasOne(r => r.Barbero)
            .WithMany()
            .HasForeignKey(r => r.BarberoId)
            .OnDelete(DeleteBehavior.NoAction);
    }
}