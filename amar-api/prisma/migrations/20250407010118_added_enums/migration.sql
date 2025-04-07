/*
  Warnings:

  - The values [CARTÃO] on the enum `PaymentType_name` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `client` MODIFY `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE `clientcontract` MODIFY `assignedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE `contract` ADD COLUMN `generalStatus` ENUM('SCHEDULED', 'EDITING', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'SCHEDULED',
    ADD COLUMN `isPaid` ENUM('PAID', 'PENDING') NOT NULL DEFAULT 'PENDING',
    ADD COLUMN `isSigned` ENUM('SIGNED', 'PENDING') NOT NULL DEFAULT 'PENDING',
    MODIFY `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE `package` MODIFY `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE `paymenttype` MODIFY `name` ENUM('PIX', 'CREDIT_CARD') NOT NULL,
    MODIFY `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP;
