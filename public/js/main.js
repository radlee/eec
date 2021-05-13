//get the form by its id
const form = document.getElementById("contact-form");

const formEvent = form.addEventListener("submit", (event) => {
    event.preventDefault();

    let mail = new FormData(form);

    const sendMail = (mail) => {
        //1.
        fetch("https://exhorbi.herokuapp.com/send", {
            method: "POST",
            body: mail,

        }).then((response) => {
            return response.json();
        });
    };
})