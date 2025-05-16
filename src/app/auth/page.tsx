
// src/app/auth/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { LogIn, UserPlus, Eye, EyeOff } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";

const signInSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});
type SignInFormData = z.infer<typeof signInSchema>;

const signUpSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters." }).max(20, { message: "Username must be 20 characters or less."}),
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters." }).max(50, { message: "Full name must be 50 characters or less."}),
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter." })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." })
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, { message: "Password must contain at least one special character." }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match.",
  path: ["confirmPassword"], // path of error
});
type SignUpFormData = z.infer<typeof signUpSchema>;

const MOCKED_EXISTING_EMAIL = "existinguser@example.com";
const MOCKED_PASSWORD = "Password123!"; // This is for frontend simulation only. NEVER hardcode passwords in a real app.

export default function AuthPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const signInForm = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const signUpForm = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { username: "", fullName: "", email: "", password: "", confirmPassword: "" },
  });

  const onSignInSubmit: SubmitHandler<SignInFormData> = async (data) => {
    console.log("Sign In Data:", data);
    if (data.email === MOCKED_EXISTING_EMAIL && data.password === MOCKED_PASSWORD) {
      signInForm.reset();
      toast({
        title: "Login Successful!",
        description: "Welcome back!",
      });
      localStorage.setItem('isUserLoggedIn', 'true');
      window.dispatchEvent(new CustomEvent('authChange'));
      router.push("/profile");
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid email or password.",
        variant: "destructive",
      });
      signInForm.setError("root", { message: "Invalid email or password."});
    }
  };

  const onSignUpSubmit: SubmitHandler<SignUpFormData> = async (data) => {
    console.log("Sign Up Data:", data);
    if (data.email === MOCKED_EXISTING_EMAIL) {
      signUpForm.setError("email", {
        type: "manual",
        message: "This email address is already registered.",
      });
      toast({
        title: "Registration Failed",
        description: "This email address is already registered.",
        variant: "destructive",
      });
      return;
    }

    signUpForm.reset();
    toast({
      title: "Account Created!",
      description: "You have successfully signed up. Welcome to MarketMate!",
    });
    localStorage.setItem('isUserLoggedIn', 'true');
    localStorage.setItem('userProfile', JSON.stringify({ fullName: data.fullName, username: data.username, email: data.email }));
    window.dispatchEvent(new CustomEvent('authChange'));
    router.push("/profile");
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md shadow-xl rounded-lg">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-3xl font-bold tracking-tight text-primary">
            MarketMate
          </CardTitle>
          <CardDescription className="pt-1 text-base">
            Access your account or create a new one.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Create Account</TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <Form {...signInForm}>
                <form onSubmit={signInForm.handleSubmit(onSignInSubmit)} className="space-y-6">
                  <FormField
                    control={signInForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="you@example.com" {...field} type="email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signInForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input placeholder="••••••••" {...field} type={showPassword ? "text" : "password"} />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                              onClick={togglePasswordVisibility}
                              aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   {signInForm.formState.errors.root && (
                    <p className="text-sm font-medium text-destructive">{signInForm.formState.errors.root.message}</p>
                  )}
                  <Button type="submit" className="w-full h-11 text-lg" disabled={signInForm.formState.isSubmitting}>
                    {signInForm.formState.isSubmitting ? "Signing In..." : <> <LogIn className="mr-2 h-5 w-5" /> Sign In </>}
                  </Button>
                </form>
              </Form>
            </TabsContent>
            <TabsContent value="signup">
              <Form {...signUpForm}>
                <form onSubmit={signUpForm.handleSubmit(onSignUpSubmit)} className="space-y-4">
                  <FormField
                    control={signUpForm.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your Full Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signUpForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="yourusername" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signUpForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="you@example.com" {...field} type="email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signUpForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                           <div className="relative">
                            <Input placeholder="••••••••" {...field} type={showPassword ? "text" : "password"} />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                              onClick={togglePasswordVisibility}
                              aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        </FormControl>
                        <FormDescription className="text-xs">
                          Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signUpForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input placeholder="••••••••" {...field} type={showConfirmPassword ? "text" : "password"} />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                              onClick={toggleConfirmPasswordVisibility}
                              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                            >
                              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full h-11 text-lg" disabled={signUpForm.formState.isSubmitting}>
                    {signUpForm.formState.isSubmitting ? "Creating Account..." : <> <UserPlus className="mr-2 h-5 w-5" /> Create Account </>}
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
          
          <div className="relative my-6">
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
