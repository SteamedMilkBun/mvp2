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
        return result.json();
    })
    .then((chars) => {
        console.log(chars);
        for(let char of chars) {
            const $charDiv = $(`<div>${char.char_name}</div>`)
                            .addClass('char-div')
                            .on('click', (event) => {
                                showSelectedChar(event.target);
                            });
            $listChar.append($charDiv);
        }
    })
    .catch((err) => {
        console.log(err);
        res.sendStatus(500);
    })
}

const showSelectedChar = (target) => {
    const { char_id, char_name, char_race } = target;
    const $idDiv = $(`<div>char_id: ${char_id}</div>`)
                            .addClass('char-div');
    const $nameDiv = $(`<div>char_id: ${char_name}</div>`)
                            .addClass('char-div');
    const $raceDiv = $(`<div>char_id: ${char_race}</div>`)
                            .addClass('char-div');
    $charContainer.append($idDiv, $nameDiv, $raceDiv);
}

showAllChar();