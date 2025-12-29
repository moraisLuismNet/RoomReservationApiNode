"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomTypeService = void 0;
const data_source_1 = require("../config/data/data-source");
const RoomType_1 = require("../models/RoomType");
class RoomTypeService {
    constructor() {
        this.roomTypeRepository = data_source_1.AppDataSource.getRepository(RoomType_1.RoomType);
    }
    async getAllRoomTypes() {
        const roomTypes = await this.roomTypeRepository.find();
        return roomTypes.map((rt) => ({
            roomTypeId: rt.roomTypeId,
            roomTypeName: rt.roomTypeName,
            pricePerNight: Number(rt.pricePerNight),
            description: rt.description,
            capacity: rt.capacity,
        }));
    }
    async getRoomType(roomTypeId) {
        const roomType = await this.roomTypeRepository.findOneBy({ roomTypeId });
        if (!roomType)
            return null;
        return {
            roomTypeId: roomType.roomTypeId,
            roomTypeName: roomType.roomTypeName,
            pricePerNight: Number(roomType.pricePerNight),
            description: roomType.description,
            capacity: roomType.capacity,
        };
    }
    async createRoomType(dto) {
        const roomType = new RoomType_1.RoomType();
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
    async updateRoomType(id, dto) {
        const roomType = await this.roomTypeRepository.findOneBy({
            roomTypeId: id,
        });
        if (!roomType)
            return false;
        roomType.roomTypeName = dto.roomTypeName;
        roomType.pricePerNight = dto.pricePerNight;
        roomType.description = dto.description;
        roomType.capacity = dto.capacity;
        await this.roomTypeRepository.save(roomType);
        return true;
    }
    async deleteRoomType(id) {
        const result = await this.roomTypeRepository.delete(id);
        return result.affected !== 0;
    }
}
exports.RoomTypeService = RoomTypeService;
