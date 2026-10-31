CREATE TABLE `bookings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`room_id` integer NOT NULL,
	`user_id` integer NOT NULL,
	`start_at` integer NOT NULL,
	`end_at` integer NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` integer NOT NULL,
	`canceled_at` integer,
	FOREIGN KEY (`room_id`) REFERENCES `rooms`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `bookings_room_idx` ON `bookings` (`room_id`,`status`,`start_at`);--> statement-breakpoint
CREATE TABLE `resources` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `resources_name_unique` ON `resources` (`name`);--> statement-breakpoint
CREATE TABLE `room_resources` (
	`room_id` integer NOT NULL,
	`resource_id` integer NOT NULL,
	PRIMARY KEY(`room_id`, `resource_id`),
	FOREIGN KEY (`room_id`) REFERENCES `rooms`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`resource_id`) REFERENCES `resources`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `rooms` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`capacity` integer NOT NULL,
	`location` text,
	`active` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `rooms_name_unique` ON `rooms` (`name`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`role` text DEFAULT 'user' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);