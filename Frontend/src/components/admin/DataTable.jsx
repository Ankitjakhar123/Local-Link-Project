import React, { useState, useEffect } from 'react';
import { 
  ChevronDown, ChevronUp, Search, Filter, MoreHorizontal, 
  ArrowLeft, ArrowRight, CheckCircle, XCircle, ChevronLeft, ChevronRight
} from 'lucide-react';

const DataTable = ({
  columns,
  data,
  title,
  description,
  loading = false,
  pagination = true,
  searchable = true,
  filterable = true,
  selectable = false,
  actions = null,
  onRowClick = null,
  emptyMessage = "No data available",
  itemsPerPageOptions = [10, 25, 50, 100]
}) => {
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(itemsPerPageOptions[0]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [filters, setFilters] = useState({});
  const [activeFilters, setActiveFilters] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  
  // Reset pagination when search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeFilters]);
  
  // Handle sorting
  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  // Apply sorting, filtering, and pagination
  const processedData = React.useMemo(() => {
    let filtered = [...data];
    
    // Apply search filter
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(item => {
        return columns.some(column => {
          const value = item[column.accessor];
          return value && String(value).toLowerCase().includes(lowercasedQuery);
        });
      });
    }
    
    // Apply active filters
    if (activeFilters.length > 0) {
      filtered = filtered.filter(item => {
        return activeFilters.every(filter => {
          if (typeof filter.value === 'function') {
            return filter.value(item[filter.key]);
          }
          return item[filter.key] === filter.value;
        });
      });
    }
    
    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return filtered;
  }, [data, searchQuery, activeFilters, sortConfig.key, sortConfig.direction, columns]);
  
  // Paginate data
  const paginatedData = React.useMemo(() => {
    if (!pagination) return processedData;
    
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return processedData.slice(start, end);
  }, [processedData, currentPage, itemsPerPage, pagination]);
  
  // Calculate total pages
  const totalPages = Math.ceil(processedData.length / itemsPerPage);
  
  // Handle select all rows
  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedRows([]);
    } else {
      setSelectedRows(paginatedData.map(row => row.id));
    }
    setIsAllSelected(!isAllSelected);
  };
  
  // Handle row selection
  const handleSelectRow = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };
  
  // Handle pagination
  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };
  
  // Add a filter
  const addFilter = (filter) => {
    setActiveFilters([...activeFilters, filter]);
    setShowFilters(false);
  };
  
  // Remove a filter
  const removeFilter = (index) => {
    const newFilters = [...activeFilters];
    newFilters.splice(index, 1);
    setActiveFilters(newFilters);
  };
  
  // Clear all filters
  const clearFilters = () => {
    setActiveFilters([]);
    setSearchQuery('');
  };

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
      {/* Table header */}
      {(title || searchable || filterable || actions) && (
        <div className="p-4 border-b border-border">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              {title && <h2 className="text-lg font-semibold">{title}</h2>}
              {description && <p className="text-sm text-muted-foreground">{description}</p>}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 md:ml-auto">
              {searchable && (
                <div className="relative flex-1 min-w-[200px]">
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full py-2 pl-10 pr-4 border border-border rounded-lg bg-background/50 focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
                  />
                </div>
              )}
              
              {filterable && (
                <div className="relative">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="px-4 py-2 border border-border rounded-lg bg-background/50 hover:bg-background flex items-center gap-2"
                  >
                    <Filter size={16} />
                    <span>Filter</span>
                    {activeFilters.length > 0 && (
                      <span className="ml-1 bg-primary text-white text-xs px-2 py-0.5 rounded-full">
                        {activeFilters.length}
                      </span>
                    )}
                  </button>
                  
                  {showFilters && (
                    <div className="absolute right-0 mt-2 w-72 bg-card rounded-lg border border-border shadow-lg z-10 p-3">
                      <h3 className="text-sm font-medium mb-2">Filter by</h3>
                      <div className="space-y-3">
                        {columns
                          .filter(column => column.filterable)
                          .map(column => (
                            <div key={column.accessor} className="space-y-1">
                              <label className="text-xs font-medium text-muted-foreground">
                                {column.header}
                              </label>
                              {column.filterType === 'select' ? (
                                <select
                                  className="w-full p-2 text-sm border border-border rounded bg-background"
                                  onChange={(e) => {
                                    if (e.target.value) {
                                      addFilter({
                                        key: column.accessor,
                                        value: e.target.value,
                                        label: `${column.header}: ${e.target.value}`
                                      });
                                    }
                                  }}
                                >
                                  <option value="">Select {column.header}</option>
                                  {column.filterOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                      {option.label}
                                    </option>
                                  ))}
                                </select>
                              ) : (
                                <input
                                  type={column.filterType || 'text'}
                                  placeholder={`Filter by ${column.header}`}
                                  className="w-full p-2 text-sm border border-border rounded bg-background"
                                  onChange={(e) => {
                                    setFilters({
                                      ...filters,
                                      [column.accessor]: e.target.value
                                    });
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter' && filters[column.accessor]) {
                                      addFilter({
                                        key: column.accessor,
                                        value: filters[column.accessor],
                                        label: `${column.header}: ${filters[column.accessor]}`
                                      });
                                    }
                                  }}
                                />
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {actions && (
                <div className="ml-2">
                  {actions}
                </div>
              )}
            </div>
          </div>
          
          {/* Active filters */}
          {activeFilters.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2 items-center">
              <span className="text-xs text-muted-foreground">Active filters:</span>
              {activeFilters.map((filter, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary"
                >
                  <span>{filter.label}</span>
                  <button
                    onClick={() => removeFilter(index)}
                    className="hover:text-primary/70"
                  >
                    <XCircle size={14} />
                  </button>
                </div>
              ))}
              <button
                onClick={clearFilters}
                className="text-xs text-primary hover:underline ml-2"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* Loading state */}
      {loading ? (
        <div className="py-32 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/30 border-y border-border">
                  {selectable && (
                    <th className="py-3 px-4 text-left">
                      <input
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={handleSelectAll}
                        className="rounded border-border text-primary focus:ring-primary"
                      />
                    </th>
                  )}
                  {columns.map((column) => (
                    <th
                      key={column.accessor}
                      className={`py-3 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider ${
                        column.sortable ? 'cursor-pointer hover:bg-muted/50' : ''
                      }`}
                      onClick={() => column.sortable && handleSort(column.accessor)}
                    >
                      <div className="flex items-center space-x-1">
                        <span>{column.header}</span>
                        {column.sortable && (
                          <div className="flex flex-col">
                            <ChevronUp
                              size={12}
                              className={`${
                                sortConfig.key === column.accessor && sortConfig.direction === 'ascending'
                                  ? 'text-primary'
                                  : 'text-muted-foreground/30'
                              }`}
                            />
                            <ChevronDown
                              size={12}
                              className={`${
                                sortConfig.key === column.accessor && sortConfig.direction === 'descending'
                                  ? 'text-primary'
                                  : 'text-muted-foreground/30'
                              } -mt-1`}
                            />
                          </div>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginatedData.length > 0 ? (
                  paginatedData.map((row, rowIndex) => (
                    <tr
                      key={row.id}
                      className={`${
                        onRowClick ? 'cursor-pointer hover:bg-muted/20' : 'hover:bg-muted/10'
                      } ${selectedRows.includes(row.id) ? 'bg-primary/5' : ''}`}
                      onClick={() => onRowClick && onRowClick(row)}
                    >
                      {selectable && (
                        <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={selectedRows.includes(row.id)}
                            onChange={() => handleSelectRow(row.id)}
                            className="rounded border-border text-primary focus:ring-primary"
                          />
                        </td>
                      )}
                      {columns.map((column) => (
                        <td key={column.accessor} className="py-3 px-4">
                          {column.cell ? column.cell(row) : row[column.accessor]}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={columns.length + (selectable ? 1 : 0)}
                      className="py-16 text-center text-muted-foreground"
                    >
                      {emptyMessage}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {pagination && processedData.length > 0 && (
            <div className="py-3 px-4 border-t border-border flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
              <div className="text-sm text-muted-foreground">
                Showing <span className="font-medium">{Math.min((currentPage - 1) * itemsPerPage + 1, processedData.length)}</span> to{' '}
                <span className="font-medium">{Math.min(currentPage * itemsPerPage, processedData.length)}</span> of{' '}
                <span className="font-medium">{processedData.length}</span> results
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2 mr-4">
                  <span className="text-sm text-muted-foreground">Rows per page</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                    className="py-1 px-2 border border-border rounded bg-background text-sm"
                  >
                    {itemsPerPageOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => goToPage(1)}
                    disabled={currentPage === 1}
                    className="p-1 rounded hover:bg-muted/30 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-1 rounded hover:bg-muted/30 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ArrowLeft size={16} />
                  </button>
                  
                  <span className="px-2 py-1 text-sm">
                    Page <span className="font-medium">{currentPage}</span> of{' '}
                    <span className="font-medium">{totalPages}</span>
                  </span>
                  
                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-1 rounded hover:bg-muted/30 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ArrowRight size={16} />
                  </button>
                  <button
                    onClick={() => goToPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="p-1 rounded hover:bg-muted/30 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DataTable; 