import {createAllElements, createElement} from './dom-utils.js';

(function () {
    
    initialiseSpreadsheet();
    
////temp state management
    var selectedColumn = null;
    var isCalcInitiated = false;
    var state = {

    }
////temp state management

    function initialiseSpreadsheet() {

        createAllElements(20, 20);
        const contextMenuElem = document.querySelector("#context-menu");

        // ON CONTEXT MENU OPEN | EVENT
        container__elem.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            contextMenuElem.classList.add('active');
            contextMenuElem.style.top = `${e.clientY}px`;
            contextMenuElem.style.left = `${e.clientX}px`;
            selectedColumn = e.target;
            
        })

        // TO CLOSE CONTEXT MENU | EVENT
        document.addEventListener('click', function(e) {
            if(contextMenuElem.className.includes('active')) {
                contextMenuElem.classList.remove('active');
            }
        })

        // INSERT ROW AND COLS | EVENT
        contextMenuElem.addEventListener('click', function(e) {
            switch (e.target.id) {
                case 'insert-row':
                    insertRow();
                    break;
                case 'insert-column':
                    insertCol();
                    break;
                case 'sort-a-z':
                    sortColumn('ascending');
                    break;
                case 'sort-z-a':
                    sortColumn('descending');
                    break;
                default:
                    break;
            }
        })
 
        // ON CHANGING OR ADDING A VALUE TO CELL | EVENT
        container__elem.addEventListener('keyup', function(e) {
            const val = e.target.innerText;
            if(val.length === 1) {
                isCalcInitiated = (val === '='); 
            }

            if(isCalcInitiated) {
                let firstVal;
                let secondVal;
                if (val.includes('+')) {
                    firstVal = val.split('+')[0].replace('=', '');
                    secondVal = val.split('+')[1];
                }
                if(state.hasOwnProperty(firstVal) && state.hasOwnProperty(secondVal)) {
                    if(!isNaN(state[firstVal] + state[secondVal])) {
                        e.target.innerText = Number(state[firstVal]) + Number(state[secondVal]);
                    }
                }

            }  else {
                const rowNumber = e.target.parentElement.id.split('-')[1];
                const colNumber = e.target.dataset.content;
                const storageKey = `${rowNumber}${colNumber}`;
                state[storageKey] = val;
            }

            
        })

        // On search
        document.querySelector('#search-btn').addEventListener('click', function(e) {
            const value = document.querySelector('#search-input').value;
            searchCell(value);
        })
    }
    
    function searchCell(query) {
        const resultAdd = Object.keys(state).find(cellAdd => {
            if(state[cellAdd] === query) {
                return cellAdd;
            }
        });
        const rowAdd = resultAdd[0];
        const rowElem = document.querySelector(`#row-${rowAdd}`);
        const colAdd = `.col-${resultAdd.replace(rowAdd, '')}`;
        const colElem = rowElem.querySelector(colAdd);
        colElem.style.border = '1px solid blue';
    }

    function insertRow() {
        let currentID = Number(selectedColumn.dataset.content);
        let count = 1;
        let colElementToAppend = document.querySelector(`.col-${currentID}`);
        while(colElementToAppend) {
            let newCol = createElement(`col col-${currentID}`);
            newCol.dataset.content = currentID;
            colElementToAppend.insertAdjacentElement('beforebegin', newCol, true);
            colElementToAppend = colElementToAppend.parentElement?.nextElementSibling?.querySelector(`.col-${currentID}`);
            console.log(count += 1);
        }
            

        // Increment the row header count by one
        const totalCols = document.querySelector('#row-header').childElementCount;
        let currentColumn = document.querySelector('#row-header').children[currentID+1];
        while(currentID < totalCols) {
            currentColumn.className = `col col-${currentID+1}`;
            currentColumn.dataset.content = currentID+1;
            currentColumn = currentColumn.nextElementSibling;
            currentID++;
        }
    }


    function insertCol() {
        const selectedRowElem = selectedColumn.parentElement;
            let newRowElem = selectedRowElem.cloneNode(true);
            const charCodeOfID = newRowElem.id.split('-')[1].charCodeAt();
            newRowElem.id = selectedRowElem.id;
            
            // clear the current column's values
            for(let i=1; i<selectedRowElem.childElementCount; i++) {
                selectedRowElem.children[i].innerText = '';
            }
            selectedRowElem.insertAdjacentElement('afterend', newRowElem);
            // increment all next column by one (title and element id)
            let i=1;
            while(newRowElem) {
                const rowName = String.fromCharCode(charCodeOfID+i).toUpperCase();
                newRowElem.id = `row-${rowName}`;
                newRowElem.children[0].innerText = rowName;
                newRowElem = newRowElem.nextElementSibling;
                i++;
            }
    }

    function sortColumn(order) {

        const rowName = selectedColumn.parentElement.id.split('-')[1];
        let allValues = Object.keys(state).map(key => {
            if(key.includes(rowName) && !isNaN(key.replace(rowName, ''))) {
                return state[key];
            }
        }).filter(Boolean);

        if(order === 'ascending') {
            allValues = allValues.sort((a,b) => a.localeCompare(b, 'en', { numeric: true }))
        } else {
            allValues = allValues.sort((a,b) => b.localeCompare(a, 'en', { numeric: true }))
        }

        // Refresh the state variable and dom columns as the sorting has affected both
        const colsElement  = selectedColumn.parentElement.children;
        for(let i=0; i<=colsElement.length; i++) {
            if(i >= allValues.length && colsElement[i+1]) {
                colsElement[i+1].innerText = '';
                state[rowName+(i+1)] = '';
            } else {
                colsElement[i+1].innerText = allValues[i];
                state[rowName+(i+1)] = allValues[i];
            }
        }   

    }

    

})();

