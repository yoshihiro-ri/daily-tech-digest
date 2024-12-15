PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_articles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`url` text NOT NULL,
	`posted_at` integer,
	`created_at` integer DEFAULT 1734238399492
);
--> statement-breakpoint
INSERT INTO `__new_articles`("id", "title", "url", "posted_at", "created_at") SELECT "id", "title", "url", "posted_at", "created_at" FROM `articles`;--> statement-breakpoint
DROP TABLE `articles`;--> statement-breakpoint
ALTER TABLE `__new_articles` RENAME TO `articles`;--> statement-breakpoint
PRAGMA foreign_keys=ON;