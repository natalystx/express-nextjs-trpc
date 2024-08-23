CREATE TABLE `tasks` (
	`id` varchar(128) NOT NULL,
	`user_id` varchar(128),
	`title` varchar(255),
	`description` varchar(255),
	`done` boolean DEFAULT false,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `tasks_id` PRIMARY KEY(`id`)
);
