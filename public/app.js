const $charContainer = $('#character-container');
const $itemContainer = $('#item-container');
const $optionsContainer = $('#options-container');
const $charItemContainer = $('#char-item-container');
const $listChar = $('#list-char');
const $listItem = $('#list-item');

const showAllChar = () => {
    console.log('fetch character');
    fetch("character")
    .then((result) => {
        result.json();
    })
    .then((chars) => {
        console.log(chars.rows);
        for(let char of chars.rows) {
            const $charDiv = $(`<div>${char.char_name}</div>`)
                            .addclass('char-div');
            $listChar.append($charDiv);
        }
    })
    .catch((err) => {
        console.log(err);
        res.sendStatus(500);
    })
}

showAllChar();