import { memo } from "react";
import { Product } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Package, AlertCircle, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface ProductCardProps {
  product: Product;
}

const getCategoryColor = (category: string) => {
  const hash = category.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const colors = [
    "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
    "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400",
    "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400",
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
    "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
    "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400",
  ];
  return colors[hash % colors.length];
};

function ProductCardComponent({ product }: ProductCardProps) {
  const isLowStock = product.stock > 0 && product.stock <= 10;
  const isOutOfStock = product.stock === 0;

  const stockPercent = Math.min(100, Math.max(0, (product.stock / 50) * 100)); // Arbitrary max stock for progress bar

  return (
    <Link href={`/products/${product.id}`} className="block group h-full">
      <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-2 border-border/50 bg-card/80 backdrop-blur-sm group-hover:border-primary/30 flex flex-col">
        <div className="aspect-square w-full overflow-hidden bg-muted/20 relative">
          <img 
            src={product.thumbnail} 
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          {/* Bottom fade overlay for image */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0 text-white font-medium flex items-center gap-1.5">
            View details <ArrowRight className="w-4 h-4" />
          </div>

          <div className="absolute top-3 left-3 flex flex-col gap-2">
            <span className={cn(
              "px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm capitalize border border-white/10 backdrop-blur-md",
              getCategoryColor(product.category)
            )}>
              {product.category.replace('-', ' ')}
            </span>
          </div>
          
          <div className="absolute top-3 right-3">
            {isOutOfStock ? (
              <Badge variant="destructive" className="shadow-md font-semibold">Out of stock</Badge>
            ) : isLowStock ? (
              <Badge className="bg-amber-500 hover:bg-amber-600 text-white shadow-md font-semibold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> Low Stock
              </Badge>
            ) : null}
          </div>
        </div>
        
        <CardContent className="p-5 flex flex-col flex-1">
          <div className="mb-auto">
            <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors tracking-tight" title={product.title}>
              {product.title}
            </h3>
            <div className="flex items-center gap-1 mt-2">
              <div className="flex text-amber-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    className={cn(
                      "w-3.5 h-3.5",
                      product.rating >= star 
                        ? "fill-current" 
                        : product.rating >= star - 0.5 
                          ? "fill-current opacity-50" 
                          : "fill-muted text-muted"
                    )} 
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-muted-foreground ml-1">{product.rating.toFixed(1)}</span>
            </div>
          </div>
          
          <div className="mt-5 space-y-3">
            <div className="font-bold text-2xl text-primary tracking-tight">
              ${product.price.toFixed(2)}
            </div>
            
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                <span className="flex items-center">
                  <Package className="w-3.5 h-3.5 mr-1.5" /> Stock
                </span>
                <span>{product.stock} units</span>
              </div>
              <Progress 
                value={stockPercent} 
                className="h-1.5 bg-muted" 
                indicatorClassName={cn(
                  "transition-all duration-500",
                  isOutOfStock ? "bg-red-500" : isLowStock ? "bg-amber-500" : "bg-emerald-500"
                )}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export const ProductCard = memo(ProductCardComponent);

export function ProductCardSkeleton() {
  return (
    <Card className="h-full overflow-hidden border-border/50">
      <div className="aspect-square w-full bg-muted/40 animate-pulse" />
      <CardContent className="p-5 flex flex-col space-y-5">
        <div className="space-y-2">
          <div className="h-6 w-3/4 bg-muted rounded animate-pulse" />
          <div className="h-4 w-1/3 bg-muted rounded animate-pulse" />
        </div>
        <div className="space-y-3 mt-auto">
          <div className="h-8 w-1/3 bg-muted rounded animate-pulse" />
          <div className="h-1.5 w-full bg-muted rounded animate-pulse mt-4" />
        </div>
      </CardContent>
    </Card>
  );
}
