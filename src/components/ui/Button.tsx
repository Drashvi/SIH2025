import React from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  children: React.ReactNode
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  children,
  className,
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'
  
  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus-visible:ring-primary-600 shadow-sm hover:shadow-md',
    secondary: 'bg-secondary-100 text-secondary-900 hover:bg-secondary-200 focus-visible:ring-secondary-600 shadow-sm',
    outline: 'border border-secondary-300 bg-transparent hover:bg-secondary-50 focus-visible:ring-secondary-600 text-secondary-700',
    ghost: 'text-secondary-700 hover:bg-secondary-100 focus-visible:ring-secondary-600',
    danger: 'bg-danger-600 text-white hover:bg-danger-700 focus-visible:ring-danger-600 shadow-sm hover:shadow-md'
  }
  
  const sizes = {
    sm: 'h-8 px-3 text-xs gap-1.5',
    md: 'h-10 px-4 text-sm gap-2',
    lg: 'h-12 px-6 text-base gap-2.5'
  }

  const buttonClasses = clsx(
    baseClasses,
    variants[variant],
    sizes[size],
    className
  )

  const renderIcon = () => {
    if (loading) {
      return (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className={clsx('rounded-full border-2 border-current border-t-transparent', {
            'w-3 h-3': size === 'sm',
            'w-4 h-4': size === 'md',
            'w-5 h-5': size === 'lg'
          })}
        />
      )
    }
    return icon
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={buttonClasses}
      disabled={disabled || loading}
      type={props.type}
      onClick={props.onClick}
      onSubmit={props.onSubmit}
      form={props.form}
      formAction={props.formAction}
      style={props.style}
      id={props.id}
      name={props.name}
      value={props.value}
      autoFocus={props.autoFocus}
      tabIndex={props.tabIndex}
    >
      {iconPosition === 'left' && renderIcon()}
      {children}
      {iconPosition === 'right' && renderIcon()}
    </motion.button>
  )
}

export default Button
