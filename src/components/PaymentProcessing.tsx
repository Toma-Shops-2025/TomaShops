
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/sonner';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreditCard, Calendar, User, Lock } from 'lucide-react';

const paymentSchema = z.object({
  cardNumber: z.string().min(13).max(19).regex(/^\d+$/, "Card number must contain only digits"),
  cardholderName: z.string().min(3, "Name is required"),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Format must be MM/YY"),
  cvv: z.string().min(3).max(4).regex(/^\d+$/, "CVV must contain only digits"),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

interface PaymentProcessingProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: string;
  productTitle: string;
  productPrice: number;
  sellerId: string;
}

const PaymentProcessing = ({
  open,
  onOpenChange,
  productId,
  productTitle,
  productPrice,
  sellerId,
}: PaymentProcessingProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      cardNumber: "",
      cardholderName: "",
      expiryDate: "",
      cvv: "",
    },
  });

  const formatCardNumber = (value: string) => {
    return value.replace(/\D/g, '').substring(0, 16);
  };

  const formatExpiryDate = (value: string) => {
    value = value.replace(/\D/g, '');
    
    if (value.length > 2) {
      return `${value.substring(0, 2)}/${value.substring(2, 4)}`;
    }
    
    return value;
  };

  const onSubmit = async (values: PaymentFormValues) => {
    if (!user) {
      toast.error("You must be logged in to make a purchase");
      return;
    }

    setIsLoading(true);

    try {
      // This would be connected to a payment processor in a real app
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 2000));

      // In a real app, this would create an order in the database
      toast.success("Payment successful!");
      navigate('/profile?tab=purchases');
      onOpenChange(false);
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Payment failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Complete Purchase</DialogTitle>
          <DialogDescription>
            Enter your payment details to purchase {productTitle} for ${productPrice.toFixed(2)}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="cardNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Card Number</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        placeholder="1234 5678 9012 3456" 
                        className="pl-10" 
                        {...field}
                        onChange={(e) => field.onChange(formatCardNumber(e.target.value))}
                      />
                      <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cardholderName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cardholder Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        placeholder="John Smith" 
                        className="pl-10" 
                        {...field} 
                      />
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="expiryDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expiry Date</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          placeholder="MM/YY" 
                          className="pl-10" 
                          {...field} 
                          onChange={(e) => field.onChange(formatExpiryDate(e.target.value))}
                          maxLength={5}
                        />
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cvv"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CVV</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          placeholder="123" 
                          className="pl-10" 
                          {...field} 
                          type="password" 
                          maxLength={4}
                          onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))}
                        />
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-t-transparent border-primary-foreground rounded-full"></div>
                    Processing...
                  </div>
                ) : (
                  `Pay $${productPrice.toFixed(2)}`
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentProcessing;
