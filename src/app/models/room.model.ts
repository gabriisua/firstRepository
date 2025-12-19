export interface Room {
  id?: number;
  name: string;
  beds: number;
  pricePerNight: number;
  imagePath?: string; // campo restituito dal backend
}
