using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CalorieIntakeTracker.api.Migrations
{
    /// <inheritdoc />
    public partial class FoodConstraintFoodItems : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_food_entries_Food",
                table: "food_entries",
                column: "Food",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_food_entries_Food",
                table: "food_entries");
        }
    }
}
