import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';

const DashboardCard = ({ 
  title, 
  value, 
  icon, 
  change, 
  description, 
  loading = false,
  variant = 'default', // default, success, warning, error, info
  chart = null // Optional chart component
}) => {
  // Determine if change is positive, negative or neutral
  const isPositive = change && change.includes('+');
  const isNegative = change && change.includes('-');
  const isNeutral = change && !isPositive && !isNegative;

  // Get color based on variant
  const getVariantClasses = () => {
    switch (variant) {
      case 'success':
        return {
          background: 'bg-success/10',
          text: 'text-success',
          icon: 'text-success',
          border: 'border-success/20',
          hover: 'hover:border-success/40',
          shadow: 'shadow-success/10'
        };
      case 'warning':
        return {
          background: 'bg-warning/10',
          text: 'text-warning',
          icon: 'text-warning',
          border: 'border-warning/20',
          hover: 'hover:border-warning/40',
          shadow: 'shadow-warning/10'
        };
      case 'error':
        return {
          background: 'bg-error/10',
          text: 'text-error',
          icon: 'text-error',
          border: 'border-error/20',
          hover: 'hover:border-error/40',
          shadow: 'shadow-error/10'
        };
      case 'info':
        return {
          background: 'bg-info/10',
          text: 'text-info',
          icon: 'text-info',
          border: 'border-info/20',
          hover: 'hover:border-info/40',
          shadow: 'shadow-info/10'
        };
      default:
        return {
          background: 'bg-primary/10',
          text: 'text-primary',
          icon: 'text-primary',
          border: 'border-primary/20',
          hover: 'hover:border-primary/40',
          shadow: 'shadow-primary/10'
        };
    }
  };

  const variantClasses = getVariantClasses();

  // Get change text color
  const getChangeTextColor = () => {
    if (isPositive) return 'text-success';
    if (isNegative) return 'text-error';
    return 'text-muted-foreground';
  };

  return (
    <motion.div 
      className={`bg-card rounded-xl border ${variantClasses.border} ${variantClasses.hover} transition-all p-6 shadow-md ${variantClasses.shadow}`}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="flex justify-between">
            <div className="h-4 bg-muted/40 rounded w-1/4"></div>
            <div className="h-8 w-8 rounded-lg bg-muted/40"></div>
          </div>
          <div className="h-8 bg-muted/40 rounded w-1/2"></div>
          <div className="h-4 bg-muted/40 rounded w-3/4"></div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
            <div className={`p-2 rounded-lg ${variantClasses.background}`}>
              <span className={variantClasses.icon}>
                {icon}
              </span>
            </div>
          </div>
          
          <div className="flex items-baseline mb-3">
            <h2 className="text-2xl font-bold">{value}</h2>
            {change && (
              <div className={`ml-2 flex items-center text-xs font-medium ${getChangeTextColor()}`}>
                {isPositive && <ArrowUpIcon size={12} className="mr-0.5" />}
                {isNegative && <ArrowDownIcon size={12} className="mr-0.5" />}
                <span>{change}</span>
              </div>
            )}
          </div>
          
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
          
          {chart && (
            <div className="mt-4">
              {chart}
            </div>
          )}
        </>
      )}
    </motion.div>
  );
};

export default DashboardCard; 