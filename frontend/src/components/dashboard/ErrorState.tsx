import type { ImgHTMLAttributes, JSX } from 'react';
import Error401 from '@/assets/error/Error401';
import Error403 from '@/assets/error/Error403';
import Error404 from '@/assets/error/Error404';
import Error500 from '@/assets/error/Error500';

type ImgComp = (props: ImgHTMLAttributes<HTMLImageElement>) => JSX.Element;

/**
 * Returns the error illustration component matching the given HTTP status code.
 *
 * @param {number} status - HTTP status code.
 * @returns {ImgComp} The matching illustration component.
 */
function getIllustration(status: number): ImgComp {
  switch (status) {
    case 401:  return Error401;
    case 403:  return Error403;
    case 404:  return Error404;
    default:   return Error500;
  }
}

/**
 * Returns a user-friendly label for the given HTTP status code.
 *
 * @param {number} status - HTTP status code.
 * @returns {string} Human-readable error label.
 */
function getErrorLabel(status: number): string {
  switch (status) {
    case 401:  return 'Session expired. Please sign in again.';
    case 403:  return 'You do not have permission to view this.';
    case 404:  return 'Nothing found here.';
    default:   return 'Something went wrong on our end.';
  }
}

interface Props { status: number; message: string }

/**
 * Displays a full-page error illustration with a status label and backend message.
 *
 * @param {Props} props - Component props.
 * @param {number} props.status - HTTP status code used to pick the illustration.
 * @param {string} props.message - Error message from the backend.
 * @returns {JSX.Element} The error state element.
 */
const ErrorState = ({ status, message }: Props) => {
  const Illustration = getIllustration(status);
  return (
    <div className="flex min-h-[55vh] flex-col items-center justify-center gap-4 text-center">
      <Illustration className="h-40 w-auto" />
      <p className="text-sm font-semibold text-quaternary-700 dark:text-gray-200">{getErrorLabel(status)}</p>
      <p className="max-w-xs text-xs text-quaternary-400 dark:text-gray-500">{message}</p>
    </div>
  );
};

export default ErrorState;
