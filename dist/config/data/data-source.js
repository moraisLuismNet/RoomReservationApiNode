"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const User_1 = require("../../models/User");
const Room_1 = require("../../models/Room");
const RoomType_1 = require("../../models/RoomType");
const Reservation_1 = require("../../models/Reservation");
const ReservationStatus_1 = require("../../models/ReservationStatus");
const EmailQueue_1 = require("../../models/EmailQueue");
const connectionStringParser_1 = require("../../utils/connectionStringParser");
const isProduction = process.env.NODE_ENV === "production";
// Read appsettings.json
const configPath = path.join(process.cwd(), "appsettings.json");
let databaseSettings;
try {
    const fileContent = fs.readFileSync(configPath, "utf-8");
    const config = JSON.parse(fileContent);
    databaseSettings = config.DatabaseSettings;
}
catch (error) {
    console.error("Error reading appsettings.json:", error);
    throw new Error("Database settings are not configured.");
}
if (!databaseSettings) {
    throw new Error("Database settings section is missing.");
}
let dbConfig;
const commonConfig = {
    synchronize: false,
    logging: ["error", "warn", "migration"],
    entities: [User_1.User, Room_1.Room, RoomType_1.RoomType, Reservation_1.Reservation, ReservationStatus_1.ReservationStatus, EmailQueue_1.EmailQueue],
    migrations: ["src/migrations/*.ts"],
    subscribers: [],
};
switch (databaseSettings.Provider) {
    case "SqlServer":
        const sqlConfig = (0, connectionStringParser_1.parseConnectionString)(databaseSettings.ConnectionStrings.SqlServer, "SqlServer");
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
        const mysqlConfig = (0, connectionStringParser_1.parseConnectionString)(databaseSettings.ConnectionStrings.MySQL, "MySQL");
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
        const pgConfig = (0, connectionStringParser_1.parseConnectionString)(databaseSettings.ConnectionStrings.PostgreSQL, "PostgreSQL");
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
        const sqliteConfig = (0, connectionStringParser_1.parseConnectionString)(databaseSettings.ConnectionStrings.SQLite, "SQLite");
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
exports.AppDataSource = new typeorm_1.DataSource(dbConfig);
