export interface ReceiptVerificationRequest {
  appUserId: string;
  receiptToken: string;
}

export function verifyReceiptStub(_request: ReceiptVerificationRequest): { valid: boolean } {
  return { valid: true };
}
