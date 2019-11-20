var button = document.getElementById("about_us_button");
var modal = document.getElementById("about_us_modal")
var modal_close = document.getElementById("modal_close")


button.onclick = function ()
{
    modal.classList.add("is-active")
}

modal_close.onclick = function ()
{
    modal.classList.remove("is-active")
}

console.log("loaded")