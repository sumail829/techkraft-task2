export interface Property {
  id: string;
  title: string;
  location: string;
  price: string;
  beds: number;
  baths: number;
  sqft: number;
  type: string;
  tag?: string;
}

export const MOCK_PROPERTIES: Property[] = [
  {
    id: "prop_001",
    title: "Sunlit Corner Apartment",
    location: "Lazimpat, Kathmandu",
    price: "NPR 1.2 Cr",
    beds: 3,
    baths: 2,
    sqft: 1400,
    type: "Apartment",
    tag: "New",
  },
  {
    id: "prop_002",
    title: "Modern Villa with Garden",
    location: "Budhanilkantha, Kathmandu",
    price: "NPR 4.8 Cr",
    beds: 5,
    baths: 4,
    sqft: 3200,
    type: "Villa",
    tag: "Hot",
  },
  {
    id: "prop_003",
    title: "Cozy Studio in the Heart",
    location: "Thamel, Kathmandu",
    price: "NPR 65 L",
    beds: 1,
    baths: 1,
    sqft: 520,
    type: "Studio",
  },
  {
    id: "prop_004",
    title: "Executive Penthouse",
    location: "Jhamsikhel, Lalitpur",
    price: "NPR 6.5 Cr",
    beds: 4,
    baths: 3,
    sqft: 2800,
    type: "Penthouse",
    tag: "Premium",
  },
  {
    id: "prop_005",
    title: "Family Townhouse",
    location: "Bhaisepati, Lalitpur",
    price: "NPR 2.3 Cr",
    beds: 4,
    baths: 3,
    sqft: 2100,
    type: "Townhouse",
  },
  {
    id: "prop_006",
    title: "Investment Flat",
    location: "Chabahil, Kathmandu",
    price: "NPR 95 L",
    beds: 2,
    baths: 1,
    sqft: 850,
    type: "Apartment",
  },
];