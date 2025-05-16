
// src/app/profile/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header'; // Assuming you might want a consistent header
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, User, LogOut, ShoppingBag, Settings } from 'lucide-react';
import Link from 'next/link';

// Mocked user data - in a real app, this would come from context/state or API
interface UserProfile {
  fullName: string;
  username: string;
  email: string;
  avatarUrl?: string; // Optional
  joinDate: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // In a real app, you would fetch user data here or check authentication status
    // For now, we'll use mock data if the user "logs in"
    // This is a simplified mock, ideally, auth state would be managed globally
    const mockUser: UserProfile = {
      fullName: "Demo User",
      username: "demouser123",
      email: "demo@marketmate.com",
      joinDate: new Date().toLocaleDateString(), // Or a fixed date
      avatarUrl: "https://placehold.co/100x100.png"
    };
    setUser(mockUser);

    // If no user (e.g. direct navigation without "login"), redirect to auth
    // This is a placeholder for proper auth guard
    // setTimeout(() => { // Adding a slight delay to avoid flash if auth check is fast
    //   if (!mockUser) { // Replace with actual auth check
    //     router.push('/auth');
    //   }
    // }, 100);

  }, [router]);

  const handleLogout = () => {
    // TODO: Implement actual logout logic (clear session, tokens, etc.)
    console.log("User logged out (mocked)");
    // setUser(null); // Clear user state
    router.push('/auth'); // Redirect to auth page after logout
  };

  if (!mounted || !user) {
    // Basic loading state or redirect
    // You might want a more sophisticated loading component
    return (
        <div className="flex flex-col min-h-screen bg-background">
         <Header onSearchChange={() => {}} initialSearchTerm="" />
          <div className="flex flex-grow items-center justify-center">
            <p>Loading profile...</p>
          </div>
        </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header onSearchChange={() => {}} initialSearchTerm="" /> {/* Pass dummy props if Header requires them */}
      <main className="flex-grow container mx-auto px-4 py-8 sm:py-12">
        <Card className="w-full max-w-2xl mx-auto shadow-xl rounded-lg">
          <CardHeader className="text-center pb-6 border-b">
            <div className="flex flex-col items-center space-y-3">
              <Avatar className="h-24 w-24 border-2 border-primary">
                <AvatarImage src={user.avatarUrl || `https://placehold.co/100x100.png`} alt={user.fullName} data-ai-hint="profile avatar" />
                <AvatarFallback>{user.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
              </Avatar>
              <CardTitle className="text-3xl font-bold text-primary">{user.fullName}</CardTitle>
              <CardDescription className="text-base text-muted-foreground">@{user.username}</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">Profile Information</h3>
              <div className="flex items-center text-sm">
                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-foreground">{user.email}</span>
              </div>
              <div className="flex items-center text-sm">
                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-foreground">Joined on {user.joinDate}</span>
              </div>
            </div>

            <div className="space-y-3">
               <h3 className="text-lg font-semibold text-foreground">Account Actions</h3>
                <Button variant="outline" className="w-full justify-start">
                  <ShoppingBag className="mr-2 h-4 w-4" /> My Listings
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="mr-2 h-4 w-4" /> Account Settings
                </Button>
            </div>
           
            <Button onClick={handleLogout} variant="destructive" className="w-full mt-6">
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
             <Button variant="link" className="w-full text-muted-foreground hover:text-primary mt-2" asChild>
                <Link href="/">
                 Back to Marketplace
                </Link>
            </Button>
          </CardContent>
        </Card>
      </main>
      <footer className="bg-secondary border-t border-border text-secondary-foreground p-6 text-center text-sm">
        © {new Date().getFullYear()} MarketMate. All rights reserved.
      </footer>
    </div>
  );
}
