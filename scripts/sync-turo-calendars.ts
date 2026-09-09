import { prisma } from "../lib/db";
import { fetchTuroCalendar } from "../lib/ical";

/**
 * Standalone script to sync all Turo calendars.
 * Run with: npx tsx scripts/sync-turo-calendars.ts
 * Or set up as a cron job.
 */
async function syncAllTuroCalendars() {
  console.log("Starting Turo calendar sync...");

  const vehicles = await prisma.vehicle.findMany({
    where: {
      turoIcalUrl: {
        not: "",
      },
    },
  });

  console.log(`Found ${vehicles.length} vehicles with Turo iCal URLs`);

  for (const vehicle of vehicles) {
    try {
      console.log(`\nSyncing ${vehicle.make} ${vehicle.model}...`);
      console.log(`  URL: ${vehicle.turoIcalUrl}`);

      const events = await fetchTuroCalendar(vehicle.turoIcalUrl);
      console.log(`  Events found: ${events.length}`);

      // Atomic transaction: delete old + insert new together
      const [, result] = await prisma.$transaction([
        prisma.blockedDate.deleteMany({
          where: {
            vehicleId: vehicle.id,
            source: "turo",
          },
        }),
        prisma.blockedDate.createMany({
          data: events.map((event) => ({
            vehicleId: vehicle.id,
            startDate: event.startDate,
            endDate: event.endDate,
            source: "turo",
            summary: event.summary || "Turo booking",
          })),
        }),
      ]);

      console.log(`  Blocked dates created: ${result.count}`);
    } catch (error) {
      console.error(`  Failed to sync ${vehicle.make} ${vehicle.model}:`, error);
    }
  }

  console.log("\nTuro calendar sync complete.");
}

// Run if called directly
if (require.main === module) {
  syncAllTuroCalendars()
    .catch(console.error)
    .finally(async () => {
      await prisma.$disconnect();
    });
}

export { syncAllTuroCalendars };
