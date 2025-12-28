CREATE TABLE `batteries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`brandId` int NOT NULL,
	`model` varchar(255) NOT NULL,
	`type` enum('lithium','lead-acid','lfp','agm') NOT NULL,
	`capacityKwh` decimal(6,2) NOT NULL,
	`voltage` int,
	`cycleLife` int,
	`depthOfDischarge` decimal(5,2),
	`warrantyYears` int,
	`qualityScore` decimal(3,1),
	`pros` json,
	`cons` json,
	`globalRating` decimal(2,1),
	`reviewSummary` text,
	`reviewSummarySinhala` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `batteries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ceb_tariffs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`category` enum('domestic','religious','industrial','commercial') NOT NULL DEFAULT 'domestic',
	`blockNumber` int NOT NULL,
	`minUnits` int NOT NULL,
	`maxUnits` int,
	`energyChargeLKR` decimal(8,2) NOT NULL,
	`fixedChargeLKR` decimal(8,2),
	`effectiveFrom` timestamp NOT NULL,
	`effectiveTo` timestamp,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `ceb_tariffs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `chat_history` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionId` varchar(64) NOT NULL,
	`userId` int,
	`role` enum('user','assistant') NOT NULL,
	`message` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `chat_history_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `hardware_brands` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`country` varchar(100),
	`website` text,
	`logo` text,
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `hardware_brands_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `inquiries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`packageId` int,
	`name` varchar(255) NOT NULL,
	`phone` varchar(50) NOT NULL,
	`email` varchar(320),
	`monthlyBillLKR` decimal(10,2),
	`message` text,
	`status` enum('pending','contacted','converted','closed') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `inquiries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `inverters` (
	`id` int AUTO_INCREMENT NOT NULL,
	`brandId` int NOT NULL,
	`model` varchar(255) NOT NULL,
	`type` enum('string','micro','hybrid','off-grid') NOT NULL,
	`capacity` decimal(6,2) NOT NULL,
	`maxDcInput` decimal(8,2),
	`efficiency` decimal(5,2),
	`mpptTrackers` int,
	`phases` enum('single','three') DEFAULT 'single',
	`warrantyYears` int,
	`features` json,
	`qualityScore` decimal(3,1),
	`pros` json,
	`cons` json,
	`globalRating` decimal(2,1),
	`reviewSummary` text,
	`reviewSummarySinhala` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `inverters_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `providers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`nameSinhala` varchar(255),
	`logo` text,
	`website` text,
	`phone` varchar(50),
	`email` varchar(320),
	`address` text,
	`description` text,
	`descriptionSinhala` text,
	`rating` decimal(2,1),
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `providers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `solar_packages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`providerId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`nameSinhala` varchar(255),
	`type` enum('on-grid','off-grid','hybrid') NOT NULL,
	`systemCapacity` decimal(6,2) NOT NULL,
	`panelId` int,
	`panelCount` int,
	`inverterId` int,
	`batteryId` int,
	`batteryCount` int,
	`priceLKR` decimal(12,2) NOT NULL,
	`installationIncluded` boolean DEFAULT true,
	`warrantyYears` int,
	`description` text,
	`descriptionSinhala` text,
	`features` json,
	`featuresSinhala` json,
	`financingAvailable` boolean DEFAULT false,
	`financingDetails` text,
	`estimatedMonthlyGeneration` decimal(8,2),
	`roiYears` decimal(4,2),
	`hardwareQualityScore` decimal(3,1),
	`isActive` boolean NOT NULL DEFAULT true,
	`isFeatured` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `solar_packages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `solar_panels` (
	`id` int AUTO_INCREMENT NOT NULL,
	`brandId` int NOT NULL,
	`model` varchar(255) NOT NULL,
	`wattage` int NOT NULL,
	`efficiency` decimal(4,2),
	`cellType` varchar(100),
	`dimensions` varchar(100),
	`weight` decimal(5,2),
	`warrantyYears` int,
	`performanceWarrantyYears` int,
	`degradationYear1` decimal(4,2),
	`degradationAnnual` decimal(4,2),
	`output25Years` decimal(5,2),
	`qualityScore` decimal(3,1),
	`pros` json,
	`cons` json,
	`globalRating` decimal(2,1),
	`reviewSummary` text,
	`reviewSummarySinhala` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `solar_panels_id` PRIMARY KEY(`id`)
);
