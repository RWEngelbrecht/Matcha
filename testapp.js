const Validate	= require('./controllers/validate.class');

var username = "aratayano12!3"
var check = new Validate();
let x = check.ValidateUsername(username);
console.log(x);
