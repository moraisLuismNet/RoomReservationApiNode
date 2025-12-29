import { AppDataSource } from "../src/config/data/data-source";
import { User, UserRole } from "../src/models/User";
import { RoomType } from "../src/models/RoomType";
import { Room } from "../src/models/Room";
import {
  ReservationStatus,
  ReservationStatusName,
} from "../src/models/ReservationStatus";

async function seedDatabase() {
  try {
    // Initialize DataSource
    await AppDataSource.initialize();
    console.log("Database connected for seeding...");

    // Seed Users
    const userRepository = AppDataSource.getRepository(User);
    const existingAdmin = await userRepository.findOneBy({
      email: "luis@mail.com",
    });

    if (!existingAdmin) {
      console.log("Seeding admin user...");
      const admin = new User();
      admin.email = "luis@mail.com";
      admin.fullName = "Luis Admin";
      admin.passwordHash = "123456"; // @BeforeInsert should hash this
      admin.role = UserRole.ADMIN;
      admin.isActive = true;
      await userRepository.save(admin);
      console.log("Admin user created.");
    } else {
      console.log("Admin user already exists.");
    }

    // Seed Reservation Statuses
    const statusRepository = AppDataSource.getRepository(ReservationStatus);
    const statuses = Object.values(ReservationStatusName);
    for (const statusName of statuses) {
      const existingStatus = await statusRepository.findOneBy({
        name: statusName,
      });
      if (!existingStatus) {
        console.log(`Seeding reservation status: ${statusName}`);
        const status = new ReservationStatus();
        status.name = statusName;
        await statusRepository.save(status);
      }
    }

    // Seed Room Types
    const roomTypeRepository = AppDataSource.getRepository(RoomType);
    const roomRepository = AppDataSource.getRepository(Room);

    const roomTypes = [
      {
        name: "Single",
        price: 50,
        capacity: 1,
        description: "A comfortable single room",
      },
      {
        name: "Double",
        price: 80,
        capacity: 2,
        description: "A spacious double room",
      },
      {
        name: "Suite",
        price: 150,
        capacity: 4,
        description: "A luxurious suite",
      },
    ];

    for (const typeData of roomTypes) {
      // Check by roomTypeName
      let roomType = await roomTypeRepository.findOneBy({
        roomTypeName: typeData.name,
      });
      if (!roomType) {
        console.log(`Creating room type: ${typeData.name}`);
        roomType = new RoomType();
        roomType.roomTypeName = typeData.name;
        roomType.pricePerNight = typeData.price;
        roomType.capacity = typeData.capacity;
        roomType.description = typeData.description;
        await roomTypeRepository.save(roomType);
      }

      // Seed Rooms for this type
      const existingRooms = await roomRepository.countBy({
        roomTypeId: roomType.roomTypeId,
      });
      if (existingRooms === 0) {
        console.log(`Seeding rooms for ${typeData.name}...`);
        for (let i = 1; i <= 5; i++) {
          const room = new Room();
          // Room Number: S101, D101, etc.
          room.roomNumber = `${typeData.name.substring(0, 1).toUpperCase()}${
            100 + i
          }`;
          room.roomType = roomType;
          room.isActive = true;
          // Room does not have price or status fields directly in this schema
          await roomRepository.save(room);
        }
      }
    }

    console.log("Database seeding completed.");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await AppDataSource.destroy();
  }
}

seedDatabase();
