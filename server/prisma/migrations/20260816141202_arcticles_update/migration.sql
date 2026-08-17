-- CreateTable
CREATE TABLE `Article` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `excerpt` TEXT NULL,
    `body` TEXT NOT NULL,
    `category` ENUM('COMPANY_UPDATES', 'INDUSTRY_INSIGHTS') NOT NULL DEFAULT 'COMPANY_UPDATES',
    `image` VARCHAR(191) NULL,
    `isPublished` BOOLEAN NOT NULL DEFAULT false,
    `publishedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Article_slug_key`(`slug`),
    INDEX `Article_isPublished_idx`(`isPublished`),
    INDEX `Article_category_idx`(`category`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
