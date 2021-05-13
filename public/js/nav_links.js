var navItemContainer = document.getElementById("myNavbar");

var navItems = btnContainer.getElementsByClassName("nav-item");

for (var i = 0; i < navItems.length; i++) {
    navItems[i].addEventListener("click", function () {
        var current = document.getElementsByClassName("active");

        if (current.lenth > 0) {
            current[0].className = current[0].className.replace(" active", "");
        }

        this.className += " active"
    });
}