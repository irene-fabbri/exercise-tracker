export interface DBManagerRepository<DBConnectionType> {
  initializeDatabase(): Promise<DBConnectionType>;
  getDatabase(): DBConnectionType | null;
  closeDatabase(): Promise<void>;
}
