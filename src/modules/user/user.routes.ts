import { Router } from "express";
import { userControllers } from "./user.controller";

const router = Router();

// create a user
router.post("/", userControllers.createUser);

// get all users
router.get("/", userControllers.getUsers);

// single user
router.get("/:id", userControllers.getSingleUser);

// update user
router.put("/:id", userControllers.updateUser);

// delete user
router.delete("/:id", userControllers.deleteUser);

export const userRoutes = router;
