import { AppDataSource } from "../config/data/data-source";
import { Room } from "../models/Room";
import { RoomType } from "../models/RoomType";
import { RoomDTO, CreateRoomDTO, UpdateRoomDTO } from "../dtos";

export class RoomService {
  private roomRepository = AppDataSource.getRepository(Room);
  private roomTypeRepository = AppDataSource.getRepository(RoomType);

  async getAllRooms(): Promise<RoomDTO[]> {
    const rooms = await this.roomRepository.find({
      relations: ["roomType"],
    });

    return rooms.map((r) => ({
      roomId: r.roomId,
      roomNumber: r.roomNumber,
      roomTypeId: r.roomTypeId,
      roomTypeName: r.roomType.roomTypeName,
      pricePerNight: Number(r.roomType.pricePerNight),
      description: r.roomType.description,
      capacity: r.roomType.capacity,
      isActive: r.isActive,
      imageRoom: r.imageRoom,
    }));
  }

  async getRoom(roomId: number): Promise<RoomDTO | null> {
    const room = await this.roomRepository.findOne({
      where: { roomId },
      relations: ["roomType"],
    });

    if (!room) return null;

    return {
      roomId: room.roomId,
      roomNumber: room.roomNumber,
      roomTypeId: room.roomTypeId,
      roomTypeName: room.roomType.roomTypeName,
      pricePerNight: Number(room.roomType.pricePerNight),
      description: room.roomType.description,
      capacity: room.roomType.capacity,
      isActive: room.isActive,
      imageRoom: room.imageRoom,
    };
  }

  async createRoom(dto: CreateRoomDTO): Promise<RoomDTO | null> {
    const roomType = await this.roomTypeRepository.findOneBy({
      roomTypeId: dto.roomTypeId,
    });
    if (!roomType) return null;

    const room = new Room();
    room.roomNumber = dto.roomNumber;
    room.roomTypeId = dto.roomTypeId;
    room.isActive = dto.isActive;
    room.imageRoom = dto.imageRoom;

    const savedRoom = await this.roomRepository.save(room);

    // Re-fetch to get relations
    return this.getRoom(savedRoom.roomId);
  }

  async updateRoom(
    roomId: number,
    dto: UpdateRoomDTO
  ): Promise<RoomDTO | null> {
    const room = await this.roomRepository.findOneBy({ roomId });
    if (!room) return null;

    const roomType = await this.roomTypeRepository.findOneBy({
      roomTypeId: dto.roomTypeId,
    });
    if (!roomType) return null;

    room.roomNumber = dto.roomNumber;
    room.roomTypeId = dto.roomTypeId;
    room.isActive = dto.isActive;
    room.imageRoom = dto.imageRoom;

    await this.roomRepository.save(room);
    return this.getRoom(roomId);
  }

  async deleteRoom(id: number): Promise<boolean> {
    const result = await this.roomRepository.delete(id);
    return result.affected !== 0;
  }
}
