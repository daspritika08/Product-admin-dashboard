import { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  isLoading?: boolean;
  trend?: string;
  trendUp?: boolean;
  colorType?: "indigo" | "emerald" | "amber";
}

const gradientMap = {
  indigo: "from-primary to-violet-500",
  emerald: "from-emerald-400 to-teal-500",
  amber: "from-amber-400 to-orange-500",
};

const badgeMap = {
  indigo: "bg-primary/10 text-primary dark:bg-primary/20",
  emerald: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400",
  amber: "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400",
};

function StatCardComponent({ title, value, icon: Icon, description, isLoading, trend, trendUp = true, colorType = "indigo" }: StatCardProps) {
  return (
    <Card className="relative overflow-hidden group hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 border-border/60 bg-card/50 backdrop-blur-sm">
      <div className={cn("absolute top-0 left-0 right-0 h-1 bg-gradient-to-r opacity-80", gradientMap[colorType])} />
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-[0.03] dark:group-hover:opacity-[0.08] transition-opacity duration-500 pointer-events-none", gradientMap[colorType])} />
      
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 relative z-10">
        <CardTitle className="text-sm font-medium text-muted-foreground tracking-wide">
          {title}
        </CardTitle>
        <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center shadow-sm transition-transform duration-300 group-hover:scale-110", badgeMap[colorType])}>
          <Icon className="h-5 w-5" />
        </div>
      </CardHeader>
      <CardContent className="relative z-10">
        {isLoading ? (
          <>
            <Skeleton className="h-9 w-28 mb-2" />
            <Skeleton className="h-4 w-32" />
          </>
        ) : (
          <>
            <div className="text-3xl font-bold tracking-tight text-foreground">{value}</div>
            <div className="flex items-center mt-2 space-x-2">
              {trend && (
                <span className={cn(
                  "text-xs font-semibold px-2 py-0.5 rounded-full",
                  trendUp ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-red-500/10 text-red-600 dark:text-red-400"
                )}>
                  {trend}
                </span>
              )}
              {description && (
                <p className="text-xs text-muted-foreground">{description}</p>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export const StatCard = memo(StatCardComponent);
