/*
  Warnings:

  - The primary key for the `daily_activity` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `profile_user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `streak_snapshot` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "daily_activity" DROP CONSTRAINT "daily_activity_userId_fkey";

-- DropForeignKey
ALTER TABLE "practice_event" DROP CONSTRAINT "practice_event_userId_fkey";

-- DropForeignKey
ALTER TABLE "streak_history" DROP CONSTRAINT "streak_history_userId_fkey";

-- DropForeignKey
ALTER TABLE "streak_snapshot" DROP CONSTRAINT "streak_snapshot_userId_fkey";

-- DropForeignKey
ALTER TABLE "weekly_progress" DROP CONSTRAINT "weekly_progress_userId_fkey";

-- AlterTable
ALTER TABLE "daily_activity" DROP CONSTRAINT "daily_activity_pkey",
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ADD CONSTRAINT "daily_activity_pkey" PRIMARY KEY ("userId", "day");

-- AlterTable
ALTER TABLE "practice_event" ALTER COLUMN "userId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "profile_user" DROP CONSTRAINT "profile_user_pkey",
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ADD CONSTRAINT "profile_user_pkey" PRIMARY KEY ("userId");

-- AlterTable
ALTER TABLE "streak_history" ALTER COLUMN "userId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "streak_snapshot" DROP CONSTRAINT "streak_snapshot_pkey",
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ADD CONSTRAINT "streak_snapshot_pkey" PRIMARY KEY ("userId");

-- AlterTable
ALTER TABLE "weekly_progress" ALTER COLUMN "userId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "practice_event" ADD CONSTRAINT "practice_event_userId_fkey" FOREIGN KEY ("userId") REFERENCES "profile_user"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_activity" ADD CONSTRAINT "daily_activity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "profile_user"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "streak_snapshot" ADD CONSTRAINT "streak_snapshot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "profile_user"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "streak_history" ADD CONSTRAINT "streak_history_userId_fkey" FOREIGN KEY ("userId") REFERENCES "profile_user"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "weekly_progress" ADD CONSTRAINT "weekly_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "profile_user"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
