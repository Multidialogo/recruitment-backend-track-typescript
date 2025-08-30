import {
  PrismaClient,
  Prisma,
  InvoiceStatus,
  PaymentMethod,
  TaxType,
  UserRole,
} from "@prisma/client";

import bcrypt from "bcrypt";


const prisma = new PrismaClient();

// Helpers
const d = (v: string) => new Prisma.Decimal(v);
const dt = (iso: string) => new Date(iso);

async function main() {
 // 1) DELETE
  await prisma.$transaction([
    prisma.userInvoice.deleteMany(),
    prisma.invoiceItem.deleteMany(),
    prisma.invoice.deleteMany(),
    prisma.customerTaxProfile.deleteMany(),
    prisma.userTaxProfile.deleteMany(),
    prisma.customer.deleteMany(),
    prisma.user.deleteMany(),
  ]);
  console.log("Existing data deleted successfully.");

  // 2) USERS (4)
  const admin1 = await prisma.user.create({
    data: {
      email: "admin1@example.com",
      phone: "+390600000001",
      passwordHash: await bcrypt.hash("admin123", 10),
      firstName: "Admin",
      lastName: "One",
      role: UserRole.ADMIN,
      isEnabled: true,
    },
  });
  console.log(`Created user with id: ${admin1.id}`);

  const user1 = await prisma.user.create({
    data: {
      email: "user1@example.com",
      phone: "+390600000002",
      passwordHash: await bcrypt.hash("user123", 10),
      firstName: "User",
      lastName: "One",
      role: UserRole.USER,
      isEnabled: true,
    },
  });
  console.log(`Created user with id: ${user1.id}`);

  const admin2 = await prisma.user.create({
    data: {
      email: "admin2@example.com",
      phone: "+390600000003",
      passwordHash: await bcrypt.hash("admin456", 10),
      firstName: "Admin",
      lastName: "Two",
      role: UserRole.ADMIN,
      isEnabled: true,
    },
  });
  console.log(`Created user with id: ${admin2.id}`);

  const user2 = await prisma.user.create({
    data: {
      email: "user2@example.com",
      phone: "+390600000004",
      passwordHash: await bcrypt.hash("user456", 10),
      firstName: "User",
      lastName: "Two",
      role: UserRole.USER,
      isEnabled: true,
    },
  });
  console.log(`Created user with id: ${user2.id}`);

  // 3) USER TAX PROFILES
  const admin1Tax = await prisma.userTaxProfile.create({
    data: {
      userId: admin1.id,
      type: TaxType.FREELANCER,
      legalName: "Admin One - Studio",
      fiscalCode: "ADMONE80A01H501A",
      vatNumber: "IT01234560001",
      addressLine1: "Via Centrale 1",
      city: "Torino",
      province: "TO",
      postalCode: "10100",
      countryCode: "IT",
      isActive: true,
    },
  });
  console.log(`Created tax profile with id: ${admin1Tax.id} for user id: ${admin1.id}`);

  const user1Tax = await prisma.userTaxProfile.create({
    data: {
      userId: user1.id,
      type: TaxType.INDIVIDUAL,
      legalName: "",
      fiscalCode: "USRONE80A01H501B",
      vatNumber: "",
      addressLine1: "Via Secondaria 2",
      city: "Roma",
      province: "RM",
      postalCode: "00100",
      countryCode: "IT",
      isActive: true,
    },
  });
  console.log(`Created tax profile with id: ${user1Tax.id} for user id: ${user1.id}`);

  const admin2Tax = await prisma.userTaxProfile.create({
    data: {
      userId: admin2.id,
      type: TaxType.COMPANY,
      legalName: "Admin Two SRL",
      fiscalCode: "ADMTWO80A01H501C",
      vatNumber: "IT01234560002",
      addressLine1: "Corso Italia 3",
      city: "Milano",
      province: "MI",
      postalCode: "20100",
      countryCode: "IT",
      isActive: true,
    },
  });
  console.log(`Created tax profile with id: ${admin2Tax.id} for user id: ${admin2.id}`);

  const user2Tax = await prisma.userTaxProfile.create({
    data: {
      userId: user2.id,
      type: TaxType.INDIVIDUAL,
      legalName: "",
      fiscalCode: "USRTWO80A01H501D",
      vatNumber: "",
      addressLine1: "Via Roma 20",
      city: "Napoli",
      province: "NA",
      postalCode: "80100",
      countryCode: "IT",
      isActive: true,
    },
  });
  console.log(`Created tax profile with id: ${user2Tax.id} for user id: ${user2.id}`);

  // 4) CUSTOMERS (4)
  const customer1 = await prisma.customer.create({
    data: {
      email: "customer1@azienda.it",
      phone: "+390612345678",
      firstName: "Customer",
      lastName: "One",
      isEnabled: true,
    },
  });
  console.log(`Created customer1 with id: ${customer1.id}`);

  const customer2 = await prisma.customer.create({
    data: {
      email: "customer2@azienda.it",
      phone: "+390612345679",
      firstName: "Customer",
      lastName: "Two",
      isEnabled: true,
    },
  });
  console.log(`Created customer2 with id: ${customer2.id}`);

  const customer3 = await prisma.customer.create({
    data: {
      email: "customer3@azienda.it",
      phone: "+390612345680",
      firstName: "Customer",
      lastName: "Three",
      isEnabled: true,
    },
  });
  console.log(`Created customer3 with id: ${customer3.id}`);

  const customer4 = await prisma.customer.create({
    data: {
      email: "customer4@azienda.it",
      phone: "+390612345681",
      firstName: "Customer",
      lastName: "Four",
      isEnabled: true,
    },
  });
  console.log(`Created customer4 with id: ${customer4.id}`);

  // 5) CUSTOMER TAX PROFILES
  const customer1Tax = await prisma.customerTaxProfile.create({
    data: {
      customerId: customer1.id,
      type: TaxType.COMPANY,
      legalName: "Customer One SRL",
      fiscalCode: "CSTONE80B01H501X",
      vatNumber: "IT09876543211",
      addressLine1: "Via Milano 1",
      city: "Milano",
      province: "MI",
      postalCode: "20100",
      countryCode: "IT",
      isActive: true,
    },
  });
  console.log(`Created tax profile with id: ${customer1Tax.id} for customer id: ${customer1.id}`);

  const customer2Tax = await prisma.customerTaxProfile.create({
    data: {
      customerId: customer2.id,
      type: TaxType.COMPANY,
      legalName: "Customer Two SPA",
      fiscalCode: "CSTTWO80B01H501Y",
      vatNumber: "IT09876543212",
      addressLine1: "Via Roma 2",
      city: "Roma",
      province: "RM",
      postalCode: "00100",
      countryCode: "IT",
      isActive: true,
    },
  });
  console.log(`Created tax profile with id: ${customer2Tax.id} for customer id: ${customer2.id}`);

  const customer3Tax = await prisma.customerTaxProfile.create({
    data: {
      customerId: customer3.id,
      type: TaxType.COMPANY,
      legalName: "Customer Three SNC",
      fiscalCode: "CSTTHREE80B01H501Z",
      vatNumber: "IT09876543213",
      addressLine1: "Via Napoli 3",
      city: "Napoli",
      province: "NA",
      postalCode: "80100",
      countryCode: "IT",
      isActive: true,
    },
  });
  console.log(`Created tax profile with id: ${customer3Tax.id} for customer id: ${customer3.id}`);

  const customer4Tax = await prisma.customerTaxProfile.create({
    data: {
      customerId: customer4.id,
      type: TaxType.COMPANY,
      legalName: "Customer Four SRLS",
      fiscalCode: "CSTFOUR80B01H501W",
      vatNumber: "IT09876543214",
      addressLine1: "Via Firenze 4",
      city: "Firenze",
      province: "FI",
      postalCode: "50100",
      countryCode: "IT",
      isActive: true,
    },
  });
  console.log(`Created tax profile with id: ${customer4Tax.id} for customer id: ${customer4.id}`);

  // 6) INVOICES (4)
  const invoice1 = await prisma.invoice.create({
    data: {
      invoiceNumber: 2025002001n,
      issueDate: dt("2025-08-01T10:00:00.000Z"),
      dueDate: dt("2025-08-31T23:59:59.000Z"),
      status: InvoiceStatus.DRAFT,
      currency: "EUR",
      issuerUserId: admin1.id,
      issuerTaxProfileId: admin1Tax.id,
      billToCustomerId: customer1.id,
      billToCustomerTaxProfileId: customer1Tax.id,
      subtotal: d("1000.00"),
      taxTotal: d("220.00"),
      grandTotal: d("1220.00"),
      paymentMethod: PaymentMethod.BANK_TRANSFER,
    },
  });
  console.log(`Created invoice with id: ${invoice1.id}`);

  const invoice2 = await prisma.invoice.create({
    data: {
      invoiceNumber: 2025002002n,
      issueDate: dt("2025-08-05T10:00:00.000Z"),
      dueDate: dt("2025-09-04T23:59:59.000Z"),
      status: InvoiceStatus.ISSUED,
      currency: "EUR",
      issuerUserId: user1.id,
      issuerTaxProfileId: user1Tax.id,
      billToCustomerId: customer2.id,
      billToCustomerTaxProfileId: customer2Tax.id,
      subtotal: d("300.00"),
      taxTotal: d("66.00"),
      grandTotal: d("366.00"),
      paymentMethod: PaymentMethod.CARD,
    },
  });
  console.log(`Created invoice with id: ${invoice2.id}`);

  const invoice3 = await prisma.invoice.create({
    data: {
      invoiceNumber: 2025002003n,
      issueDate: dt("2025-08-10T10:00:00.000Z"),
      dueDate: dt("2025-09-09T23:59:59.000Z"),
      status: InvoiceStatus.PAID,
      currency: "EUR",
      issuerUserId: admin2.id,
      issuerTaxProfileId: admin2Tax.id,
      billToCustomerId: customer3.id,
      billToCustomerTaxProfileId: customer3Tax.id,
      subtotal: d("500.00"),
      taxTotal: d("110.00"),
      grandTotal: d("610.00"),
      paymentMethod: PaymentMethod.BANK_TRANSFER,
    },
  });
  console.log(`Created invoice with id: ${invoice3.id}`);

  const invoice4 = await prisma.invoice.create({
    data: {
      invoiceNumber: 2025002004n,
      issueDate: dt("2025-08-15T10:00:00.000Z"),
      dueDate: dt("2025-09-14T23:59:59.000Z"),
      status: InvoiceStatus.PAID,
      currency: "EUR",
      issuerUserId: user2.id,
      issuerTaxProfileId: user2Tax.id,
      billToCustomerId: customer4.id,
      billToCustomerTaxProfileId: customer4Tax.id,
      subtotal: d("800.00"),
      taxTotal: d("176.00"),
      grandTotal: d("976.00"),
      paymentMethod: PaymentMethod.CARD,
    },
  });
  console.log(`Created invoice with id: ${invoice4.id}`);

  // 7) INVOICE ITEMS
  await prisma.invoiceItem.create({
    data: {
      invoiceId: invoice1.id,
      codProduct: "CONS-001",
      description: "Consulenza software - Luglio",
      quantity: d("10.0000"),
      unitPrice: d("100.00"),
      taxRate: d("22.00"),
      lineTotal: d("1220.00"),
    },
  });
  console.log(`Created invoice item for invoice id: ${invoice1.id}`);

  await prisma.invoiceItem.create({
    data: {
      invoiceId: invoice2.id,
      codProduct: "DEV-PIANO",
      description: "Sviluppo feature - Sprint 32",
      quantity: d("3.0000"),
      unitPrice: d("100.00"),
      taxRate: d("22.00"),
      lineTotal: d("366.00"),
    },
  });
  console.log(`Created invoice item for invoice id: ${invoice2.id}`);

  await prisma.invoiceItem.create({
    data: {
      invoiceId: invoice3.id,
      codProduct: "LIC-SW",
      description: "Licenze software annuali",
      quantity: d("5.0000"),
      unitPrice: d("100.00"),
      taxRate: d("22.00"),
      lineTotal: d("610.00"),
    },
  });
  console.log(`Created invoice item for invoice id: ${invoice3.id}`);

  await prisma.invoiceItem.create({
    data: {
      invoiceId: invoice4.id,
      codProduct: "SUP-001",
      description: "Supporto tecnico trimestrale",
      quantity: d("8.0000"),
      unitPrice: d("100.00"),
      taxRate: d("22.00"),
      lineTotal: d("976.00"),
    },
  });
  console.log(`Created invoice item for invoice id: ${invoice4.id}`);

  // 8) USER-INVOICE LINKS
  await prisma.userInvoice.create({
    data: { userId: admin1.id, invoiceId: invoice1.id },
  });
  console.log(`Linked user id: ${admin1.id} to invoice id: ${invoice1.id}`);

  await prisma.userInvoice.create({
    data: { userId: user1.id, invoiceId: invoice2.id },
  });
  console.log(`Linked user id: ${user1.id} to invoice id: ${invoice2.id}`);

  await prisma.userInvoice.create({
    data: { userId: admin2.id, invoiceId: invoice3.id },
  });
  console.log(`Linked user id: ${admin2.id} to invoice id: ${invoice3.id}`);

  await prisma.userInvoice.create({
    data: { userId: user2.id, invoiceId: invoice4.id },
  });
  console.log(`Linked user id: ${user2.id} to invoice id: ${invoice4.id}`);

  console.log(" Seed completato con successo!");
}

main()
  .catch((e) => {
    console.error("Errore nel seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
