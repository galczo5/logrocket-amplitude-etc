import { Link, Outlet, useLocation } from "react-router";
import { ShoppingCartIcon, UserIcon, LogOutIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

export default function AppLayout() {
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const { totalItems } = useCart();

  return (
    <div className="min-h-screen w-screen flex flex-col">
      <header className="border-b bg-background">
        <div className="mx-auto px-6 h-14 flex items-center gap-6 min-w-[1200px]">
          <Link to="/" className="text-lg font-semibold shrink-0">
            T-Shirt Shop
          </Link>

          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  data-active={location.pathname === "/" || undefined}
                  className={navigationMenuTriggerStyle()}
                >
                  <Link to="/">Home</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  data-active={
                    location.pathname.startsWith("/products") || undefined
                  }
                  className={navigationMenuTriggerStyle()}
                >
                  <Link to="/products">Products</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  data-active={location.pathname === "/about" || undefined}
                  className={navigationMenuTriggerStyle()}
                >
                  <Link to="/about">About</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <div className="ml-auto flex items-center gap-3">
            <Link to="/checkout" className="relative p-2">
              <ShoppingCartIcon className="size-5" />
              {totalItems > 0 && (
                <Badge className="absolute -top-1 -right-1 size-5 p-0 flex items-center justify-center text-xs">
                  {totalItems}
                </Badge>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{user?.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="gap-1.5"
                >
                  <LogOutIcon className="size-4" />
                  Logout
                </Button>
              </div>
            ) : (
              <Link
                to="/login"
                state={{ from: location.pathname }}
                className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-md hover:bg-accent"
              >
                <UserIcon className="size-4" />
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t py-4 text-center text-sm text-muted-foreground">
        This is an example app for presentation purposes only.{" "}
        <a
          href="https://github.com/galczo5/logrocket-amplitude-etc"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-foreground"
        >
          View source on GitHub
        </a>
      </footer>
    </div>
  );
}
