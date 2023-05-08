const express = require("express");
const router = express.Router();
const petControllers = require("../controllers/petControllers");
const {
  aliasNewestAdittions,
  addEditDate,
} = require("../middleware/petMiddlewares");

router.route("/").get(petControllers.getPets).post(petControllers.addPet);

router.route("/stats").get(petControllers.getPetStats);

router
  .route("/3-newest-additions")
  .get(aliasNewestAdittions, petControllers.getPets);

router
  .route("/:id")
  .get(petControllers.getPetById)
  .patch(addEditDate, petControllers.editPet)
  .delete(petControllers.deletePet);

router.route("/:id/adpot").post(petControllers.adoptPet);

router.route("/:id/return").post(petControllers.returnPet);

router
  .route("/:id/save")
  .post(petControllers.savePet)
  .delete(petControllers.deleteSavedPet);

router.route("/user/:id").get(petControllers.getPetsByUserId);

module.exports = router;
