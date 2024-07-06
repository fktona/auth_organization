/*
  Warnings:

  - A unique constraint covering the columns `[createdBy]` on the table `Organisation` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Organisation_createdBy_key" ON "Organisation"("createdBy");
