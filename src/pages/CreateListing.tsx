
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
const uuidv4 = () => (typeof crypto !== 'undefined' && 'randomUUID' in crypto)
  ? (crypto as any).randomUUID()
  : 'id-' + Math.random().toString(36).slice(2) + Date.now().toString(36);

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Upload, X, Image, Video } from 'lucide-react';

const listingSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }).max(100),
  description: z.string().min(20, { message: "Description must be at least 20 characters" }),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Price must be a positive number",
  }),
  category: z.string().min(1, { message: "Please select a category" }),
  condition: z.string().min(1, { message: "Please select the condition" }),
  location: z.string().min(3, { message: "Location must be at least 3 characters" }),
  listing_type: z.enum(['direct', 'affiliate', 'dropship']),
  external_url: z.string().trim().max(2000).optional().or(z.literal('')),
  affiliate_network: z.string().trim().max(50).optional().or(z.literal('')),
  disclosure: z.string().trim().max(500).optional().or(z.literal('')),
}).refine(
  (d) => d.listing_type === 'direct' || (d.external_url && /^https?:\/\//i.test(d.external_url)),
  { message: 'A valid http(s) URL is required for affiliate/dropship listings', path: ['external_url'] }
);

const categories = ["Electronics", "Fashion", "Home & Garden", "Sports", "Music", "Toys", "Books", "Automotive", "Other"];
const conditions = ["New", "Like New", "Good", "Fair", "Salvage"];

const CreateListing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [videoUploadProgress, setVideoUploadProgress] = useState(0);
  const [imagesUploadProgress, setImagesUploadProgress] = useState(0);

  const form = useForm<z.infer<typeof listingSchema>>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      title: "",
      description: "",
      price: "",
      category: "",
      condition: "",
      location: "",
    },
  });

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 100 * 1024 * 1024) {
        toast.error("Video size must be less than 100MB");
        return;
      }
      
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
      toast.success("Video selected successfully");
    }
  };

  const handleImagesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const validFiles = filesArray.filter(file => file.size <= 5 * 1024 * 1024);
      
      if (validFiles.length !== filesArray.length) {
        toast.error("Some images were too large (max 5MB per image)");
      }
      
      if (validFiles.length + images.length > 5) {
        toast.error("Maximum 5 images allowed");
        return;
      }
      
      const newImages = [...images, ...validFiles];
      setImages(newImages);
      
      const newPreviewUrls = newImages.map(file => URL.createObjectURL(file));
      setImagePreviewUrls(newPreviewUrls);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    
    const newPreviewUrls = [...imagePreviewUrls];
    URL.revokeObjectURL(newPreviewUrls[index]);
    newPreviewUrls.splice(index, 1);
    setImagePreviewUrls(newPreviewUrls);
  };

  const removeVideo = () => {
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
    }
    setVideoFile(null);
    setVideoPreview(null);
  };

  const uploadVideo = async (productId: string): Promise<string | null> => {
    if (!videoFile) return null;
    
    const fileExt = videoFile.name.split('.').pop();
    const fileName = `${productId}/video.${fileExt}`;
    const filePath = `videos/${fileName}`;
    
    try {
      const { error: uploadError, data } = await supabase.storage
        .from('products')
        .upload(filePath, videoFile, { upsert: true });
      setVideoUploadProgress(100);
      
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data: publicUrl } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);
      
      return publicUrl?.publicUrl || null;
    } catch (error) {
      console.error('Video upload error:', error);
      return null;
    }
  };

  const uploadImages = async (productId: string): Promise<string[]> => {
    if (images.length === 0) return [];
    
    const uploadPromises = images.map(async (image, index) => {
      const fileExt = image.name.split('.').pop();
      const fileName = `${productId}/image_${index}.${fileExt}`;
      const filePath = `images/${fileName}`;
      
      try {
        const { error: uploadError } = await supabase.storage
          .from('products')
          .upload(filePath, image, { upsert: true });
        setImagesUploadProgress(Math.round(((index + 1) / images.length) * 100));
        
        if (uploadError) throw uploadError;
        
        // Get the public URL
        const { data: publicUrl } = supabase.storage
          .from('products')
          .getPublicUrl(filePath);
        
        return publicUrl?.publicUrl || null;
      } catch (error) {
        console.error(`Image ${index} upload error:`, error);
        return null;
      }
    });
    
    const uploadedUrls = await Promise.all(uploadPromises);
    return uploadedUrls.filter(url => url !== null) as string[];
  };

  const onSubmit = async (values: z.infer<typeof listingSchema>) => {
    if (!videoFile) {
      toast.error("Video is required for listing");
      return;
    }
    
    if (images.length === 0) {
      toast.error("At least one image is required");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Create a unique ID for the product
      const productId = uuidv4();
      
      // Upload video and images to storage
      const videoUrl = await uploadVideo(productId);
      const imageUrls = await uploadImages(productId);
      
      if (!videoUrl) {
        toast.error("Failed to upload video");
        setIsLoading(false);
        return;
      }
      
      if (imageUrls.length === 0) {
        toast.error("Failed to upload images");
        setIsLoading(false);
        return;
      }
      
      // Get the first image as the thumbnail
      const thumbnailUrl = imageUrls[0];
      
      // Insert the product into the database
      const { error } = await supabase
        .from('products')
        .insert({
          id: productId,
          title: values.title,
          description: values.description,
          price: parseFloat(values.price),
          category: values.category,
          condition: values.condition,
          location: values.location,
          seller_id: user?.id,
          thumbnailUrl,
          videoUrl,
          imageUrls,
          datePosted: new Date().toISOString(),
          status: 'active',
        });
      
      if (error) throw error;
      
      toast.success("Product listed successfully!");
      navigate(`/product/${productId}`);
    } catch (error: any) {
      toast.error(`Error creating listing: ${error.message}`);
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute requireSeller={true}>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold mb-6">Create a New Listing</h1>
            
            <div className="bg-card p-6 rounded-lg shadow-md border">
              <div className="space-y-8 mb-8">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Upload Video</h2>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    {videoPreview ? (
                      <div className="relative">
                        <video 
                          src={videoPreview} 
                          className="mx-auto max-h-64 rounded" 
                          controls 
                        />
                        <button 
                          onClick={removeVideo}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                          type="button"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex justify-center">
                          <Video className="h-12 w-12 text-muted-foreground" />
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Upload a video of your product (required, max 100MB)
                        </div>
                        <label className="inline-flex cursor-pointer">
                          <span className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded text-sm">
                            <Upload className="h-4 w-4 inline-block mr-1" /> Select Video
                          </span>
                          <input
                            type="file"
                            accept="video/*"
                            className="sr-only"
                            onChange={handleVideoSelect}
                          />
                        </label>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold mb-4">Upload Images</h2>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      {imagePreviewUrls.map((url, index) => (
                        <div key={index} className="relative">
                          <img 
                            src={url} 
                            className="h-24 w-full object-cover rounded" 
                            alt={`Product ${index + 1}`} 
                          />
                          <button 
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
                            type="button"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                    
                    {images.length < 5 && (
                      <div className="space-y-2">
                        <div className="flex justify-center">
                          <Image className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Upload product images (required, max 5 images, 5MB each)
                        </div>
                        <label className="inline-flex cursor-pointer">
                          <span className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded text-sm">
                            <Upload className="h-4 w-4 inline-block mr-1" /> Add Images
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="sr-only"
                            onChange={handleImagesSelect}
                          />
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Sony WH-1000XM4 Wireless Headphones" {...field} />
                        </FormControl>
                        <FormDescription>
                          Be specific and clear about what you're selling
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories.map(category => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price ($)</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" step="0.01" placeholder="0.00" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="condition"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Condition</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select condition" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {conditions.map(condition => (
                                <SelectItem key={condition} value={condition}>
                                  {condition}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., New York, NY" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe your item in detail, including features, condition, usage history, etc." 
                            className="h-32"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Be as detailed as possible to help buyers make an informed decision
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin mr-2 h-4 w-4 border-2 border-t-transparent border-primary-foreground rounded-full"></div>
                        {videoUploadProgress > 0 && videoUploadProgress < 100 ? (
                          `Uploading video ${videoUploadProgress}%`
                        ) : imagesUploadProgress > 0 && imagesUploadProgress < 100 ? (
                          `Uploading images ${imagesUploadProgress}%`
                        ) : (
                          "Creating listing..."
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Upload className="mr-2 h-4 w-4" />
                        Create Listing
                      </div>
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default CreateListing;
