
// src/app/auth/page.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { LogIn, UserPlus } from "lucide-react";

export default function AuthPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md shadow-xl rounded-lg">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-3xl font-bold tracking-tight text-primary">
            MarketMate
          </CardTitle>
          <CardDescription className="pt-1 text-base">
            Join our community or sign in to continue.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 px-6 pb-6">
          <Button className="w-full h-12 text-lg" asChild>
            <Link href="#"> {/* Replace # with actual sign-in link */}
              <LogIn className="mr-2 h-5 w-5" /> Sign In
            </Link>
          </Button>
          <Button variant="outline" className="w-full h-12 text-lg" asChild>
            <Link href="#"> {/* Replace # with actual sign-up link */}
              <UserPlus className="mr-2 h-5 w-5" /> Create Account
            </Link>
          </Button>
          
          <div className="relative my-4">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-sm text-muted-foreground">
              OR
            </span>
          </div>

          <Button variant="ghost" className="w-full text-muted-foreground hover:text-primary" asChild>
            <Link href="/">
              Continue Browsing as Guest
            </Link>
          </Button>
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground justify-center px-6 pb-6">
          By continuing, you agree to MarketMate's Terms of Service.
        </CardFooter>
      </Card>
    </div>
  );
}
