import React from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'

interface CardProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'elevated' | 'outline'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hoverable?: boolean
  onClick?: () => void
}

const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = 'default',
  padding = 'md',
  hoverable = false,
  onClick
}) => {
  const baseClasses = 'bg-white rounded-lg border transition-all duration-200'
  
  const variants = {
    default: 'border-secondary-200 shadow-sm',
    elevated: 'border-secondary-100 shadow-soft',
    outline: 'border-secondary-300 shadow-none'
  }
  
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }

  const cardClasses = clsx(
    baseClasses,
    variants[variant],
    paddingClasses[padding],
    {
      'cursor-pointer hover:shadow-soft-lg hover:border-secondary-300': hoverable || onClick,
    },
    className
  )

  const CardComponent = onClick ? motion.div : 'div'
  const motionProps = onClick ? {
    whileHover: { y: -2 },
    whileTap: { scale: 0.98 }
  } : {}

  return (
    <CardComponent
      className={cardClasses}
      onClick={onClick}
      {...motionProps}
    >
      {children}
    </CardComponent>
  )
}

const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className
}) => (
  <div className={clsx('mb-4', className)}>
    {children}
  </div>
)

const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className
}) => (
  <h3 className={clsx('text-lg font-semibold text-secondary-900', className)}>
    {children}
  </h3>
)

const CardDescription: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className
}) => (
  <p className={clsx('text-sm text-secondary-600 mt-1', className)}>
    {children}
  </p>
)

const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className
}) => (
  <div className={className}>
    {children}
  </div>
)

const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className
}) => (
  <div className={clsx('mt-6 pt-4 border-t border-secondary-100', className)}>
    {children}
  </div>
)

export default Card
export { CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
