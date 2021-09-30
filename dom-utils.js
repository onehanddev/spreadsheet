function createColumns(columns) {
    const colElements = [];
    for(let i=0; i<=columns; i++) {
        const classNames = i === 0 ? `col-header col col-${i}` : `col col-${i}`;
        const colElement = createElement(classNames, true);
        // if its row heading then add row number
        if(i !== 0) {
            colElement.dataset.content = i;
        } else {
            colElement.contentEditable = false;
        }
        colElements.push(colElement);
    }
    return colElements;
}

function createRows(rows, colElements) {
    const rowElements = [];
    const rowElement = createElement('row');
    rowElement.id = 'row-header';
    rowElement.append(...colElements);
    rowElements.push(rowElement);

    for(let i=1; i<=rows; i++) {
        const rowName = String.fromCharCode(64+i);
        const clonedRowElement = rowElement.cloneNode(true);
        clonedRowElement.childNodes[0].innerText = rowName;
        clonedRowElement.id = `row-${rowName}`;
        rowElements.push(clonedRowElement);

    }
    return rowElements;
}


function createAllElements(rows, cols) {
    const colElements = createColumns(cols);
    const rowElements = createRows(rows, colElements);
    container__elem.append(...rowElements);

}
function createElement(classNames, isEditable) {

    let element = document.createElement('div');
    element.className = classNames;
    if(isEditable) {
        element.contentEditable = true;
    }
    return element;
}

export {createAllElements, createElement};