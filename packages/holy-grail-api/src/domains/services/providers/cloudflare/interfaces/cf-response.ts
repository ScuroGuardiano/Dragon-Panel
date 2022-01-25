export default interface CloudflareResponse<T> {
  result: T;
  success: boolean;
  errors: { code?: number, message?: string }[];
  messages: { code?: number, message?: string, type?: string }[];
  result_info?: {
    page: number;
    per_page: number;
    count: number;
    total_count: number;
    total_pages?: number;
  }
}
