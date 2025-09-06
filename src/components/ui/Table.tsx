import React from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'

interface Column<T = any> {
  key: string
  title: string
  sortable?: boolean
  width?: string
  render?: (value: any, record: T) => React.ReactNode
}

interface TableProps<T = any> {
  data: T[]
  columns: Column<T>[]
  loading?: boolean
  emptyText?: string
  onSort?: (key: string, direction: 'asc' | 'desc') => void
  sortConfig?: { key: string; direction: 'asc' | 'desc' }
  className?: string
}

const Table = <T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  emptyText = 'No data available',
  onSort,
  sortConfig,
  className
}: TableProps<T>) => {
  const handleSort = (key: string) => {
    if (!onSort) return
    
    const direction = sortConfig?.key === key && sortConfig?.direction === 'asc' ? 'desc' : 'asc'
    onSort(key, direction)
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-soft overflow-hidden">
        <div className="animate-pulse">
          <div className="bg-secondary-50 px-6 py-4">
            <div className="flex space-x-4">
              {columns.map((_, index) => (
                <div key={index} className="h-4 bg-secondary-200 rounded flex-1"></div>
              ))}
            </div>
          </div>
          <div className="divide-y divide-secondary-200">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="px-6 py-4">
                <div className="flex space-x-4">
                  {columns.map((_, colIndex) => (
                    <div key={colIndex} className="h-4 bg-secondary-100 rounded flex-1"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={clsx('bg-white rounded-lg shadow-soft overflow-hidden', className)}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-secondary-200">
          <thead className="bg-secondary-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={clsx(
                    'px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider',
                    {
                      'cursor-pointer hover:bg-secondary-100 transition-colors': column.sortable,
                    }
                  )}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    <span>{column.title}</span>
                    {column.sortable && (
                      <div className="flex flex-col">
                        <motion.div
                          animate={{
                            opacity: sortConfig?.key === column.key && sortConfig?.direction === 'asc' ? 1 : 0.3
                          }}
                          className="w-0 h-0 border-l-2 border-r-2 border-b-2 border-transparent border-b-secondary-400"
                        />
                        <motion.div
                          animate={{
                            opacity: sortConfig?.key === column.key && sortConfig?.direction === 'desc' ? 1 : 0.3
                          }}
                          className="w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-secondary-400"
                        />
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-secondary-200">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center text-secondary-500"
                >
                  {emptyText}
                </td>
              </tr>
            ) : (
              data.map((record, rowIndex) => (
                <motion.tr
                  key={rowIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: rowIndex * 0.05 }}
                  className="hover:bg-secondary-50 transition-colors"
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900"
                    >
                      {column.render
                        ? column.render(record[column.key], record)
                        : record[column.key]
                      }
                    </td>
                  ))}
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Table
export type { Column, TableProps }
