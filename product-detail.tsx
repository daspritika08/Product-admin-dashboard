import { useRoute, Link } from "wouter";
import { useProduct } from "@/hooks/use-products";
import { ChevronRight, Home, ArrowLeft, Star, Package, Tag, ShieldCheck, Truck, ShoppingCart, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function ProductDetail() {
  const [, params] = useRoute("/products/:id");
  const id = params?.id || "";
  
  const { data: product, isLoading, isError } = useProduct(id);
  const [mainImageCarouselRef, mainImageCarousel] = useEmblaCarousel({ loop: true });
  const [thumbCarouselRef, thumbCarousel] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: true
  });
  
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onThumbClick = useCallback(
    (index: number) => {
      if (!mainImageCarousel || !thumbCarousel) return;
      mainImageCarousel.scrollTo(index);
      setSelectedIndex(index);
    },
    [mainImageCarousel, thumbCarousel]
  );

  const onSelect = useCallback(() => {
    if (!mainImageCarousel) return;
    setSelectedIndex(mainImageCarousel.selectedScrollSnap());
    if (thumbCarousel) {
      thumbCarousel.scrollTo(mainImageCarousel.selectedScrollSnap());
    }
  }, [mainImageCarousel, thumbCarousel]);

  if (mainImageCarousel) {
    mainImageCarousel.on("select", onSelect);
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[60vh] space-y-4">
        <div className="h-16 w-16 rounded-2xl bg-destructive/10 flex items-center justify-center mb-2">
          <Info className="h-8 w-8 text-destructive" />
        </div>
        <div className="text-xl font-bold tracking-tight text-foreground">Product not found</div>
        <p className="text-muted-foreground mb-4">The item you're looking for doesn't exist or has been removed.</p>
        <Button asChild className="rounded-full shadow-sm px-6">
          <Link href="/products">Return to inventory</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24 relative">
      <nav className="flex items-center text-sm font-medium text-muted-foreground mb-8 bg-card/40 p-3 rounded-full border border-border/50 backdrop-blur-sm w-fit shadow-sm">
        <Link href="/" className="hover:text-primary transition-colors flex items-center px-2">
          <Home className="w-4 h-4 mr-1.5" /> Home
        </Link>
        <ChevronRight className="w-4 h-4 mx-1 opacity-40" />
        <Link href="/products" className="hover:text-primary transition-colors px-2">
          Products
        </Link>
        <ChevronRight className="w-4 h-4 mx-1 opacity-40" />
        {isLoading ? (
          <Skeleton className="h-4 w-32 ml-2 rounded-sm" />
        ) : (
          <span className="text-foreground truncate max-w-[250px] px-2 font-semibold tracking-tight">{product?.title}</span>
        )}
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        {/* Gallery Section */}
        <div className="space-y-6">
          {isLoading ? (
            <>
              <Skeleton className="w-full aspect-square rounded-3xl" />
              <div className="flex gap-4">
                {[1, 2, 3].map(i => <Skeleton key={i} className="w-24 h-24 rounded-xl" />)}
              </div>
            </>
          ) : product ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="bg-card/50 backdrop-blur-sm rounded-3xl border border-border/60 p-3 shadow-xl shadow-primary/5"
            >
              <div className="overflow-hidden rounded-2xl bg-white dark:bg-zinc-900/50 aspect-square relative" ref={mainImageCarouselRef}>
                <div className="flex h-full touch-pan-y">
                  {product.images.map((img, index) => (
                    <div className="flex-[0_0_100%] min-w-0 h-full relative" key={index}>
                      <img 
                        src={img} 
                        alt={`${product.title} - Image ${index + 1}`} 
                        className="absolute inset-0 w-full h-full object-contain p-8"
                      />
                    </div>
                  ))}
                </div>
                
                {/* Custom styling for carousel dots */}
                {product.images.length > 1 && (
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                    {product.images.map((_, i) => (
                      <button 
                        key={i}
                        onClick={() => onThumbClick(i)}
                        className={cn(
                          "w-2 h-2 rounded-full transition-all duration-300",
                          selectedIndex === i ? "bg-primary w-6" : "bg-primary/30 hover:bg-primary/50"
                        )}
                        aria-label={`Go to slide ${i + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {product.images.length > 1 && (
                <div className="overflow-hidden mt-3 px-1" ref={thumbCarouselRef}>
                  <div className="flex gap-3 touch-pan-y py-1">
                    {product.images.map((img, index) => (
                      <div 
                        key={index}
                        className={cn(
                          "flex-[0_0_88px] min-w-0 h-24 relative cursor-pointer rounded-xl overflow-hidden transition-all duration-200 bg-white dark:bg-zinc-900/50",
                          selectedIndex === index ? "ring-2 ring-primary ring-offset-2 ring-offset-card border-transparent scale-95 shadow-md" : "border border-border/60 opacity-60 hover:opacity-100 hover:border-primary/40 hover:shadow-sm"
                        )}
                        onClick={() => onThumbClick(index)}
                      >
                        <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover p-2" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ) : null}
        </div>

        {/* Details Section */}
        <div className="flex flex-col">
          {isLoading ? (
            <div className="space-y-6">
              <div className="space-y-3">
                <Skeleton className="h-6 w-32 rounded-full" />
                <Skeleton className="h-12 w-3/4 rounded-lg" />
              </div>
              <Skeleton className="h-12 w-1/3 rounded-lg" />
              <div className="pt-6 space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
              </div>
            </div>
          ) : product ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <div className="flex flex-wrap gap-3 mb-5">
                <Badge variant="outline" className="capitalize text-sm px-3 py-1 font-semibold rounded-full border-primary/20 bg-primary/5 text-primary">
                  {product.category.replace('-', ' ')}
                </Badge>
                <div className="flex items-center text-sm font-bold bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 px-3 py-1 rounded-full shadow-sm">
                  <Star className="w-4 h-4 mr-1.5 fill-current" />
                  {product.rating.toFixed(1)} Rating
                </div>
              </div>

              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-4 leading-tight">
                {product.title}
              </h1>
              
              <div className="flex items-baseline gap-4 mb-8">
                <div className="text-4xl sm:text-5xl font-bold text-primary tracking-tight">
                  ${product.price.toFixed(2)}
                </div>
                <div className="text-lg text-muted-foreground font-medium line-through opacity-70">
                  MSRP ${(product.price * 1.2).toFixed(2)}
                </div>
              </div>

              <div className="prose prose-base dark:prose-invert max-w-none mb-10 text-muted-foreground/90">
                <p className="leading-relaxed text-lg">{product.description}</p>
              </div>

              <Separator className="my-8 opacity-50" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-6 mb-10">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-card/40 border border-border/40 shadow-sm">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 shadow-inner">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground font-semibold mb-1 uppercase tracking-wider">Inventory Status</div>
                    <div className="text-xl font-bold text-foreground flex items-center gap-2">
                      {product.stock} units
                      {product.stock <= 10 && product.stock > 0 && (
                        <Badge className="bg-amber-500 hover:bg-amber-600 rounded-full px-2 py-0">Low</Badge>
                      )}
                      {product.stock === 0 && (
                        <Badge variant="destructive" className="rounded-full px-2 py-0">Out</Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-card/40 border border-border/40 shadow-sm">
                  <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center shrink-0 shadow-inner">
                    <Tag className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground font-semibold mb-1 uppercase tracking-wider">Product Tags</div>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {product.tags.map(tag => (
                        <span key={tag} className="text-xs font-medium bg-secondary px-2 py-1 rounded-md text-secondary-foreground capitalize border border-border/50">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/5 dark:from-emerald-500/20 dark:to-teal-500/10 border border-emerald-500/20 rounded-2xl p-5 flex flex-col sm:flex-row gap-5 justify-between items-start sm:items-center shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-500/20 p-2 rounded-full">
                    <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <span className="font-semibold text-emerald-800 dark:text-emerald-300">Quality verified</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-blue-500/20 p-2 rounded-full">
                    <Truck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="font-semibold text-blue-800 dark:text-blue-300">Ready to ship today</span>
                </div>
              </div>
              
              {/* Sticky action bar */}
              <div className="fixed sm:sticky bottom-4 sm:bottom-0 left-4 right-4 sm:left-auto sm:right-auto z-40 sm:z-auto sm:mt-12 bg-background/80 backdrop-blur-xl sm:bg-transparent sm:backdrop-blur-none p-4 sm:p-0 rounded-3xl sm:rounded-none border sm:border-none border-border/50 shadow-2xl sm:shadow-none flex gap-4">
                <Button 
                  className="flex-1 rounded-full h-14 text-lg font-bold shadow-lg shadow-primary/20 transition-transform active:scale-95" 
                  size="lg" 
                  disabled={product.stock === 0}
                >
                  {product.stock === 0 ? "Out of Stock" : (
                    <span className="flex items-center gap-2"><ShoppingCart className="w-5 h-5" /> Add to Cart</span>
                  )}
                </Button>
                <Button variant="outline" size="lg" className="rounded-full h-14 px-8 font-semibold border-2 border-border/60 hover:bg-muted/50 transition-transform active:scale-95">
                  Manage Item
                </Button>
              </div>
            </motion.div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
