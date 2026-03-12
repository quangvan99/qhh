"use client"

import { useState, useId } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface AppSelectProps {
  label?: string
  error?: string
  options: SelectOption[]
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  searchable?: boolean
  required?: boolean
  disabled?: boolean
  className?: string
  id?: string
}

export function AppSelect({
  label, error, options, value, onChange, placeholder = "Chọn...", searchable,
  required, disabled, className, id,
}: AppSelectProps) {
  const [open, setOpen] = useState(false)
  const generatedId = useId()
  const inputId = id || generatedId
  const errorId = `${inputId}-error`

  const selectedLabel = options.find((o) => o.value === value)?.label

  if (searchable) {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <Label htmlFor={inputId} className="text-sm font-medium">
            {label}
            {required && <span className="ml-1 text-destructive" aria-hidden="true">*</span>}
          </Label>
        )}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger
            render={
              <button
                type="button"
                id={inputId}
                role="combobox"
                aria-controls={`${inputId}-listbox`}
                aria-expanded={open}
                aria-required={required}
                aria-invalid={!!error}
                aria-describedby={error ? errorId : undefined}
                disabled={disabled}
                className={cn(
                  "inline-flex min-h-[44px] w-full items-center justify-between rounded-lg border border-input bg-background px-2.5 py-2 text-sm cursor-pointer font-normal transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50",
                  !value && "text-muted-foreground",
                  error && "border-destructive",
                  className
                )}
              />
            }
          >
            {selectedLabel ?? placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <Command>
              <CommandInput placeholder="Tìm kiếm..." />
              <CommandList id={`${inputId}-listbox`}>
                <CommandEmpty>Không tìm thấy kết quả.</CommandEmpty>
                <CommandGroup>
                  {options.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.label}
                      disabled={option.disabled}
                      onSelect={() => {
                        onChange?.(option.value)
                        setOpen(false)
                      }}
                    >
                      <Check className={cn("mr-2 h-4 w-4", value === option.value ? "opacity-100" : "opacity-0")} />
                      {option.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        {error && <p id={errorId} role="alert" className="text-sm text-destructive">{error}</p>}
      </div>
    )
  }

  const handleValueChange = (val: string | null) => {
    if (val !== null) {
      onChange?.(val)
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <Label htmlFor={inputId} className="text-sm font-medium">
          {label}
          {required && <span className="ml-1 text-destructive" aria-hidden="true">*</span>}
        </Label>
      )}
      <Select value={value} onValueChange={handleValueChange} disabled={disabled} required={required}>
        <SelectTrigger
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={cn("min-h-[44px] cursor-pointer", error && "border-destructive", className)}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p id={errorId} role="alert" className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
