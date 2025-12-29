export interface RoomDTO {
  roomId: number;
  roomNumber: string;
  roomTypeId: number;
  roomTypeName?: string;
  pricePerNight: number;
  description?: string;
  capacity: number;
  isActive: boolean;
  imageRoom?: string;
}

export interface CreateRoomDTO {
  roomNumber: string;
  roomTypeId: number;
  isActive: boolean;
  imageRoom?: string;
}

export interface UpdateRoomDTO {
  roomNumber: string;
  roomTypeId: number;
  isActive: boolean;
  imageRoom?: string;
}
