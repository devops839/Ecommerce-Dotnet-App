# Use official .NET 8 SDK image to build the application
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["PaymentService/PaymentService.csproj", "PaymentService/"]
RUN dotnet restore "PaymentService/PaymentService.csproj"
COPY . .
WORKDIR "/src/PaymentService"
RUN dotnet build "PaymentService.csproj" -c Release -o /app/build

# Publish the application
FROM build AS publish
RUN dotnet publish "PaymentService.csproj" -c Release -o /app/publish

# Set the base image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 5004
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "PaymentService.dll"]
