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
        // SPECIAL CHARS?
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
}
module.exports = Validate;