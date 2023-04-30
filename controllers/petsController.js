const { v4: uuidv4 } = require("uuid");

const {
  addPetModel,
  getAllPetsModel,
  getPetByIdModel,
} = require("../models/petsModels");

const allPets = (req, res) => {
  try {
    const allPets = getAllPetsModel();
    res.send(allPets);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
};

const petById = (req, res) => {
  try {
    const filtertedPet = getPetByIdModel(req.params.petsId);
    res.send(filtertedPet);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
};

const addPet = (req, res) => {
  try {
    console.log(req.body);
    const newPet = {
      ...req.body,
      id: uuidv4(),
    };
    addPetModel(newPet);
    res.send(newPet);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
};

module.exports = {
  allPets,
  petById,
  addPet,
};
