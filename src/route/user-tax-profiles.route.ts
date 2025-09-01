import { Router } from 'express';
const r = Router();

// GET /user-tax-profiles
r.get('/', async (req, res) => {
  const { page = '1', pageSize = '20', sort, userId, type, isActive, city } = req.query;
  res.set('X-Total-Count', '0');
  return res.json({ data: [], page: Number(page), pageSize: Number(pageSize), total: 0 });
});

// POST /user-tax-profiles
r.post('/', async (req, res) => {
  // body: UserTaxProfileCreateRequest
  return res.status(201).json({ id: 'uuid-generated' });
});

// GET /user-tax-profiles/:id
r.get('/:id', async (req, res) => {
  const { id } = req.params;
  return res.json({ /* UserTaxProfileResponse */ });
});

// PUT /user-tax-profiles/:id
r.put('/:id', async (req, res) => {
  const { id } = req.params;
  // body: UserTaxProfileUpdateRequest
  return res.json({ /* UserTaxProfileResponse */ });
});

// DELETE /user-tax-profiles/:id
r.delete('/:id', async (req, res) => {
  const { id } = req.params;
  return res.status(204).send();
});

export default r;
