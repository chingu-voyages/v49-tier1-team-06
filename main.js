//Output of colors to page element
const colorArray = document.querySelector('#color-array');

//array of colors example:testing
const colors =
    ['#FF0000',
        '#008000',
        '#0000FF',
        '#FFFFFF',
        '#FFFFF0',
        '#000000',
        '#808080',
        '#C0C0C0'];

//length of array
const arrayLength = colors.length;
console.log(arrayLength);

//iterate of color array
//create new div element with card and colorCard class
const iterate = colors.map((el) => {
    const newCard = document.createElement('div');
    newCard.className = 'card colorCard';
    newCard.style = `background-color: ${el}`;
    colorArray.appendChild(newCard);
});

//CRUD
