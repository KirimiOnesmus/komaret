-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `role` ENUM('OWNER', 'ADMIN') NOT NULL DEFAULT 'ADMIN',
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `passwordHash` VARCHAR(191) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `emailVerifiedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RefreshToken` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `tokenHash` VARCHAR(191) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `revokedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `RefreshToken_tokenHash_key`(`tokenHash`),
    INDEX `RefreshToken_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SiteManager` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `notes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Client` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `companyName` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `whatsappPhone` VARCHAR(191) NULL,
    `preferredChannel` ENUM('WHATSAPP', 'EMAIL') NOT NULL DEFAULT 'WHATSAPP',
    `address` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ServiceRequest` (
    `id` VARCHAR(191) NOT NULL,
    `reference` VARCHAR(191) NOT NULL,
    `contactName` VARCHAR(191) NOT NULL,
    `contactEmail` VARCHAR(191) NULL,
    `contactPhone` VARCHAR(191) NULL,
    `serviceType` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `location` VARCHAR(191) NULL,
    `status` ENUM('NEW', 'REVIEWING', 'ACCEPTED', 'REJECTED', 'CONVERTED') NOT NULL DEFAULT 'NEW',
    `estimateMin` DECIMAL(12, 2) NULL,
    `estimateMax` DECIMAL(12, 2) NULL,
    `clientId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ServiceRequest_reference_key`(`reference`),
    INDEX `ServiceRequest_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Quotation` (
    `id` VARCHAR(191) NOT NULL,
    `number` VARCHAR(191) NOT NULL,
    `clientId` VARCHAR(191) NOT NULL,
    `serviceRequestId` VARCHAR(191) NULL,
    `status` ENUM('DRAFT', 'SENT', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'EXPIRED', 'CONVERTED') NOT NULL DEFAULT 'DRAFT',
    `currency` VARCHAR(191) NOT NULL DEFAULT 'KES',
    `subtotal` DECIMAL(12, 2) NOT NULL DEFAULT 0,
    `discountType` ENUM('NONE', 'PERCENT', 'FIXED') NOT NULL DEFAULT 'NONE',
    `discountValue` DECIMAL(12, 2) NOT NULL DEFAULT 0,
    `taxRatePct` DECIMAL(5, 2) NOT NULL DEFAULT 16,
    `taxAmount` DECIMAL(12, 2) NOT NULL DEFAULT 0,
    `total` DECIMAL(12, 2) NOT NULL DEFAULT 0,
    `notes` TEXT NULL,
    `validUntil` DATETIME(3) NULL,
    `createdById` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Quotation_number_key`(`number`),
    INDEX `Quotation_clientId_idx`(`clientId`),
    INDEX `Quotation_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `QuotationItem` (
    `id` VARCHAR(191) NOT NULL,
    `quotationId` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `unit` VARCHAR(191) NULL,
    `quantity` DECIMAL(12, 2) NOT NULL DEFAULT 1,
    `unitPrice` DECIMAL(12, 2) NOT NULL DEFAULT 0,
    `lineTotal` DECIMAL(12, 2) NOT NULL DEFAULT 0,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,

    INDEX `QuotationItem_quotationId_idx`(`quotationId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Project` (
    `id` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `clientId` VARCHAR(191) NOT NULL,
    `serviceRequestId` VARCHAR(191) NULL,
    `quotationId` VARCHAR(191) NULL,
    `type` VARCHAR(191) NULL,
    `status` ENUM('PENDING', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    `location` VARCHAR(191) NULL,
    `description` TEXT NULL,
    `budget` DECIMAL(14, 2) NULL,
    `startDate` DATETIME(3) NULL,
    `expectedEndDate` DATETIME(3) NULL,
    `actualEndDate` DATETIME(3) NULL,
    `progressPct` INTEGER NOT NULL DEFAULT 0,
    `createdById` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Project_code_key`(`code`),
    UNIQUE INDEX `Project_serviceRequestId_key`(`serviceRequestId`),
    UNIQUE INDEX `Project_quotationId_key`(`quotationId`),
    INDEX `Project_clientId_idx`(`clientId`),
    INDEX `Project_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProjectManager` (
    `id` VARCHAR(191) NOT NULL,
    `projectId` VARCHAR(191) NOT NULL,
    `siteManagerId` VARCHAR(191) NOT NULL,
    `assignedById` VARCHAR(191) NULL,
    `assignedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `active` BOOLEAN NOT NULL DEFAULT true,

    INDEX `ProjectManager_siteManagerId_idx`(`siteManagerId`),
    UNIQUE INDEX `ProjectManager_projectId_siteManagerId_key`(`projectId`, `siteManagerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProjectUpdate` (
    `id` VARCHAR(191) NOT NULL,
    `projectId` VARCHAR(191) NOT NULL,
    `note` TEXT NOT NULL,
    `progressPct` INTEGER NULL,
    `createdById` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ProjectUpdate_projectId_idx`(`projectId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notification` (
    `id` VARCHAR(191) NOT NULL,
    `recipientType` ENUM('SITE_MANAGER', 'CLIENT') NOT NULL,
    `siteManagerId` VARCHAR(191) NULL,
    `clientId` VARCHAR(191) NULL,
    `channel` ENUM('WHATSAPP', 'EMAIL') NOT NULL,
    `templateType` VARCHAR(191) NOT NULL,
    `payload` JSON NOT NULL,
    `status` ENUM('QUEUED', 'SENDING', 'SENT', 'FAILED') NOT NULL DEFAULT 'QUEUED',
    `attempts` INTEGER NOT NULL DEFAULT 0,
    `providerMessageId` VARCHAR(191) NULL,
    `error` TEXT NULL,
    `projectId` VARCHAR(191) NULL,
    `quotationId` VARCHAR(191) NULL,
    `scheduledAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `sentAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Notification_status_idx`(`status`),
    INDEX `Notification_recipientType_idx`(`recipientType`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `RefreshToken` ADD CONSTRAINT `RefreshToken_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServiceRequest` ADD CONSTRAINT `ServiceRequest_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `Client`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Quotation` ADD CONSTRAINT `Quotation_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `Client`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Quotation` ADD CONSTRAINT `Quotation_serviceRequestId_fkey` FOREIGN KEY (`serviceRequestId`) REFERENCES `ServiceRequest`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Quotation` ADD CONSTRAINT `Quotation_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QuotationItem` ADD CONSTRAINT `QuotationItem_quotationId_fkey` FOREIGN KEY (`quotationId`) REFERENCES `Quotation`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Project` ADD CONSTRAINT `Project_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `Client`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Project` ADD CONSTRAINT `Project_serviceRequestId_fkey` FOREIGN KEY (`serviceRequestId`) REFERENCES `ServiceRequest`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Project` ADD CONSTRAINT `Project_quotationId_fkey` FOREIGN KEY (`quotationId`) REFERENCES `Quotation`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Project` ADD CONSTRAINT `Project_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProjectManager` ADD CONSTRAINT `ProjectManager_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProjectManager` ADD CONSTRAINT `ProjectManager_siteManagerId_fkey` FOREIGN KEY (`siteManagerId`) REFERENCES `SiteManager`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProjectUpdate` ADD CONSTRAINT `ProjectUpdate_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProjectUpdate` ADD CONSTRAINT `ProjectUpdate_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_siteManagerId_fkey` FOREIGN KEY (`siteManagerId`) REFERENCES `SiteManager`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `Client`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
