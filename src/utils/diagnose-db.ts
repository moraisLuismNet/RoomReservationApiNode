import { AppDataSource } from "../config/data/data-source";

async function diagnose() {
  try {
    await AppDataSource.initialize();
    console.log("--- Database Diagnostics ---");

    // 1. Check Table Constraints
    const constraints = await AppDataSource.query(`
      SELECT conname, contype, pg_get_constraintdef(oid) 
      FROM pg_constraint 
      WHERE conrelid = '"rooms"'::regclass;
    `);
    console.log("\nConstraints on 'rooms':", constraints);

    // 2. Check Column Defaults
    const columns = await AppDataSource.query(`
      SELECT column_name, column_default, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'rooms';
    `);
    console.log("\nColumns in 'rooms':", columns);

    // 3. Check All Sequences and their current states
    const sequences = await AppDataSource.query(`
      SELECT 
        schemaname,
        sequencename as sequence_name, 
        last_value
      FROM pg_sequences;
    `);
    console.log("\nSequences State:", sequences);

    // 4. Check actual data in rooms
    const rooms = await AppDataSource.query(
      `SELECT "roomId", "room_number" FROM "rooms" ORDER BY "roomId" ASC;`
    );
    console.log("\nActual Rows in 'rooms':", rooms);

    // 5. Try a manual nextval trace
    const seqNameResult = await AppDataSource.query(
      `SELECT pg_get_serial_sequence('rooms', 'roomId') as seq;`
    );
    const seq = seqNameResult[0].seq;
    if (seq) {
      console.log(`\nAttached sequence for rooms.roomId: ${seq}`);
      const next = await AppDataSource.query(
        `SELECT nextval('${seq}') as val;`
      );
      console.log(`Nextval from ${seq}: ${next[0].val}`);
    } else {
      console.log(
        "\nNo sequence found via pg_get_serial_sequence for rooms.roomId"
      );
    }
  } catch (error) {
    console.error("Diagnostic failed:", error);
  } finally {
    await AppDataSource.destroy();
  }
}

diagnose();
