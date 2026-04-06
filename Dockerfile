# See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

# This stage is used when running from VS in fast mode (Default for Debug configuration)
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080


# This stage is used to build the service project
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS with-node
RUN apt-get update
RUN apt-get -y install curl
RUN curl -sL https://deb.nodesource.com/setup_20.x | bash
RUN apt-get -y install nodejs


FROM with-node AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["PowerCalc.Server/PowerCalc.Server.csproj", "PowerCalc.Server/"]
COPY ["powercalc.client/powercalc.client.esproj", "powercalc.client/"]
RUN dotnet restore "./PowerCalc.Server/PowerCalc.Server.csproj"
COPY . .

# Install npm dependencies properly for Linux before building
WORKDIR "/src/powercalc.client"
RUN npm ci

WORKDIR "/src/PowerCalc.Server"
RUN dotnet build "./PowerCalc.Server.csproj" -c $BUILD_CONFIGURATION -o /app/build

# This stage is used to publish the service project to be copied to the final stage
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./PowerCalc.Server.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false --verbosity detailed

# This stage is used in production or when running from VS in regular mode (Default when not using the Debug configuration)
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "PowerCalc.Server.dll"]
