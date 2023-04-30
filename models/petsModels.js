const fs = require("fs");
const path = require("path");

const pathToPetsDb = path.resolve(__dirname, "../petsDb.json");

function getAllPetsModel() {
  const pets = JSON.parse(fs.readFileSync(pathToPetsDb, "utf8"));
  return pets;
}

function getPetByIdModel(id) {
  const allPets = getAllPetsModel();
  const filteredPet = allPets.filter((pet) => pet.id == id);
  return filteredPet[0];
}

function addPetModel(newPet) {
  try {
    const petArray = getAllPetsModel();
    console.log(petArray);
    petArray.push(newPet);
    fs.writeFileSync(pathToPetsDb, JSON.stringify(petArray));
    return true;
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  getAllPetsModel,
  addPetModel,
  getPetByIdModel,
};
