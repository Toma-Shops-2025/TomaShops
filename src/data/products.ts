
export interface Seller {
  id: string;
  name?: string;
  full_name?: string;
  avatar?: string;
  avatar_url?: string;
  email?: string;
  rating: number;
}

export interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  seller?: Seller | null;
  category: string;
  condition: string;
  location: string;
  datePosted: string;
  views: number;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  senderName: string;
  senderAvatar: string;
  message: string;
  timestamp: string;
  productId?: string;
  productTitle?: string;
  isRead: boolean;
}

export const products: Product[] = [
  {
    id: '1',
    title: 'Vintage Camera with Advanced Zoom Features',
    price: 299.99,
    description: 'This vintage-style camera comes with modern technology including 4K video recording, 30x optical zoom, and image stabilization. Perfect for photography enthusiasts looking for both style and functionality.',
    videoUrl: '/placeholder.svg',
    thumbnailUrl: '/placeholder.svg',
    seller: {
      id: 's1',
      name: 'PhotoGear Pro',
      avatar: '/placeholder.svg',
      rating: 4.8
    },
    category: 'Electronics',
    condition: 'Like New',
    location: 'San Francisco, CA',
    datePosted: '2025-05-01',
    views: 342
  },
  {
    id: '2',
    title: 'Handcrafted Leather Messenger Bag',
    price: 149.99,
    description: 'Genuine full-grain leather messenger bag with multiple compartments. Hand-stitched with durable waxed thread and featuring antique brass hardware. Perfect for daily commutes or business travel.',
    videoUrl: '/placeholder.svg',
    thumbnailUrl: '/placeholder.svg',
    seller: {
      id: 's2',
      name: 'LeatherCraftsman',
      avatar: '/placeholder.svg',
      rating: 4.9
    },
    category: 'Fashion',
    condition: 'New',
    location: 'Portland, OR',
    datePosted: '2025-05-05',
    views: 187
  },
  {
    id: '3',
    title: 'Smart Home Security System with Motion Detection',
    price: 249.99,
    description: 'Complete wireless home security system including 1080p HD cameras, motion sensors, and smartphone integration. Get notifications directly to your phone and view live footage from anywhere.',
    videoUrl: '/placeholder.svg',
    thumbnailUrl: '/placeholder.svg',
    seller: {
      id: 's3',
      name: 'SecureTech',
      avatar: '/placeholder.svg',
      rating: 4.7
    },
    category: 'Home & Garden',
    condition: 'New',
    location: 'Austin, TX',
    datePosted: '2025-05-07',
    views: 231
  },
  {
    id: '4',
    title: 'Professional DJ Mixer with Bluetooth',
    price: 499.99,
    description: 'Professional-grade DJ mixer with 4 channels, built-in effects, Bluetooth connectivity, and USB recording. Perfect for clubs, events, or home studios.',
    videoUrl: '/placeholder.svg',
    thumbnailUrl: '/placeholder.svg',
    seller: {
      id: 's4',
      name: 'BeatMaster',
      avatar: '/placeholder.svg',
      rating: 4.6
    },
    category: 'Music Equipment',
    condition: 'Used - Excellent',
    location: 'Los Angeles, CA',
    datePosted: '2025-04-28',
    views: 278
  },
  {
    id: '5',
    title: 'Mountain Bike with Carbon Frame',
    price: 899.99,
    description: 'Lightweight carbon frame mountain bike with 27-speed Shimano gears, hydraulic disc brakes, and front suspension. Perfect for trail riding and mountain adventures.',
    videoUrl: '/placeholder.svg',
    thumbnailUrl: '/placeholder.svg',
    seller: {
      id: 's5',
      name: 'TrailBlazer Bikes',
      avatar: '/placeholder.svg',
      rating: 4.9
    },
    category: 'Sports & Outdoors',
    condition: 'Like New',
    location: 'Boulder, CO',
    datePosted: '2025-05-02',
    views: 156
  },
  {
    id: '6',
    title: 'Artisan Pottery Set - Handmade Ceramic Dishes',
    price: 129.99,
    description: 'Beautiful handmade ceramic dish set including 4 dinner plates, 4 salad plates, and 4 bowls. Each piece is individually crafted and glazed with unique patterns.',
    videoUrl: '/placeholder.svg',
    thumbnailUrl: '/placeholder.svg',
    seller: {
      id: 's6',
      name: 'ClayCreations',
      avatar: '/placeholder.svg',
      rating: 5.0
    },
    category: 'Home & Garden',
    condition: 'New',
    location: 'Santa Fe, NM',
    datePosted: '2025-05-08',
    views: 97
  }
];

export const messages: Message[] = [
  {
    id: 'm1',
    senderId: 's2',
    receiverId: 'current-user',
    senderName: 'LeatherCraftsman',
    senderAvatar: '/placeholder.svg',
    message: 'Thanks for your interest in the leather bag! Yes, it comes with a shoulder strap that can be adjusted or removed.',
    timestamp: '2025-05-10T14:22:00Z',
    productId: '2',
    productTitle: 'Handcrafted Leather Messenger Bag',
    isRead: false
  },
  {
    id: 'm2',
    senderId: 's5',
    receiverId: 'current-user',
    senderName: 'TrailBlazer Bikes',
    senderAvatar: '/placeholder.svg',
    message: 'The mountain bike is still available. Would you like to schedule a time to see it in person?',
    timestamp: '2025-05-09T17:45:00Z',
    productId: '5',
    productTitle: 'Mountain Bike with Carbon Frame',
    isRead: true
  },
  {
    id: 'm3',
    senderId: 'current-user',
    receiverId: 's4',
    senderName: 'You',
    senderAvatar: '/placeholder.svg',
    message: 'Hi there! I\'m interested in your DJ mixer. Does it come with the original box and manual?',
    timestamp: '2025-05-08T09:30:00Z',
    productId: '4',
    productTitle: 'Professional DJ Mixer with Bluetooth',
    isRead: true
  }
];
