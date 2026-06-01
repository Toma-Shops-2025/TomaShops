
# TomaShops - Video-First Marketplace

TomaShops is a modern marketplace platform that puts video content front and center, allowing sellers to showcase their products with short video clips and images, and enabling buyers to make more informed purchase decisions.

## Features

- **Video-First Approach**: Sellers can upload video demonstrations of their products
- **User Authentication**: Secure email/password authentication with separate buyer and seller accounts
- **Product Listings**: Create, view, edit, and delete product listings with videos, images, and detailed descriptions
- **Search & Filter**: Find products by category, condition, price range, and more
- **Messaging System**: Built-in messaging system for buyers and sellers to communicate
- **Favorites**: Save products to your favorites for later viewing
- **Payment Processing**: Secure payment processing for transactions
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (Authentication, Database, Storage)
- **State Management**: React Query, Context API
- **Forms**: React Hook Form with Zod validation
- **UI Components**: Custom components with Tailwind styling
- **Routing**: React Router

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn or pnpm
- Supabase account

### Environment Setup

1. Create a `.env.local` file in the root directory with the following variables:

```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:8080](http://localhost:8080) in your browser

### Database Setup

Run the SQL script in `supabase/migrations/schema.sql` in your Supabase SQL editor to set up the database schema.

## Deployment

1. Build the application:

```bash
npm run build
# or
yarn build
# or
pnpm build
```

2. Deploy the `dist` folder to your hosting provider

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details

## Contact

- Project Link: [https://github.com/yourusername/tomashops](https://github.com/yourusername/tomashops)

## Acknowledgements

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Supabase](https://supabase.io/)
- [React Router](https://reactrouter.com/)
- [React Query](https://tanstack.com/query/)
