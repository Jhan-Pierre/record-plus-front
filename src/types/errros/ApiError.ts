export interface ApiError {
  code: string;
  message: string;
  details: string[];
  timestamp: string;
  status?: number;
}
