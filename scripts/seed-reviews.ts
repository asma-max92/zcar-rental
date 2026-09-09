import { prisma } from "../lib/db";

async function main() {
  const vehicles = await prisma.vehicle.findMany();

  if (vehicles.length === 0) {
    console.log("No vehicles found. Skipping review seed.");
    return;
  }

  const sampleReviews = [
    {
      customerName: "James Mitchell",
      rating: 5,
      text: "Absolutely incredible experience. The Mercedes G550 was pristine and the delivery to my hotel was seamless. Will definitely rent again!",
    },
    {
      customerName: "Sarah Chen",
      rating: 5,
      text: "Best car rental experience in Miami. The concierge service is top-notch and the car was immaculate. Highly recommend!",
    },
    {
      customerName: "Michael Rodriguez",
      rating: 4,
      text: "Great selection of luxury vehicles. The Porsche Macan S was a dream to drive around South Beach. Easy pickup and return process.",
    },
    {
      customerName: "Emily Watson",
      rating: 5,
      text: "Rented the Corvette C8 for my husband's birthday and it made his entire trip. Amazing service from start to finish.",
    },
    {
      customerName: "David Kim",
      rating: 5,
      text: "The team at Z Car Rental goes above and beyond. They even accommodated a last-minute extension without any hassle.",
    },
    {
      customerName: "Lisa Thompson",
      rating: 4,
      text: "Beautiful cars, professional service. The only reason for 4 stars is I wish they had more convertibles available during peak season.",
    },
    {
      customerName: "Robert Johnson",
      rating: 5,
      text: "Fifth time renting from Z Car. Consistently excellent. The Porsche Boxster S is my favorite — pure driving pleasure.",
    },
    {
      customerName: "Amanda Foster",
      rating: 5,
      text: "Made our Miami vacation unforgettable. The Mercedes CLE 300 was perfect for cruising Ocean Drive. Thank you!",
    },
    {
      customerName: "Christopher Lee",
      rating: 4,
      text: "Solid luxury rental experience. Good communication, clean vehicle, fair pricing. Will use again for business trips.",
    },
    {
      customerName: "Jessica Martinez",
      rating: 5,
      text: "From booking to return, everything was flawless. The WhatsApp support was incredibly responsive. 10/10 recommend!",
    },
  ];

  let createdCount = 0;

  for (const vehicle of vehicles) {
    // Assign 2 reviews per vehicle
    const reviewsForVehicle = sampleReviews.slice(
      createdCount % sampleReviews.length,
      (createdCount % sampleReviews.length) + 2
    );

    for (const reviewData of reviewsForVehicle) {
      await prisma.review.create({
        data: {
          vehicleId: vehicle.id,
          customerName: reviewData.customerName,
          rating: reviewData.rating,
          text: reviewData.text,
          approved: true,
        },
      });
      createdCount++;
    }
  }

  console.log(`Created ${createdCount} sample reviews.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
