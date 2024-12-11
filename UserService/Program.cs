using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers(); // Register controllers

// Build the application
var app = builder.Build();

// Configure the HTTP request pipeline.
app.MapControllers(); // Map controllers to routes

app.Run();
