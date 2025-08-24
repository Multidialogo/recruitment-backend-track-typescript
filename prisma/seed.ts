import { PrismaClient, Prisma, InvoiceStatus, PaymentMethod, TaxType, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Pulizia opzionale (sconsigliata in prod!)
  // Ordine inverso per rispettare le FK
  await prisma.userInvoice.deleteMany();
  await prisma.invoiceItem.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.customerTaxProfile.deleteMany();
  await prisma.userTaxProfile.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.user.deleteMany();

  console.log('Existing data deleted successfully.');


  const user1= await prisma.user.create({
    data: {
      email: "mario.rossi@gmail.com",
      phone: "+390611111111",
      passwordHash: "$2b$10$K..HASH..FITTIZIO..", // bcrypt hash fittizio
      firstName: "Mario",
      lastName: "Rossi",
      role: UserRole.ADMIN,
      isEnabled: true,
    },
    include: { taxProfile: true },
  });

  console.log(`Created user with id: ${user1.id}`);

const user2 = await prisma.user.create({
    data: {
      email: "alessia.capo@gmail.com",
      phone: "+3906113411111",
      passwordHash: "$2b$10$K..HASH..FITTIZIO..", // bcrypt hash fittizio
      firstName: "Alessia",
      lastName: "Capo",
      role: UserRole.ADMIN,
      isEnabled: true,
    },
  });
  console.log(`Created user with id: ${user2.id}`);

const userTax1 = await prisma.userTaxProfile.create({
    data: {
      userId: user1.id,
      type: TaxType.FREELANCER,
      legalName: "Mario Rossi - Studio",
      fiscalCode: "RSSMRA80A01H501U",
      vatNumber: "IT01234567890",
      addressLine1: "Via Roma 10",
      city: "Torino",
      province: "TO",
      postalCode: "10100",
      countryCode: "IT",
      isActive: true,
    },
  });

    console.log(`Created tax profile with id: ${userTax1.id} for user id: ${user1.id}`);


  const userTax2 = await prisma.userTaxProfile.create({
    data: {
      userId: user2.id,
      type: TaxType.INDIVIDUAL,
      legalName: "",
      fiscalCode: "RSSMRA80A01H501U",
      vatNumber: "",
      addressLine1: "Via Roma 10",
      city: "Roma",
      province: "TO",
      postalCode: "10100",
      countryCode: "IT",
      isActive: true,
    },
  });

  console.log(`Created tax profile with id: ${userTax2.id} for user id: ${user2.id}`);

  const customer1 = await prisma.customer.create({
    data: {
      email: "acquisti@azienda-spa.it",
      phone: "+390612345678",
      firstName: "Azienda",
      lastName: "SPA",
      isEnabled: true,
    },
  });

    console.log(`Created customer1 with id: ${customer1.id}`);


  const customerTax1 = await prisma.customerTaxProfile.create({
    data: {
      customerId: customer1.id,
      type: TaxType.COMPANY,
      legalName: "Azienda S.p.A.",
      fiscalCode: "AZNSPA80B01H501X",
      vatNumber: "IT09876543210",
      addressLine1: "Corso Vittorio 10",
      city: "Milano",
      province: "MI",
      postalCode: "20100",
      countryCode: "IT",
      isActive: true,
    },
  });

  console.log(`Created tax profile with id: ${customerTax1.id} for customer id: ${customer1.id}`);
  
  const customerShipTax1 = await prisma.customerTaxProfile.create({
    data: {
      customerId: customer1.id,
      type: TaxType.COMPANY,
      legalName: "Azienda S.p.A. - Magazzino",
      fiscalCode: "AZNSPA80B01H501X",
      vatNumber: "IT09876543210",
      addressLine1: "Via Logistica 25",
      city: "Milano",
      province: "MI",
      postalCode: "20100",
      countryCode: "IT",
      isActive: true,
    },
  });

  console.log(`Created shipping tax profile with id: ${customerShipTax1.id} for customer id: ${customer1.id}`);
  


const customer2 = await prisma.customer.create({
    data: {
      email: "acquisti2@azienda-spa.it",
      phone: "+3906127878745678",
      firstName: "Azienda2",
      lastName: "SPA",
      isEnabled: true,
    },
  });

  console.log(`Created customer2 with id: ${customer2.id}`);

 const customerTax2 = await prisma.customerTaxProfile.create({
    data: {
      customerId: customer2.id,
      type: TaxType.COMPANY,
      legalName: "Azienda 2 S.p.A.",
      fiscalCode: "AZNSPA80B01H501X",
      vatNumber: "IT09876543210",
      addressLine1: "Corso Vittorio 10",
      city: "Milano",
      province: "MI",
      postalCode: "20100",
      countryCode: "IT",
      isActive: true,
    },
  });

  console.log(`Created tax profile with id: ${customerTax2.id} for customer id: ${customer2.id}`);
  
  
  const invoice1 = await prisma.invoice.create({
    data: {
      invoiceNumber: 2025000001n,
      issueDate: new Date("2025-08-01T10:00:00.000Z"),
      dueDate: new Date("2025-08-31T23:59:59.000Z"),
      status: InvoiceStatus.DRAFT,
      currency: "EUR",

      issuerUserId: user1.id,
      issuerTaxProfileId: userTax1.id,

      billToCustomerId: customer1.id,
      billToCustomerTaxProfileId: customerTax1.id,

      shipToCustomerId: customer1.id,
      shipToCustomerTaxProfileId: customerShipTax1.id,

      subtotal: new Prisma.Decimal("1000.00"),
      taxTotal: new Prisma.Decimal("220.00"), // 22%
      grandTotal: new Prisma.Decimal("1220.00"),

      paymentMethod: PaymentMethod.BANK_TRANSFER,
    },
  });

  console.log(`Created invoice with id: ${invoice1.id}`);

  await prisma.invoiceItem.create({
    data: {
      invoiceId: invoice1.id,
      codProduct: "CONS-001",
      description: "Consulenza software - Luglio",
      quantity: new Prisma.Decimal("10.0000"),
      unitPrice: new Prisma.Decimal("100.00"),
      taxRate: new Prisma.Decimal("22.00"),
      lineTotal: new Prisma.Decimal("1220.00"),
    },
  });
console.log(`Created invoice item for invoice id: ${invoice1.id}`);

  await prisma.userInvoice.create({
    data: {
      userId: user1.id,
      invoiceId: invoice1.id,
    },
  });

  console.log(`Linked user id: ${user1.id} to invoice id: ${invoice1.id}`);

  const invoice2 = await prisma.invoice.create({
    data: {
      invoiceNumber: 2025000002n,
      issueDate: new Date("2025-08-05T10:00:00.000Z"),
      dueDate: new Date("2025-09-04T23:59:59.000Z"),
      status: InvoiceStatus.ISSUED,
      currency: "EUR",

      issuerUserId: user1.id,
      issuerTaxProfileId: userTax1.id,

      billToCustomerId: customer1.id,
      billToCustomerTaxProfileId: customerTax1.id,

      subtotal: new Prisma.Decimal("300.00"),
      taxTotal: new Prisma.Decimal("66.00"),
      grandTotal: new Prisma.Decimal("366.00"),

      paymentMethod: PaymentMethod.CARD,
    },
  });

  console.log(`Created invoice with id: ${invoice2.id}`);

  await prisma.invoiceItem.create({
    data: {
      invoiceId: invoice2.id,
      codProduct: "DEV-PIANO",
      description: "Sviluppo feature - Sprint 32",
      quantity: new Prisma.Decimal("3.0000"),
      unitPrice: new Prisma.Decimal("100.00"),
      taxRate: new Prisma.Decimal("22.00"),
      lineTotal: new Prisma.Decimal("366.00"),
    },
  });
  console.log(`Created invoice item for invoice id: ${invoice2.id}`);

  await prisma.userInvoice.create({
    data: {
      userId: user1.id,
      invoiceId: invoice2.id,
    },
  });
  console.log(`Linked user id: ${user1.id} to invoice id: ${invoice2.id}`);



const invoice3 = await prisma.invoice.create({
    data: {
      invoiceNumber: 2025000003n,
      issueDate: new Date("2025-08-01T10:00:00.000Z"),
      dueDate: new Date("2025-08-31T23:59:59.000Z"),
      status: InvoiceStatus.PAID,
      currency: "EUR",

      issuerUserId: user2.id,
      issuerTaxProfileId: userTax2.id,

      billToCustomerId: customer2.id,
      billToCustomerTaxProfileId: customerTax2.id,

      shipToCustomerId: null,
      shipToCustomerTaxProfileId: null,

      subtotal: new Prisma.Decimal("100.00"),
      taxTotal: new Prisma.Decimal("20.00"), // 22%
      grandTotal: new Prisma.Decimal("120.00"),

      paymentMethod: PaymentMethod.CARD,
    },
  });

  console.log(`Created invoice with id: ${invoice3.id}`);

  await prisma.invoiceItem.create({
    data: {
      invoiceId: invoice3.id,
      codProduct: "CONS-001",
      description: "Consulenza software - Agosto",
      quantity: new Prisma.Decimal("10.0000"),
      unitPrice: new Prisma.Decimal("10.00"),
      taxRate: new Prisma.Decimal("22.00"),
      lineTotal: new Prisma.Decimal("122.00"),
    },
  });
console.log(`Created invoice item for invoice id: ${invoice3.id}`);

  await prisma.userInvoice.create({
    data: {
      userId: user2.id,
      invoiceId: invoice3.id,
    },
  });

  console.log(`Linked user id: ${user2.id} to invoice id: ${invoice3.id}`);

  console.log("Seed completato con successo!");
}

main()
  .catch((e) => {
    console.error("Errore nel seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });