using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);

// Register services
builder.Services.AddControllers(); // Register controllers for API

// Build the application
var app = builder.Build();

// Configure the HTTP request pipeline
app.MapControllers(); // Map controllers to routes

app.Run();
