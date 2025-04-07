/*
  Warnings:

  - You are about to drop the column `commuting_fee` on the `event` table. All the data in the column will be lost.
  - You are about to drop the column `discount` on the `event` table. All the data in the column will be lost.
  - You are about to drop the column `event_start_time` on the `event` table. All the data in the column will be lost.
  - You are about to drop the column `payment_due_date` on the `event` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `Client` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cpf]` on the table `Client` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `commutingFee` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `discountPercentage` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `eventStartTime` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `observations` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `packageId` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentDueDate` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentTypeId` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `client` ADD COLUMN `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN `updatedAt` TIMESTAMP(0) NOT NULL;

-- AlterTable
ALTER TABLE `event` DROP COLUMN `commuting_fee`,
    DROP COLUMN `discount`,
    DROP COLUMN `event_start_time`,
    DROP COLUMN `payment_due_date`,
    ADD COLUMN `commutingFee` DOUBLE NOT NULL,
    ADD COLUMN `discountPercentage` DOUBLE NOT NULL,
    ADD COLUMN `eventStartTime` TIME NOT NULL,
    ADD COLUMN `observations` TEXT NOT NULL,
    ADD COLUMN `packageId` INTEGER NOT NULL,
    ADD COLUMN `paymentDueDate` DATE NOT NULL,
    ADD COLUMN `paymentTypeId` INTEGER NOT NULL,
    MODIFY `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE `clientEvent` (
    `clientId` VARCHAR(191) NOT NULL,
    `eventId` VARCHAR(191) NOT NULL,
    `assignedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (`clientId`, `eventId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PaymentType` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` ENUM('PIX', 'CARTÃO') NOT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` TIMESTAMP(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Package` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(20) NOT NULL,
    `pixPrice` DOUBLE NOT NULL,
    `cardPrice` DOUBLE NOT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` TIMESTAMP(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Client_email_key` ON `Client`(`email`);

-- CreateIndex
CREATE UNIQUE INDEX `Client_cpf_key` ON `Client`(`cpf`);

-- AddForeignKey
ALTER TABLE `Event` ADD CONSTRAINT `Event_paymentTypeId_fkey` FOREIGN KEY (`paymentTypeId`) REFERENCES `PaymentType`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Event` ADD CONSTRAINT `Event_packageId_fkey` FOREIGN KEY (`packageId`) REFERENCES `Package`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `clientEvent` ADD CONSTRAINT `clientEvent_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `Client`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `clientEvent` ADD CONSTRAINT `clientEvent_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Event`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
