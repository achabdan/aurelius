/**
 * Product Routes
 * GET    /api/products        - List products (with filters & pagination)
 * GET    /api/products/:id    - Get single product
 * POST   /api/products        - Create product (admin)
 * PUT    /api/products/:id    - Update product (admin)
 * DELETE /api/products/:id    - Delete product (admin)
 */

const express = require('express');
const router = express.Router();
const prisma = require('../prisma/client');
const authMiddleware = require('../middleware/auth');

// GET /api/products — public, with filters + pagination + search
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      gender,
      minPrice,
      maxPrice,
      featured,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build filter object
    const where = {};

    if (category) where.category = category.toUpperCase();
    if (gender) where.gender = gender.toUpperCase();
    if (featured === 'true') where.featured = true;

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { nameEn: { contains: search, mode: 'insensitive' } },
        { nameFr: { contains: search, mode: 'insensitive' } },
        { nameEs: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.product.count({ where }),
    ]);

    res.json({
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    console.error('GET /products error:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// GET /api/products/:id — public
router.get('/:id', async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// POST /api/products — admin only
router.post('/', authMiddleware, async (req, res) => {
  try {
    const {
      name, nameEn, nameFr, nameEs,
      description, descriptionEn, descriptionFr, descriptionEs,
      price, images, category, gender, stock, featured,
    } = req.body;

    if (!name || !price || !category || !gender) {
      return res.status(400).json({ error: 'Name, price, category and gender are required' });
    }

    const product = await prisma.product.create({
      data: {
        name,
        nameEn: nameEn || name,
        nameFr: nameFr || name,
        nameEs: nameEs || name,
        description: description || '',
        descriptionEn: descriptionEn || description || '',
        descriptionFr: descriptionFr || description || '',
        descriptionEs: descriptionEs || description || '',
        price: parseFloat(price),
        images: images || [],
        category: category.toUpperCase(),
        gender: gender.toUpperCase(),
        stock: parseInt(stock) || 0,
        featured: featured || false,
      },
    });

    res.status(201).json(product);
  } catch (err) {
    console.error('POST /products error:', err);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// PUT /api/products/:id — admin only
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const existing = await prisma.product.findUnique({
      where: { id: req.params.id },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const {
      name, nameEn, nameFr, nameEs,
      description, descriptionEn, descriptionFr, descriptionEs,
      price, images, category, gender, stock, featured,
    } = req.body;

    const updated = await prisma.product.update({
      where: { id: req.params.id },
      data: {
        ...(name && { name }),
        ...(nameEn !== undefined && { nameEn }),
        ...(nameFr !== undefined && { nameFr }),
        ...(nameEs !== undefined && { nameEs }),
        ...(description !== undefined && { description }),
        ...(descriptionEn !== undefined && { descriptionEn }),
        ...(descriptionFr !== undefined && { descriptionFr }),
        ...(descriptionEs !== undefined && { descriptionEs }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(images !== undefined && { images }),
        ...(category && { category: category.toUpperCase() }),
        ...(gender && { gender: gender.toUpperCase() }),
        ...(stock !== undefined && { stock: parseInt(stock) }),
        ...(featured !== undefined && { featured }),
      },
    });

    res.json(updated);
  } catch (err) {
    console.error('PUT /products/:id error:', err);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// DELETE /api/products/:id — admin only
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const existing = await prisma.product.findUnique({
      where: { id: req.params.id },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Product not found' });
    }

    await prisma.product.delete({ where: { id: req.params.id } });
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('DELETE /products/:id error:', err);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = router;
