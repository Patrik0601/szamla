import Database from "better-sqlite3";

const db = new Database('./data/database.sqlite')

db.exec(`
  CREATE TABLE IF NOT EXISTS buyers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    buyer_name TEXT NOT NULL,
    address TEXT NOT NULL,
    taxNumber TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS sellers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    seller_name TEXT NOT NULL,
    address TEXT NOT NULL,
    taxNumber TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS bills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    buyer_id INTEGER NOT NULL,
    seller_id INTEGER NOT NULL,
    billNumber TEXT NOT NULL,
    created_at TEXT NOT NULL,
    payed_at TEXT NOT NULL,
    deadline_at TEXT NOT NULL,
    totalAmount INTEGER NOT NULL,
    vat INTEGER NOT NULL,
    FOREIGN KEY (buyer_id) REFERENCES buyers(id),
    FOREIGN KEY (seller_id) REFERENCES sellers(id)
  );
`);


export const getAllBills = () => db.prepare(`
  SELECT 
      bills.*,
      buyers.buyer_name AS buyer_name,
      sellers.seller_name AS seller_name
    FROM bills
    JOIN buyers ON bills.buyer_id = buyers.id
    JOIN sellers ON bills.seller_id = sellers.id
`).all();

export const getBillById = (id) => db.prepare(`SELECT * FROM bills WHERE id = ?`).get(id)

export const creatBill = (buyer_id, seller_id, billNumber, created_at, payed_at, deadline_at, totalAmount, vat) =>
  db.prepare(`INSERT INTO bills (buyer_id, seller_id, billNumber, created_at, payed_at, deadline_at, totalAmount, vat) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
).run(buyer_id, seller_id, billNumber, created_at, payed_at, deadline_at, totalAmount, vat);

export const updateBill = (id, buyer_id, seller_id, billNumber, created_at, payed_at, deadline_at, totalAmount, vat) => db.prepare(`UPDATE bills
      SET buyer_id = ?, seller_id = ?, billNumber = ?, created_at = ?, payed_at = ?, deadline_at = ?, totalAmount = ?, vat = ? WHERE id = ?
`).run(buyer_id, seller_id, billNumber, created_at, payed_at, deadline_at, totalAmount, vat, id)

export const deleteBill = (id) => db.prepare(`DELETE FROM bills WHERE id = ?`).run(id)

export function getAllBuyers() {
  const stmt = db.prepare(`SELECT id, buyer_name FROM buyers`);
  return stmt.all();
}

export function getAllSellers() {
  const stmt = db.prepare(`SELECT id, seller_name FROM sellers`);
  return stmt.all();
}

const buyers = [
    {buyer_name: 'Teszt Szolgáltató Kft.', address: '1054 Budapest, Szolgáltatás utca 12.', taxNumber: '98765432-1-42'},
    {buyer_name: 'Digit-All Solutions Kft.', address: '6720 Szeged, Tisza Lajos körút 5', taxNumber: ' 87654321-2-06'},
    {buyer_name: 'GreenTech Innovációs Zrt.', address: '7400 Kaposvár, Zöldfa utca 9.', taxNumber: '76543210-1-14'}
  ];

const sellers = [
    {seller_name: 'Kovács és Társa Kft.', address: '1111 Budapest, Fő utca 1.', taxNumber: '12345678-1-11'},
    {seller_name: 'Nagy és Fiai Bt.', address: '9022 Győr, Kossuth Lajos utca 22.', taxNumber: '23456789-2-08'},
    {seller_name: 'Szabó és Társa Zrt.', address: '4032 Debrecen, Piac utca 10.', taxNumber: '34567890-1-09'}
];

const bills = [
    {buyer_id: 1, seller_id: 1, billNumber: '2025/001', created_at: '2025-05-01', payed_at: '2025-05-01', deadline_at: '2025-05-15', totalAmount: '127000', vat: '27000'},
    {buyer_id: 1, seller_id: 1, billNumber: '2025/002', created_at: '2025-05-10', payed_at: '2025-05-10', deadline_at: '2025-05-25', totalAmount: '63500', vat: '13500'},
    {buyer_id: 1, seller_id: 1, billNumber: '2025/003', created_at: '2025-05-20', payed_at: '2025-05-20', deadline_at: '2025-06-05', totalAmount: '50800', vat: '10800'},
    {buyer_id: 2, seller_id: 2, billNumber: '2025/004', created_at: '2025-05-03', payed_at: '2025-05-03', deadline_at: '2025-05-17', totalAmount: '76200', vat: '16200'},
    {buyer_id: 2, seller_id: 2, billNumber: '2025/005', created_at: '2025-05-12', payed_at: '2025-05-12', deadline_at: '2025-05-26', totalAmount: '88900', vat: '18900'},
    {buyer_id: 2, seller_id: 2, billNumber: '2025/006', created_at: '2025-05-21', payed_at: '2025-05-21', deadline_at: '2025-06-04', totalAmount: '114300', vat: '24300'},
    {buyer_id: 3, seller_id: 3, billNumber: '2025/007', created_at: '2025-05-05', payed_at: '2025-05-05', deadline_at: '2025-05-20', totalAmount: '127000', vat: '27000'},
    {buyer_id: 3, seller_id: 3, billNumber: '2025/008', created_at: '2025-05-14', payed_at: '2025-05-14', deadline_at: '2025-05-29', totalAmount: '69800', vat: '14800'},
    {buyer_id: 3, seller_id: 3, billNumber: '2025/009', created_at: '2025-05-24', payed_at: '2025-05-24', deadline_at: '2025-06-07', totalAmount: '88900', vat: '18900'},
];

const insertBuyer = db.prepare(`INSERT INTO buyers (buyer_name, address, taxNumber) VALUES (?, ?, ?)`);
const insertSeller = db.prepare(`INSERT INTO sellers (seller_name, address, taxNumber) VALUES (?, ?, ?)`);
const insertBill = db.prepare(`INSERT INTO bills (buyer_id, seller_id, billNumber, created_at, payed_at, deadline_at, totalAmount, vat) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);


const existingBuyers = db.prepare('SELECT COUNT(*) AS count FROM buyers').get().count;
if (existingBuyers === 0) {
  buyers.forEach(buyer => insertBuyer.run(buyer.buyer_name, buyer.address, buyer.taxNumber));
}

const existingSellers = db.prepare('SELECT COUNT(*) AS count FROM sellers').get().count;
if (existingSellers === 0) {
  sellers.forEach(seller => insertSeller.run(seller.seller_name, seller.address, seller.taxNumber));
}

const existingBills= db.prepare('SELECT COUNT(*) AS count FROM bills').get().count;
if (existingBills === 0) {
  bills.forEach(bill => insertBill.run(bill.buyer_id, bill.seller_id, bill.billNumber, bill.created_at, bill.payed_at, bill.deadline_at, bill.totalAmount, bill.vat));
}