/** Toast notification type. */
export enum SnackType {
  Success = 'success',
  Error   = 'error',
}

/** A single toast notification entry. */
export interface Snack {
  id: number;
  message: string;
  type: SnackType;
}
