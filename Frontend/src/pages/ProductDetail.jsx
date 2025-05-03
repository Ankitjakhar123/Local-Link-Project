import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Plus, Minus, ShoppingCart, Heart, Share2, Check, ChevronRight, Info, Truck, Package, ArrowLeft, Shield } from 'lucide-react';
import { products, getRelatedProducts } from '../data/products';
import { useCart } from '../context/CartContext';
import AnimatedElement from '../components/AnimatedElement';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('description');
  const [addedToCart, setAddedToCart] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    window.scrollTo(0, 0);
    // Simulate API fetch
    const fetchProduct = () => {
      const productId = parseInt(id);
      const foundProduct = products.find(p => p.id === productId);
      
      setProduct(foundProduct);
      
      if (foundProduct) {
        // Get related products
        const related = products.filter(p => 
          p.id !== productId && p.category === foundProduct.category
        ).slice(0, 4);
        
        setRelatedProducts(related);
      }
      
      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    if (quantity < 10) {
      setQuantity(quantity + 1);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: `product-${product.id}`,
        name: product.name,
        price: product.price,
        quantity: quantity,
        type: 'product',
        image: product.image
      });
      
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  // Mock reviews data
  const reviews = [
    { id: 1, user: 'Rajesh S.', rating: 5, comment: 'Excellent product, works as described! Highly recommended for everyone.', date: '2 weeks ago' },
    { id: 2, user: 'Priya M.', rating: 4, comment: 'Good quality product. Delivery was fast and packaging was secure.', date: '1 month ago' },
    { id: 3, user: 'Amit K.', rating: 5, comment: 'Amazing product at a great price. Will definitely buy again.', date: '1 month ago' }
  ];

  if (loading) {
    return (
      <div className="container py-32 text-center">
        <div className="inline-block relative w-20 h-20">
          <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
          <div className="absolute top-2 left-2 w-16 h-16 rounded-full border-4 border-t-transparent border-r-secondary border-b-transparent border-l-transparent animate-spin animation-delay-200"></div>
          <div className="absolute top-4 left-4 w-12 h-12 rounded-full border-4 border-t-transparent border-r-transparent border-b-accent border-l-transparent animate-spin animation-delay-500"></div>
        </div>
        <p className="mt-6 text-muted-foreground">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-32 text-center">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <p className="mb-8 text-muted-foreground">The product you're looking for doesn't exist or has been removed.</p>
        <Link to="/shop" className="btn btn-primary">Back to Shop</Link>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 bg-background dark">
      {/* Breadcrumb navigation */}
      <div className="container mb-8">
        <div className="flex items-center text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight size={14} className="mx-2" />
          <Link to="/shop" className="hover:text-primary transition-colors">Shop</Link>
          <ChevronRight size={14} className="mx-2" />
          <Link to={`/shop?category=${product.category}`} className="hover:text-primary transition-colors">{product.category}</Link>
          <ChevronRight size={14} className="mx-2" />
          <span className="text-foreground">{product.name}</span>
        </div>
      </div>

      {/* Product overview section */}
      <div className="container mb-16">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Product images */}
          <AnimatedElement className="lg:w-1/2" animation="fadeInLeft">
            <div className="sticky top-24">
              <div className="relative overflow-hidden rounded-2xl border border-primary/10 glass-panel">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-[500px] object-cover hover:scale-105 transition-transform duration-700"
                />
                {/* Floating badges */}
                {product.inStock ? (
                  <div className="absolute top-4 left-4 bg-success/90 text-white px-3 py-1 rounded-full text-sm">
                    In Stock
                  </div>
                ) : (
                  <div className="absolute top-4 left-4 bg-error/90 text-white px-3 py-1 rounded-full text-sm">
                    Out of Stock
                  </div>
                )}
                
                {/* Category tag */}
                <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm text-primary font-medium px-3 py-1.5 rounded-full text-sm">
                  {product.category}
                </div>
              </div>
            </div>
          </AnimatedElement>

          {/* Product details */}
          <AnimatedElement className="lg:w-1/2" animation="fadeInRight">
            <div className="space-y-6">
              <button 
                onClick={() => navigate(-1)} 
                className="flex items-center text-muted-foreground hover:text-primary transition-colors"
              >
                <ArrowLeft size={16} className="mr-1" />
                Back
              </button>
              
              <h1 className="text-3xl font-bold">{product.name}</h1>
              
              <div className="flex items-center gap-3">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={18} 
                      className={i < Math.floor(product.rating) ? "fill-warning text-warning" : "text-muted"}
                    />
                  ))}
                </div>
                <span className="text-muted-foreground">({product.rating})</span>
                <span className="text-muted-foreground">|</span>
                <Link to="#reviews" className="text-primary hover:underline">
                  {reviews.length} reviews
                </Link>
              </div>
              
              <div className="flex items-end gap-4">
                <span className="text-3xl font-bold">₹{product.price}</span>
                <span className="text-muted-foreground line-through">₹{Math.round(product.price * 1.2)}</span>
                <span className="bg-success/10 text-success px-2 py-0.5 rounded-md text-sm">
                  20% OFF
                </span>
              </div>
              
              <div className="pt-4 border-t border-border">
                <p className="text-muted-foreground mb-4">{product.description}</p>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-secondary/10 mt-1">
                      <Truck size={16} className="text-secondary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Free Delivery</h3>
                      <p className="text-sm text-muted-foreground">Free delivery on orders above ₹499</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-primary/10 mt-1">
                      <Package size={16} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Premium Packaging</h3>
                      <p className="text-sm text-muted-foreground">Secure and eco-friendly packaging</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-accent/10 mt-1">
                      <Shield size={16} className="text-accent" />
                    </div>
                    <div>
                      <h3 className="font-medium">30-Day Return</h3>
                      <p className="text-sm text-muted-foreground">Easy returns within 30 days</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Add to cart section */}
              <div className="pt-6 border-t border-border">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex items-center h-12 w-36 rounded-xl overflow-hidden bg-background border-2 border-muted">
                    <button 
                      onClick={decreaseQuantity}
                      className="flex-1 h-full flex items-center justify-center hover:bg-muted/50 transition-colors"
                      disabled={quantity <= 1}
                    >
                      <Minus size={16} />
                    </button>
                    <span className="flex-1 h-full flex items-center justify-center font-medium">
                      {quantity}
                    </span>
                    <button 
                      onClick={increaseQuantity}
                      className="flex-1 h-full flex items-center justify-center hover:bg-muted/50 transition-colors"
                      disabled={quantity >= 10}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  
                  <button
                    onClick={handleAddToCart}
                    disabled={!product.inStock || addedToCart}
                    className={`flex-1 h-12 rounded-xl font-medium transition-all flex items-center justify-center gap-2 shadow-lg ${
                      !product.inStock 
                        ? 'bg-muted text-muted-foreground cursor-not-allowed' 
                        : addedToCart 
                          ? 'bg-success text-white' 
                          : 'bg-primary text-white hover:bg-primary/90'
                    }`}
                  >
                    {addedToCart ? (
                      <>
                        <Check size={18} />
                        Added to Cart
                      </>
                    ) : (
                      <>
                        <ShoppingCart size={18} />
                        Add to Cart
                      </>
                    )}
                  </button>
                  
                  <button className="w-12 h-12 rounded-xl flex items-center justify-center border-2 border-muted hover:bg-muted/30 transition-colors">
                    <Heart size={18} className="text-muted-foreground" />
                  </button>
                </div>
              </div>
            </div>
          </AnimatedElement>
        </div>
      </div>

      {/* Product details tabs */}
      <div className="container mb-16">
        <div className="border-b border-border mb-8">
          <div className="flex flex-wrap -mb-px">
            {['description', 'specifications', 'reviews'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === tab 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        <div className="cyber-card rounded-2xl p-8">
          {activeTab === 'description' && (
            <AnimatedElement animation="fadeIn">
              <h3 className="text-xl font-bold mb-4 gradient-text">Product Description</h3>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  {product.description}
                </p>
                <p>
                  Our products are sourced from trusted manufacturers and undergo rigorous quality testing. We ensure that each product meets our high standards for durability, effectiveness, and safety.
                </p>
                <p>
                  This premium {product.name.toLowerCase()} is designed to deliver exceptional performance and long-lasting results. Made with high-quality materials and attention to detail, it's a perfect addition to your home.
                </p>
                <div className="pt-4">
                  <h4 className="font-semibold mb-2">Key Features:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Premium quality materials</li>
                    <li>Durable construction</li>
                    <li>Easy to use and maintain</li>
                    <li>Designed for long-lasting performance</li>
                    <li>Backed by our satisfaction guarantee</li>
                  </ul>
                </div>
              </div>
            </AnimatedElement>
          )}
          
          {activeTab === 'specifications' && (
            <AnimatedElement animation="fadeIn">
              <h3 className="text-xl font-bold mb-4 gradient-text">Product Specifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Brand</span>
                    <span className="font-medium">LocalLink</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Category</span>
                    <span className="font-medium">{product.category}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Warranty</span>
                    <span className="font-medium">1 Year</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Return Policy</span>
                    <span className="font-medium">30 Days</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Color</span>
                    <span className="font-medium">As shown</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Material</span>
                    <span className="font-medium">Premium Quality</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Made In</span>
                    <span className="font-medium">India</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">SKU</span>
                    <span className="font-medium">LL-PRD-{product.id.toString().padStart(4, '0')}</span>
                  </div>
                </div>
              </div>
            </AnimatedElement>
          )}
          
          {activeTab === 'reviews' && (
            <AnimatedElement animation="fadeIn" id="reviews">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold gradient-text">Customer Reviews</h3>
                <button className="btn btn-primary">Write a Review</button>
              </div>
              
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={24} 
                        className={i < Math.floor(product.rating) ? "fill-warning text-warning" : "text-muted"}
                      />
                    ))}
                  </div>
                  <span className="text-2xl font-bold">{product.rating}</span>
                  <span className="text-muted-foreground">Based on {reviews.length} reviews</span>
                </div>
                
                <div className="h-1.5 w-full bg-muted/50 rounded-full mb-1">
                  <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full" style={{ width: '80%' }}></div>
                </div>
              </div>
              
              <div className="space-y-6">
                {reviews.map(review => (
                  <div key={review.id} className="glass-panel rounded-xl p-6 border border-border">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-semibold">{review.user}</h4>
                        <div className="flex mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              size={14} 
                              className={i < review.rating ? "fill-warning text-warning" : "text-muted"}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">{review.date}</span>
                    </div>
                    <p className="text-muted-foreground">{review.comment}</p>
                  </div>
                ))}
              </div>
            </AnimatedElement>
          )}
        </div>
      </div>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <div className="container">
          <h2 className="text-2xl font-bold mb-8 gradient-text">Related Products</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct, index) => (
              <AnimatedElement
                key={relatedProduct.id}
                animation="fadeInUp"
                delay={index * 0.1}
                className="group h-full"
              >
                <Link 
                  to={`/product/${relatedProduct.id}`}
                  className="block h-full"
                >
                  <div className="card-3d h-full bg-card rounded-2xl overflow-hidden border border-primary/10 group-hover:border-primary/30 transition-all duration-500">
                    <div className="h-48 overflow-hidden relative">
                      <img 
                        src={relatedProduct.image} 
                        alt={relatedProduct.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      
                      {/* Price tag */}
                      <div className="absolute top-3 left-3 bg-background/80 backdrop-blur-sm text-primary font-semibold px-3 py-1 rounded-full text-sm">
                        ₹{relatedProduct.price}
                      </div>
                      
                      {/* Rating if available */}
                      <div className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm text-primary px-2 py-1 rounded-full text-sm font-medium flex items-center">
                        <Star size={14} className="fill-warning text-warning mr-1" /> {relatedProduct.rating}
                      </div>
                      
                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-30"></div>
                    </div>
                    
                    <div className="p-5">
                      <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors duration-300 line-clamp-1">
                        {relatedProduct.name}
                      </h3>
                      <p className="text-muted-foreground mb-4 text-sm line-clamp-2">
                        {relatedProduct.description}
                      </p>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm bg-secondary/10 text-secondary px-2 py-0.5 rounded-md">
                          {relatedProduct.category}
                        </span>
                        <div className="p-2 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-all duration-300">
                          <ShoppingCart className="text-primary" size={16} />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </AnimatedElement>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail; 