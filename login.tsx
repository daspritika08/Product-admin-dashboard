import { useState, FormEvent } from "react";
import { useAuth } from "@/context/auth-context";
import { Package, Eye, EyeOff, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    const result = await login(email, password);
    setIsLoading(false);
    if (!result.success) setError(result.error ?? "Something went wrong.");
  };

  return (
    <div className="min-h-screen w-full flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-sidebar flex-col items-center justify-center p-12 relative overflow-hidden">
        {/* Background orbs */}
        <div className="absolute top-[-80px] left-[-80px] w-96 h-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-[-60px] right-[-60px] w-72 h-72 rounded-full bg-violet-500/20 blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-10 text-center"
        >
          <div className="flex justify-center mb-8">
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center shadow-2xl shadow-primary/30">
              <Package className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight mb-4">Nexus</h1>
          <p className="text-sidebar-foreground/60 text-lg max-w-sm leading-relaxed">
            Your product catalog, beautifully organized. Real-time insights at a glance.
          </p>

          <div className="mt-12 grid grid-cols-3 gap-6 text-center">
            {[
              { label: "Products", value: "194" },
              { label: "Categories", value: "20+" },
              { label: "Inventory", value: "$17M" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-sidebar-foreground/50 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right login form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-sm"
        >
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-10">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center shadow-lg shadow-primary/20">
              <Package className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">Nexus</span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Welcome back</h2>
            <p className="text-muted-foreground mt-2 text-sm">Sign in to your dashboard to continue.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 px-4 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 px-4 pr-11 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2.5 bg-destructive/10 border border-destructive/20 text-destructive text-sm px-4 py-3 rounded-xl"
              >
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </motion.div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-semibold text-sm transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2 shadow-lg shadow-primary/20"
            >
              {isLoading ? (
                <>
                  <span className="h-4 w-4 rounded-full border-2 border-primary-foreground border-r-transparent animate-spin" />
                  Signing in…
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <p className="text-xs text-muted-foreground text-center mt-8">
            Demo mode — any email and password (4+ chars) will work.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
