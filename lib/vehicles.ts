export interface Vehicle {
  id: string;
  make: string;
  model: string;
  category: string;
  dailyRate: number;
  imageUrl: string;
  seats: number;
  transmission: string;
  featured: boolean;
  available: boolean;
}

export const fallbackVehicles: Vehicle[] = [
  {
    id: "1",
    make: "Mercedes",
    model: "G550",
    category: "Luxury SUV",
    dailyRate: 44900,
    imageUrl: "/images/g550/01.jpg",
    seats: 5,
    transmission: "Automatic",
    featured: true,
    available: true,
  },
  {
    id: "2",
    make: "Porsche",
    model: "Macan S",
    category: "Luxury SUV",
    dailyRate: 34900,
    imageUrl: "/images/porsche-macan/01.jpg",
    seats: 5,
    transmission: "Automatic",
    featured: true,
    available: true,
  },
  {
    id: "3",
    make: "Porsche",
    model: "Boxster S",
    category: "Convertible",
    dailyRate: 32900,
    imageUrl: "/images/porsche-boxster/01.jpg",
    seats: 2,
    transmission: "Automatic",
    featured: true,
    available: true,
  },
  {
    id: "4",
    make: "Mercedes",
    model: "CLE 300 Cabriolet",
    category: "Convertible",
    dailyRate: 27900,
    imageUrl: "/images/mercedes-cle/01.jpg",
    seats: 4,
    transmission: "Automatic",
    featured: true,
    available: true,
  },
  {
    id: "5",
    make: "Corvette",
    model: "C8",
    category: "Sports Car",
    dailyRate: 34900,
    imageUrl: "/images/corvette/01.jpg",
    seats: 2,
    transmission: "Automatic",
    featured: true,
    available: true,
  },
];

export const categories = ["All", "Luxury SUV", "Convertible", "Sports Car"];
