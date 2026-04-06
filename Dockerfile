# Stage 1: Build the React frontend
FROM node:20-alpine AS frontend-build
WORKDIR /app/client

# Copy package files and install dependencies
COPY powercalc.client/package*.json ./
RUN npm ci

# Copy frontend source and build
COPY powercalc.client/ ./
RUN npm run build

# Stage 2: Build the .NET backend
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS backend-build
WORKDIR /app

# Copy solution and project files
COPY PowerCalc.sln ./
COPY PowerCalc.Server/PowerCalc.Server.csproj ./PowerCalc.Server/
COPY powercalc.client/powercalc.client.esproj ./powercalc.client/

# Restore dependencies
RUN dotnet restore

# Copy the rest of the backend source
COPY PowerCalc.Server/ ./PowerCalc.Server/

# Build the backend
RUN dotnet publish PowerCalc.Server/PowerCalc.Server.csproj -c Release -o /app/publish

# Stage 3: Runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Copy built backend from build stage
COPY --from=backend-build /app/publish .

# Copy built frontend from frontend-build stage
COPY --from=frontend-build /app/client/dist ./wwwroot

# Expose port
EXPOSE 8080
EXPOSE 8081

# Set environment variables
ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production

# Run the application
ENTRYPOINT ["dotnet", "PowerCalc.Server.dll"]
