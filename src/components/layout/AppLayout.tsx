import { Link, Outlet, useLocation } from "react-router";
import { ShoppingCartIcon, UserIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

export default function AppLayout() {
  const location = useLocation();

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
            </NavigationMenuList>
          </NavigationMenu>

          <div className="ml-auto flex items-center gap-3">
            <Link to="/checkout" className="relative p-2">
              <ShoppingCartIcon className="size-5" />
              <Badge className="absolute -top-1 -right-1 size-5 p-0 flex items-center justify-center text-xs">
                0
              </Badge>
            </Link>
            <Link
              to="/login"
              className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-md hover:bg-accent"
            >
              <UserIcon className="size-4" />
              Login
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t py-4 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} T-Shirt Shop. All rights reserved.
      </footer>
    </div>
  );
}
