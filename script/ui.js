import api from './api.js';
import bag from './shopping_bag__storage.js';

let total_price = 0;
const blur = document.getElementById('bg_blur');

const ui = {
    navbar_buttons() {
        let typeFilter = 'Destaques';

        const search_input = document.getElementById('search_snack');
        const highlights_button = document.getElementById('highlights');
        const pizzas_button = document.getElementById('pizzas');
        const beverages_button = document.getElementById('beverages');
        const all_button = document.getElementById('all');

        highlights_button.classList.add('active');
        renderizeProducts('destaque');

        search_input.addEventListener('input', ()=> {
            typeFilter = navbar_buttons_actions('pesquisado');
            renderizeProducts(typeFilter, search_input.value);
        });

        highlights_button.addEventListener('click', ()=> {
            typeFilter = navbar_buttons_actions('destaque');
            renderizeProducts(typeFilter);
        });

        pizzas_button.addEventListener('click', ()=> {
            typeFilter = navbar_buttons_actions('pizza');
            renderizeProducts(typeFilter);
        });

        beverages_button.addEventListener('click', ()=> {
            typeFilter = navbar_buttons_actions('bebida');
            renderizeProducts(typeFilter);
        });

        all_button.addEventListener('click', ()=> {
            typeFilter = navbar_buttons_actions('todo');
            renderizeProducts();
        });
    },
    bag_tab() {
        const storage = bag.get_bag();
        total_price = 0;
        storage.forEach(item => {
            add_item_bag(item);
            totalCost(item);
        })
        toggleShoppingBag('shopping_bag__footer__button', 'shopping_bag_footer');
        toggleShoppingBag('shopping_bag__aside__button', 'shopping_bag__aside');
    },
    manageArea() {
        const manage_button = document.querySelector('#manage')
        manage_button.addEventListener('click', ()=> {
            alert('o popup a seguir é apenas demonstrativo, não existe um login registrado.');
            toggle_hidden(blur);
            manage_login();
            manage_logout();
        });
    }
}
export default ui;

function brlformat(price) {
    return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
function add_item_bag(item) {
    const shopping_tabs = document.querySelectorAll('.shopping_bag');
    shopping_tabs.forEach(shopping_tab => {
        const buying_item = document.createElement('li');
        
        const item_name = document.createElement('p');
        item_name.classList.add('item_name');
        item_name.textContent = item.name;
        
        const item_price = document.createElement('p');
        item_price.classList.add('item_price');
        item_price.textContent = brlformat(item.price);
        
        const slash_dotts = document.createElement('hr');
        slash_dotts.classList.add('item_dots');
        
        buying_item.append(item_name, slash_dotts, item_price);
        shopping_tab.appendChild(buying_item);
    })
}
function toggleShoppingBag( button_id, container_id) {
    document.getElementById(button_id).addEventListener('click', function() {
        var container = document.getElementById(container_id);
        container.classList.toggle('expanded');
    })
}
function totalCost(item) {
    total_price += item.price;
    const totalCost = document.querySelector('.total_price');
    totalCost.textContent = `Total: ${brlformat(total_price)}`;
}
function navbar_buttons_actions(type) {
    const list_title = document.querySelector('.products h2');
    list_title.textContent = `${type.charAt(0).toUpperCase()}${type.slice(1)}s`;
    return type;
}
async function renderizeProducts(typeFilter, text) {
    const menu = await api.getMenu();
    let menuFiltered = menu;
    if (typeFilter) {
        menuFiltered = menu.filter(product => product.type.includes(typeFilter));
    }
    if (typeFilter === 'pesquisado') {
        menuFiltered = menu.filter(product => product.name.toLowerCase().includes(text.toLowerCase()));
    }
    const menuList = document.querySelector('#list');
    menuList.innerHTML = '';
    menuFiltered.forEach(product => {
        const li = document.createElement('li');
        const image = document.createElement('img');
        image.src = `../img/snack_pic/${product.img}`;
        image.alt = product.name;
        
        const dish_name = document.createElement('p');
        dish_name.id = 'dish_name';
        dish_name.textContent = product.name;

        const button_container = document.createElement('div');
        button_container.classList.add('button_product_container');

        const buy_button = document.createElement('button');
        buy_button.textContent = `adicionar por ${brlformat(product.price)}`;
        buy_button.addEventListener('click', function() {

            bag.addIn_bag(product);
            add_item_bag(product);
            totalCost(product);

        });

        const show_description = document.createElement('button');
        show_description.id = 'show_description';
        show_description.textContent = 'ver sobre';

        button_container.append(buy_button, show_description);

        li.append(image, dish_name, button_container);
        menuList.appendChild(li);
    })
    const new_item = document.createElement('li');
    new_item.classList.add('hidden');
    const new_item__button = document.createElement('button');
    new_item__button.id = 'add_new_item';
    const new_item__img = document.createElement('img');
    new_item__img.src = '../img/new_window.svg';
    new_item__img.alt = 'adicionar item';
    new_item__button.append(new_item__img);
    new_item.append(new_item__button);
    menuList.appendChild(new_item);
}
function manage_login() {
    const body = document.body;

    const form = document.createElement('form');
    form.classList.add('manager_login');

    const form_title = document.createElement('h3');
    form_title.textContent = 'acesso da gerencia';

    const email_label = buildin_label(
        'email',
        'email',
        'formatação de email invalida'
    );
    const password_label = buildin_label(
        'senha', 
        'password',
        'senha deve conter ao menos 6 caracteres, um número, uma letra maiúscula e um caractere especial'
    );

    const button_container = document.createElement('div');
    button_container.classList.add('manager_login__button_container');

    const cancel_button = document.createElement('button');
    cancel_button.textContent = 'cancelar';
    cancel_button.id = 'manager_login__button_cancel'
    cancel_button.addEventListener('click', ()=> {
        email_label.textContent = '';
        password_label.textContent = '';
        body.removeChild(form);
        toggle_hidden(blur);
    });

    const button_enter = document.createElement('button');
    button_enter.textContent = 'entrar';
    button_enter.id = 'manager_login__button_enter';
    button_enter.addEventListener('click', (event)=> {
        event.preventDefault();
        
        const email = document.getElementById('manager_login__email__input');
        const password = document.getElementById('manager_login__password__input');
        const email_regex = /^[^\s]+@[^\s]+\..*[^\s]{2}$/;
        const password_regex = /^(?=[^\s])(?=.*[A-Z])(?=.*[1-9])(?=.*[\W]).{6,}$/;
        const validate_email = email_regex.test(email.value) ? true : false;
        const validate_password = password_regex.test(password.value) ? true : false;
        const email_error = document.querySelector('.manager_login__email .longin_error');
        const password_error = document.querySelector('.manager_login__password .longin_error');

        if (!validate_email) {
            email_error.classList.remove('hidden');
        }else {
            email_error.classList.add('hidden');
        }
        if (!validate_password) {
            password_error.classList.remove('hidden');
        } else {
            password_error.classList.add('hidden');
        }
        if (validate_email && validate_password) {
            email.value = '';
            password.value = '';
            body.removeChild(form);
            toggle_hidden(blur);
            const add_item = document.querySelector('#list li:last-child');
            toggle_hidden(add_item);
            const manage_button = document.querySelector('#manage');
            toggle_hidden(manage_button);
            const manage_logout = document.getElementById('logout');
            toggle_hidden(manage_logout);
            email_error.classList.add('hidden');
            password_error.classList.add('hidden');
        }

    });

    button_container.append(cancel_button, button_enter);

    form.append(form_title, email_label, password_label, button_container);
    body.appendChild(form);
}
function manage_logout() {
    const manage_logout = document.getElementById('logout');
    manage_logout.addEventListener('click', ()=> {
        const add_item = document.querySelector('#list li:last-child');
        toggle_hidden(add_item);
        const manage_button = document.querySelector('#manage');
        toggle_hidden(manage_button);
        toggle_hidden(manage_logout);
    });
}

function buildin_label(labelName, inputType, errorText) {
    const label = document.createElement('label');
    label.for = `manager_login__${inputType}__input`;
    label.classList.add(`manager_login__${inputType}`);

    const label_text = document.createElement('p');
    label_text.textContent = `${labelName}:`;

    const input = document.createElement('input');
    input.type = inputType;
    input.classList.add('input');
    input.id = `manager_login__${inputType}__input`;

    const error = document.createElement('p');
    error.classList.add('longin_error');
    error.classList.add('hidden');
    error.textContent = `*${errorText}`;

    label.append(label_text, input, error);

    return label;
}
function toggle_hidden(item) {
    item.classList.toggle('hidden');
}
