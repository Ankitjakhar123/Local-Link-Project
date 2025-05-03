import React, { useState, useEffect } from 'react';
import { FixedSizeList, VariableSizeList } from 'react-window';
import { useIntersectionObserver } from '../utils/performance';

/**
 * VirtualizedList component for efficiently rendering large lists
 * Only renders items that are visible in the viewport
 *
 * @param {Object} props Component props
 * @param {Array} props.items Array of items to render
 * @param {Function} props.renderItem Function to render each item (receives item, index, style)
 * @param {number} props.height Height of the list container
 * @param {number|Function} props.itemSize Fixed size of each item or a function that returns the size of an item at a given index
 * @param {string} props.className Additional CSS classes for the container
 * @param {boolean} props.variableSize Whether items have variable heights
 * @param {number} props.overscan Number of items to render above/below the visible area
 * @param {Object} props.initialScrollOffset Initial scroll offset
 * @returns {React.ReactNode} Virtualized list component
 */
const VirtualizedList = ({
  items = [],
  renderItem,
  height = 400,
  itemSize = 50,
  className = '',
  variableSize = false,
  overscan = 5,
  initialScrollOffset = 0,
}) => {
  const [listHeight, setListHeight] = useState(height);
  const [measurementCache, setMeasurementCache] = useState({});
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  // Observe the container to dynamically set its height
  const containerRef = useIntersectionObserver((entry) => {
    if (entry.isIntersecting) {
      // Wait for any parent transitions to complete
      setTimeout(() => {
        const container = entry.target;
        const parentHeight = container.parentElement?.offsetHeight || height;
        
        // Set list height to parent container height or specified height
        if (height === 'auto' && parentHeight > 0) {
          setListHeight(parentHeight);
        }
      }, 0);
    }
  });
  
  // Update window width on resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Function to get the size of a variable height item
  const getItemSize = (index) => {
    if (typeof itemSize === 'function') {
      return itemSize(index);
    }
    
    // Use cached measurements or default size
    return measurementCache[index] || itemSize;
  };
  
  // Item renderer that passes the virtualization style to the render function
  const itemRenderer = ({ index, style }) => {
    return renderItem(items[index], index, style);
  };
  
  // Empty state when no items are provided
  if (!items.length) {
    return (
      <div 
        ref={containerRef}
        className={`flex items-center justify-center bg-card ${className}`}
        style={{ height: listHeight, width: '100%' }}
      >
        <p className="text-muted-foreground">No items to display</p>
      </div>
    );
  }
  
  // Choose between fixed and variable size list
  const ListComponent = variableSize ? VariableSizeList : FixedSizeList;
  
  return (
    <div
      ref={containerRef}
      className={`virtualizedList-container ${className}`}
    >
      <ListComponent
        height={listHeight}
        width="100%"
        itemCount={items.length}
        itemSize={variableSize ? getItemSize : itemSize}
        overscanCount={overscan}
        initialScrollOffset={initialScrollOffset}
        itemData={items}
      >
        {itemRenderer}
      </ListComponent>
    </div>
  );
};

export default VirtualizedList; 