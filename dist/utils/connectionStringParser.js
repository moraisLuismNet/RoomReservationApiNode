"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseConnectionString = parseConnectionString;
function parseConnectionString(connectionString, provider) {
    const config = {};
    // Remove trailing semicolon if present
    const cleanedString = connectionString.endsWith(";")
        ? connectionString.slice(0, -1)
        : connectionString;
    const pairs = cleanedString.split(";");
    pairs.forEach((pair) => {
        const [key, ...values] = pair.split("=");
        if (!key || !values)
            return;
        const value = values.join("="); // Re-join in case value contains =
        const lowerKey = key.trim().toLowerCase();
        const cleanValue = value.trim();
        switch (lowerKey) {
            case "server":
            case "host":
            case "data source":
            case "datasource":
                if (provider === "SQLite") {
                    config.database = cleanValue;
                }
                else {
                    // Handle port if included in host (e.g. localhost:5432)
                    if (cleanValue.includes(",") && provider === "SqlServer") {
                        // SQL Server sometimes uses comma for port
                        const [host, port] = cleanValue.split(",");
                        config.host = host;
                        config.port = parseInt(port, 10);
                    }
                    else if (cleanValue.includes(":") && provider !== "SqlServer") {
                        const [host, port] = cleanValue.split(":");
                        config.host = host;
                        config.port = parseInt(port, 10);
                    }
                    else {
                        config.host = cleanValue;
                    }
                }
                break;
            case "database":
            case "initial catalog":
                config.database = cleanValue;
                break;
            case "user":
            case "username":
            case "user id":
            case "uid":
                config.username = cleanValue;
                break;
            case "password":
            case "pwd":
                config.password = cleanValue;
                break;
            case "port":
                config.port = parseInt(cleanValue, 10);
                break;
        }
    });
    // Default ports if not specified
    if (!config.port) {
        switch (provider) {
            case "PostgreSQL":
                config.port = 5432;
                break;
            case "MySQL":
                config.port = 3306;
                break;
            case "SqlServer":
                config.port = 1433;
                break;
            case "MongoDB":
                config.port = 27017;
                break;
        }
    }
    return config;
}
