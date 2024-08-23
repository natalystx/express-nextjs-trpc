CREATE TABLE `users` (
	`id` varchar(128) NOT NULL,
	`name` varchar(255),
	`email` varchar(255),
	`password` varchar(255),
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`)
);
