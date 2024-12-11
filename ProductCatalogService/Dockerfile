# Use official .NET 8 SDK image to build the application
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["ProductCatalogService/ProductCatalogService.csproj", "ProductCatalogService/"]
RUN dotnet restore "ProductCatalogService/ProductCatalogService.csproj"
COPY . .
WORKDIR "/src/ProductCatalogService"
RUN dotnet build "ProductCatalogService.csproj" -c Release -o /app/build

# Publish the application
FROM build AS publish
RUN dotnet publish "ProductCatalogService.csproj" -c Release -o /app/publish

# Set the base image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 5002
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ProductCatalogService.dll"]
