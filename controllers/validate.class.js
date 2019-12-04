class Validate {

    constructor() {
        // MIGHT NOT BE NEEDED, WE SHALL SEE
    };

    ValidatePassword(passwd) {
        // BOOL -> PROMISES? DOESNT SEEM NECESSARY.

        if (passwd.length < 8) {
            console.log("Password must be at least 8 characters long");
            return(0);
        }
        var checkspecial = new RegExp("\\W");
        var checklower = new RegExp("[a-z]");
        var checkupper = new RegExp("[A-Z]");
        var checknumber = new RegExp("[0-9]");
        if (checklower.test(passwd) == false
            || checkupper.test(passwd) == false
            || checknumber.test(passwd) == false
            || checkspecial.test(passwd) == true) {
                console.log("Password must conatin at least one Uppercase letter and a number and no special characters");
                return (0);
        }
        return(1);
    };

    ValidateUsername(username) {
        var checkspecial = new RegExp("\\W");
        if (username.length < 5) {
            console.log("Username must be at least 5 characters long");
            return(0);
        }
        if (checkspecial.test(username) == true) {
            console.log("Username cannot contain special characters");
            return (0);
        }
        return (1);
    }

    isAlpha(string) {
        var checkspecial = new RegExp("\\W");
        var checknum = new RegExp("[0-9]");
        if (checknum.test(string) == true || checkspecial.test(string) == true){
            console.log("Contains either a special character or a letter");
            return (0);
        }
        return (1);
    };

    isAlphanumeric(string) {
        var checkspecial = new RegExp("\\W");
        if (checkspecial.test(string) == true){
            console.log("Contains a special character, BAD!");
            return (0);
        }
        return (1);
    };

    isNumeric(string) {
        var checkspecial = new RegExp("\\W");
        var checknum = new RegExp("[A-Za-z]");
        if (checknum.test(string) == true || checkspecial.test(string) == true){
            console.log("Contains either a special character or a letter");
            return (0);
        }
        return (1);
    };

    isEmail(string) {
        // BASIC CHECK BECAUSE WE CANT REALLY CHECK IF ITS VALID WITH JUSTY REGEX
        var checkemail = new RegExp("\\S+@\\S+\\.\\S+");
        console.log(checkemail);
        if (checkemail.test(string) == false) {
            console.log("Please format your email properly");
            return (0);
        }
        return (1);
    }

    validateregister(body) {
        var firstname = this.isAlpha(body.firstname);
        var surname = this.isAlpha(body.surname);
        var username = this.ValidateUsername(body.username);
        var email = this.isEmail(body.email);
        var password = this.ValidatePassword(body.password);
        var age = this.isNumeric(body.age);
        // var about = this.isAlphanumeric(body.about);
        if (
            firstname == 0 ||
            surname == 0 ||
            username == 0 ||
            email == 0 ||
            password == 0 ||
            age == 0
            // about == 0
        ) {
            return (0);
        }
        return (1);
    }
}
module.exports = Validate;