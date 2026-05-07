const Product = require('../models/Product');

const productController = {
     getAllProducts: (req, res) => {
          try {
               res.json(Product);
          } catch (error) {
               res.status(500).json({ error: 'Failed to fetch products' });
          }
     },

     getProductById: (req, res) => {
          try {
               const product = Product.find((p) => p.id === parseInt(req.params.id));
               if (!product) {
                    return res.status(404).json({ error: 'Product not found' });
               }
               res.json(product);
          } catch (error) {
               res.status(500).json({ error: 'Failed to fetch product' });
          }
     },

     createProduct: (req, res) => {
          try {
               const newProduct = {
                    id: Math.max(...Product.map((p) => p.id), 0) + 1,
                    ...req.body,
               };
               Product.push(newProduct);
               res.status(201).json(newProduct);
          } catch (error) {
               res.status(500).json({ error: 'Failed to create product' });
          }
     },

     updateProduct: (req, res) => {
          try {
               const product = Product.find((p) => p.id === parseInt(req.params.id));
               if (!product) {
                    return res.status(404).json({ error: 'Product not found' });
               }
               Object.assign(product, req.body);
               res.json(product);
          } catch (error) {
               res.status(500).json({ error: 'Failed to update product' });
          }
     },

     deleteProduct: (req, res) => {
          try {
               const index = Product.findIndex((p) => p.id === parseInt(req.params.id));
               if (index === -1) {
                    return res.status(404).json({ error: 'Product not found' });
               }
               const deletedProduct = Product.splice(index, 1);
               res.json(deletedProduct[0]);
          } catch (error) {
               res.status(500).json({ error: 'Failed to delete product' });
          }
     },
};

module.exports = productController;
