const { objectExpression } = require("@babel/types")

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

function cellsPossibleValues(board,i,j) {
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

function eliminatePossibility(value,i,j,board) {
    coords = Array.from(new Set([...getColumnCoordinates(j),...getBoxCoordinates(i,j),...getRowCoordinates(i)]))
    let cellValue
    coords.forEach(coord=> {
        cellValue = board[coord[0]][coord[1]]
        //console.log(`Possible values at ${coord[0]},${coord[1]} are ${cellValue}`)
        if (typeof cellValue==='object' && cellValue.indexOf(value)!==-1) {

            board[coord[0]][coord[1]].splice(cellValue.indexOf(value),1)
            //console.log(`Possibility of ${value} removed at ${coord[0]+1},${coord[1]+1}`)
        }
    })
}

function obviousSingles(board,i,j,type) {
    const coordinates = findEmptyCellCoordinates(board,i,j,type)
    const possibleValues = coordinates.map(crd=> board[crd[0]][crd[1]])
    const valueCounter = {}
    possibleValues.forEach((possibles,crdCounter)=> {
        possibles.forEach(possible=> {
            `${possible}` in valueCounter? valueCounter[`${possible}`][0]++:valueCounter[`${possible}`]=[1,coordinates[crdCounter]]
        })
    })
    const singularCells = Object.keys(valueCounter).reduce((acc,key)=> {
        if (valueCounter[key][0]===1 ){
            acc.push([parseInt(key),valueCounter[key][1]])
        }
        return acc
    },[])
    return singularCells
}

function findEmptyCellCoordinates(board,i,j,type) {
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
    while (unsolved) {
        emptyCellIndexes = findAllEmptyCells(board)
        for (let emptyCell of emptyCellIndexes) {
            const [i,j] = emptyCell

            board[i][j]=cellsPossibleValues(board,i,j)
            if (typeof board[i][j]==='number') {
                eliminatePossibility(board[i][j],i,j,board)
            }
        }
        for (let k=0;k<9;k++) {
            I = Math.floor(k/3)*3
            J = (k % 3)*3
            const boxSols = obviousSingles(board,I,J,'box')
            const rowSols = obviousSingles(board,k,k,'row')
            const colSols =  obviousSingles(board,k,k,'column')
            for (let [value,[crdI,crdJ]] of [...rowSols,...colSols,...boxSols]) {
                if (typeof board[crdI][crdJ]!=='number') {
                    board[crdI][crdJ]=value
                    eliminatePossibility(value,crdI,crdJ,board)
                }
            }
        }
        if (emptyCellIndexes.length===0) {
            console.log(`dT = ${new Date() - startTime}`)
            unsolved=false
        }
    }
    return board




}

// medium = [[1,5,"","",9,"","","",2],
//         ["","","",2,1,"",7,4,""],
//         ["","","",7,5,3,"",9,""],
//         ["",6,"",1,"","","","",9],
//         [4,"","","","","",3,"",8],
//         [9,"","","",7,"",5,"",1],
//         [6,"","",5,3,"","","",""],
//         ["","","","",2,"",6,1,""],
//         ["",3,1,"","","","","",""]]
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
sudokuSolver(medium)


module.exports = {
    cellsPossibleValues,
    eliminatePossibility,
    obviousSingles,
    sudokuSolver,
}