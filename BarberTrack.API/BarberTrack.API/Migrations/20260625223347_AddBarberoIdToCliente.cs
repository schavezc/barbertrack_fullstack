using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BarberTrack.API.Migrations
{
    /// <inheritdoc />
    public partial class AddBarberoIdToCliente : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "BarberoId",
                table: "Clientes",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BarberoId",
                table: "Clientes");
        }
    }
}
