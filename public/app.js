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
        $listChar.empty();
        for(let char of chars) {
            const $charDiv = $(`<div>${char.char_name}</div>`)
                            .addClass('char-div')
                            .on('click', () => {
                                showSelectedChar(char);
                                createCharOptions(char);
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
    const $nameDiv = $(`<div>char_name: ${char_name}</div>`)
                            .addClass('char-div');
    const $raceDiv = $(`<div>char_race: ${char_race}</div>`)
                            .addClass('char-div');
    $charContainer.append($idDiv, $nameDiv, $raceDiv);
}

const showAllItems = () => {
    fetch("item")
    .then((result) => {
        return result.json();
    })
    .then((items) => {
        $listItem.empty();
        for(let item of items) {
            const $itemDiv = $(`<div>${item.item_name}</div>`)
                            .addClass('char-div')
                            .on('click', () => {
                                showSelectedItem(item);
                            });
            $listItem.append($itemDiv);
        }
    })
    .catch((err) => {
        console.log(err);
        res.sendStatus(500);
    })
}

const showSelectedItem = (item) => {
    $itemContainer.empty();
    console.log(item);
    const { item_id, item_name, item_value, owned_by_char_id } = item;

    const $idDiv = $(`<div>item_id: ${item_id}</div>`)
                            .addClass('char-div');
    const $nameDiv = $(`<div>item_name: ${item_name}</div>`)
                            .addClass('char-div');
    const $valueDiv = $(`<div>item_value: ${item_value}</div>`)
                            .addClass('char-div');
    const $ownedByDiv = $(`<div>owned_by_char_id: ${owned_by_char_id}</div>`)
                            .addClass('char-div');

    $itemContainer.append($idDiv, $nameDiv, $valueDiv, $ownedByDiv);
}

const createCharOptions = (char) => {
    $('.all-inputs').empty();
    const $allInputsDiv = $(`<div class='all-inputs'></div>`);
    for (let column in char) {
        const $columnDiv = $(`<div id='inputs'>${column}: ${Object.values(column)}</div>`);
        $allInputsDiv.append($columnDiv);
    }
    $optionsContainer.append($allInputsDiv);
}

showAllChar();
showAllItems();
createCharOptions();