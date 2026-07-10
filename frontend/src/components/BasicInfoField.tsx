import type { InputHTMLAttributes, SelectHTMLAttributes } from 'react';

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function TextField({ label, className, ...props }: TextFieldProps) {
  return (
    <div className="flex items-center space-x-2">
      <label className="w-20 text-xs text-gray-400 bg-[#222222] py-1 px-2 text-center rounded border border-gray-700 shrink-0">
        {label}
      </label>
      <input
        type="text"
        className={`flex-1 bg-[#333333] border-none rounded py-1 px-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#e74c3c] ${className ?? ''}`}
        {...props}
      />
    </div>
  );
}

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: readonly string[];
}

export function SelectField({ label, options, className, ...props }: SelectFieldProps) {
  return (
    <div className="flex items-center space-x-2">
      <label className="w-20 text-xs text-gray-400 bg-[#222222] py-1 px-2 text-center rounded border border-gray-700 shrink-0">
        {label}
      </label>
      <select
        className={`flex-1 bg-[#333333] border-none rounded py-1 px-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#e74c3c] ${className ?? ''}`}
        {...props}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}
