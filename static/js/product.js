document.addEventListener('DOMContentLoaded', function () {
    const buyButtons = document.querySelectorAll('.buy-button');

    buyButtons.forEach(button => {
        button.addEventListener('click', function () {
            alert('Thank you for purchasing this product!');
        });
    });
});