"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomService = void 0;
const data_source_1 = require("../config/data/data-source");
const Room_1 = require("../models/Room");
const RoomType_1 = require("../models/RoomType");
class RoomService {
    constructor() {
        this.roomRepository = data_source_1.AppDataSource.getRepository(Room_1.Room);
        this.roomTypeRepository = data_source_1.AppDataSource.getRepository(RoomType_1.RoomType);
    }
    async getAllRooms() {
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
    async getRoom(roomId) {
        const room = await this.roomRepository.findOne({
            where: { roomId },
            relations: ["roomType"],
        });
        if (!room)
            return null;
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
    async createRoom(dto) {
        const roomType = await this.roomTypeRepository.findOneBy({
            roomTypeId: dto.roomTypeId,
        });
        if (!roomType)
            return null;
        const room = new Room_1.Room();
        room.roomNumber = dto.roomNumber;
        room.roomTypeId = dto.roomTypeId;
        room.isActive = dto.isActive;
        room.imageRoom = dto.imageRoom;
        const savedRoom = await this.roomRepository.save(room);
        // Re-fetch to get relations
        return this.getRoom(savedRoom.roomId);
    }
    async updateRoom(roomId, dto) {
        const room = await this.roomRepository.findOneBy({ roomId });
        if (!room)
            return null;
        const roomType = await this.roomTypeRepository.findOneBy({
            roomTypeId: dto.roomTypeId,
        });
        if (!roomType)
            return null;
        room.roomNumber = dto.roomNumber;
        room.roomTypeId = dto.roomTypeId;
        room.isActive = dto.isActive;
        room.imageRoom = dto.imageRoom;
        await this.roomRepository.save(room);
        return this.getRoom(roomId);
    }
    async deleteRoom(id) {
        const result = await this.roomRepository.delete(id);
        return result.affected !== 0;
    }
}
exports.RoomService = RoomService;
