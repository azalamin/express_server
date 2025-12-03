import { Router } from "express";
import { todoControllers } from "./todo.controller";

const router = Router();
// create todo
router.post("/", todoControllers.createTodo);

// get todos
router.get("/", todoControllers.getTodos);

// update todo
router.put("/:id", todoControllers.updateTodo);
// get single todo
router.get("/:id", todoControllers.getSingleTodo);

// get single user's todos
router.get("/user/:user_id", todoControllers.getSingleUserTodo);

// delete todos
router.delete("/:id", todoControllers.deleteTodo);

export const todoRoutes = router;
