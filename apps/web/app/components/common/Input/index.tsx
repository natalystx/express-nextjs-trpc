"use client";

import { cn } from "../../../utils/cn";
import React, { forwardRef, useId } from "react";

type InputProps = {
  label: string;
  wrapperClassName?: string;
  hint?: string;
  placedIcon?: "start" | "end";
  hasError?: boolean;
  icon?: React.ReactNode;
  inputClassName?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      wrapperClassName,
      hint,
      icon,
      placedIcon = "start",
      hasError,
      className,
      placeholder,
      inputClassName,
      ...props
    },
    ref
  ) => {
    const id = useId();
    return (
      <div className={cn("flex flex-col", wrapperClassName)}>
        <label className="prose label text-base" htmlFor={id}>
          {label}
        </label>

        <div className={cn("label input input-bordered w-full", className)}>
          {placedIcon === "start" && icon}
          <input
            {...props}
            ref={ref}
            className={cn("grow", inputClassName)}
            id={id}
            placeholder={placeholder}
          />
          {placedIcon === "end" && icon}
        </div>
        {
          <p className="prose h-2 pt-1 text-xs text-error">
            {hasError && hint}
          </p>
        }
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
