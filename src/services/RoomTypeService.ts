import { AppDataSource } from "../config/data/data-source";
import { RoomType } from "../models/RoomType";
import {
  RoomTypeDTO,
  CreateRoomTypeDTO,
  UpdateRoomTypeDTO,
} from "../dtos/room-type.dto";

export class RoomTypeService {
  private roomTypeRepository = AppDataSource.getRepository(RoomType);

  async getAllRoomTypes(): Promise<RoomTypeDTO[]> {
    const roomTypes = await this.roomTypeRepository.find();
    return roomTypes.map((rt) => ({
      roomTypeId: rt.roomTypeId,
      roomTypeName: rt.roomTypeName,
      pricePerNight: Number(rt.pricePerNight),
      description: rt.description,
      capacity: rt.capacity,
    }));
  }

  async getRoomType(roomTypeId: number): Promise<RoomTypeDTO | null> {
    const roomType = await this.roomTypeRepository.findOneBy({ roomTypeId });
    if (!roomType) return null;

    return {
      roomTypeId: roomType.roomTypeId,
      roomTypeName: roomType.roomTypeName,
      pricePerNight: Number(roomType.pricePerNight),
      description: roomType.description,
      capacity: roomType.capacity,
    };
  }

  async createRoomType(dto: CreateRoomTypeDTO): Promise<RoomTypeDTO> {
    const roomType = new RoomType();
    roomType.roomTypeName = dto.roomTypeName;
    roomType.pricePerNight = dto.pricePerNight;
    roomType.description = dto.description;
    roomType.capacity = dto.capacity;

    const savedRoomType = await this.roomTypeRepository.save(roomType);
    return {
      roomTypeId: savedRoomType.roomTypeId,
      roomTypeName: savedRoomType.roomTypeName,
      pricePerNight: Number(savedRoomType.pricePerNight),
      description: savedRoomType.description,
      capacity: savedRoomType.capacity,
    };
  }

  async updateRoomType(id: number, dto: UpdateRoomTypeDTO): Promise<boolean> {
    const roomType = await this.roomTypeRepository.findOneBy({
      roomTypeId: id,
    });
    if (!roomType) return false;

    roomType.roomTypeName = dto.roomTypeName;
    roomType.pricePerNight = dto.pricePerNight;
    roomType.description = dto.description;
    roomType.capacity = dto.capacity;

    await this.roomTypeRepository.save(roomType);
    return true;
  }

  async deleteRoomType(id: number): Promise<boolean> {
    const result = await this.roomTypeRepository.delete(id);
    return result.affected !== 0;
  }
}
