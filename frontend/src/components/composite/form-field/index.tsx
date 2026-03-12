import { useFormContext } from 'react-hook-form'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

export interface FormFieldProps {
  name: string
  label?: string
  required?: boolean
  description?: string
  children: React.ReactNode
  className?: string
}

export function FormField({ name, label, required, description, children, className }: FormFieldProps) {
  // Works both with and without FormProvider context
  let error: string | undefined
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { formState } = useFormContext()
    const fieldError = formState.errors[name]
    error = fieldError?.message as string | undefined
  } catch {
    // No FormProvider — render without error binding
  }

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <Label htmlFor={name} className="text-sm font-medium">
          {label}
          {required && <span className="ml-1 text-destructive" aria-hidden="true">*</span>}
        </Label>
      )}
      {children}
      {description && !error && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      {error && (
        <p role="alert" className="text-sm text-destructive">{error}</p>
      )}
    </div>
  )
}
