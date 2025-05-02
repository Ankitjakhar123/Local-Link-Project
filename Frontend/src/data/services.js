export const services = [
  {
    id: 1,
    name: "Salon at Home",
    description: "Professional salon services delivered at your home",
    image: "https://images.pexels.com/photos/3992874/pexels-photo-3992874.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    categories: [
      {
        id: 101,
        name: "Women's Salon",
        services: [
          { id: 1001, name: "Haircut", price: 599, duration: "45 min", rating: 4.8 },
          { id: 1002, name: "Hair Spa", price: 999, duration: "60 min", rating: 4.9 },
          { id: 1003, name: "Manicure", price: 499, duration: "30 min", rating: 4.7 },
          { id: 1004, name: "Pedicure", price: 599, duration: "45 min", rating: 4.8 },
          { id: 1005, name: "Facial", price: 1299, duration: "60 min", rating: 4.9 }
        ]
      },
      {
        id: 102,
        name: "Men's Salon",
        services: [
          { id: 1006, name: "Haircut", price: 299, duration: "30 min", rating: 4.6 },
          { id: 1007, name: "Shave", price: 199, duration: "20 min", rating: 4.5 },
          { id: 1008, name: "Facial", price: 799, duration: "45 min", rating: 4.7 },
          { id: 1009, name: "Hair Color", price: 699, duration: "45 min", rating: 4.6 }
        ]
      }
    ],
    relatedProducts: [
      { id: 2001, name: "Hair Serum", price: 499, rating: 4.5, image: "https://images.pexels.com/photos/3735219/pexels-photo-3735219.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
      { id: 2002, name: "Face Wash", price: 299, rating: 4.3, image: "https://images.pexels.com/photos/3737594/pexels-photo-3737594.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
      { id: 2003, name: "Hair Mask", price: 599, rating: 4.6, image: "https://images.pexels.com/photos/3737586/pexels-photo-3737586.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" }
    ]
  },
  {
    id: 2,
    name: "Appliance Repair",
    description: "Expert repair services for all your home appliances",
    image: "https://images.pexels.com/photos/4108719/pexels-photo-4108719.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    categories: [
      {
        id: 201,
        name: "AC Repair",
        services: [
          { id: 2001, name: "AC Service", price: 699, duration: "60 min", rating: 4.7 },
          { id: 2002, name: "AC Gas Refill", price: 1499, duration: "90 min", rating: 4.8 },
          { id: 2003, name: "AC Installation", price: 1999, duration: "120 min", rating: 4.6 }
        ]
      },
      {
        id: 202,
        name: "Refrigerator Repair",
        services: [
          { id: 2004, name: "Refrigerator Service", price: 799, duration: "60 min", rating: 4.6 },
          { id: 2005, name: "Gas Refill", price: 1299, duration: "90 min", rating: 4.7 }
        ]
      },
      {
        id: 203,
        name: "Washing Machine Repair",
        services: [
          { id: 2006, name: "Washing Machine Service", price: 699, duration: "60 min", rating: 4.5 },
          { id: 2007, name: "Installation", price: 499, duration: "45 min", rating: 4.6 }
        ]
      }
    ],
    relatedProducts: [
      { id: 2004, name: "AC Filter", price: 799, rating: 4.4, image: "https://images.pexels.com/photos/4108775/pexels-photo-4108775.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
      { id: 2005, name: "Washing Machine Cover", price: 399, rating: 4.2, image: "https://images.pexels.com/photos/4108811/pexels-photo-4108811.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" }
    ]
  },
  {
    id: 3,
    name: "Cleaning Services",
    description: "Professional home cleaning services",
    image: "https://images.pexels.com/photos/4108843/pexels-photo-4108843.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    categories: [
      {
        id: 301,
        name: "Home Deep Cleaning",
        services: [
          { id: 3001, name: "1 BHK Deep Cleaning", price: 1999, duration: "4 hrs", rating: 4.8 },
          { id: 3002, name: "2 BHK Deep Cleaning", price: 2999, duration: "6 hrs", rating: 4.8 },
          { id: 3003, name: "3 BHK Deep Cleaning", price: 3999, duration: "8 hrs", rating: 4.9 }
        ]
      },
      {
        id: 302,
        name: "Bathroom Cleaning",
        services: [
          { id: 3004, name: "Bathroom Deep Cleaning", price: 799, duration: "2 hrs", rating: 4.7 }
        ]
      },
      {
        id: 303,
        name: "Kitchen Cleaning",
        services: [
          { id: 3005, name: "Kitchen Deep Cleaning", price: 999, duration: "3 hrs", rating: 4.8 }
        ]
      }
    ],
    relatedProducts: [
      { id: 2006, name: "All-Purpose Cleaner", price: 199, rating: 4.6, image: "https://images.pexels.com/photos/4108815/pexels-photo-4108815.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
      { id: 2007, name: "Microfiber Cloth Set", price: 299, rating: 4.7, image: "https://images.pexels.com/photos/4108771/pexels-photo-4108771.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
      { id: 2008, name: "Scrubbing Brushes", price: 249, rating: 4.5, image: "https://images.pexels.com/photos/4108846/pexels-photo-4108846.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" }
    ]
  },
  {
    id: 4,
    name: "Plumbing",
    description: "Expert plumbing services for your home",
    image: "https://images.pexels.com/photos/4108807/pexels-photo-4108807.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    categories: [
      {
        id: 401,
        name: "Tap & Mixer Repairs",
        services: [
          { id: 4001, name: "Tap Repair/Replacement", price: 299, duration: "30 min", rating: 4.6 },
          { id: 4002, name: "Mixer Repair", price: 399, duration: "45 min", rating: 4.7 }
        ]
      },
      {
        id: 402,
        name: "Toilet Repairs",
        services: [
          { id: 4003, name: "Toilet Repair", price: 399, duration: "45 min", rating: 4.7 },
          { id: 4004, name: "Flush Tank Repair", price: 449, duration: "60 min", rating: 4.6 }
        ]
      },
      {
        id: 403,
        name: "Water Tank Services",
        services: [
          { id: 4005, name: "Water Tank Cleaning", price: 999, duration: "2 hrs", rating: 4.8 },
          { id: 4006, name: "Water Tank Installation", price: 2999, duration: "4 hrs", rating: 4.7 }
        ]
      }
    ],
    relatedProducts: [
      { id: 2009, name: "Sink Tap", price: 599, rating: 4.4, image: "https://images.pexels.com/photos/4108701/pexels-photo-4108701.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
      { id: 2010, name: "Shower Head", price: 799, rating: 4.6, image: "https://images.pexels.com/photos/4108732/pexels-photo-4108732.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" }
    ]
  },
  {
    id: 5,
    name: "Electrical",
    description: "Professional electrical repair and installation services",
    image: "https://images.pexels.com/photos/4108727/pexels-photo-4108727.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    categories: [
      {
        id: 501,
        name: "Switch & Socket",
        services: [
          { id: 5001, name: "Switch/Socket Replacement", price: 199, duration: "20 min", rating: 4.6 },
          { id: 5002, name: "Switch Board Installation", price: 399, duration: "30 min", rating: 4.7 }
        ]
      },
      {
        id: 502,
        name: "Fan",
        services: [
          { id: 5003, name: "Fan Repair", price: 299, duration: "30 min", rating: 4.5 },
          { id: 5004, name: "Fan Installation", price: 499, duration: "45 min", rating: 4.6 }
        ]
      },
      {
        id: 503,
        name: "Lighting",
        services: [
          { id: 5005, name: "Light Installation", price: 199, duration: "20 min", rating: 4.7 },
          { id: 5006, name: "Chandelier Installation", price: 999, duration: "60 min", rating: 4.8 }
        ]
      }
    ],
    relatedProducts: [
      { id: 2011, name: "LED Bulb Pack", price: 499, rating: 4.7, image: "https://images.pexels.com/photos/4108716/pexels-photo-4108716.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
      { id: 2012, name: "Extension Board", price: 399, rating: 4.5, image: "https://images.pexels.com/photos/4108706/pexels-photo-4108706.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" }
    ]
  },
  {
    id: 6,
    name: "Pest Control",
    description: "Effective pest control services for your home",
    image: "https://images.pexels.com/photos/4108754/pexels-photo-4108754.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    categories: [
      {
        id: 601,
        name: "General Pest Control",
        services: [
          { id: 6001, name: "1 BHK General Pest Control", price: 999, duration: "60 min", rating: 4.7 },
          { id: 6002, name: "2 BHK General Pest Control", price: 1499, duration: "90 min", rating: 4.8 },
          { id: 6003, name: "3 BHK General Pest Control", price: 1999, duration: "120 min", rating: 4.8 }
        ]
      },
      {
        id: 602,
        name: "Bed Bugs Control",
        services: [
          { id: 6004, name: "Bed Bugs Control Treatment", price: 1999, duration: "90 min", rating: 4.9 }
        ]
      },
      {
        id: 603,
        name: "Termite Control",
        services: [
          { id: 6005, name: "Termite Control Treatment", price: 2499, duration: "120 min", rating: 4.8 }
        ]
      }
    ],
    relatedProducts: [
      { id: 2013, name: "Mosquito Repellent", price: 299, rating: 4.3, image: "https://images.pexels.com/photos/4108834/pexels-photo-4108834.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
      { id: 2014, name: "Cockroach Gel", price: 199, rating: 4.6, image: "https://images.pexels.com/photos/4108764/pexels-photo-4108764.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" }
    ]
  }
];