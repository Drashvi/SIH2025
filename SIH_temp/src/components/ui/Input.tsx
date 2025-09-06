import React, { forwardRef } from 'react'
import clsx from 'clsx'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  variant?: 'default' | 'filled'
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, icon, iconPosition = 'left', variant = 'default', className, ...props }, ref) => {
    const baseInputClasses = 'block w-full rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
    
    const variants = {
      default: 'border border-secondary-300 bg-white focus:border-primary-500 focus:ring-primary-500',
      filled: 'border-0 bg-secondary-100 focus:bg-white focus:ring-primary-500'
    }
    
    const inputClasses = clsx(
      baseInputClasses,
      variants[variant],
      {
        'border-danger-300 focus:border-danger-500 focus:ring-danger-500': error,
        'pl-10': icon && iconPosition === 'left',
        'pr-10': icon && iconPosition === 'right',
        'px-3 py-2 text-sm': true
      },
      className
    )

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-secondary-700 mb-1">
            {label}
          </label>
        )}
        
        <div className="relative">
          {icon && iconPosition === 'left' && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <div className={clsx('text-secondary-400', { 'text-danger-400': error })}>
                {icon}
              </div>
            </div>
          )}
          
          <input
            ref={ref}
            className={inputClasses}
            {...props}
          />
          
          {icon && iconPosition === 'right' && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <div className={clsx('text-secondary-400', { 'text-danger-400': error })}>
                {icon}
              </div>
            </div>
          )}
        </div>
        
        {error && (
          <p className="mt-1 text-sm text-danger-600">{error}</p>
        )}
        
        {hint && !error && (
          <p className="mt-1 text-sm text-secondary-500">{hint}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
