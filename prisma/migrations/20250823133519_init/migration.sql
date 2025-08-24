/*
  Warnings:

  - You are about to drop the `user_invoice` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."user_invoice" DROP CONSTRAINT "user_invoice_invoice_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."user_invoice" DROP CONSTRAINT "user_invoice_user_id_fkey";

-- DropTable
DROP TABLE "public"."user_invoice";

-- CreateTable
CREATE TABLE "public"."UserInvoice" (
    "user_invoice_id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "invoice_id" BIGINT NOT NULL,
    "date_link" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "first_view" TIMESTAMP(3),
    "last_view" TIMESTAMP(3),

    CONSTRAINT "UserInvoice_pkey" PRIMARY KEY ("user_invoice_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserInvoice_user_id_invoice_id_key" ON "public"."UserInvoice"("user_id", "invoice_id");

-- AddForeignKey
ALTER TABLE "public"."UserInvoice" ADD CONSTRAINT "UserInvoice_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserInvoice" ADD CONSTRAINT "UserInvoice_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "public"."Invoice"("invoice_id") ON DELETE RESTRICT ON UPDATE CASCADE;
