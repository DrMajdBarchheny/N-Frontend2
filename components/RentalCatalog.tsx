"use client"

import { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/contexts/LanguageContext";

import {
  Search,
  Grid3X3,
  List,
  Star,
  Heart,
  ShoppingCart,
  Eye,
  Calendar,
  Package,
  Truck,
  Shield,
  ArrowRight,
  SlidersHorizontal,
  X,
} from "lucide-react"
import Image from "next/image"
import { useCart, useFavorites, useUser } from "@/lib/redux/hooks";
import axios from "axios";

interface Product {
  id: number;
  translations: {
    en: {
      name: string;
      description: string;
    };
    ar?: {
      name: string;
      description: string;
    };
  };
  image: string;
  price_per_day: string;
  category: {
    id: number;
    translations: {
      en: {
        name: string;
      };
      ar?: {
        name: string;
      };
    };
  };
  availability: boolean;
  qty: number;
}

interface FavoriteItem {
  favoriteId: number;
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

const sortOptions = [
  { value: "featured", label: "Featured First" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "name", label: "Name A-Z" },
]

export default function RentalCatalog() {

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedSort, setSelectedSort] = useState("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const {
    items: cartItems,
    total: cartTotal,
    addItem,
    removeItem,
    updateQuantity,
    clear,
    fetchItems
  } = useCart();
  
  const {
    items: favoritesItems,
    fetchItems: fetchFavorites,
    addItem: addToFavorites,
    removeItem: removeFromFavorites
  } = useFavorites();
  
  // Type the favorites items
  const typedFavoritesItems = favoritesItems as FavoriteItem[];

  const { isAuthenticated } = useUser();
  const { language, t } = useLanguage();


  useEffect(() => {
    setLoading(true);
    setError(null);
    axios.get("http://127.0.0.1:8000/api/products/")
      .then(res => {
        setProducts(res.data);
        console.log("the category data is : ",res.data)
        setLoading(false);
      })
      .catch(err => {
        setError("Failed to load products.");
        setLoading(false);
      });
    
    // Fetch favorites from backend only if user is authenticated
    if (isAuthenticated) {
      fetchFavorites();
    }
      
  }, []); // Remove fetchFavorites from dependency array

  // Build categories from products
  const categories = useMemo(() => {
    const cats = new Set<string>();
    products.forEach(p => {
      if (p.category && p.category.translations && p.category.translations.en) {
        cats.add(p.category.translations.en.name);
      }
    });
    return ["All Categories", ...Array.from(cats)];
  }, [products]);

  const filteredAndSortedItems = useMemo(() => {
    let filtered = products.filter((item) => {
      const lang = item.translations?.[language] ? language : "en";
      const catLang = item.category?.translations?.[language] ? language : "en";
      const matchesSearch =
        item.translations?.[lang]?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.translations?.[lang]?.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "All Categories" || (item.category && item.category.translations?.[catLang]?.name === selectedCategory);
      const price = parseFloat(item.price_per_day);
      const matchesPrice = price >= priceRange.min && price <= priceRange.max;
      const matchesAvailability = selectedAvailability.length === 0 || selectedAvailability.includes(item.availability ? "available" : "unavailable");
      return matchesSearch && matchesCategory && matchesPrice && matchesAvailability;
    });
    // Sort items
    filtered.sort((a, b) => {
      const langA = a.translations?.[language] ? language : "en";
      const langB = b.translations?.[language] ? language : "en";
      switch (selectedSort) {
        case "price-low":
          return parseFloat(a.price_per_day) - parseFloat(b.price_per_day);
        case "price-high":
          return parseFloat(b.price_per_day) - parseFloat(a.price_per_day);
        case "name":
          return (a.translations?.[langA]?.name || "").localeCompare(b.translations?.[langB]?.name || "");
        case "featured":
        default:
          return 0;
      }
    });
    return filtered;
  }, [products, searchTerm, selectedCategory, selectedSort, priceRange, selectedAvailability, language]);

  const toggleFavorite = async (item: Product) => {
    if (!isAuthenticated) {
      // You could show a toast or redirect to login here
      console.log("User must be logged in to manage favorites");
      return;
    }
    
    console.log("User is authenticated, proceeding with favorite toggle");
    console.log("Current token:", localStorage.getItem('token'));
    
    const lang = item.translations?.[language] ? language : "en";
    const isFavorite = typedFavoritesItems.some((fav: FavoriteItem) => fav.id === item.id);
    
    if (isFavorite) {
      // Find the favorite item to get its backend ID for deletion
      const favoriteItem = typedFavoritesItems.find((fav: FavoriteItem) => fav.id === item.id);
      if (favoriteItem) {
        await removeFromFavorites(favoriteItem.favoriteId);
      }
    } else {
      await addToFavorites({
        id: item.id,
        name: item.translations?.[lang]?.name || "",
        price: parseFloat(item.price_per_day),
        image: item.image,
        category: item.category?.translations?.[lang]?.name || ""
      });
    }
  };

  // Handler to add to cart and refetch
  const handleAddToCart = async (item: any) => {
    // Find if product is already in cart (compare by product id, not cart item id)
    const existingCartItem = cartItems.find((ci: any) => ci.name === item.name); // or use ci.productId === item.id if available
    if (existingCartItem) {
      await updateQuantity(existingCartItem.id, existingCartItem.quantity + 1);
      fetchItems();
    } else {
      await addItem(item);
      fetchItems();
    }
  };
  // Handler to remove from cart and refetch
  const handleRemoveFromCart = async (cartItemId: number) => {
    await removeItem(cartItemId);
    fetchItems();
  };

  return (
    <section className="py-32 relative">
      {/* Cart Modal Button */}
      <button
        className="fixed bottom-8 right-8 z-50 bg-gradient-to-br from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white rounded-full shadow-2xl w-16 h-16 flex items-center justify-center transition-all duration-200 group"
        onClick={() => setCartOpen(true)}
        aria-label="Open cart"
      >
        <span className="absolute -top-3 left-12 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold rounded-full px-2 py-0.5 shadow-lg border-2 border-white group-hover:scale-110 transition-transform">
          {cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0)}
        </span>
        <ShoppingCart className="h-8 w-8" />
      </button>

      {/* Cart Modal Overlay */}
      {cartOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center"
          onClick={() => setCartOpen(false)}
        >
          {/* Modal Content */}
          <div
            className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-auto p-6 relative"
            onClick={e => e.stopPropagation()}
          >
            <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-700" onClick={() => setCartOpen(false)}>
              <X className="h-6 w-6" />
            </button>
            <h3 className="text-xl font-bold mb-4">Shopping Cart</h3>
            {cartItems.length === 0 ? (
              <div className="text-gray-500 text-center my-16">Your cart is empty.</div>
            ) : (
              <>
                <div className="max-h-80 overflow-y-auto mb-4">
                  {cartItems.map((item: any) => (
                    <div key={item.id} className="flex items-center gap-3 mb-4 border-b pb-3">
                      <Image src={`http://127.0.0.1:8000${item.image}` || "/placeholder.svg"} alt={item.name || "Cart item image"} width={56} height={40} className="rounded object-cover w-14 h-10" />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-900 truncate">{item.name}</div>
                        <div className="text-xs text-gray-500">AED {item.price} /day</div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300">-</button>
                        <span className="px-2 text-sm text-black font-semibold">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300">+</button>
                      </div>
                      {/* Use CartItem ID for removal */}
                      <button onClick={() => handleRemoveFromCart(item.id)} className="ml-2 text-red-500 hover:text-red-700">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between font-semibold mb-2">
                  <span>Total:</span>
                  <span className="text-blue-600">AED {cartTotal}</span>
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-2">Checkout</Button>
                <Button className="w-full mt-2" variant="outline" onClick={clear}>Clear Cart</Button>
              </>
            )}
          </div>
        </div>
      )}

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-gray-400 text-sm font-medium tracking-widest uppercase mb-4">RENTAL CATALOG</p>
          <h2 className="text-4xl lg:text-6xl font-bold mb-6 text-white">
            Exhibition
            <span className="block text-blue-400">Equipment Rental</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Browse our comprehensive collection of premium exhibition equipment, furniture, and technology available for
            rent.
          </p>
        </motion.div>

        {/* Search and Filter Bar */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4 items-center">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    placeholder="Search equipment, categories, or features..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>

                {/* Category Filter */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-md text-white"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>

                {/* Sort */}
                <select
                  value={selectedSort}
                  onChange={(e) => setSelectedSort(e.target.value)}
                  className="px-4 py-2 bg-gray-700/50 border-gray-600 rounded-md text-white"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                {/* View Mode Toggle */}
                <div className="flex bg-gray-700/50 rounded-md p-1">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="px-3"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="px-3"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>

                {/* Advanced Filters Toggle */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="border-gray-600 text-gray-300"
                >
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>

              {/* Advanced Filters */}
              {showFilters && (
                <motion.div
                  className="mt-6 pt-6 border-t border-gray-700"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Price Range */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Daily Price Range (AED)</label>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          placeholder="Min"
                          value={priceRange.min}
                          onChange={(e) => setPriceRange((prev) => ({ ...prev, min: Number(e.target.value) }))}
                          className="bg-gray-700/50 border-gray-600 text-white"
                        />
                        <Input
                          type="number"
                          placeholder="Max"
                          value={priceRange.max}
                          onChange={(e) => setPriceRange((prev) => ({ ...prev, max: Number(e.target.value) }))}
                          className="bg-gray-700/50 border-gray-600 text-white"
                        />
                      </div>
                    </div>

                    {/* Availability */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Availability</label>
                      <div className="space-y-2">
                        {["available", "unavailable"].map((status) => (
                          <label key={status} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={selectedAvailability.includes(status)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedAvailability((prev) => [...prev, status])
                                } else {
                                  setSelectedAvailability((prev) => prev.filter((s) => s !== status))
                                }
                              }}
                              className="mr-2"
                            />
                            <span className="text-gray-300 capitalize">{status}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Clear Filters */}
                    <div className="flex items-end">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSearchTerm("")
                          setSelectedCategory("All Categories")
                          setPriceRange({ min: 0, max: 1000 })
                          setSelectedAvailability([])
                        }}
                        className="border-gray-600 text-gray-300"
                      >
                        Clear All Filters
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Results Summary */}
        <motion.div
          className="mb-8 flex justify-between items-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className="text-gray-300">
            {loading ? "Loading..." : error ? error : `Showing ${filteredAndSortedItems.length} of ${products.length} items`}
          </p>
          <div className="flex items-center gap-4">
            <span className="text-gray-400">Cart ({cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0)} items)</span>
            <span className="text-gray-400">Favorites ({typedFavoritesItems.length})</span>
          </div>
        </motion.div>

        {/* Items Grid/List */}
        <div className={`grid gap-8 ${viewMode === "grid" ? "md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
          {filteredAndSortedItems.map((item: Product, index: number) => {
            const lang = item.translations?.[language] ? language : "en";
            const catLang = item.category?.translations?.[language] ? language : "en";
            const cartItem = cartItems.find((ci: any) => ci.id === item.id);
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Card className="bg-gray-800/50 border-gray-700 hover:border-gray-600 transition-all duration-300 h-full overflow-hidden">
                  <div className="relative">
                    <Image
                      src={`http://127.0.0.1:8000${item.image}` || "/placeholder.svg"}
                      alt={item.translations?.[lang]?.name || ""}
                      width={400}
                      height={250}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Overlay Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      <Badge className={`${item.availability ? "bg-green-500" : "bg-red-500"} text-white`}>
                        {item.availability ? "Available" : "Unavailable"}
                      </Badge>
                    </div>

                    {/* Action Buttons */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => toggleFavorite(item)}
                        className={`p-2 ${typedFavoritesItems.some((fav: FavoriteItem) => fav.id === item.id) ? "text-red-500" : "text-gray-400"}`}
                      >
                        <Heart className="h-4 w-4" fill={typedFavoritesItems.some((fav: FavoriteItem) => fav.id === item.id) ? "currentColor" : "none"} />
                      </Button>
                      <Button size="sm" variant="secondary" className="p-2">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
                          {item.translations?.[lang]?.name || ""}
                        </h3>
                        <p className="text-sm text-gray-400">{item.category?.translations?.[catLang]?.name || ""}</p>
                      </div>
                    </div>

                    <p className="text-gray-300 text-sm mb-4 line-clamp-2">{item.translations?.[lang]?.description || ""}</p>

                    {/* Specifications */}
                    <div className="space-y-1 mb-4 text-xs text-gray-400">
                      <div className="flex items-center gap-2">
                        <Package className="h-3 w-3" />
                        <span>Qty: {item.qty}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        <span>Per Day</span>
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="mb-4">
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-white">AED {item.price_per_day}</span>
                        <span className="text-sm text-gray-400">/day</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      {!cartItem ? (
                        <Button
                          size="sm"
                          onClick={() => handleAddToCart({ id: item.id, name: item.translations?.[lang]?.name || "", price: parseFloat(item.price_per_day), image: `http://127.0.0.1:8000${item.image}` })}
                          className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:bg-blue-700"
                          disabled={!item.availability}
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Add to Cart
                        </Button>
                      ) : (
                        <div className="flex items-center gap-2 flex-1">
                          <button onClick={() => updateQuantity(item.id, cartItem.quantity - 1)} className="w-8 h-8 flex items-center justify-center bg-gray-700 rounded text-white hover:bg-gray-600">-</button>
                          <span className="px-2 text-sm font-semibold">{cartItem.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, cartItem.quantity + 1)} className="w-8 h-8 flex items-center justify-center bg-gray-700 rounded text-white hover:bg-gray-600">+</button>
                          <Button size="sm" variant="destructive" onClick={() => handleRemoveFromCart(item.id)}>
                            Remove
                          </Button>
                        </div>
                      )}
                      <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 bg-transparent">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* No Results */}
        {!loading && !error && filteredAndSortedItems.length === 0 && (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-white mb-2">No items found</h3>
            <p className="text-gray-400 mb-6">Try adjusting your search criteria or filters</p>
            <Button
              onClick={() => {
                setSearchTerm("")
                setSelectedCategory("All Categories")
                setPriceRange({ min: 0, max: 1000 })
                setSelectedAvailability([])
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Clear All Filters
            </Button>
          </motion.div>
        )}

        {/* Services Info */}
        <motion.div
          className="mt-20 grid md:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {[
            {
              icon: Truck,
              title: "Free Delivery & Setup",
              description: "Complimentary delivery and professional setup for orders over AED 1,000",
            },
            {
              icon: Shield,
              title: "Insurance Included",
              description: "All rental items are fully insured against damage and theft",
            },
            {
              icon: Calendar,
              title: "Flexible Rental Terms",
              description: "Daily, weekly, and monthly rental options with competitive pricing",
            },
          ].map((service, index) => (
            <Card key={service.title} className="bg-gray-800/30 border-gray-700 text-center">
              <CardContent className="p-6">
                <service.icon className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">{service.title}</h3>
                <p className="text-gray-300 text-sm">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h3 className="text-3xl font-bold text-white mb-4">Need Custom Equipment or Bulk Orders?</h3>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Contact our team for custom equipment solutions, bulk discounts, and specialized exhibition setups.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Request Custom Quote
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-gray-600 text-gray-300 bg-transparent">
              Contact Sales Team
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
