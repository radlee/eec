var activeNavItem = $('.nav-item');

activeNavItem.onClick(function () {
    activeNavItem.removeClass('active');
    $(this).addClass('active');
});