export interface ConnectionStrings {
  SqlServer: string;
  MySQL: string;
  PostgreSQL: string;
  SQLite: string;
  MongoDB: string;
}

export interface DatabaseSettings {
  Provider: string;
  ConnectionStrings: ConnectionStrings;
}
