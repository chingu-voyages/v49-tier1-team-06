const colorArray = document.querySelector('#color-array');
//const colorSquare = document.querySelector('.card').attributes.style;
const colors =
    ['#FF0000',
        '#008000',
        '#0000FF',
        '#FFFFFF',
        '#FFFFF0',
        '#000000',
        '#808080',
        '#C0C0C0'];

//path to adjust color of card
//console.log(colorSquare.value = 'background-color: #FF0bbb');

//length of array
const arrayLength = colors.length;
console.log(arrayLength);

//iterate of array
const iterate = colors.map((el) => {
    const newCard = document.createElement('div');
    newCard.className = 'card colorCard align-items-start';
    newCard.style = `background-color: ${el}`;
    colorArray.appendChild(newCard);
});

console.log(iterate)
