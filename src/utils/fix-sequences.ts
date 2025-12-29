import { AppDataSource } from "../config/data/data-source";

async function fixSequences() {
  try {
    await AppDataSource.initialize();
    console.log("Database initialized");

    const tables = [
      { name: "rooms", idColumn: "roomId" },
      {
        name: "room_types",
        idColumn: "roomTypeId",
      },
      {
        name: "reservations",
        idColumn: "reservation_id",
      },
      {
        name: "reservation_statuses",
        idColumn: "status_id",
      },
      {
        name: "email_queues",
        idColumn: "email_queue_id",
      },
    ];

    // Inspect sequences
    const allSequences = await AppDataSource.query(`
      SELECT n.nspname as schema, c.relname as sequence_name
      FROM pg_class c
      JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE c.relkind = 'S';
    `);
    console.log("All sequences in DB:", allSequences);

    for (const table of tables) {
      console.log(`\n--- Working on: ${table.name}.${table.idColumn} ---`);

      // Get the correct sequence from column_default
      const columnInfo = await AppDataSource.query(`
        SELECT column_default 
        FROM information_schema.columns 
        WHERE table_name = '${table.name}' AND column_name = '${table.idColumn}';
      `);

      const defaultValue = columnInfo[0]?.column_default || "";
      console.log(`Default Value: ${defaultValue}`);

      // Extract sequence name from: nextval('sequence_name'::regclass)
      const match = defaultValue.match(/nextval\('"?([^"']+)"?'::regclass\)/);
      const seqName = match ? match[1] : null;

      if (!seqName) {
        console.warn(
          `Could not extract sequence name for ${table.name}.${table.idColumn}`
        );
        continue;
      }

      console.log(`Actual sequence in use: ${seqName}`);

      // Get max ID
      const maxIdResult = await AppDataSource.query(
        `SELECT MAX("${table.idColumn}") as maxid FROM "${table.name}";`
      );
      const maxId = parseInt(maxIdResult[0].maxid || "0");
      console.log(`Max ID: ${maxId}`);

      // Sync
      const nextVal = maxId + 10; // Set safely ahead
      console.log(`Synchronizing ${seqName} to ${nextVal}`);
      await AppDataSource.query(`SELECT setval('"${seqName}"', ${nextVal});`);
    }

    console.log("All sequences synchronized.");
  } catch (error) {
    console.error("Error fixing sequences:", error);
  } finally {
    await AppDataSource.destroy();
  }
}

fixSequences();
