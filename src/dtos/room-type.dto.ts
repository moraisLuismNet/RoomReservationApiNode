export interface RoomTypeDTO {
  roomTypeId: number;
  roomTypeName: string;
  pricePerNight: number;
  description?: string;
  capacity: number;
}

export interface CreateRoomTypeDTO {
  roomTypeName: string;
  pricePerNight: number;
  description?: string;
  capacity: number;
}

export interface UpdateRoomTypeDTO {
  roomTypeName: string;
  pricePerNight: number;
  description?: string;
  capacity: number;
}
