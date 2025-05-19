
// src/app/profile/page.tsx
"use client";

import { useEffect, useState, useRef, type ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, User, LogOut, ShoppingBag, Settings, Edit3, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";

interface UserProfile {
  fullName: string;
  username: string;
  email: string;
  avatarUrl: string;
  joinDate: string;
}

const DEFAULT_AVATAR_PLACEHOLDER = "https://placehold.co/100x100.png?text=User";

export default function ProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [mounted, setMounted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previousObjectURL, setPreviousObjectURL] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    const storedUserProfileString = localStorage.getItem('userProfile');
    const storedAvatarUrl = localStorage.getItem('userAvatarUrl');
    let profileData: Partial<UserProfile> = {};

    if (storedUserProfileString) {
      try {
        profileData = JSON.parse(storedUserProfileString);
      } catch (e) {
        console.error("Failed to parse userProfile from localStorage", e);
      }
    }

    const initialUser: UserProfile = {
      fullName: profileData.fullName || "Demo User",
      username: profileData.username || "demouser123",
      email: profileData.email || "demo@marketmate.com",
      joinDate: profileData.joinDate || new Date(new Date().setDate(new Date().getDate() - 30)).toLocaleDateString(),
      avatarUrl: storedAvatarUrl || profileData.avatarUrl || DEFAULT_AVATAR_PLACEHOLDER,
    };
    setUser(initialUser);
    
    // Revoke previous object URL if it exists and it's different from the current one or default
    if (previousObjectURL && previousObjectURL !== initialUser.avatarUrl && !previousObjectURL.startsWith('https://placehold.co')) {
        URL.revokeObjectURL(previousObjectURL);
        setPreviousObjectURL(null);
    }


    // Cleanup for the last object URL when component unmounts
    return () => {
      if (previousObjectURL && !previousObjectURL.startsWith('https://placehold.co')) {
        URL.revokeObjectURL(previousObjectURL);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  const handleLogout = () => {
    console.log("User logged out");
    localStorage.removeItem('isUserLoggedIn');
    localStorage.removeItem('userProfile');
    localStorage.removeItem('userAvatarUrl');
    if (previousObjectURL && !previousObjectURL.startsWith('https://placehold.co')) {
      URL.revokeObjectURL(previousObjectURL);
      setPreviousObjectURL(null);
    }
    window.dispatchEvent(new CustomEvent('authChange'));
    toast({ title: "Logged Out", description: "You have been successfully logged out." });
    router.push('/auth');
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      if (previousObjectURL && !previousObjectURL.startsWith('https://placehold.co')) {
        URL.revokeObjectURL(previousObjectURL);
      }

      const newObjectURL = URL.createObjectURL(file);
      setPreviousObjectURL(newObjectURL);

      setUser(prevUser => {
        if (!prevUser) return null;
        const updatedUser = { ...prevUser, avatarUrl: newObjectURL };
        // Update userProfile in localStorage as well
        const storedUserProfileString = localStorage.getItem('userProfile');
        let currentProfile = {};
        if (storedUserProfileString) currentProfile = JSON.parse(storedUserProfileString);
        localStorage.setItem('userProfile', JSON.stringify({...currentProfile, avatarUrl: newObjectURL}));
        localStorage.setItem('userAvatarUrl', newObjectURL); // Update separate avatar URL item
        
        // Defer event dispatch
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('avatarChange')); // Notify Navbar
        }, 0);
        
        return updatedUser;
      });
      
      toast({
        title: "Profile Picture Updated",
        description: "Your new profile picture is previewed. This change is local and won't persist on server (simulation).",
      });
    }
  };

  if (!mounted || !user) {
    return (
        <div className="flex flex-col min-h-screen bg-background">
          <div className="flex flex-grow items-center justify-center">
            <p className="text-lg text-muted-foreground">Loading profile...</p>
          </div>
        </div>
    );
  }
  
  const userInitials = user.fullName.split(' ').map(n => n[0]).join('').toUpperCase() || user.username.substring(0,2).toUpperCase();

  return (
    <main className="flex-grow container mx-auto px-4 py-8 sm:py-12">
      <Card className="w-full max-w-2xl mx-auto shadow-xl rounded-lg overflow-hidden">
        <CardHeader className="text-center pb-6 border-b bg-card">
          <div className="flex flex-col items-center space-y-3 pt-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelected}
              accept="image/*"
              className="hidden"
              aria-label="Upload profile picture"
            />
            <div className="relative group">
              <Avatar className="h-28 w-28 border-4 border-primary shadow-md">
                <AvatarImage
                  src={user.avatarUrl}
                  alt={user.fullName}
                  data-ai-hint="profile avatar user" />
                <AvatarFallback>{userInitials}</AvatarFallback>
              </Avatar>
              <Button
                variant="outline"
                size="icon"
                className="absolute bottom-0 right-0 rounded-full h-8 w-8 bg-background hover:bg-accent/10 border-primary/50 group-hover:opacity-100 opacity-70 transition-opacity"
                onClick={triggerFileInput}
                title="Change profile picture"
              >
                <ImageIcon className="h-4 w-4 text-primary" />
              </Button>
            </div>
            <CardTitle className="text-3xl font-bold text-primary">{user.fullName}</CardTitle>
            <CardDescription className="text-base text-muted-foreground">@{user.username}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-6 px-6 sm:px-8">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground border-b pb-2 mb-3">Profile Information</h3>
            <div className="flex items-center text-sm">
              <Mail className="h-5 w-5 mr-3 text-muted-foreground flex-shrink-0" />
              <span className="text-foreground truncate" title={user.email}>{user.email}</span>
            </div>
            <div className="flex items-center text-sm">
              <User className="h-5 w-5 mr-3 text-muted-foreground flex-shrink-0" />
              <span className="text-foreground">Joined on {user.joinDate}</span>
            </div>
          </div>

          <div className="space-y-3">
             <h3 className="text-xl font-semibold text-foreground border-b pb-2 mb-3">Account Actions</h3>
              <Button variant="outline" className="w-full justify-start text-base py-3 h-auto" asChild>
                <Link href="/sell-product">
                  <ShoppingBag className="mr-2 h-5 w-5" /> My Listings
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start text-base py-3 h-auto">
                <Settings className="mr-2 h-5 w-5" /> Account Settings
              </Button>
              <Button variant="outline" className="w-full justify-start text-base py-3 h-auto">
                <Edit3 className="mr-2 h-5 w-5" /> Edit Profile
              </Button>
          </div>

          <div className="pt-4 space-y-3">
            <Button onClick={handleLogout} variant="destructive" className="w-full text-lg py-3 h-auto">
              <LogOut className="mr-2 h-5 w-5" /> Logout
            </Button>
            <Button variant="link" className="w-full text-muted-foreground hover:text-primary mt-1" asChild>
                <Link href="/">
                 Back to Marketplace
                </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
