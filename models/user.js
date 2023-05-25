const mongoose = require("mongoose")
const Patisserie = require("./patisserie")

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  pastriesWon: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true, default: 0 },
    },
  ],
  pastriesStock: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true, default: 0 },
    },
  ],
})

userSchema.methods.addWonPastry = async function (patisserieName) {
  const pastryIndex = this.pastriesWon.findIndex(
    (pastry) => pastry.name === patisserieName
  )

  if (pastryIndex !== -1) {
    this.pastriesWon[pastryIndex].quantity++
  } else {
    this.pastriesWon.push({ name: patisserieName, quantity: 1 })
  }

  // Ajouter la pâtisserie gagnée au stock de l'utilisateur
  const userPastryIndex = this.pastriesStock.findIndex(
    (pastry) => pastry.name === patisserieName
  )

  if (userPastryIndex !== -1) {
    this.pastriesStock[userPastryIndex].quantity++
  } else {
    this.pastriesStock.push({ name: patisserieName, quantity: 1 })
  }

  // Supprimer la pâtisserie gagnée de la collection de pâtisseries
  await Patisserie.findOneAndUpdate(
    { name: patisserieName },
    { $inc: { number: -1 } }
  )

  await this.save()
}

const User = mongoose.model("User", userSchema)

module.exports = User
