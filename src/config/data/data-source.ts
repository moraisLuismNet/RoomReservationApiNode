import { DataSource, DataSourceOptions } from "typeorm";
import * as fs from "fs";
import * as path from "path";
import { User } from "../../models/User";
import { Room } from "../../models/Room";
import { RoomType } from "../../models/RoomType";
import { Reservation } from "../../models/Reservation";
import { ReservationStatus } from "../../models/ReservationStatus";
import { EmailQueue } from "../../models/EmailQueue";
import { DatabaseSettings } from "../../models/DatabaseSettings";
import { parseConnectionString } from "../../utils/connectionStringParser";

const isProduction = process.env.NODE_ENV === "production";

// Read appsettings.json
const configPath = path.join(process.cwd(), "appsettings.json");
let databaseSettings: DatabaseSettings;

try {
  const fileContent = fs.readFileSync(configPath, "utf-8");
  const config = JSON.parse(fileContent);
  databaseSettings = config.DatabaseSettings;
} catch (error) {
  console.error("Error reading appsettings.json:", error);
  throw new Error("Database settings are not configured.");
}

if (!databaseSettings) {
  throw new Error("Database settings section is missing.");
}

let dbConfig: DataSourceOptions;

const commonConfig = {
  synchronize: false,
  logging: ["error", "warn", "migration"] as any,
  entities: [User, Room, RoomType, Reservation, ReservationStatus, EmailQueue],
  migrations: ["src/migrations/*.ts"],
  subscribers: [],
};

switch (databaseSettings.Provider) {
  case "SqlServer":
    const sqlConfig = parseConnectionString(
      databaseSettings.ConnectionStrings.SqlServer,
      "SqlServer"
    );
    dbConfig = {
      type: "mssql",
      host: sqlConfig.host,
      port: sqlConfig.port,
      username: sqlConfig.username,
      password: sqlConfig.password,
      database: sqlConfig.database,
      options: {
        encrypt: true, // simplified for azure/local
        trustServerCertificate: true,
      },
      ...commonConfig,
    };
    break;

  case "MySQL":
    const mysqlConfig = parseConnectionString(
      databaseSettings.ConnectionStrings.MySQL,
      "MySQL"
    );
    dbConfig = {
      type: "mysql",
      host: mysqlConfig.host,
      port: mysqlConfig.port,
      username: mysqlConfig.username,
      password: mysqlConfig.password,
      database: mysqlConfig.database,
      ...commonConfig,
    };
    break;

  case "PostgreSQL":
    const pgConfig = parseConnectionString(
      databaseSettings.ConnectionStrings.PostgreSQL,
      "PostgreSQL"
    );
    dbConfig = {
      type: "postgres",
      host: pgConfig.host,
      port: pgConfig.port,
      username: pgConfig.username,
      password: pgConfig.password,
      database: pgConfig.database,
      ssl: isProduction ? { rejectUnauthorized: false } : false,
      ...commonConfig,
    };
    break;

  case "SQLite":
    const sqliteConfig = parseConnectionString(
      databaseSettings.ConnectionStrings.SQLite,
      "SQLite"
    );
    dbConfig = {
      type: "sqlite",
      database: sqliteConfig.database || "RoomReservationDb.db",
      ...commonConfig,
    };
    break;

  case "MongoDB":
    dbConfig = {
      type: "mongodb",
      url: databaseSettings.ConnectionStrings.MongoDB,
      ...commonConfig,
    };
    break;

  default:
    throw new Error("Unsupported database provider");
}

export const AppDataSource = new DataSource(dbConfig);
