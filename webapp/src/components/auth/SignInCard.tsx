import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

/**
 * Renders a centred white card for authentication UI.
 *
 * @param {Props} props - Component props.
 * @param {ReactNode} props.children - Form content rendered inside the card.
 * @returns {JSX.Element} The sign-in card element.
 */
const SignInCard = ({ children }: Props) => (
  <div className="flex min-h-screen items-center justify-center bg-secondary px-4">
    <div className="w-full max-w-sm rounded-2xl border border-quaternary-200 bg-white p-8 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
      {children}
    </div>
  </div>
);

export default SignInCard;
