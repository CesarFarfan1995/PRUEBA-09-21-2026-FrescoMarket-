interface FieldErrorProps {
  message?: string;
}

export function FieldError({ message }: FieldErrorProps) {
  if (!message) return null;

  return <p className="mt-1 text-sm text-[#8a3b1c]">{message}</p>;
}

export function inputClass(hasError: boolean): string {
  return hasError
    ? 'mt-1 w-full rounded-lg border border-[#c45c26] bg-white px-3 py-2 outline-none'
    : 'mt-1 w-full rounded-lg border border-[#d9e2d6] bg-white px-3 py-2 outline-none focus:border-[#2f6b4f]';
}
