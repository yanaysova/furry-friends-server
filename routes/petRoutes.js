const express = require("express");
const router = express.Router();
const { validateBody } = require("../middleware/validateBody");
const { petSchema } = require("../schemas/allSchemas");
const petsController = require("../controllers/petsController");

const app = express();

app.use(express.json());

router.get("/", petsController.allPets);

router.get("/:petsId", petsController.petById);

router.post("/", validateBody(petSchema), petsController.addPet);

module.exports = router;
