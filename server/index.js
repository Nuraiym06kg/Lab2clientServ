const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(cors());

// --- 1. ОСНОВНОЙ МОДУЛЬ: КЛИЕНТЫ (CUSTOMERS) ---
let customers = [
  { id: 'c1', name: 'Алексей Иванов', email: 'alex@mail.ru', status: 'VIP', totalSpent: 150000 },
  { id: 'c2', name: 'Мария Петрова', email: 'maria@gmail.com', status: 'REGULAR', totalSpent: 25000 },
  { id: 'c3', name: 'Иван Сидоров', email: 'sidorov@yandex.ru', status: 'NEW', totalSpent: 3500 }
];

// GET /api/v1/customers (с фильтрацией по статусу и поиском)
app.get('/api/v1/customers', (req, res) => {
  const { status, search } = req.query;
  let result = [...customers];
  if (status) {
    result = result.filter(c => c.status.toLowerCase() === status.toLowerCase());
  }
  if (search) {
    result = result.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
  }
  res.status(200).json({ success: true, count: result.length, data: result });
});

// GET /api/v1/customers/:id (по ID)
app.get('/api/v1/customers/:id', (req, res) => {
  const customer = customers.find(c => c.id === req.params.id);
  if (!customer) {
    return res.status(404).json({
      success: false,
      error: { code: 'NOT_FOUND', message: `Клиент с ID ${req.params.id} не найден` }
    });
  }
  res.status(200).json({ success: true, data: customer });
});

// POST /api/v1/customers (создание)
app.post('/api/v1/customers', (req, res) => {
  const { name, email, status, totalSpent } = req.body;
  if (!name || !email) {
    return res.status(400).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: 'Поля name и email обязательны' }
    });
  }
  const newCustomer = {
    id: `c${customers.length + 1}`,
    name,
    email,
    status: status || 'NEW',
    totalSpent: Number(totalSpent) || 0
  };
  customers.push(newCustomer);
  res.status(201).json({ success: true, data: newCustomer });
});

// PUT /api/v1/customers/:id (обновление)
app.put('/api/v1/customers/:id', (req, res) => {
  const index = customers.findIndex(c => c.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: { code: 'NOT_FOUND', message: 'Клиент для обновления не найден' }
    });
  }
  const { name, email, status, totalSpent } = req.body;
  customers[index] = { id: req.params.id, name, email, status, totalSpent: Number(totalSpent) || 0 };
  res.status(200).json({ success: true, data: customers[index] });
});

// DELETE /api/v1/customers/:id (удаление)
app.delete('/api/v1/customers/:id', (req, res) => {
  const index = customers.findIndex(c => c.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: { code: 'NOT_FOUND', message: 'Клиент для удаления не найден' }
    });
  }
  customers.splice(index, 1);
  res.status(204).send();
});


// --- 2. САМОСТОЯТЕЛЬНОЕ ЗАДАНИЕ: МОДУЛЬ СТУДЕНТОВ / ПОКУПАТЕЛЕЙ (STUDENTS) ---
let students = [
  { id: 's1', firstName: 'Артур', lastName: 'Каримов', studentCard: 'ST-1001', groupId: 'IS-21' },
  { id: 's2', firstName: 'Динара', lastName: 'Умарова', studentCard: 'ST-1002', groupId: 'IS-22' }
];

// GET /api/v1/students (с фильтрацией по groupId)
app.get('/api/v1/students', (req, res) => {
  const { groupId } = req.query;
  let result = [...students];
  if (groupId) {
    result = result.filter(s => s.groupId.toLowerCase() === groupId.toLowerCase());
  }
  res.status(200).json({ success: true, count: result.length, data: result });
});

// POST /api/v1/students (со строгой валидацией firstName, lastName, studentCard)
app.post('/api/v1/students', (req, res) => {
  const { firstName, lastName, studentCard, groupId } = req.body;
  if (!firstName || !lastName || !studentCard) {
    return res.status(400).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: 'Поля firstName, lastName и studentCard обязательны' }
    });
  }
  const newStudent = {
    id: `s${students.length + 1}`,
    firstName,
    lastName,
    studentCard,
    groupId: groupId || 'GENERAL'
  };
  students.push(newStudent);
  res.status(201).json({ success: true, data: newStudent });
});


// Запуск сервера
app.listen(PORT, () => {
  console.log(`[E-Commerce API] Сервер запущен на http://localhost:${PORT}`);
});