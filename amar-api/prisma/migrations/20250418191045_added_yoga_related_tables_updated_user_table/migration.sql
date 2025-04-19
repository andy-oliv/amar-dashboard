/*
  Warnings:

  - You are about to drop the column `password` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `hashedPassword` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `clientcontract` DROP FOREIGN KEY `clientContract_clientId_fkey`;

-- DropForeignKey
ALTER TABLE `clientcontract` DROP FOREIGN KEY `clientContract_contractId_fkey`;

-- DropForeignKey
ALTER TABLE `contract` DROP FOREIGN KEY `Contract_packageId_fkey`;

-- DropForeignKey
ALTER TABLE `contract` DROP FOREIGN KEY `Contract_paymentTypeId_fkey`;

-- DropForeignKey
ALTER TABLE `notification` DROP FOREIGN KEY `Notification_clientId_fkey`;

-- DropIndex
DROP INDEX `clientContract_contractId_fkey` ON `clientcontract`;

-- DropIndex
DROP INDEX `Contract_packageId_fkey` ON `contract`;

-- DropIndex
DROP INDEX `Contract_paymentTypeId_fkey` ON `contract`;

-- DropIndex
DROP INDEX `Notification_clientId_fkey` ON `notification`;

-- AlterTable
ALTER TABLE `client` MODIFY `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE `clientcontract` MODIFY `assignedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE `contract` MODIFY `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE `notification` ADD COLUMN `userId` VARCHAR(191) NULL,
    MODIFY `type` ENUM('CONTRACT_CREATED', 'CONTRACT_SIGNED', 'PAYMENT_CONFIRMED', 'EVENT_FINISHED', 'CLASS_FINISHED', 'EVENT_TIME', 'CLASS_TIME', 'CUSTOM') NOT NULL,
    MODIFY `clientId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `package` MODIFY `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE `paymenttype` MODIFY `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `password`,
    ADD COLUMN `hashedPassword` VARCHAR(255) NOT NULL,
    ADD COLUMN `role` ENUM('ADMIN', 'YOGA_INSTRUCTOR', 'PHOTOGRAPHER', 'VIDEO_MAKER') NOT NULL,
    MODIFY `pictureUrl` VARCHAR(200) NULL,
    MODIFY `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE `Child` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` TIMESTAMP(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Family` (
    `clientId` VARCHAR(191) NOT NULL,
    `childId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`clientId`, `childId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `YogaClass` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `type` ENUM('ADULTS', 'CHILDREN') NOT NULL,
    `status` ENUM('SCHEDULED', 'CANCELLED', 'DONE', 'RESCHEDULED') NOT NULL,
    `locationId` INTEGER NULL,
    `date` DATETIME NOT NULL,
    `price` DOUBLE NOT NULL,
    `instructorId` VARCHAR(191) NOT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` TIMESTAMP(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Location` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `address` VARCHAR(100) NOT NULL,
    `neighborhood` VARCHAR(100) NOT NULL,
    `city` VARCHAR(100) NOT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` TIMESTAMP(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `YogaChildStudent` (
    `yogaClassId` INTEGER NOT NULL,
    `studentId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`yogaClassId`, `studentId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `YogaAdultStudent` (
    `yogaClassId` INTEGER NOT NULL,
    `studentId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`yogaClassId`, `studentId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RollCall` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `classId` INTEGER NOT NULL,
    `date` DATETIME NOT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` TIMESTAMP(0) NOT NULL,

    UNIQUE INDEX `RollCall_classId_key`(`classId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Presence` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `studentType` ENUM('ADULT', 'CHILD') NOT NULL,
    `rollCallId` INTEGER NOT NULL,
    `adultStudentId` VARCHAR(191) NULL,
    `childStudentId` VARCHAR(191) NULL,
    `isPresent` BOOLEAN NOT NULL,
    `absenceReason` TEXT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` TIMESTAMP(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `User_email_key` ON `User`(`email`);

-- AddForeignKey
ALTER TABLE `Family` ADD CONSTRAINT `Family_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `Client`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Family` ADD CONSTRAINT `Family_childId_fkey` FOREIGN KEY (`childId`) REFERENCES `Child`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `YogaClass` ADD CONSTRAINT `YogaClass_locationId_fkey` FOREIGN KEY (`locationId`) REFERENCES `Location`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `YogaClass` ADD CONSTRAINT `YogaClass_instructorId_fkey` FOREIGN KEY (`instructorId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `YogaChildStudent` ADD CONSTRAINT `YogaChildStudent_yogaClassId_fkey` FOREIGN KEY (`yogaClassId`) REFERENCES `YogaClass`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `YogaChildStudent` ADD CONSTRAINT `YogaChildStudent_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Child`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `YogaAdultStudent` ADD CONSTRAINT `YogaAdultStudent_yogaClassId_fkey` FOREIGN KEY (`yogaClassId`) REFERENCES `YogaClass`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `YogaAdultStudent` ADD CONSTRAINT `YogaAdultStudent_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Client`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RollCall` ADD CONSTRAINT `RollCall_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `YogaClass`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Presence` ADD CONSTRAINT `Presence_rollCallId_fkey` FOREIGN KEY (`rollCallId`) REFERENCES `RollCall`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Presence` ADD CONSTRAINT `Presence_adultStudentId_fkey` FOREIGN KEY (`adultStudentId`) REFERENCES `Client`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Presence` ADD CONSTRAINT `Presence_childStudentId_fkey` FOREIGN KEY (`childStudentId`) REFERENCES `Child`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Contract` ADD CONSTRAINT `Contract_paymentTypeId_fkey` FOREIGN KEY (`paymentTypeId`) REFERENCES `PaymentType`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Contract` ADD CONSTRAINT `Contract_packageId_fkey` FOREIGN KEY (`packageId`) REFERENCES `Package`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClientContract` ADD CONSTRAINT `ClientContract_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `Client`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClientContract` ADD CONSTRAINT `ClientContract_contractId_fkey` FOREIGN KEY (`contractId`) REFERENCES `Contract`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `Client`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
