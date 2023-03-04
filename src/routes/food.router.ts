import { FoodModel } from "./../models/food.model";
import { Router } from "express";
import asynceHandler from "express-async-handler";
import { sample_food } from "../data";

const router = Router();

router.get(
  "/seed",
  asynceHandler(async (req, res) => {
    const foodsCount = await FoodModel.countDocuments();
    if (foodsCount > 0) {
      // res.send('Seed is already done...');
      // return;
      await FoodModel.create(sample_food);
      res.send("Seed is done...");
    }
    // await FoodModel.create(sample_food);
    // res.send('Seed is done...');
  })
);

router.get(
  "/",
  asynceHandler(async (req, res) => {
    const foods = await FoodModel.find();
    res.send(foods);
  })
);

router.get(
  "/search/:searchTerm",
  asynceHandler(async (req, res) => {
    const searchRegex = new RegExp(req.params.searchTerm, "i");
    const foods = await FoodModel.find({ name: { $regex: searchRegex } });
    res.send(foods);
  })
);

router.get(
  "/tags",
  asynceHandler(
    async (req, res) => {
      const tags = await FoodModel.aggregate([
        {
          $unwind: "$tags",
        },
        {
          $group: {
            _id: "$tags",
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            name: "$_id",
            count: "$count",
          },
        },
      ]).sort({ count: -1 });

      const all = {
        name: "all",
        count: await FoodModel.countDocuments(),
      };
      tags.unshift(all);
      res.send(tags);
    }
    // 2 foods 3 tags, unwind tags => 6 foods tags 1
  )
);

router.get(
  "/tag/:tagName",
  asynceHandler(async (req, res) => {
    const foods = await FoodModel.find({ tags: req.params.tagName });
    res.send(foods);
  })
);

router.get(
  "/:foodId",
  asynceHandler(async (req, res) => {
    const food = await FoodModel.findById(req.params.foodId);
    res.send(food);
  })
);

export default router;
