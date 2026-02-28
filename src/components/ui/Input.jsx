import { cn } from '../../utils/cn';

export const Input = ({ label, error, hint, icon: Icon, className, ...props }) => (
  <div className="flex flex-col gap-1">
    {label && <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>}
    <div className="relative">
      {Icon && <Icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />}
      <input
        className={cn(
          'w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all',
          Icon && 'pl-9',
          error && 'border-red-500 focus:ring-red-500',
          className
        )}
        {...props}
      />
    </div>
    {error && <span className="text-xs text-red-600 dark:text-red-400">{error}</span>}
    {hint && !error && <span className="text-xs text-gray-500 dark:text-gray-400">{hint}</span>}
  </div>
);

export const Textarea = ({ label, error, className, ...props }) => (
  <div className="flex flex-col gap-1">
    {label && <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>}
    <textarea
      className={cn(
        'w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none',
        error && 'border-red-500',
        className
      )}
      {...props}
    />
    {error && <span className="text-xs text-red-600">{error}</span>}
  </div>
);
