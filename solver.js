function getRow(board,i) {
    return board[i]
}
function getColumn(board,j) {
    return board.map((row)=>row[j])
}
function getRowCoordinates(i) {
    const rowCoords = []
    for (let k=0;k<9;k++) {
        rowCoords.push([i,k])
    }
    return rowCoords
}

function getColumnCoordinates(j) {
    const colCoords = []
    for (let k=0;k<9;k++) {
        colCoords.push([k,j])
    }
    return colCoords
}
function getBoxCoordinates(i,j) {
    const threeByThreeIndices = [[0,0],[0,1],[0,2],
                                 [1,0],[1,1],[1,2],
                                 [2,0],[2,1],[2,2]]
    const topLeftCoords = [Math.floor(i/3)*3,Math.floor(j/3)*3]
    return threeByThreeIndices.map(crd=> {
        return [crd[0]+topLeftCoords[0],crd[1]+topLeftCoords[1]]
    })
}

function getBox(board,i,j) {
    const boxCoordinates = getBoxCoordinates(i,j)
    return boxCoordinates.map(crd=>board[crd[0]][crd[1]])
}



function removeEmpties(array) {
    return array.filter(el=> typeof el==='number' && el!==0)
}

function pairingsEliminatePossibility(board,type,value1,value2,crd1,crd2) {
    const coordinates = findEmptyCellCoordinates(board,crd1[0],crd1[1],type)
    const coi = coordinates.filter(coordinate=> { //coordinates of interest
        return coordinate.toString()!==crd1.toString() && coordinate.toString()!==crd2.toString()
    })
    let cellValue
    coi.forEach(crd=> {
        cellValue = board[crd[0]][crd[1]]
        if (cellValue.includes(value1)) {
            cellValue.splice(cellValue.indexOf(value1),1)
            board[crd[0]][crd[1]] = cellValue
            //console.log(`${value1} eliminated at ${crd[0]},${crd[1]}`)
        }
        if (cellValue.includes(value2)) {
            cellValue.splice(cellValue.indexOf(value2),1)
            board[crd[0]][crd[1]] = cellValue
        }
    }

    )


}

function obviousPairs(board,i,j,type) {
    const coordinates = findEmptyCellCoordinates(board,i,j,type)
    const possibleValues = coordinates.map((crd,crd_i)=> [board[crd[0]][crd[1]],crd]) 
    const possiblePairs = possibleValues.filter(values=>values[0].length===2).map(el=>{
        return [`${el[0]}`,el[1]]
    })
    const matchingCells = []
    let value1,value2
    for (let l=0;l<possiblePairs.length;l++) {
        for (let k=l+1;k<possiblePairs.length;k++) {
            if (possiblePairs[l][0]===possiblePairs[k][0]) {
                value1 = parseInt(possiblePairs[l][0][0]) //get the value from the string
                value2 = parseInt(possiblePairs[l][0][2])
                const [I1,J1] = possiblePairs[l][1]
                const [I2,J2] = possiblePairs[k][1]
                pairingsEliminatePossibility(board,type,value1,value2,[I1,J1],[I2,J2])
                //console.log(`Found pairing ${board[I1][J1]} at ${I1},${J1} and ${I2},${J2} for ${type}`)
            }
        }
    }
}
function cellsPossibleValues(board,i,j) {
    /**
     * For a given row (i) and column (j) this function finds all of the numbers the cell [i,j] cannot be
     * due to the numbers existing on the respective row, column and box
     */
    const allInvalidValues = [...getBox(board,i,j),...getColumn(board,j),...getRow(board,i)]
    const invalidValues = Array.from(new Set(removeEmpties(allInvalidValues)))
    const possibleValues = [1,2,3,4,5,6,7,8,9]
    invalidValues.forEach(value=> {
        if (possibleValues.includes(value)) {  
            possibleValues.splice(possibleValues.indexOf(value),1)
        }
    })
    return (possibleValues.length===1?possibleValues[0]:possibleValues)
}   

function eliminatePossibility(value,i,j,board,type) {
    let coords
    let cellValue
    coords = findEmptyCellCoordinates(board,i,j,type)
    coords.forEach(coord=> {
        cellValue = board[coord[0]][coord[1]]
        if (typeof cellValue==='object' && cellValue.indexOf(value)!==-1 && !(i===coord[0]&& j===coord[1])) {
            board[coord[0]][coord[1]].splice(cellValue.indexOf(value),1)
        }
    })
}

function singleValuedCells(board) {
    coordinates = findAllEmptyCells(board) //all coordinates of the board
    const possibleValues = coordinates.map(crd=> board[crd[0]][crd[1]])
    const singles = possibleValues.map((p,indx)=> [p,coordinates[indx]]).filter(el=>el[0].length===1)
    singles.forEach(el => {
        const [[value],[I,J]] = el
        board[I][J] = value
        eliminatePossibility(value,I,J,board,'all')
        })
}

function obviousSingles(board,i,j,type) {
    const coordinates = findEmptyCellCoordinates(board,i,j,type)
    const possibleValues = coordinates.map(crd=> board[crd[0]][crd[1]])
    const singles = possibleValues.map((p,indx)=> [p,coordinates[indx]]).filter(el=>el[0].length===1)
    const valueCounter = {}
    possibleValues.forEach((possibles,crdCounter)=> {
        possibles.forEach(possible=> {
            `${possible}` in valueCounter? valueCounter[`${possible}`][0]++:valueCounter[`${possible}`]=[1,coordinates[crdCounter]]
        })
    })
    const singularCells = Object.keys(valueCounter).reduce((acc,key)=> {
        if (valueCounter[key][0]===1){
            acc.push([parseInt(key),valueCounter[key][1]])
        }
        return acc
    },[])
    return singularCells
}

function findEmptyCellCoordinates(board,i,j,type) {
    if (type==='all') {
        const rowCords = getRowCoordinates(i).filter(crd=> typeof board[crd[0]][crd[1]]==='object')
        const boxCords = getBoxCoordinates(i,j).filter(crd=> typeof board[crd[0]][crd[1]]==='object')
        const colCords = getColumnCoordinates(j).filter(crd=> typeof board[crd[0]][crd[1]]==='object')
        return Array.from(new Set([...rowCords,...boxCords,...colCords]))
    }
    if (type==='row') {
        return getRowCoordinates(i).filter(crd=> typeof board[crd[0]][crd[1]]==='object')
    }
    else if (type==='box') {
        return  getBoxCoordinates(i,j).filter(crd=> typeof board[crd[0]][crd[1]]==='object')
    }
    else {
        return getColumnCoordinates(j).filter(crd=> typeof board[crd[0]][crd[1]]==='object')
    }
}

function findAllEmptyCells(board) {
    const emptyCellIndexes = []    
    let currentBox = 0
    board.forEach((row,i)=> {
        row.forEach((cell,j)=> {
            if (cell===0 || typeof cell==='object') {
                emptyCellIndexes.push([i,j])
            }
        })
    })
    return emptyCellIndexes
}

function sudokuSolver(board) {
    let currentBox
    const startTime = new Date()
    let emptyCellIndexes
    let unsolved = true
    let I,J
    const oldBoard = [...board]
    emptyCellIndexes = findAllEmptyCells(board)
    for (let [i,j] of emptyCellIndexes) {
        board[i][j]=cellsPossibleValues(board,i,j) //find all the possible values for each empty cell. 
        if (typeof board[i][j]==='number') {
            eliminatePossibility(board[i][j],i,j,board,'all') //fill in, if there can only be 1. 
        }
    }
    while (unsolved) {
        emptyCellIndexes = findAllEmptyCells(board)

        singleValuedCells(board) //where only 1 value is possible in a cell, it is filled. (similar to cellsPossibleValues)
        for (let k=0;k<9;k++) {
            singleValuedCells(board)
            I = Math.floor(k/3)*3
            J = (k % 3)*3
            //console.log(getBox(board,6,3)[6])
            //console.log(getBox(board,6,3)[8])
            obviousPairs(board,k,k,'row')
            obviousPairs(board,k,k,'column')
            obviousPairs(board,I,J,'box')
            const boxSols = obviousSingles(board,I,J,'box') //find a cell where within a box/row/col a potential value can only exist 
            const rowSols = obviousSingles(board,k,k,'row') 
            const colSols =  obviousSingles(board,k,k,'column')
            for (let [value,[crdI,crdJ]] of [...rowSols,...colSols,...boxSols]) {
                if (typeof board[crdI][crdJ]!=='number') {
                    board[crdI][crdJ]=value
                    eliminatePossibility(value,crdI,crdJ,board,'all')
                }
            }
        }
        //console.log(board)
        //console.log('------------')
        
        if (emptyCellIndexes.length===0) {
            console.log(`dT = ${new Date() - startTime}`)
            unsolved=false
        }
    }
    console.log(board)
    return board




}


const medium = [[1,5,0,0,9,0,0,0,2],
[0,0,0,2,1,0,7,4,0],
[0,0,0,7,5,3,0,9,0],
[0,6,0,1,0,0,0,0,9],
[4,0,0,0,0,0,3,0,8],
[9,0,0,0,7,0,5,0,1],
[6,0,0,5,3,0,0,0,0],
[0,0,0,0,2,0,6,1,0],
[0,3,1,0,0,0,0,0,0]]
const evil = [[5,0,0,0,0,0,1,0,2],
              [0,3,0,8,7,0,0,9,0],
              [0,2,0,0,0,3,8,0,0],
              [0,0,1,0,0,7,0,0,0],
              [0,0,0,5,0,9,0,0,0],
              [0,0,0,3,0,0,6,0,0],
              [0,0,3,6,0,0,0,1,0],
              [0,6,0,0,3,1,0,8,0],
              [2,0,9,0,0,0,0,0,6]]
//sudokuSolver(medium)
const hard=[[0,0,7,0,0,3,5,4,0],
            [0,0,0,2,0,0,0,0,0],
            [0,3,0,0,8,4,0,7,2],
            [0,9,0,0,0,0,0,0,7],
            [0,1,0,7,0,0,0,0,0],
            [7,0,0,1,0,0,2,8,0],
            [1,0,5,0,0,9,0,0,0],
            [9,6,0,0,0,8,0,0,5],
            [3,0,0,0,6,0,9,0,0]]
sudokuSolver(hard)

module.exports = {
    cellsPossibleValues,
    eliminatePossibility,
    obviousSingles,
    sudokuSolver,
    obviousPairs,
    getBoxCoordinates
}