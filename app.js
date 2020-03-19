
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
                name: 'Beef Burguer',
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
        logState: function () {
            return state;
        }
    }

})();

//our ui controller will populate our list 
const UICtrl = (function () {

})();

const App = (function (ItemCtrl, UICtrl) {

    //anything we need to run when the app loads, we place here.
    return {
        init: function () {
            console.log('HOI')
        }
    }

})(ItemCtrl, UICtrl);

App.init();