/*
  Warnings:

  - You are about to drop the `document` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `document` DROP FOREIGN KEY `Document_projectId_fkey`;

-- DropForeignKey
ALTER TABLE `document` DROP FOREIGN KEY `Document_quotationId_fkey`;

-- DropForeignKey
ALTER TABLE `document` DROP FOREIGN KEY `Document_serviceRequestId_fkey`;

-- AlterTable
ALTER TABLE `contactmessage` ADD COLUMN `isPublished` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `type` ENUM('ENQUIRY', 'COMPLAINT', 'TESTIMONIAL') NOT NULL DEFAULT 'ENQUIRY';

-- AlterTable
ALTER TABLE `notification` MODIFY `recipientType` ENUM('LABOUR', 'CLIENT', 'CONTACT') NOT NULL;

-- AlterTable
ALTER TABLE `project` ADD COLUMN `isPublished` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `publicDescription` TEXT NULL;

-- AlterTable
ALTER TABLE `service` ADD COLUMN `categoryId` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `document`;

-- CreateTable
CREATE TABLE `ServiceCategory` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `summary` VARCHAR(191) NULL,
    `description` TEXT NULL,
    `image` VARCHAR(191) NULL,
    `isPublished` BOOLEAN NOT NULL DEFAULT true,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ServiceCategory_slug_key`(`slug`),
    INDEX `ServiceCategory_isPublished_idx`(`isPublished`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ContactReply` (
    `id` VARCHAR(191) NOT NULL,
    `contactMessageId` VARCHAR(191) NOT NULL,
    `channel` ENUM('WHATSAPP', 'EMAIL') NOT NULL,
    `body` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ContactReply_contactMessageId_idx`(`contactMessageId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `ContactMessage_type_idx` ON `ContactMessage`(`type`);

-- CreateIndex
CREATE INDEX `ContactMessage_isPublished_idx` ON `ContactMessage`(`isPublished`);

-- CreateIndex
CREATE INDEX `Project_isPublished_idx` ON `Project`(`isPublished`);

-- CreateIndex
CREATE INDEX `Service_categoryId_idx` ON `Service`(`categoryId`);

-- AddForeignKey
ALTER TABLE `Service` ADD CONSTRAINT `Service_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `ServiceCategory`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ContactReply` ADD CONSTRAINT `ContactReply_contactMessageId_fkey` FOREIGN KEY (`contactMessageId`) REFERENCES `ContactMessage`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
