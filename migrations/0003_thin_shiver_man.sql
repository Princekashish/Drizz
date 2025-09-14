ALTER TABLE "sessions" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "expired_at" timestamp;