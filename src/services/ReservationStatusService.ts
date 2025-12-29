import { AppDataSource } from "../config/data/data-source";
import {
  ReservationStatus,
  ReservationStatusName,
} from "../models/ReservationStatus";
import {
  ReservationStatusDTO,
  CreateReservationStatusDTO,
  UpdateReservationStatusDTO,
} from "../dtos/reservation-status.dto";

export class ReservationStatusService {
  private repository = AppDataSource.getRepository(ReservationStatus);

  async getAllReservationStatuses(): Promise<ReservationStatusDTO[]> {
    const statuses = await this.repository.find();
    return statuses.map((s) => ({
      statusId: s.statusId,
      name: s.name as string,
    }));
  }

  async getReservationStatus(
    statusId: number
  ): Promise<ReservationStatusDTO | null> {
    const status = await this.repository.findOneBy({ statusId });
    if (!status) return null;
    return {
      statusId: status.statusId,
      name: status.name as string,
    };
  }

  async createReservationStatus(
    dto: CreateReservationStatusDTO
  ): Promise<ReservationStatusDTO> {
    const status = new ReservationStatus();
    status.name = dto.name as ReservationStatusName;
    const saved = await this.repository.save(status);
    return {
      statusId: saved.statusId,
      name: saved.name as string,
    };
  }

  async updateReservationStatus(
    statusId: number,
    dto: UpdateReservationStatusDTO
  ): Promise<boolean> {
    const status = await this.repository.findOneBy({ statusId });
    if (!status) return false;
    status.name = dto.name as ReservationStatusName;
    await this.repository.save(status);
    return true;
  }

  async deleteReservationStatus(statusId: number): Promise<boolean> {
    const result = await this.repository.delete(statusId);
    return result.affected !== 0;
  }
}
