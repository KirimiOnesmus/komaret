
ALTER TABLE `notification` DROP FOREIGN KEY `Notification_siteManagerId_fkey`;

-- DropForeignKey
ALTER TABLE `projectmanager` DROP FOREIGN KEY `ProjectManager_projectId_fkey`;

-- DropForeignKey
ALTER TABLE `projectmanager` DROP FOREIGN KEY `ProjectManager_siteManagerId_fkey`;

-- DropForeignKey
ALTER TABLE `projectupdate` DROP FOREIGN KEY `ProjectUpdate_createdById_fkey`;

-- DropForeignKey
ALTER TABLE `projectupdate` DROP FOREIGN KEY `ProjectUpdate_projectId_fkey`;

-- DropIndex
DROP INDEX `Notification_siteManagerId_fkey` ON `notification`;

-- AlterTable
ALTER TABLE `notification` DROP COLUMN `siteManagerId`,
    ADD COLUMN `labourId` VARCHAR(191) NULL,
    MODIFY `recipientType` ENUM('LABOUR', 'CLIENT') NOT NULL;

-- AlterTable
ALTER TABLE `project` DROP COLUMN `type`,
    ADD COLUMN `publicSummary` TEXT NULL,
    ADD COLUMN `serviceId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `quotation` ADD COLUMN `serviceId` VARCHAR(191) NOT NULL,
    MODIFY `status` ENUM('DRAFT', 'SENT', 'UNDER_REVIEW', 'ACCEPTED', 'REJECTED', 'EXPIRED', 'CONVERTED') NOT NULL DEFAULT 'DRAFT';

-- AlterTable
ALTER TABLE `servicerequest` DROP COLUMN `serviceType`,
    ADD COLUMN `metadata` JSON NULL,
    ADD COLUMN `requestedEnd` DATETIME(3) NULL,
    ADD COLUMN `requestedMachineryId` VARCHAR(191) NULL,
    ADD COLUMN `requestedQuantity` INTEGER NULL,
    ADD COLUMN `requestedRole` VARCHAR(191) NULL,
    ADD COLUMN `requestedStart` DATETIME(3) NULL,
    ADD COLUMN `serviceId` VARCHAR(191) NOT NULL,
    ADD COLUMN `type` ENUM('SERVICE', 'MACHINERY', 'LABOUR', 'ESTIMATE') NOT NULL DEFAULT 'SERVICE',
    MODIFY `status` ENUM('SUBMITTED', 'UNDER_REVIEW', 'QUOTED', 'ACCEPTED', 'REJECTED', 'CLOSED', 'CONVERTED') NOT NULL DEFAULT 'SUBMITTED';

-- DropTable
DROP TABLE `projectmanager`;

-- DropTable
DROP TABLE `projectupdate`;

-- DropTable
DROP TABLE `sitemanager`;

-- CreateTable
CREATE TABLE `Service` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NULL,
    `summary` VARCHAR(191) NULL,
    `description` TEXT NULL,
    `heroImage` VARCHAR(191) NULL,
    `isPublished` BOOLEAN NOT NULL DEFAULT true,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `supportsServiceRequest` BOOLEAN NOT NULL DEFAULT true,
    `supportsMachineryRequest` BOOLEAN NOT NULL DEFAULT false,
    `supportsLabourRequest` BOOLEAN NOT NULL DEFAULT false,
    `supportsEstimate` BOOLEAN NOT NULL DEFAULT false,
    `estimateMarginPct` DECIMAL(5, 2) NOT NULL DEFAULT 10,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Service_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ServiceRate` (
    `id` VARCHAR(191) NOT NULL,
    `serviceId` VARCHAR(191) NOT NULL,
    `label` VARCHAR(191) NOT NULL,
    `unit` VARCHAR(191) NOT NULL,
    `unitPrice` DECIMAL(12, 2) NOT NULL,
    `minQty` DECIMAL(12, 2) NULL,
    `defaultQty` DECIMAL(12, 2) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `ServiceRate_serviceId_idx`(`serviceId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Lead` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `source` VARCHAR(191) NULL,
    `serviceId` VARCHAR(191) NULL,
    `status` ENUM('NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'LOST') NOT NULL DEFAULT 'NEW',
    `notes` TEXT NULL,
    `clientId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Lead_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FollowUp` (
    `id` VARCHAR(191) NOT NULL,
    `leadId` VARCHAR(191) NULL,
    `clientId` VARCHAR(191) NULL,
    `dueDate` DATETIME(3) NULL,
    `note` TEXT NOT NULL,
    `done` BOOLEAN NOT NULL DEFAULT false,
    `createdById` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `FollowUp_done_idx`(`done`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ContactMessage` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `subject` VARCHAR(191) NULL,
    `message` TEXT NOT NULL,
    `handled` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProjectImage` (
    `id` VARCHAR(191) NOT NULL,
    `projectId` VARCHAR(191) NOT NULL,
    `filename` VARCHAR(191) NOT NULL,
    `storedName` VARCHAR(191) NOT NULL,
    `path` VARCHAR(191) NOT NULL,
    `mimeType` VARCHAR(191) NOT NULL,
    `sizeBytes` INTEGER NOT NULL,
    `caption` VARCHAR(191) NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `isCover` BOOLEAN NOT NULL DEFAULT false,
    `showcase` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ProjectImage_projectId_idx`(`projectId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProjectActivity` (
    `id` VARCHAR(191) NOT NULL,
    `projectId` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `detail` TEXT NULL,
    `progressPct` INTEGER NULL,
    `isPublic` BOOLEAN NOT NULL DEFAULT false,
    `createdById` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ProjectActivity_projectId_idx`(`projectId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Machinery` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NULL,
    `description` TEXT NULL,
    `hireRate` DECIMAL(12, 2) NULL,
    `hireTerms` VARCHAR(191) NULL,
    `status` ENUM('AVAILABLE', 'RESERVED', 'HIRED', 'IN_USE', 'MAINTENANCE', 'UNAVAILABLE') NOT NULL DEFAULT 'AVAILABLE',
    `isPublic` BOOLEAN NOT NULL DEFAULT true,
    `imagePath` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Machinery_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProjectMachinery` (
    `id` VARCHAR(191) NOT NULL,
    `projectId` VARCHAR(191) NOT NULL,
    `machineryId` VARCHAR(191) NOT NULL,
    `startDate` DATETIME(3) NULL,
    `endDate` DATETIME(3) NULL,
    `rate` DECIMAL(12, 2) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'allocated',
    `assignedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `releasedAt` DATETIME(3) NULL,

    INDEX `ProjectMachinery_projectId_idx`(`projectId`),
    INDEX `ProjectMachinery_machineryId_idx`(`machineryId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Labour` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `role` ENUM('SITE_MANAGER', 'FOREMAN', 'PLUMBER', 'ELECTRICIAN', 'MASON', 'CARPENTER', 'PAINTER', 'GENERAL', 'OTHER') NOT NULL DEFAULT 'OTHER',
    `skill` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `internalRate` DECIMAL(12, 2) NULL,
    `status` ENUM('AVAILABLE', 'ASSIGNED', 'UNAVAILABLE', 'INACTIVE') NOT NULL DEFAULT 'AVAILABLE',
    `notes` TEXT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Labour_role_idx`(`role`),
    INDEX `Labour_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProjectLabour` (
    `id` VARCHAR(191) NOT NULL,
    `projectId` VARCHAR(191) NOT NULL,
    `labourId` VARCHAR(191) NOT NULL,
    `projectRole` VARCHAR(191) NULL,
    `assignedById` VARCHAR(191) NULL,
    `assignedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `releasedAt` DATETIME(3) NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,

    INDEX `ProjectLabour_labourId_idx`(`labourId`),
    UNIQUE INDEX `ProjectLabour_projectId_labourId_key`(`projectId`, `labourId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Document` (
    `id` VARCHAR(191) NOT NULL,
    `filename` VARCHAR(191) NOT NULL,
    `storedName` VARCHAR(191) NOT NULL,
    `path` VARCHAR(191) NOT NULL,
    `mimeType` VARCHAR(191) NOT NULL,
    `sizeBytes` INTEGER NOT NULL,
    `category` VARCHAR(191) NULL,
    `isPublic` BOOLEAN NOT NULL DEFAULT false,
    `projectId` VARCHAR(191) NULL,
    `serviceRequestId` VARCHAR(191) NULL,
    `quotationId` VARCHAR(191) NULL,
    `uploadedById` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Document_projectId_idx`(`projectId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Payment` (
    `id` VARCHAR(191) NOT NULL,
    `projectId` VARCHAR(191) NULL,
    `quotationId` VARCHAR(191) NULL,
    `clientId` VARCHAR(191) NULL,
    `invoiceId` VARCHAR(191) NULL,
    `amount` DECIMAL(14, 2) NOT NULL,
    `currency` VARCHAR(191) NOT NULL DEFAULT 'KES',
    `method` VARCHAR(191) NULL,
    `reference` VARCHAR(191) NULL,
    `paidAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `note` TEXT NULL,
    `recordedById` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Payment_projectId_idx`(`projectId`),
    INDEX `Payment_clientId_idx`(`clientId`),
    INDEX `Payment_invoiceId_idx`(`invoiceId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Invoice` (
    `id` VARCHAR(191) NOT NULL,
    `number` VARCHAR(191) NOT NULL,
    `clientId` VARCHAR(191) NOT NULL,
    `projectId` VARCHAR(191) NULL,
    `quotationId` VARCHAR(191) NULL,
    `currency` VARCHAR(191) NOT NULL DEFAULT 'KES',
    `status` ENUM('DRAFT', 'ISSUED', 'PARTIAL', 'PAID', 'CANCELLED') NOT NULL DEFAULT 'DRAFT',
    `subtotal` DECIMAL(14, 2) NOT NULL DEFAULT 0,
    `vatAmount` DECIMAL(14, 2) NOT NULL DEFAULT 0,
    `total` DECIMAL(14, 2) NOT NULL DEFAULT 0,
    `sellerPin` VARCHAR(191) NULL,
    `buyerPin` VARCHAR(191) NULL,
    `issuedAt` DATETIME(3) NULL,
    `notes` TEXT NULL,
    `createdById` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Invoice_number_key`(`number`),
    INDEX `Invoice_status_idx`(`status`),
    INDEX `Invoice_clientId_idx`(`clientId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InvoiceItem` (
    `id` VARCHAR(191) NOT NULL,
    `invoiceId` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `unit` VARCHAR(191) NULL,
    `quantity` DECIMAL(12, 2) NOT NULL DEFAULT 1,
    `unitPrice` DECIMAL(12, 2) NOT NULL DEFAULT 0,
    `taxCode` VARCHAR(191) NOT NULL DEFAULT 'B',
    `taxRatePct` DECIMAL(5, 2) NOT NULL DEFAULT 16,
    `lineNet` DECIMAL(14, 2) NOT NULL DEFAULT 0,
    `lineVat` DECIMAL(14, 2) NOT NULL DEFAULT 0,
    `lineTotal` DECIMAL(14, 2) NOT NULL DEFAULT 0,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,

    INDEX `InvoiceItem_invoiceId_idx`(`invoiceId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Project_serviceId_idx` ON `Project`(`serviceId`);

-- CreateIndex
CREATE INDEX `ServiceRequest_serviceId_idx` ON `ServiceRequest`(`serviceId`);

-- AddForeignKey
ALTER TABLE `ServiceRate` ADD CONSTRAINT `ServiceRate_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `Service`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Lead` ADD CONSTRAINT `Lead_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `Service`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Lead` ADD CONSTRAINT `Lead_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `Client`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FollowUp` ADD CONSTRAINT `FollowUp_leadId_fkey` FOREIGN KEY (`leadId`) REFERENCES `Lead`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FollowUp` ADD CONSTRAINT `FollowUp_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `Client`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServiceRequest` ADD CONSTRAINT `ServiceRequest_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `Service`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServiceRequest` ADD CONSTRAINT `ServiceRequest_requestedMachineryId_fkey` FOREIGN KEY (`requestedMachineryId`) REFERENCES `Machinery`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Quotation` ADD CONSTRAINT `Quotation_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `Service`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Project` ADD CONSTRAINT `Project_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `Service`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProjectImage` ADD CONSTRAINT `ProjectImage_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProjectActivity` ADD CONSTRAINT `ProjectActivity_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProjectActivity` ADD CONSTRAINT `ProjectActivity_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProjectMachinery` ADD CONSTRAINT `ProjectMachinery_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProjectMachinery` ADD CONSTRAINT `ProjectMachinery_machineryId_fkey` FOREIGN KEY (`machineryId`) REFERENCES `Machinery`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProjectLabour` ADD CONSTRAINT `ProjectLabour_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProjectLabour` ADD CONSTRAINT `ProjectLabour_labourId_fkey` FOREIGN KEY (`labourId`) REFERENCES `Labour`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Document` ADD CONSTRAINT `Document_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Document` ADD CONSTRAINT `Document_serviceRequestId_fkey` FOREIGN KEY (`serviceRequestId`) REFERENCES `ServiceRequest`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Document` ADD CONSTRAINT `Document_quotationId_fkey` FOREIGN KEY (`quotationId`) REFERENCES `Quotation`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_quotationId_fkey` FOREIGN KEY (`quotationId`) REFERENCES `Quotation`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `Client`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_invoiceId_fkey` FOREIGN KEY (`invoiceId`) REFERENCES `Invoice`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Invoice` ADD CONSTRAINT `Invoice_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `Client`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Invoice` ADD CONSTRAINT `Invoice_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Invoice` ADD CONSTRAINT `Invoice_quotationId_fkey` FOREIGN KEY (`quotationId`) REFERENCES `Quotation`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InvoiceItem` ADD CONSTRAINT `InvoiceItem_invoiceId_fkey` FOREIGN KEY (`invoiceId`) REFERENCES `Invoice`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_labourId_fkey` FOREIGN KEY (`labourId`) REFERENCES `Labour`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
