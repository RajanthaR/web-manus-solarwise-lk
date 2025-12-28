CREATE TABLE `review_votes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`reviewId` int NOT NULL,
	`userId` int NOT NULL,
	`isHelpful` boolean NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `review_votes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`packageId` int,
	`providerId` int,
	`overallRating` int NOT NULL,
	`installationRating` int,
	`performanceRating` int,
	`supportRating` int,
	`valueRating` int,
	`title` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`pros` json,
	`cons` json,
	`installationDate` timestamp,
	`systemSize` decimal(6,2),
	`monthlyGeneration` decimal(8,2),
	`previousBill` decimal(10,2),
	`currentBill` decimal(10,2),
	`photos` json,
	`isVerified` boolean DEFAULT false,
	`verificationNote` text,
	`status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
	`moderatorNote` text,
	`helpfulCount` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `reviews_id` PRIMARY KEY(`id`)
);
