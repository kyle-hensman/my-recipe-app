export class ServiceResponseDto<T> {
  success: boolean;
  error: Error | null;
  data: T | null;
  page?: number | undefined;
  count?: number | undefined;
}
