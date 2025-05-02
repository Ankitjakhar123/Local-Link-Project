export const products = [
  // Salon products
  {
    id: 1,
    name: "Hair Serum",
    price: 499,
    rating: 4.5,
    image: "https://images.pexels.com/photos/3735219/pexels-photo-3735219.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    category: "Hair Care",
    description: "Premium hair serum for frizz control and shine. Enriched with argan oil and vitamin E.",
    inStock: true,
    relatedServiceIds: [1]
  },
  {
    id: 2,
    name: "Face Wash",
    price: 299,
    rating: 4.3,
    image: "https://images.pexels.com/photos/3737594/pexels-photo-3737594.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    category: "Skin Care",
    description: "Gentle face wash with natural extracts for all skin types. Removes dirt and excess oil without drying the skin.",
    inStock: true,
    relatedServiceIds: [1]
  },
  {
    id: 3,
    name: "Hair Mask",
    price: 599,
    rating: 4.6,
    image: "https://images.pexels.com/photos/3737586/pexels-photo-3737586.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    category: "Hair Care",
    description: "Deep conditioning hair mask for damaged hair. Restores moisture and repairs split ends.",
    inStock: true,
    relatedServiceIds: [1]
  },
  {
    id: 4,
    name: "Face Scrub",
    price: 399,
    rating: 4.4,
    image: "https://images.pexels.com/photos/4465124/pexels-photo-4465124.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    category: "Skin Care",
    description: "Exfoliating face scrub with walnut particles. Removes dead skin cells and reveals fresh skin.",
    inStock: true,
    relatedServiceIds: [1]
  },
  
  // Appliance repair products
  {
    id: 5,
    name: "AC Filter",
    price: 799,
    rating: 4.4,
    image: "https://images.pexels.com/photos/4108775/pexels-photo-4108775.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    category: "Appliance Parts",
    description: "High-quality AC filter for cleaner air and better efficiency. Compatible with most AC brands.",
    inStock: true,
    relatedServiceIds: [2]
  },
  {
    id: 6,
    name: "Washing Machine Cover",
    price: 399,
    rating: 4.2,
    image: "https://images.pexels.com/photos/4108811/pexels-photo-4108811.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    category: "Appliance Accessories",
    description: "Waterproof and dustproof washing machine cover. Protects your machine from dust and moisture.",
    inStock: true,
    relatedServiceIds: [2]
  },
  
  // Cleaning products
  {
    id: 7,
    name: "All-Purpose Cleaner",
    price: 199,
    rating: 4.6,
    image: "https://images.pexels.com/photos/4108815/pexels-photo-4108815.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    category: "Cleaning Supplies",
    description: "Powerful all-purpose cleaner for multiple surfaces. Removes tough stains and grease.",
    inStock: true,
    relatedServiceIds: [3]
  },
  {
    id: 8,
    name: "Microfiber Cloth Set",
    price: 299,
    rating: 4.7,
    image: "https://images.pexels.com/photos/4108771/pexels-photo-4108771.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    category: "Cleaning Supplies",
    description: "Set of 5 premium microfiber cloths. Perfect for dusting, polishing, and cleaning surfaces without scratches.",
    inStock: true,
    relatedServiceIds: [3]
  },
  {
    id: 9,
    name: "Scrubbing Brushes",
    price: 249,
    rating: 4.5,
    image: "https://images.pexels.com/photos/4108846/pexels-photo-4108846.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    category: "Cleaning Supplies",
    description: "Set of 3 scrubbing brushes with ergonomic handles. Designed for different surfaces and tough stains.",
    inStock: true,
    relatedServiceIds: [3]
  },
  
  // Plumbing products
  {
    id: 10,
    name: "Sink Tap",
    price: 599,
    rating: 4.4,
    image: "https://images.pexels.com/photos/4108701/pexels-photo-4108701.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    category: "Plumbing",
    description: "Modern sink tap with chrome finish. Easy to install and durable.",
    inStock: true,
    relatedServiceIds: [4]
  },
  {
    id: 10,
    name: "Sink Tap",
    price: 599,
    rating: 4.4,
    image: "https://images.pexels.com/photos/4108701/pexels-photo-4108701.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    category: "Plumbing",
    description: "Modern sink tap with chrome finish. Easy to install and durable.",
    inStock: true,
    relatedServiceIds: [4]
  },
  {
    id: 11,
    name: "Shower Head",
    price: 799,
    rating: 4.6,
    image: "https://images.pexels.com/photos/4108732/pexels-photo-4108732.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    category: "Plumbing",
    description: "High-pressure shower head with multiple spray settings. Easy to install and water-saving.",
    inStock: true,
    relatedServiceIds: [4]
  },
  
  // Electrical products
  {
    id: 12,
    name: "LED Bulb Pack",
    price: 499,
    rating: 4.7,
    image: "https://images.pexels.com/photos/4108716/pexels-photo-4108716.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    category: "Electrical",
    description: "Pack of 4 energy-efficient LED bulbs. Long-lasting and bright with warm white light.",
    inStock: true,
    relatedServiceIds: [5]
  },
  {
    id: 13,
    name: "Extension Board",
    price: 399,
    rating: 4.5,
    image: "https://images.pexels.com/photos/4108706/pexels-photo-4108706.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    category: "Electrical",
    description: "6-socket extension board with surge protection. Individual switches for each socket.",
    inStock: true,
    relatedServiceIds: [5]
  },
  
  // Pest control products
  {
    id: 14,
    name: "Mosquito Repellent",
    price: 299,
    rating: 4.3,
    image: "https://images.pexels.com/photos/4108834/pexels-photo-4108834.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    category: "Pest Control",
    description: "Electric mosquito repellent with refills. Safe for children and pets.",
    inStock: true,
    relatedServiceIds: [6]
  },
  {
    id: 15,
    name: "Cockroach Gel",
    price: 199,
    rating: 4.6,
    image: "https://images.pexels.com/photos/4108764/pexels-photo-4108764.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    category: "Pest Control",
    description: "Effective cockroach control gel. Easy to apply in corners and crevices.",
    inStock: true,
    relatedServiceIds: [6]
  }
];

// Helper function to get products related to a service
export const getRelatedProducts = (serviceId) => {
  return products.filter(product => 
    product.relatedServiceIds && product.relatedServiceIds.includes(serviceId)
  );
};

// Helper function to get products by category
export const getProductsByCategory = (category) => {
  return products.filter(product => product.category === category);
};

// Helper function to search products
export const searchProducts = (query) => {
  const searchTerm = query.toLowerCase();
  return products.filter(product => 
    product.name.toLowerCase().includes(searchTerm) || 
    product.description.toLowerCase().includes(searchTerm) ||
    product.category.toLowerCase().includes(searchTerm)
  );
};