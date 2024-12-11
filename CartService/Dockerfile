# Use official .NET 8 SDK image to build the application
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["CartService/CartService.csproj", "CartService/"]
RUN dotnet restore "CartService/CartService.csproj"
COPY . .
WORKDIR "/src/CartService"
RUN dotnet build "CartService.csproj" -c Release -o /app/build

# Publish the application
FROM build AS publish
RUN dotnet publish "CartService.csproj" -c Release -o /app/publish

# Set the base image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 5005
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "CartService.dll"]
