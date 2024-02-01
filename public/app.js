const $charContainer = $('#character-container');
const $itemContainer = $('#item-container');
const $optionsContainer = $('#options-container');
const $charItemContainer = $('#char-item-container');
const $listChar = $('#list-char');
const $listItem = $('#list-item');

const showAllChar = () => {
    fetch("character")
    .then((result) => {
        return result.json();
    })
    .then((chars) => {
        console.log(chars);
        for(let char of chars) {
            const $charDiv = $(`<div>${char.char_name}</div>`)
                            .addClass('char-div')
                            .on('click', () => {
                                showSelectedChar(char);
                            });
            $listChar.append($charDiv);
        }
    })
    .catch((err) => {
        console.log(err);
        res.sendStatus(500);
    })
}

const showSelectedChar = (char) => {
    $charContainer.empty();
    console.log(char);
    const { char_id, char_name, char_race } = char;
    const $idDiv = $(`<div>char_id: ${char_id}</div>`)
                            .addClass('char-div');
    const $nameDiv = $(`<div>char_id: ${char_name}</div>`)
                            .addClass('char-div');
    const $raceDiv = $(`<div>char_id: ${char_race}</div>`)
                            .addClass('char-div');
    $charContainer.append($idDiv, $nameDiv, $raceDiv);
}

showAllChar();