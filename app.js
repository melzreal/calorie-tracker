
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

        },
        getItemById: function (id) {
            let found = null;

            state.items.forEach(item => {
                if (item.id === id) {
                    found = item;
                }
            });
            return found;

        },
        setCurrentItem: function (item) {
            state.currentItem = item;
        },
        getCurrentItem: function () {
            return state.currentItem;
        },
        updateItem: function (name, calories) {
            calories = parseInt(calories);
            let found = null;
            state.items.forEach(item => {
                if (item.id === state.currentItem.id) {
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });
            return found;
        }
    }

})();

//our ui controller will populate our list 
const UICtrl = (function () {
    //if the id gets changed, its easier to change it in one place hence this cont 
    const UISelectors = {
        itemList: '#item-list',
        addBtn: '.add-btn',
        itemName: '#item-name',
        itemCalories: '#item-calories',
        totalCalories: '.total-calories',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        updateItemSubmit: '.update-btn'
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
                name: document.querySelector(UISelectors.itemName).value,
                calories: document.querySelector(UISelectors.itemCalories).value
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
            document.querySelector(UISelectors.itemName).value = '';
            document.querySelector(UISelectors.itemCalories).value = ''
        },
        clearEditState: function () {
            UICtrl.clearInput();
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.updateBtn).style.display = 'none';

        },
        addItemToForm: function () {
            document.querySelector(UISelectors.itemName).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCalories).value = ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
        },
        showEditState: function () {

            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';
        },

    }

})();

const App = (function (ItemCtrl, UICtrl) {

    const loadEventListener = function () {
        const UISelectors = UICtrl.getSelectors();
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

        //disable enter to make sure right button is clicked when multiple are available
        //key code for enter is 13
        document.addEventListener('keypress', function (e) {
            if (e.keyCode === 13 || e.which === 13) {
                e.preventDefault();
                return false;
            }
        })

        document.querySelector(UISelectors.itemList).addEventListener('click', itemUpdate);
        document.querySelector(UISelectors.updateItemSubmit).addEventListener('click', updateItemSubmit);


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

    const itemUpdate = function (e) {
        //we use event delegation to make sure we can target the edit which was added after page load
        //get the item id first
        //make an array of items and ids then grab the id which is on the first index
        e.preventDefault();
        if (e.target.classList.contains('edit-item')) {
            const listId = e.target.parentNode.parentNode.id;
            const listIdArr = listId.split('-')
            const itemId = parseInt(listIdArr[1]);
            const itemToEdit = ItemCtrl.getItemById(itemId);
            ItemCtrl.setCurrentItem(itemToEdit);
            UICtrl.addItemToForm();


        }
    }

    const updateItemSubmit = function (e) {
        e.preventDefault();
        const itemInput = UICtrl.getItemInput();

        const updatedItem = ItemCtrl.updateItem(itemInput.name, itemInput.calories);

    }
    //anything we need to run when the app loads, we place here.
    return {
        init: function () {
            //set initial state
            UICtrl.clearEditState();

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