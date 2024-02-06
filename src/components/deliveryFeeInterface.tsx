import React from 'react';

//Reusable form selector function, accessible to all functions
const form = document.querySelector.bind(document)

function deliveryFeeInterface(){

    return (
        <div>

            <div id="inputField">
            <label>Cart Value (Minimum 10)</label>
            <input type="number" data-test-id="cartValue"/>
            </div>

            <div id="inputField">
            <label>Delivery Distance (in Meters)</label>
            <input type="number" data-test-id="deliveryDistance"/>
            </div>

            <div id="inputField">
            <label>Amount of Items</label>
            <input type="number" data-test-id="numberOfItems"/>
            </div>

            <div id="inputField">
            <label>
                <input type="radio" name="timeOption" value="current" data-test-id="currentTimeRadio" checked /> Current Time
            </label>

            <label>
                <input type="radio" name="timeOption" value="userSelected" data-test-id="customTimeRadio" /> Custom Time
            </label>

            <input type="datetime-local" data-test-id="orderTime" id="orderTimeInput"/>
            </div>

            <button type={"button"} onClick={calc} className="add-to-cart">Calculate Delivery Price</button>

            <h2 id="deliv"></h2>
            <h2 id="cartTotal"></h2>
        </div>
    );
}

function calc(){

    //Function that is called when the "Calculate delivery price" button is pressed
    //First it gets the user inputted values from the website
    //and sets them to variable that are used later on in other functions to do calculations

    //cartValue variable is initialised and set to be a number
    let cartValue: number;

    //cartValue is saved as an element and then parsed into a float value
    const cartValueElement = form('[data-test-id=\"cartValue\"]') as HTMLInputElement;
    cartValue = parseFloat(cartValueElement.value);

    //deliveryDistance variable is initialised and set to be a number
    let deliveryDistance: number;

    //deliveryDistance is saved as an element and then parsed into a int value
    const deliveryElement = form('[data-test-id=\"deliveryDistance\"]') as HTMLInputElement;
    deliveryDistance = parseInt(deliveryElement.value);

    //itemQuantity variable is initialised and set to be a number
    let itemQuantity: number;

    //itemQuantity is saved as an element and then parsed into a int value
    const quantityElement = form('[data-test-id=\"numberOfItems\"]') as HTMLInputElement;
    itemQuantity = parseInt(quantityElement.value);

    //Pass in all variables to totalCalc() function that does all of the calculations
    //and updates the fields on the website
    totalCalc(cartValue, deliveryDistance, itemQuantity);
}

function totalCalc(cv:number, dd: number, iq: number){
    //cartValue, deliveryDestination and itemQuantity are passed in and used in their respective
    //calculations

    //cartValue is set to be the parameter cv and then passed into to
    //do the 10euro surcharge check
    let cartValue: number = cv;
    let cartSurCharge: number = cartValueCheck(cv);

    //We initialise the deliveryFee variable and set it's value to be
    //the calculated price that the distanceToEuro function returns
    //distanceToEuro function uses the dd (deliveryDistance) as a parameter for
    //calculations and then returns the final delivery fee
    let deliveryFee: number = distanceToEuro(dd);

    //We initialise the quantityFee variable and set it's value to be
    //the calculated price that the quantityCalc function returns
    //quantityCalc function uses the iq (itemQuantity) as a parameter for
    //calculations and then returns the potential quantityFee
    let quantityFee: number = quantityCalc(iq);

    //Variable that is used to check if the cart qualifies for free delivery
    let freeDelivCutOff: number = 200;

    //Checking if the cartValue exceeds the cut off point for delivery fees
    if (cartValue >= freeDelivCutOff){
        updateTotal(cartValue);
        updateDeliv(0);
        return cartValue;
    }

    //Update function for deliver fee
    updateDeliv(deliveryFeeTotal(deliveryFee, quantityFee, checkTime()));

    //Update function for cart total
    updateTotal(cartTotal(cartValue, cartSurCharge, deliveryFeeTotal(deliveryFee, quantityFee, checkTime())))

    //Calculating everything together and returning it as a number to be displayed on the
    //website
    return cartTotal(cartValue, cartSurCharge, deliveryFeeTotal(deliveryFee, quantityFee, checkTime()))

}

function updateDeliv(deliv: number){
    //Function for updating "Delivery Fee" on the website

    //We create a rounded version of deliv to make sure it displays only 2 decimals
    const roundDeliv = deliv.toFixed(2);

    //totalDisplayOnPage variable houses the h1 tag that displays the total delivery fee
    let totalDisplayOnPage: HTMLHeadingElement = form("#deliv") as HTMLHeadingElement;

    //After all of the calculations we set the totalDisplayOnPage to show the total fee
    totalDisplayOnPage.innerText = "Delivery Fee: " + roundDeliv + " €";

}

function updateTotal(total: number){
    //Function for updating "Cart total" on the website

    //We create a rounded version of total to make sure it displays only 2 decimals
    const roundTotal = total.toFixed(2);
    //totalDisplayOnPage variable houses the h1 tag that displays the total delivery fee
    let totalDisplayOnPage: HTMLHeadingElement = form("#cartTotal") as HTMLHeadingElement;

    //After all of the calculations we set the totalDisplayOnPage to show the total fee
    totalDisplayOnPage.innerText = "Cart total: " + roundTotal + " €";
}

function cartValueCheck(cv:number){
    //Cart value calculation Function, it takes cartValue as a parameter and
    //calculates and returns potential surcharge
    let surcharge:number;

    //If cartValue is less than 10, we will calculate the difference
    //between cv and 10 and set the surcharge value to that
    if (cv < 10){
        surcharge = 10 - cv;
        return surcharge
    }
    //Else we just return a 0 and ignore it in the later calculations
    return 0;
}

function distanceToEuro(dd: number){

    //Function for calculating how distance effects the delivery Fee

    //Base fee, Distance and additional distance can be changed in the future
    //and the functions should continue to work
    let baseFee:number = 2;
    let additionalFee:number;
    let baseDist: number = 1000;
    let addiDist: number = 500;

    //If deliveryDistance is less or equal to 1000 we return the base fee of 2
    if (dd <= baseDist){
        return baseFee;
    }

    //If the distance is greater than 1000, we divide it by 500 and we round up the remainder
    //with Math.ceil
    //We remove the first 1000 meters since the base fee might change in the future
    additionalFee = (dd - baseDist)/addiDist
    //Create a new total variable to return as the calculated fee
    let total: number = Math.ceil(additionalFee) + baseFee;
    return total;
}

function quantityCalc(q:number){

    //Function for calculating if the item quantity will effect the total delivery price
    let quantity: number = q;

    //If the quantity is between 5 and 11 we will add 0.5e for each item
    if (quantity >= 5 && quantity < 12){
        let modifier = quantity - 4
        return modifier * .50;
    }
    //If the quantity is 12 or more, we will add an additional 1.2e to the total
    else if(quantity >= 12){
        let modifier = quantity - 4
        return modifier * .50 + 1.20;
    }
    return 0;
}

function fridayRush(t: number){
    //Function for multiplying the delivery total
    //Since the friday rush modifier may be changed in the future
    //it's value is in a variable.

    let rushModifier: number = 1.2;
    let total: number = t;
    return total * rushModifier;
}

function deliveryFeeTotal(dd:number, iq: number, fr: boolean){

    //Calculating total delivery by adding the calculated delivery price
    //and the calculated quantity price together
    let total: number = dd + iq;
    let priceCap: number = 15;

    //Friday rush check
    if (fr){
        total = fridayRush(total);
    }

    //Checking if the total delivery price exceeds the cap of 15e
    //The priceCap variable can be changed in the future without touching this code
    if (total >= priceCap){
        return priceCap;
    }
    return total;
}

function cartTotal(cv:number, csc: number, delivTotal:number){
    //Function for calculating all of the prices together

    let carTotal:number = cv + csc + delivTotal;

    return carTotal;
}

function currentTime(){
    //Function for getting the time
    const now = new Date();
    return now.getHours();
}

function currentDay(){
    //Function for getting the current day of the week
    const now = new Date();
    return now.getDay();
}

function checkTime(){

    const selectedTimeOptionElement = form('input[name="timeOption"]:checked') as HTMLInputElement;

    if (selectedTimeOptionElement){
        const selectedTimeOption = selectedTimeOptionElement.value;


        if (selectedTimeOption === "current"){
            //Happens if the user selected "current time"

            // Here we set the value of isFriday to true if currentTime function returns 5 (friday)
            const isFriday = currentDay() === 5;

            //We use currentTime function to set the value of time variable
            const time = currentTime();
            //isRush is set to true if isFriday and time are both true
            const isRush = isFriday && time === 15 && time < 18;

            //If both are true this returns true
            if (isRush){
                return true
            }
            //Else we return false, since it isn't friday rush time
            return false;
        }

        else if (selectedTimeOption === "userSelected"){
            //Happens if the user selected "custom time"

            //Here we find the dateTime element on the site
            const customTime = form('[data-test-id="orderTime"]') as HTMLInputElement;
            const selectedTime = new Date (customTime.value);

            const isFriday = selectedTime.getDay() === 5;
            const time = selectedTime.getHours()

            // Here we set the value of isFriday to true if currentTime function returns 5 (friday)
            const isRush = isFriday && time >= 15 && time <= 18;

            console.log(isRush)
            //If isRush is true we return true
            if (isRush){
                return true
            }
            //Else we return false, since it isn't friday rush time
            return false;
        }
    }

    return false
}

export default deliveryFeeInterface;