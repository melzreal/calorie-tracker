
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
            {
                id: 0,
                name: 'Spinach Quiche',
                calories: 230
            },
            {
                id: 1,
                name: 'Beefy Burguer',
                calories: 800
            },
            {
                id: 2,
                name: 'Chicken Burguer',
                calories: 700
            }],
        currentItem: null,
        totalCalories: 0
    }

    return {
        getItems: function () {
            return state.items;
        },
        logState: function () {
            return state;
        }
    }

})();

//our ui controller will populate our list 
const UICtrl = (function () {
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
            document.getElementById('item-list').innerHTML = html;
        }
    }

})();

const App = (function (ItemCtrl, UICtrl) {

    //anything we need to run when the app loads, we place here.
    return {
        init: function () {
            const items = ItemCtrl.getItems();

            UICtrl.populateItems(items);
        }
    }

})(ItemCtrl, UICtrl);

App.init();