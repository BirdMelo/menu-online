import api from './api.js';

const ui = {
    toggleShoppingBag: function() {
        document.querySelector('#shopping_bag__button').addEventListener('click', function() {
            var footer = document.querySelector('footer');
            footer.classList.toggle('expanded');
        })
    },
    rederizeProducts: async function() {
        const menu = await api.getMenu();
        const menuList = document.querySelector('#list')
        menu.forEach(product => {
            const li = document.createElement('li');
            li.innerHTML +=
            `
                <img src= "../img/snack_pic/${product.img} alt="${product.name}">
                <p id= "dish_name">${product.name}</p>
                <button>adicionar</button>
            `
        });
    }
}
export default ui;