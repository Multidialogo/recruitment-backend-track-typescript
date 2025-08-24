-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "public"."TaxType" AS ENUM ('INDIVIDUAL', 'FREELANCER', 'COMPANY', 'FOREIGN_EU', 'FOREIGN_NON_EU');

-- CreateEnum
CREATE TYPE "public"."InvoiceStatus" AS ENUM ('DRAFT', 'ISSUED', 'PAID', 'VOID');

-- CreateEnum
CREATE TYPE "public"."PaymentMethod" AS ENUM ('BANK_TRANSFER', 'CARD', 'CASH', 'OTHER');

-- CreateTable
CREATE TABLE "public"."User" (
    "id_user" BIGSERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "role" "public"."UserRole" NOT NULL DEFAULT 'USER',
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id_user")
);

-- CreateTable
CREATE TABLE "public"."UserTaxProfile" (
    "user_tax_profile_id" BIGSERIAL NOT NULL,
    "id_user" BIGINT NOT NULL,
    "type" "public"."TaxType" NOT NULL,
    "legalName" TEXT NOT NULL,
    "fiscalCode" TEXT,
    "vatNumber" TEXT,
    "addressLine1" TEXT NOT NULL,
    "addressLine2" TEXT,
    "city" TEXT NOT NULL,
    "province" TEXT,
    "postalCode" TEXT NOT NULL,
    "countryCode" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserTaxProfile_pkey" PRIMARY KEY ("user_tax_profile_id")
);

-- CreateTable
CREATE TABLE "public"."Customer" (
    "customer_id" BIGSERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("customer_id")
);

-- CreateTable
CREATE TABLE "public"."CustomerTaxProfile" (
    "customer_tax_profile_id" BIGSERIAL NOT NULL,
    "customer_id" BIGINT NOT NULL,
    "type" "public"."TaxType" NOT NULL,
    "legalName" TEXT NOT NULL,
    "fiscalCode" TEXT,
    "vatNumber" TEXT,
    "addressLine1" TEXT NOT NULL,
    "addressLine2" TEXT,
    "city" TEXT NOT NULL,
    "province" TEXT,
    "postalCode" TEXT NOT NULL,
    "countryCode" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomerTaxProfile_pkey" PRIMARY KEY ("customer_tax_profile_id")
);

-- CreateTable
CREATE TABLE "public"."Invoice" (
    "invoice_id" BIGSERIAL NOT NULL,
    "invoice_number" BIGINT NOT NULL,
    "issueDate" TIMESTAMP(3) NOT NULL,
    "due_date" TIMESTAMP(3) NOT NULL,
    "status" "public"."InvoiceStatus" NOT NULL DEFAULT 'DRAFT',
    "issuerUserId" BIGINT NOT NULL,
    "issuerTaxProfileId" BIGINT NOT NULL,
    "billToCustomerId" BIGINT NOT NULL,
    "billToCustomerTaxProfileId" BIGINT NOT NULL,
    "shipToCustomerId" BIGINT,
    "shipToCustomerTaxProfileId" BIGINT,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "subtotal" DECIMAL(18,4) NOT NULL,
    "taxTotal" DECIMAL(18,4) NOT NULL,
    "grandTotal" DECIMAL(18,4) NOT NULL,
    "paymentMethod" "public"."PaymentMethod" NOT NULL DEFAULT 'BANK_TRANSFER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("invoice_id")
);

-- CreateTable
CREATE TABLE "public"."InvoiceItem" (
    "invoice_item_id" BIGSERIAL NOT NULL,
    "invoice_id" BIGINT NOT NULL,
    "codProduct" TEXT,
    "description" TEXT NOT NULL,
    "quantity" DECIMAL(18,4) NOT NULL,
    "unitPrice" DECIMAL(18,4) NOT NULL,
    "taxRate" DECIMAL(5,2) NOT NULL,
    "lineTotal" DECIMAL(18,4) NOT NULL,

    CONSTRAINT "InvoiceItem_pkey" PRIMARY KEY ("invoice_item_id")
);

-- CreateTable
CREATE TABLE "public"."user_invoice" (
    "user_invoice_id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "invoice_id" BIGINT NOT NULL,
    "date_link" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "first_view" TIMESTAMP(3),
    "last_view" TIMESTAMP(3),

    CONSTRAINT "user_invoice_pkey" PRIMARY KEY ("user_invoice_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "public"."User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "UserTaxProfile_id_user_key" ON "public"."UserTaxProfile"("id_user");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_email_key" ON "public"."Customer"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_phone_key" ON "public"."Customer"("phone");

-- CreateIndex
CREATE INDEX "Customer_surname_name_idx" ON "public"."Customer"("surname", "name");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerTaxProfile_customer_id_key" ON "public"."CustomerTaxProfile"("customer_id");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_invoice_number_key" ON "public"."Invoice"("invoice_number");

-- CreateIndex
CREATE UNIQUE INDEX "InvoiceItem_invoice_id_key" ON "public"."InvoiceItem"("invoice_id");

-- CreateIndex
CREATE INDEX "InvoiceItem_invoice_id_idx" ON "public"."InvoiceItem"("invoice_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_invoice_user_id_invoice_id_key" ON "public"."user_invoice"("user_id", "invoice_id");

-- AddForeignKey
ALTER TABLE "public"."UserTaxProfile" ADD CONSTRAINT "UserTaxProfile_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "public"."User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CustomerTaxProfile" ADD CONSTRAINT "CustomerTaxProfile_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "public"."Customer"("customer_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Invoice" ADD CONSTRAINT "Invoice_issuerUserId_fkey" FOREIGN KEY ("issuerUserId") REFERENCES "public"."User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Invoice" ADD CONSTRAINT "Invoice_issuerTaxProfileId_fkey" FOREIGN KEY ("issuerTaxProfileId") REFERENCES "public"."UserTaxProfile"("user_tax_profile_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Invoice" ADD CONSTRAINT "Invoice_billToCustomerId_fkey" FOREIGN KEY ("billToCustomerId") REFERENCES "public"."Customer"("customer_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Invoice" ADD CONSTRAINT "Invoice_billToCustomerTaxProfileId_fkey" FOREIGN KEY ("billToCustomerTaxProfileId") REFERENCES "public"."CustomerTaxProfile"("customer_tax_profile_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Invoice" ADD CONSTRAINT "Invoice_shipToCustomerId_fkey" FOREIGN KEY ("shipToCustomerId") REFERENCES "public"."Customer"("customer_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Invoice" ADD CONSTRAINT "Invoice_shipToCustomerTaxProfileId_fkey" FOREIGN KEY ("shipToCustomerTaxProfileId") REFERENCES "public"."CustomerTaxProfile"("customer_tax_profile_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."InvoiceItem" ADD CONSTRAINT "InvoiceItem_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "public"."Invoice"("invoice_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_invoice" ADD CONSTRAINT "user_invoice_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_invoice" ADD CONSTRAINT "user_invoice_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "public"."Invoice"("invoice_id") ON DELETE RESTRICT ON UPDATE CASCADE;

