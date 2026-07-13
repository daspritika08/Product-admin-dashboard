import { useAllProducts, useCategories } from "@/hooks/use-products";
import { StatCard } from "@/components/dashboard/stat-card";
import { Package, Star, DollarSign, BarChart3, Clock, TrendingUp } from "lucide-react";
import { useMemo } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const CHART_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

// Custom Tooltip for Recharts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover border border-border shadow-lg rounded-xl p-3 text-sm flex flex-col gap-1.5 animate-in fade-in zoom-in-95 duration-200">
        <p className="font-semibold text-foreground mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center gap-2">
            <div 
              className="w-2.5 h-2.5 rounded-full" 
              style={{ backgroundColor: entry.color || entry.payload.fill || CHART_COLORS[index % CHART_COLORS.length] }} 
            />
            <span className="text-muted-foreground">{entry.name}:</span>
            <span className="font-medium text-foreground ml-auto">
              {entry.name.toLowerCase().includes('value') || entry.name.toLowerCase().includes('price') 
                ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(entry.value)
                : entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const { data: allProducts, isLoading: isProductsLoading } = useAllProducts();
  const { data: categories, isLoading: isCategoriesLoading } = useCategories();

  const stats = useMemo(() => {
    if (!allProducts) return { total: 0, avgRating: 0, totalValue: 0 };
    
    let totalRating = 0;
    let totalValue = 0;
    
    allProducts.products.forEach(p => {
      totalRating += p.rating;
      totalValue += p.price * p.stock;
    });

    return {
      total: allProducts.total,
      avgRating: (totalRating / allProducts.total).toFixed(1),
      totalValue: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(totalValue)
    };
  }, [allProducts]);

  const categoryData = useMemo(() => {
    if (!allProducts || !categories) return [];
    
    const countByCat = allProducts.products.reduce((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(countByCat)
      .map(([name, count]) => ({
        name: name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        count
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [allProducts, categories]);

  const topProductsData = useMemo(() => {
    if (!allProducts) return [];
    
    return [...allProducts.products]
      .map(p => ({
        name: p.title.length > 20 ? p.title.substring(0, 20) + '...' : p.title,
        value: p.price * p.stock,
        fill: "hsl(var(--primary))"
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [allProducts]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 280, damping: 22 } }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Overview</h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Real-time insights across your product catalog.
          </p>
        </div>
        <Badge variant="outline" className="bg-card text-muted-foreground px-3 py-1.5 rounded-full shadow-sm font-medium border-border/60">
          <Clock className="w-3.5 h-3.5 mr-1.5" /> Last synced: just now
        </Badge>
      </div>

      <motion.div 
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={itemVariants}>
          <StatCard
            title="Total Products"
            value={stats.total}
            icon={Package}
            description="Active SKUs in catalog"
            isLoading={isProductsLoading}
            trend="+12%"
            trendUp={true}
            colorType="indigo"
          />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <StatCard
            title="Inventory Value"
            value={stats.totalValue}
            icon={DollarSign}
            description="Based on current stock levels"
            isLoading={isProductsLoading}
            trend="+8%"
            trendUp={true}
            colorType="emerald"
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <StatCard
            title="Average Rating"
            value={stats.avgRating}
            icon={Star}
            description="Across all customer reviews"
            isLoading={isProductsLoading}
            trend="+4.5%"
            trendUp={true}
            colorType="amber"
          />
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 280, damping: 22 }}
        >
          <Card className="h-full border-border/60 shadow-sm overflow-hidden bg-card/50 backdrop-blur-sm">
            <CardHeader className="border-b border-border/40 pb-4 bg-muted/20">
              <CardTitle className="flex items-center gap-2 text-lg">
                <BarChart3 className="h-5 w-5 text-primary" />
                Category Distribution
              </CardTitle>
              <CardDescription>Top 10 categories by product count</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {isProductsLoading || isCategoriesLoading ? (
                <div className="h-[380px] w-full flex items-end gap-3 justify-between">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <Skeleton key={i} className="w-full rounded-t-md" style={{ height: `${Math.random() * 60 + 20}%` }} />
                  ))}
                </div>
              ) : (
                <div className="h-[380px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryData} margin={{ top: 20, right: 10, left: -20, bottom: 20 }}>
                      <XAxis 
                        dataKey="name" 
                        stroke="hsl(var(--muted-foreground))" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false} 
                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                        tickFormatter={(value) => value.length > 12 ? value.substring(0, 10) + '...' : value}
                        angle={-45}
                        textAnchor="end"
                      />
                      <YAxis
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${value}`}
                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                      />
                      <Tooltip cursor={{ fill: 'hsl(var(--muted)/0.4)', rx: 6 }} content={<CustomTooltip />} />
                      <Bar 
                        dataKey="count" 
                        name="Products"
                        radius={[6, 6, 0, 0]}
                        isAnimationActive={true}
                        animationDuration={800}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} className="hover:opacity-80 transition-opacity" />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 280, damping: 22 }}
        >
          <Card className="h-full border-border/60 shadow-sm overflow-hidden bg-card/50 backdrop-blur-sm">
            <CardHeader className="border-b border-border/40 pb-4 bg-muted/20">
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5 text-emerald-500" />
                Top 5 Products by Stock Value
              </CardTitle>
              <CardDescription>Highest value inventory currently in stock</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {isProductsLoading ? (
                <div className="h-[380px] w-full flex flex-col justify-between py-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full rounded-md" style={{ width: `${Math.random() * 50 + 50}%` }} />
                  ))}
                </div>
              ) : (
                <div className="h-[380px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart layout="vertical" data={topProductsData} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
                      <XAxis 
                        type="number" 
                        stroke="hsl(var(--muted-foreground))" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false}
                        tickFormatter={(value) => `$${value >= 1000 ? (value/1000).toFixed(1) + 'k' : value}`}
                      />
                      <YAxis
                        dataKey="name"
                        type="category"
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        width={120}
                        tick={{ fill: 'hsl(var(--foreground))', fontWeight: 500 }}
                      />
                      <Tooltip cursor={{ fill: 'hsl(var(--muted)/0.4)', rx: 6 }} content={<CustomTooltip />} />
                      <Bar 
                        dataKey="value" 
                        name="Stock Value"
                        radius={[0, 6, 6, 0]}
                        isAnimationActive={true}
                        animationDuration={800}
                      >
                        {topProductsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={CHART_COLORS[(index + 2) % CHART_COLORS.length]} className="hover:opacity-80 transition-opacity" />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
