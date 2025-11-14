using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

[Table("profiles")]
public class Profile : BaseModel
{
    [PrimaryKey("id")]
    public Guid Id { get; set; }

    [Column("age")]
    public int? Age { get; set; }

    [Column("weight_lb")]
    public double? WeightLb { get; set; }

    [Column("height_ft")]
    public double? HeightFt { get; set; }

    [Column("sex")]
    public string? Sex { get; set; }

    [Column("activity_level")]
    public string? ActivityLevel { get; set; }

    [Column("goal")]
    public string? Goal { get; set; }

    [Column("updated_at")]
    public DateTime UpdatedAt { get; set; }
}
