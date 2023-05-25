const mongoose = require("mongoose")

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

  await this.save()
}

const User = mongoose.model("User", userSchema)

module.exports = User
