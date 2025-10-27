// UNCOMMENT THIS CODE IF THIS HELPER NEEDED

// import { Injectable } from '@nestjs/common';
// import * as currency from 'currency.js';
// import MeiliSearch from 'meilisearch';
// import { Product } from 'src/features/product/entities/product.entity';

// @Injectable()
// export class MeilisearchHelper {
//   constructor() {}

//   async updateMeilisearch(productId: number) {
//     const client = new MeiliSearch({
//       host: 'https://meili.folxcode.dev',
//       apiKey: process.env.MEILISEARCH_APIKEY,
//     });

//     const product = await Product.findByPk(productId, {
//       attributes: {
//         exclude: [
//           'google_feed_title',
//           'created_at',
//           'updated_at',
//           'deleted_at',
//         ],
//       },
//       include: [
//         {
//           association: 'product_images',
//           attributes: ['url', 'is_active'],
//           limit: 1,
//           order: [['is_default', 'desc']],
//         },
//         {
//           association: 'brand',
//           attributes: ['name', 'is_public', 'is_active'],
//         },
//         {
//           association: 'shop',
//           attributes: ['slug', 'name', 'is_active'],
//         },
//         {
//           association: 'category',
//           attributes: ['id', 'slug', 'name', 'is_active', 'parent_id'],
//           include: [
//             {
//               association: 'parent',
//               attributes: ['id', 'slug', 'name', 'is_active', 'parent_id'],
//               include: [
//                 {
//                   association: 'parent',
//                   attributes: ['id', 'slug', 'name', 'is_active', 'parent_id'],
//                   include: [
//                     {
//                       association: 'parent',
//                       attributes: [
//                         'id',
//                         'slug',
//                         'name',
//                         'is_active',
//                         'parent_id',
//                       ],
//                     },
//                   ],
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           association: 'variants',
//           attributes: ['name'],
//           include: [{ association: 'sub_variants', attributes: ['name'] }],
//         },
//       ],
//     });

//     const cleanProduct = product.toJSON();

//     if (product.product_images.length > 0) {
//       cleanProduct.product_images = product.product_images[0].toJSON();
//     } else {
//       cleanProduct.product_images = {
//         url: null,
//         is_active: true,
//       };
//     }

//     cleanProduct.after_discount_price = currency(cleanProduct.min_price).add(
//       cleanProduct.discount_amount,
//     ).value;

//     cleanProduct.min_price = +cleanProduct.min_price;
//     cleanProduct.discount_amount = +cleanProduct.discount_amount;
//     cleanProduct.discount_percentage = +cleanProduct.discount_percentage;
//     cleanProduct.category_groups = [cleanProduct.category.id];

//     let getParent = cleanProduct.category.parent;
//     while (getParent !== null) {
//       cleanProduct.category_groups.push(getParent.id);
//       getParent = getParent.parent;
//     }

//     const result = await client
//       .index('hb_sg_products')
//       .addDocuments([{ ...cleanProduct }]);
//     return result;
//   }
// }
