import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Navbar from '@/components/UpdatedNavbar';
import Footer from '@/components/Footer';
import { UserPlus } from 'lucide-react';

const registerSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string(),
  userType: z.enum(['buyer', 'seller']),
  ageConfirm: z.literal(true, {
    errorMap: () => ({ message: "You must be 18 or older to use TomaShops" }),
  }),
  acceptTerms: z.literal(true, {
    errorMap: () => ({ message: "You must accept the Terms and Privacy Policy" }),
  }),
  marketingOptIn: z.boolean().optional(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const Register = () => {
  const { signUp, setUserType, signInWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      userType: "buyer",
      ageConfirm: false as unknown as true,
      acceptTerms: false as unknown as true,
      marketingOptIn: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof registerSchema>) => {
    try {
      setIsLoading(true);
      await signUp(values.email, values.password);
      await setUserType(values.userType);
      navigate('/');
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Create your account</h1>
            <p className="mt-2 text-muted-foreground">Join TomaShops today</p>
          </div>

          <div className="bg-card p-8 rounded-xl shadow-brand border">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl><Input placeholder="you@example.com" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="password" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="confirmPassword" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm password</FormLabel>
                    <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="userType" render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>I want to</FormLabel>
                    <FormControl>
                      <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl><RadioGroupItem value="buyer" /></FormControl>
                          <FormLabel className="font-normal">Buy products (I'm a shopper)</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl><RadioGroupItem value="seller" /></FormControl>
                          <FormLabel className="font-normal">Sell products (I'm a seller)</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <div className="space-y-3 border-t pt-4">
                  <FormField control={form.control} name="ageConfirm" render={({ field }) => (
                    <FormItem className="flex items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value as boolean} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="font-normal text-sm">I confirm I'm at least 18 years old.</FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="acceptTerms" render={({ field }) => (
                    <FormItem className="flex items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value as boolean} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="font-normal text-sm">
                          I agree to the <Link to="/terms" className="text-primary underline">Terms of Service</Link>,{' '}
                          <Link to="/privacy" className="text-primary underline">Privacy Policy</Link>, and{' '}
                          <Link to="/community-guidelines" className="text-primary underline">Community Guidelines</Link>.
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="marketingOptIn" render={({ field }) => (
                    <FormItem className="flex items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="font-normal text-sm text-muted-foreground">
                          Send me occasional product updates and deals (optional).
                        </FormLabel>
                      </div>
                    </FormItem>
                  )} />
                </div>

                <Button type="submit" className="w-full bg-brand-gradient hover:opacity-90" disabled={isLoading}>
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-t-transparent border-white rounded-full"></div>
                      Creating account...
                    </div>
                  ) : (
                    <div className="flex items-center"><UserPlus className="mr-2 h-4 w-4" /> Create account</div>
                  )}
                </Button>
              </form>
            </Form>

            <div className="mt-6 text-center">
              <p className="text-sm">
                Already have an account?{' '}
                <Link to="/auth/login" className="font-medium text-primary hover:underline">Sign in</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Register;
