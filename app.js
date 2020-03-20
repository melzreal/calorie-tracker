
//a few iffis, immediately invoked function expressions


const ItemCtrl = (function () {
    //constructor
    const Item = function (id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    const state = {
        items: [
            // {
            //     id: 0,
            //     name: 'Spinach Quiche',
            //     calories: 230
            // },
            // {
            //     id: 1,
            //     name: 'Beefy Burguer',
            //     calories: 800
            // },
            // {
            //     id: 2,
            //     name: 'Chicken Burguer',
            //     calories: 700
            // }
        ],
        currentItem: null,
        totalCalories: 0
    }
    //PUBLIC methods
    return {
        getItems: function () {
            return state.items;
        },
        logState: function () {
            return state;
        },
        addItem: function (name, calories) {
            let ID;

            if (state.items.length > 0) {
                ID = state.items[state.items.length - 1].id + 1;
            } else {
                ID = 0;
            }

            //parse calories to a nr
            //create item
            //update state
            calories = parseInt(calories);
            newItem = new Item(ID, name, calories);
            state.items.push(newItem);

            return newItem;
        },
        getTotalCalories: function () {
            let total = 0;
            state.items.forEach(item => total += item.calories);
            state.totalCalories = total;
            return state.totalCalories;

        }
    }

})();

//our ui controller will populate our list 
const UICtrl = (function () {
    //if the id gets changed, its easier to change it in one place hence this cont 
    const UISelectors = {
        itemList: '#item-list',
        addBtn: '.add-btn',
        itemName: 'item-name',
        itemCalories: 'item-calories',
        totalCalories: '.total-calories',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn'
    }
    return {
        populateItems: function (goodies) {

            let html = '';

            goodies.map(item => {
                html += `<li id="item-${item.id}" class="collection-item">
                <strong> ${item.name} </strong> <em> ${item.calories}</em>
                <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil"></i>
                </a>
                </li>`;
            });

            //put items into the DOM
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        //this is how we access the private method of const UISelectos
        getSelectors: function () {
            return UISelectors;
        },

        getItemInput: function () {
            return {
                name: document.getElementById(UISelectors.itemName).value,
                calories: document.getElementById(UISelectors.itemCalories).value
            }
        },
        addListItem: function (item) {
            document.querySelector(UISelectors.itemList).style.display = 'block';

            //create li element
            //add class - col item is a materialize class
            const li = document.createElement('li');
            li.className = 'collection-item';
            li.id = `item-${item.id}`;
            li.innerHTML = `<strong> ${item.name} </strong> <em> ${item.calories}</em>
            <a href="#" class="secondary-content">
                <i class="edit-item fa fa-pencil"></i>
            </a>`;

            //insert it
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li)


        },
        hideList: function () {
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },
        showTotalCalories: function (total) {
            document.querySelector(UISelectors.totalCalories).textContent = total;

        },
        clearInput: function () {
            document.getElementById(UISelectors.itemName).value = '';
            document.getElementById(UISelectors.itemCalories).value = ''
        },
        clearEditState: function () {
            UICtrl.clearInput();
        }
    }

})();

const App = (function (ItemCtrl, UICtrl) {

    const loadEventListener = function () {
        const UISelectors = UICtrl.getSelectors();
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);
    }
    //we need to call this on our init function
    const itemAddSubmit = function (e) {
        e.preventDefault();
        const input = UICtrl.getItemInput();

        //check input exists
        //we will use newItem to update the UI
        //so we first store the item in state using the Item Controller
        //then place it in the UI with a UI addListItem method
        //finally clear fields
        if (input.name !== '' && input.calories !== '') {
            const newItem = ItemCtrl.addItem(input.name, input.calories);
            UICtrl.addListItem(newItem);
        }

        const getCalories = ItemCtrl.getTotalCalories();
        UICtrl.showTotalCalories(getCalories);

        UICtrl.clearInput();

    }
    //anything we need to run when the app loads, we place here.
    return {
        init: function () {
            const items = ItemCtrl.getItems();
            if (items.length === 0) {
                UICtrl.hideList();
            } else {
                UICtrl.populateItems(items);
            }

            UICtrl.populateItems(items);
            const getCalories = ItemCtrl.getTotalCalories();
            UICtrl.showTotalCalories(getCalories);
            loadEventListener();
        }
    }

})(ItemCtrl, UICtrl);

App.init();