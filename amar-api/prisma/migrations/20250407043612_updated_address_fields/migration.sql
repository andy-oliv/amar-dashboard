/*
  Warnings:

  - You are about to alter the column `address` on the `client` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(100)`.
  - You are about to alter the column `address` on the `contract` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(100)`.
  - Added the required column `city` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `neighborhood` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `Contract` table without a default value. This is not possible if the table is not empty.
  - Added the required column `neighborhood` to the `Contract` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `client` ADD COLUMN `city` VARCHAR(100) NOT NULL,
    ADD COLUMN `neighborhood` VARCHAR(100) NOT NULL,
    MODIFY `address` VARCHAR(100) NOT NULL,
    MODIFY `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE `clientcontract` MODIFY `assignedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE `contract` ADD COLUMN `city` VARCHAR(100) NOT NULL,
    ADD COLUMN `neighborhood` VARCHAR(100) NOT NULL,
    MODIFY `address` VARCHAR(100) NOT NULL,
    MODIFY `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE `package` MODIFY `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE `paymenttype` MODIFY `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP;
