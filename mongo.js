if (process.argv.length < 3){
    console.log('Please provide the right format: node mongo.js <password> (<name> <number>)')
    process.exit(1)
}
const mongoose = require('mongoose')
const password = process.argv[2]
const url =`mongodb+srv://fullstack:${password}@cluster0.q9ru9.mongodb.net/pbook?retryWrites=true&w=majority`
mongoose.connect(url)
const pbSchema = new mongoose.Schema({
    name: String,
    number: String
  })
const Contact = mongoose.model('Contact', pbSchema)

if (process.argv.length == 5) {
    const name = process.argv[3]
    const num = process.argv[4]
    const contact = new Contact({
        name:name,
        number:num
    })
    contact.save().then(result => {
    console.log(`added ${name} number ${num} to the phonebook`)
    mongoose.connection.close()
    })
}else{
    Contact.find({}).then(result => {
        console.log("Phonebook:")
        result.forEach(con => {
          console.log(con.name,con.number)
        })
        mongoose.connection.close()
    })
}