export interface BookingDto {
  id?: number;
  roomId: number;
  userId: string;
  startDate: string;
  endDate: string;
  totalPrice?: number;
}
