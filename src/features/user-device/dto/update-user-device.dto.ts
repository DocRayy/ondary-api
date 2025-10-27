export class UpdateUserDeviceDto {
  user_id: number;
  token: string;
  retry_total: number;
  label: string;
  is_active: boolean;
}
