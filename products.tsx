import { useState, useCallback, useMemo, useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import { useProducts, useCategories } from "@/hooks/use-products";
import { useDebounce } from "@/hooks/use-debounce";
import { ProductCard, ProductCardSkeleton } from "@/components/products/product-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, SlidersHorizontal, ArrowUpDown, ChevronLeft, ChevronRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type SortOption = "name-asc" | "name-desc" | "price-asc" | "price-desc" | "rating-desc";

export default function ProductsList() {
  const [location, setLocation] = useLocation();
  const searchString = useSearch();
  const urlParams = new URLSearchParams(searchString);
  const initialQuery = urlParams.get("q") || "";
  
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const debouncedSearch = useDebounce(searchTerm, 300);
  
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>("name-asc");
  const [page, setPage] = useState(1);
  const limit = 12;

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, category]);

  useEffect(() => {
    if (initialQuery !== searchTerm) {
      setSearchTerm(initialQuery);
    }
  }, [initialQuery]);

  const { data: categoryData } = useCategories();
  
  const { data, isLoading, isError } = useProducts({
    query: debouncedSearch,
    category,
    skip: (page - 1) * limit,
    limit: 100 
  });

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (e.target.value === "") {
      const newParams = new URLSearchParams(searchString);
      newParams.delete("q");
      setLocation(`${location}${newParams.toString() ? `?${newParams.toString()}` : ''}`);
    }
  }, [location, searchString, setLocation]);

  const handleCategoryChange = useCallback((value: string) => {
    setCategory(value);
  }, []);

  const handleSortChange = useCallback((value: SortOption) => {
    setSortBy(value);
  }, []);

  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setCategory("all");
    setSortBy("name-asc");
    setLocation(location);
  }, [location, setLocation]);

  const processedData = useMemo(() => {
    if (!data?.products) return { products: [], total: 0, hasMore: false };
    
    let sorted = [...data.products];
    
    switch (sortBy) {
      case "name-asc":
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "name-desc":
        sorted.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "price-asc":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "rating-desc":
        sorted.sort((a, b) => b.rating - a.rating);
        break;
    }

    const total = sorted.length;
    const displayTotal = debouncedSearch || (category !== "all") ? total : data.total;
    const paged = sorted.slice(0, limit); 
    
    return {
      products: paged,
      total: displayTotal,
      hasMore: data.products.length > limit * page || (data.total > data.skip + data.limit)
    };
  }, [data, sortBy, page, limit, debouncedSearch, category]);

  const handlePrevPage = useCallback(() => setPage(p => Math.max(1, p - 1)), []);
  const handleNextPage = useCallback(() => setPage(p => p + 1), []);

  const hasActiveFilters = debouncedSearch !== "" || category !== "all" || sortBy !== "name-asc";

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.04 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
  };

  // Only show first 6 categories as chips for cleaner UI, use select if more
  const showCategoryChips = categoryData && categoryData.length <= 8;

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Products</h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Manage and browse your complete inventory.
          </p>
        </div>
        
        <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Filter products..."
              className="pl-9 w-full bg-card/50 backdrop-blur-sm border-border/60 rounded-full h-10 shadow-sm focus-visible:ring-primary/20"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>
      </div>

      <div className="bg-card/50 backdrop-blur-sm border border-border/60 rounded-2xl p-4 mb-8 flex flex-col sm:flex-row flex-wrap gap-5 items-center shadow-sm">
        <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground w-full sm:w-auto">
          <SlidersHorizontal className="w-4 h-4" /> Filters:
        </div>
        
        {showCategoryChips ? (
          <div className="flex flex-wrap gap-2 flex-1">
            <button
              onClick={() => handleCategoryChange("all")}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-medium transition-all",
                category === "all" ? "bg-primary text-primary-foreground shadow-md" : "bg-muted/50 text-muted-foreground hover:bg-muted"
              )}
            >
              All
            </button>
            {categoryData?.slice(0, 6).map((cat) => (
              <button
                key={cat.slug}
                onClick={() => handleCategoryChange(cat.slug)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-medium transition-all capitalize",
                  category === cat.slug ? "bg-primary text-primary-foreground shadow-md" : "bg-muted/50 text-muted-foreground hover:bg-muted"
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>
        ) : (
          <Select value={category} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-full sm:w-[200px] h-10 rounded-full bg-background/50">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all" className="rounded-lg">All Categories</SelectItem>
              {categoryData?.map((cat) => (
                <SelectItem key={cat.slug} value={cat.slug} className="capitalize rounded-lg">
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <div className="h-8 w-px bg-border/60 hidden sm:block mx-2"></div>

        <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground w-full sm:w-auto">
          <ArrowUpDown className="w-4 h-4" /> Sort:
        </div>

        <Select value={sortBy} onValueChange={handleSortChange}>
          <SelectTrigger className="w-full sm:w-[200px] h-10 rounded-full bg-background/50">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="name-asc" className="rounded-lg">Name (A-Z)</SelectItem>
            <SelectItem value="name-desc" className="rounded-lg">Name (Z-A)</SelectItem>
            <SelectItem value="price-asc" className="rounded-lg">Price (Low to High)</SelectItem>
            <SelectItem value="price-desc" className="rounded-lg">Price (High to Low)</SelectItem>
            <SelectItem value="rating-desc" className="rounded-lg">Highest Rated</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearFilters}
            className="ml-auto text-muted-foreground hover:text-foreground rounded-full"
          >
            <X className="w-4 h-4 mr-1.5" /> Clear
          </Button>
        )}
      </div>

      {isError ? (
        <div className="flex-1 flex items-center justify-center border border-border/50 rounded-2xl border-dashed bg-muted/10 py-20">
          <div className="text-center">
            <p className="text-destructive font-medium mb-4 text-lg">Failed to load products</p>
            <Button variant="outline" className="rounded-full shadow-sm" onClick={() => window.location.reload()}>Retry Connection</Button>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-6 text-sm font-medium text-muted-foreground flex justify-between items-center">
            <span>
              {isLoading ? (
                <span className="inline-block w-32 h-5 bg-muted/50 animate-pulse rounded" />
              ) : (
                <>Showing <strong className="text-foreground">{processedData.products.length}</strong> of <strong className="text-foreground">{processedData.total}</strong> products</>
              )}
            </span>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.div key={`skeleton-${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}>
                  <ProductCardSkeleton />
                </motion.div>
              ))}
            </div>
          ) : processedData.products.length === 0 ? (
            <div className="col-span-full py-32 text-center border border-border/50 rounded-2xl border-dashed bg-card/30 flex flex-col items-center">
              <div className="h-16 w-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-6">
                <Search className="h-8 w-8 text-muted-foreground/70" />
              </div>
              <h3 className="text-xl font-bold tracking-tight text-foreground">No products found</h3>
              <p className="text-muted-foreground max-w-sm mt-2 text-base">
                We couldn't find anything matching "{debouncedSearch}". Try adjusting your filters or search term.
              </p>
              <Button variant="default" className="mt-6 rounded-full shadow-sm" onClick={clearFilters}>
                Clear all filters
              </Button>
            </div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              <AnimatePresence mode="popLayout">
                {processedData.products.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    variants={itemVariants}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {processedData.total > limit && !isLoading && (
            <div className="mt-12 flex justify-center items-center gap-4">
              <Button
                variant="outline"
                className="rounded-full shadow-sm bg-card hover:bg-muted"
                onClick={handlePrevPage}
                disabled={page === 1}
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Previous
              </Button>
              <span className="text-sm text-foreground font-semibold px-4 py-2 bg-muted/40 rounded-full min-w-[80px] text-center border border-border/50">
                Page {page}
              </span>
              <Button
                variant="outline"
                className="rounded-full shadow-sm bg-card hover:bg-muted"
                onClick={handleNextPage}
                disabled={!processedData.hasMore}
              >
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
