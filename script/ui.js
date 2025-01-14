const ui = {
    toggleShoppingBag: function() {
        document.querySelector('#shopping_bag__button').addEventListener('click', function() {
            var footer = document.querySelector('footer');
            footer.classList.toggle('expanded');
        })
    },
}
export default ui;