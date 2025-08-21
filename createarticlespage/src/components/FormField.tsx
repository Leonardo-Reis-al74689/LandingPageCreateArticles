"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"

interface FormFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "number" | "textarea";
  className?: string;
  min?: string;
  max?: string;
  step?: string;
  rows?: number;
  maxLength?: number;
}

export const FormField = React.memo(({ 
  label, 
  value, 
  onChange, 
  placeholder = "", 
  type = "text",
  className = "w-full",
  min,
  max,
  step,
  rows = 3,
  maxLength
}: FormFieldProps) => {
  const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e.target.value);
  }, [onChange]);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
        {label}
      </label>
      {type === "textarea" ? (
        <textarea
          className="w-full p-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
          rows={rows}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          maxLength={maxLength}
        />
      ) : (
        <Input
          value={value}
          onChange={handleChange}
          className={className}
          placeholder={placeholder}
          type={type}
          min={min}
          max={max}
          step={step}
          maxLength={maxLength}
        />
      )}
    </div>
  );
});

FormField.displayName = "FormField";
