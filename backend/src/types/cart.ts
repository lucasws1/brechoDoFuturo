export interface CartValidationResult {
  success: boolean;
  data?: any;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface StockValidationError {
  available: number;
  requested: number;
  productId: string;
  productName: string;
}
