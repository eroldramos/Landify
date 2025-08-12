import { FavoritesDashboard } from "@/components/FavoriteDashboard";

const mockData = [
  {
    id: 21,
    userId: 1,
    listingId: 6,
    createdAt: "2025-08-11T07:07:30.367Z",
    user: {
      id: 1,
      email: "ramos.erold05@gmail.com",
      password: "$2b$10$tdkQpXa52q7ktEkc.wf0kOvfGDqElp3McRRWe0xf3rRLFN5YzExT6",
      name: "Erold Ramos",
      role: "ADMIN",
      createdAt: "2025-08-10T06:28:00.815Z",
      updatedAt: "2025-08-10T06:28:00.815Z",
    },
    listing: {
      id: 6,
      ownerId: 1,
      title: "Cozy 2-Bedroom Apartmentsss",
      description: "A beautiful apartment in the heart of the city.",
      address: "123 Main St, Metro City",
      priceCents: 12000000,
      propertyType: "APARTMENT",
      status: "FOR_RENT",
      createdAt: "2025-08-10T15:18:53.505Z",
      updatedAt: "2025-08-12T05:42:27.464Z",
      images: [
        {
          id: 17,
          listingId: 6,
          url: "https://bfrjareptubsqfznqlpa.supabase.co/storage/v1/object/public/landify-bucket/uploads/1754886436406_Edinburgh-Property-management.jpg",
          altText: "Edinburgh-Property-management.jpg",
          position: 1,
          createdAt: "2025-08-11T04:27:17.398Z",
        },
        {
          id: 18,
          listingId: 6,
          url: "https://bfrjareptubsqfznqlpa.supabase.co/storage/v1/object/public/landify-bucket/uploads/1754886436916_istockphoto-1396856251-612x612.jpg",
          altText: "istockphoto-1396856251-612x612.jpg",
          position: 2,
          createdAt: "2025-08-11T04:27:17.398Z",
        },
      ],
    },
  },
  {
    id: 20,
    userId: 1,
    listingId: 5,
    createdAt: "2025-08-11T00:55:42.132Z",
    user: {
      id: 1,
      email: "ramos.erold05@gmail.com",
      password: "$2b$10$tdkQpXa52q7ktEkc.wf0kOvfGDqElp3McRRWe0xf3rRLFN5YzExT6",
      name: "Erold Ramos",
      role: "ADMIN",
      createdAt: "2025-08-10T06:28:00.815Z",
      updatedAt: "2025-08-10T06:28:00.815Z",
    },
    listing: {
      id: 5,
      ownerId: 1,
      title: "Cozy 2-Bedroom Apartment",
      description: "A beautiful apartment in the heart of the city.",
      address: "123 Main St, Metro City",
      priceCents: 12000000,
      propertyType: "APARTMENT",
      status: "FOR_RENT",
      createdAt: "2025-08-10T14:01:15.602Z",
      updatedAt: "2025-08-10T14:01:15.602Z",
      images: [],
    },
  },
  {
    id: 15,
    userId: 1,
    listingId: null,
    createdAt: "2025-08-11T00:44:32.090Z",
    user: {
      id: 1,
      email: "ramos.erold05@gmail.com",
      password: "$2b$10$tdkQpXa52q7ktEkc.wf0kOvfGDqElp3McRRWe0xf3rRLFN5YzExT6",
      name: "Erold Ramos",
      role: "ADMIN",
      createdAt: "2025-08-10T06:28:00.815Z",
      updatedAt: "2025-08-10T06:28:00.815Z",
    },
    listing: null,
  },
];

export default function FavoritePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <FavoritesDashboard favorites={mockData} />
    </main>
  );
}
