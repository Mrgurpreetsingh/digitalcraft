//générateur de mot de passe
const bcrypt = require('bcrypt');
console.log(bcrypt.hashSync('admin123', 10)); // Hache "admin123"
console.log(bcrypt.hashSync('employe123', 10)); // Hache "employe123"