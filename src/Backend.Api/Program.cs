using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<AppDbContext>(opts =>
    opts.UseSqlite(builder.Configuration.GetConnectionString("Db") ?? "Data Source=app.db"));

builder.Services.AddCors(options =>
{
    options.AddPolicy("web", p =>
        p.WithOrigins("http://localhost:5173")
         .AllowAnyHeader()
         .AllowAnyMethod());
});


var app = builder.Build();
app.UseCors("web");
app.UseSwagger();
app.UseSwaggerUI();

app.MapGet("/health", () => Results.Ok(new { status = "ok" }));

app.MapGet("/api/items", async (AppDbContext db, int page = 1, int pageSize = 10) =>
{
    page = page < 1 ? 1 : page;
    pageSize = pageSize is < 1 or > 100 ? 10 : pageSize;

    var query = db.Items.AsNoTracking().OrderByDescending(i => i.LastModified);
    var total = await query.CountAsync();
    var items = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

    return Results.Ok(new { items, totalCount = total, page, pageSize });
})
.Produces(StatusCodes.Status200OK);

app.MapGet("/api/items/{id:int}", async (AppDbContext db, int id) =>
{
    var item = await db.Items.FindAsync(id);
    return item is null ? Results.NotFound() : Results.Ok(item);
})
.Produces<Item>(StatusCodes.Status200OK)
.Produces(StatusCodes.Status404NotFound);

app.MapPost("/api/items", async (AppDbContext db, Item item) =>
{
    item.LastModified = DateTime.UtcNow;
    db.Items.Add(item);
    await db.SaveChangesAsync();
    return Results.Created($"/api/items/{item.Id}", item);
})
.Produces<Item>(StatusCodes.Status201Created);

app.MapPut("/api/items/{id:int}", async (AppDbContext db, int id, Item input) =>
{
    var item = await db.Items.FindAsync(id);
    if (item is null) return Results.NotFound();
    item.Name = input.Name;
    item.Status = input.Status;
    item.LastModified = DateTime.UtcNow;
    await db.SaveChangesAsync();
    return Results.NoContent();
})
.Produces(StatusCodes.Status204NoContent)
.Produces(StatusCodes.Status404NotFound);

app.MapDelete("/api/items/{id:int}", async (AppDbContext db, int id) =>
{
    var item = await db.Items.FindAsync(id);
    if (item is null) return Results.NotFound();
    db.Items.Remove(item);
    await db.SaveChangesAsync();
    return Results.NoContent();
})
.Produces(StatusCodes.Status204NoContent)
.Produces(StatusCodes.Status404NotFound);

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

app.Run();

public record Item
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Status { get; set; } = "pending";
    public DateTime LastModified { get; set; } = DateTime.UtcNow;
}

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
    public DbSet<Item> Items => Set<Item>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Item>().HasIndex(i => i.LastModified);
    }
}

public partial class Program { }
