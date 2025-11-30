-- AlterTable
ALTER TABLE "Reservation"
    ALTER COLUMN "status" SET DEFAULT 'CONFIRMED',
    ADD COLUMN     "guestsCount" INTEGER,
    ADD COLUMN     "channel" TEXT,
    ADD COLUMN     "totalPrice" INTEGER;
