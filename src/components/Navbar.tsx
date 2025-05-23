
"use client";

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Search, User, Home as HomeIcon, ListPlus, Info, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { Button } from './ui/button';
import { useBag } from '@/contexts/BagContext';
import { Badge } from './ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'; // Import Avatar components

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [currentSearchTerm, setCurrentSearchTerm] = useState(searchParams.get('q') || '');
  const { getBagItemCount } = useBag();
  const [bagItemCount, setBagItemCount] = useState(0);
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [userInitials, setUserInitials] = useState<string>("");

  // Effect to update local bag item count when context changes
  useEffect(() => {
    setBagItemCount(getBagItemCount());
  }, [getBagItemCount, useBag().bagItems]);

  useEffect(() => {
    setCurrentSearchTerm(searchParams.get('q') || '');
  }, [searchParams]);

  // Check login state and avatar on mount and listen for changes
  useEffect(() => {
    const updateAuthAndAvatarState = () => {
      if (typeof window !== 'undefined') {
        const loggedInStatus = localStorage.getItem('isUserLoggedIn') === 'true';
        setIsLoggedIn(loggedInStatus);

        if (loggedInStatus) {
          const avatarUrl = localStorage.getItem('userAvatarUrl');
          setUserAvatar(avatarUrl);
          const userProfileString = localStorage.getItem('userProfile');
          if (userProfileString) {
            try {
              const userProfile = JSON.parse(userProfileString);
              const initials = (userProfile.fullName?.split(' ').map((n: string) => n[0]).join('') || userProfile.username?.substring(0,2) || 'U').toUpperCase();
              setUserInitials(initials);
            } catch (e) {
              console.error("Error parsing userProfile for initials", e);
              setUserInitials("U");
            }
          } else {
            setUserInitials("U");
          }
        } else {
          setUserAvatar(null);
          setUserInitials("");
        }
      }
    };

    updateAuthAndAvatarState(); // Initial check

    const handleAuthChange = () => updateAuthAndAvatarState();
    const handleAvatarChange = () => updateAuthAndAvatarState(); // Re-use same logic for simplicity

    window.addEventListener('authChange', handleAuthChange);
    window.addEventListener('avatarChange', handleAvatarChange);
    window.addEventListener('storage', (e) => {
      if (e.key === 'isUserLoggedIn' || e.key === 'userAvatarUrl' || e.key === 'userProfile') {
        updateAuthAndAvatarState();
      }
    });

    return () => {
      window.removeEventListener('authChange', handleAuthChange);
      window.removeEventListener('avatarChange', handleAvatarChange);
      window.removeEventListener('storage', (e) => {
        if (e.key === 'isUserLoggedIn' || e.key === 'userAvatarUrl' || e.key === 'userProfile') {
          updateAuthAndAvatarState();
        }
      });
    };
  }, []);

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pathname === '/') {
      router.push(`/?q=${encodeURIComponent(currentSearchTerm)}`);
    } else {
      router.push(`/?q=${encodeURIComponent(currentSearchTerm)}`);
    }
  };

  const handleSearchInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCurrentSearchTerm(event.target.value);
  };

  const showSearchBar = pathname === '/' || searchParams.has('q');

  const navLinks = [
    { href: "/", icon: <HomeIcon className="h-4 w-4 sm:mr-1.5" />, text: "Home" },
    { href: "/sell-product", icon: <ListPlus className="h-4 w-4 sm:mr-1.5" />, text: "Sell Product" },
    { href: "/about-us", icon: <Info className="h-4 w-4 sm:mr-1.5" />, text: "About Us" },
  ];

  const profileLinkHref = isLoggedIn ? "/profile" : "/auth";

  return (
    <nav className="bg-card border-b sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-y-3">
        <Link href="/" className="text-3xl font-extrabold text-primary tracking-tight mr-auto sm:mr-6">
          MarketMate
        </Link>

        <div className="flex items-center order-1 sm:order-2 gap-3 sm:gap-4 flex-grow sm:flex-grow-0 justify-center sm:justify-start w-full sm:w-auto">
          {navLinks.map(link => (
            <NavLink key={link.href} href={link.href} icon={link.icon} text={link.text} currentPath={pathname} />
          ))}
        </div>
        
        <div className="flex items-center gap-3 order-2 sm:order-3 ml-auto">
          {showSearchBar && (
            <form onSubmit={handleSearchSubmit} className="relative w-full max-w-xs sm:max-w-sm md:max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
              <Input
                type="search"
                aria-label="Search products"
                placeholder="Search products..."
                className="pl-12 pr-4 py-2.5 text-base rounded-lg w-full h-10"
                value={currentSearchTerm}
                onChange={handleSearchInputChange}
              />
            </form>
          )}
           <Button 
            variant="ghost"
            size="icon"
            asChild
            className="text-primary hover:bg-accent/20 relative"
            aria-label="Shopping Bag"
          >
            <Link href="/bag">
              <ShoppingBag className="h-6 w-6" />
              {bagItemCount > 0 && (
                <Badge variant="destructive" className="absolute -top-1 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs rounded-full">
                  {bagItemCount}
                </Badge>
              )}
            </Link>
          </Button>
           <Button 
            variant="ghost"
            size="icon"
            asChild
            className="text-primary hover:bg-accent/20"
            aria-label="User profile"
          >
            <Link href={profileLinkHref}>
              {isLoggedIn && userAvatar ? (
                <Avatar className="h-7 w-7">
                  <AvatarImage src={userAvatar} alt="User Avatar" data-ai-hint="profile avatar"/>
                  <AvatarFallback>{userInitials}</AvatarFallback>
                </Avatar>
              ) : isLoggedIn ? ( // Logged in but no avatar URL (e.g. error or placeholder not set)
                 <Avatar className="h-7 w-7">
                   <AvatarFallback>{userInitials}</AvatarFallback>
                 </Avatar>
              ) : ( // Not logged in
                <User className="h-6 w-6" />
              )}
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}

interface NavLinkProps {
  href: string;
  icon: React.ReactNode;
  text: string;
  currentPath: string;
}

function NavLink({ href, icon, text, currentPath }: NavLinkProps) {
  const isActive = currentPath === href || (href === "/" && currentPath.startsWith("/?q="));
  return (
    <Link 
      href={href} 
      className={`flex items-center text-sm font-medium transition-colors rounded-md px-2 py-1.5 sm:px-3 hover:bg-accent/10 ${isActive ? 'text-primary bg-accent/5' : 'text-foreground/70 hover:text-primary'}`}
      aria-current={isActive ? "page" : undefined}
    >
      {icon}
      <span className="hidden sm:inline">{text}</span>
    </Link>
  );
}
