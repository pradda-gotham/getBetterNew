"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  validate?: (value: string) => string | undefined;
}

export function FormField({
  label,
  error,
  validate,
  className,
  onChange,
  onBlur,
  ...props
}: FormFieldProps) {
  const [validationError, setValidationError] = useState<string>();
  const [isDirty, setIsDirty] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsDirty(true);
    if (validate) {
      const error = validate(e.target.value);
      setValidationError(error);
    }
    onChange?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (validate && !validationError) {
      const error = validate(e.target.value);
      setValidationError(error);
    }
    onBlur?.(e);
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input
        className={cn(
          validationError && isDirty && "border-destructive",
          className
        )}
        onChange={handleChange}
        onBlur={handleBlur}
        {...props}
      />
      {validationError && isDirty && (
        <p className="text-sm text-destructive">{validationError}</p>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}