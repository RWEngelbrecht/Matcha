const iplocation = require("iplocation").default;
 
iplocation('197.169.165.38', [], (error, res) => {
    console.log(res);
});