-- CreateTable
CREATE TABLE "profile_user" (
    "userId" UUID NOT NULL,
    "pointsCurrent" INTEGER NOT NULL DEFAULT 0,
    "level" INTEGER NOT NULL DEFAULT 1,
    "streakBest" INTEGER NOT NULL DEFAULT 0,
    "currentStreakDays" INTEGER NOT NULL DEFAULT 0,
    "avatarUrl" VARCHAR(255),
    "avatarPublicId" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "seniority" VARCHAR(100) NOT NULL,
    "specialization" VARCHAR(100) NOT NULL,

    CONSTRAINT "profile_user_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "practice_event" (
    "eventId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "occurredAt" TIMESTAMP(3) NOT NULL,
    "points" INTEGER NOT NULL,
    "sourceService" VARCHAR(255) NOT NULL,
    "domain" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "practice_event_pkey" PRIMARY KEY ("eventId")
);

-- CreateTable
CREATE TABLE "daily_activity" (
    "userId" UUID NOT NULL,
    "day" DATE NOT NULL,
    "domain" VARCHAR(100) NOT NULL,
    "events" INTEGER NOT NULL,
    "points" INTEGER NOT NULL,

    CONSTRAINT "daily_activity_pkey" PRIMARY KEY ("userId","day")
);

-- CreateTable
CREATE TABLE "streak_snapshot" (
    "userId" UUID NOT NULL,
    "startDate" DATE NOT NULL,
    "lastActive" DATE NOT NULL,
    "lengthDays" INTEGER NOT NULL,
    "pointsInStreak" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "streak_snapshot_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "streak_history" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    "lengthDays" INTEGER NOT NULL,
    "pointsTotal" INTEGER NOT NULL,
    "brokenBy" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "streak_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "level_rules" (
    "level" INTEGER NOT NULL,
    "minPoints" INTEGER NOT NULL,
    "maxPoints" INTEGER NOT NULL,

    CONSTRAINT "level_rules_pkey" PRIMARY KEY ("level")
);

-- CreateTable
CREATE TABLE "weekly_progress" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "weekStartDate" DATE NOT NULL,
    "completedDays" BOOLEAN[],
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "totalActiveDays" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "weekly_progress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "practice_event_userId_occurredAt_idx" ON "practice_event"("userId", "occurredAt");

-- CreateIndex
CREATE INDEX "practice_event_occurredAt_idx" ON "practice_event"("occurredAt");

-- CreateIndex
CREATE INDEX "daily_activity_userId_day_idx" ON "daily_activity"("userId", "day");

-- CreateIndex
CREATE INDEX "streak_history_userId_startDate_idx" ON "streak_history"("userId", "startDate");

-- CreateIndex
CREATE INDEX "weekly_progress_userId_weekStartDate_idx" ON "weekly_progress"("userId", "weekStartDate");

-- CreateIndex
CREATE UNIQUE INDEX "weekly_progress_userId_weekStartDate_key" ON "weekly_progress"("userId", "weekStartDate");

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
