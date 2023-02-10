const {cellsPossibleValues, eliminatePossibility,obviousSingles,sudokuSolver,obviousPairs,getBoxCoordinates} = require('./solver.js')
const cpv = cellsPossibleValues
const eP = eliminatePossibility
const obS = obviousSingles 
const solve = sudokuSolver
const gbc = getBoxCoordinates


function checker(array) {
    const values = []
    for (cell of array) {
        if (typeof cell!=='number' || cell===0) {
            
            throw new Error('Not all cells filled in')
        }
        if (values.includes(cell)) {
            throw new Error('Row does not contain unique values')
        }
        values.push(cell)
    }
}

function verifySolution(board) {
    for (row of board) {
        checker(row)
    }
    for (let i=0;i<9;i++) {
        columnValues = board.map(row=> {
            return row[i]
        })
        checker(columnValues)
    }
    for (let i=0;i<7;i+=3) {
        for (let j=0;j<7;j+=3) {
            const boxCoords = getBoxCoordinates(i,j)
            const boxValues = boxCoords.map(crd=> {
                return board[crd[0]][crd[1]]
            })
            checker(boxValues)
        }
    }
    return true
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

const hard=[[0,0,7,0,0,3,5,4,0],
            [0,0,0,2,0,0,0,0,0],
            [0,3,0,0,8,4,0,7,2],
            [0,9,0,0,0,0,0,0,7],
            [0,1,0,7,0,0,0,0,0],
            [7,0,0,1,0,0,2,8,0],
            [1,0,5,0,0,9,0,0,0],
            [9,6,0,0,0,8,0,0,5],
            [3,0,0,0,6,0,9,0,0]]

const mediumSolution=[[1,5,7,4,9,6,8,3,2],
                [3,9,6,2,1,8,7,4,5],
                [2,8,4,7,5,3,1,9,6],
                [7,6,3,1,8,5,4,2,9],
                [4,1,5,9,6,2,3,7,8],
                [9,2,8,3,7,4,5,6,1],
                [6,7,2,5,3,1,9,8,4],
                [5,4,9,8,2,7,6,1,3],
                [8,3,1,6,4,9,2,5,7]]

const evil=[[5,0,0,0,0,0,1,0,2],
            [0,3,0,8,7,0,0,9,0],
            [0,2,0,0,0,3,8,0,0],
            [0,0,1,0,0,7,0,0,0],
            [0,0,0,5,0,9,0,0,0],
            [0,0,0,3,0,0,6,0,0],
            [0,0,3,6,0,0,0,1,0],
            [0,6,0,0,3,1,0,8,0],
            [2,0,9,0,0,0,0,0,6]]
test('Cells possible values are read correctly',()=> {
    cell10P = [1,4,6]
    cell55P = [2,4,8]
    cell87P = [3,4,5,7]
    console.log('hi')
    expect(cpv(evil,1,0).sort()).toStrictEqual(cell10P)
    expect(cpv(evil,5,5).sort()).toStrictEqual(cell55P)
    expect(cpv(evil,8,7).sort()).toStrictEqual(cell87P)
})

test('Solution is found for medium and is correct',()=> {
    verifySolution(mediumSolution)
    expect(solve(medium)).toStrictEqual(mediumSolution)
    //soluton found using https://www.sudoku-puzzles-online.com/sudoku/enter-a-sudoku-puzzle-solution.php
})
test('Solution is found for hard difficulty and is correct',()=> {
    expect(verifySolution(solve(hard))).toBe(true)
})

test('Possibilities on rows/cols/boxes eliminated',()=> {

})

test('Obvious pairs changes the board',()=> {
    board =[[[1,3,6,7],[1,3,6,7,9],2,[6,7,9],8,5,[1,7,9],[7,9],4],
            [[1,5,7],[1,7,8,9],[1,5,7,8,9],[7,9],3,[4,7,9],[1,2,5,7,8,9],6,[1,5,7,9]],
            [[5,6,7],[6,7,8,9],4,2,1,[7,9],[5,7,8,9],3,[5,7,9]],
            [[1,3,4,6,7],[1,3,4,6,7,8],[1,3,6,7,8],[1,3,6,7,8,9],[4,6,7,9],[3,4,7,8,9],5,2],
            [[4,5,6,7],[2,4,6,7,8],[5,6,7,8],[5,6,7,8,9],[2,4,5,6,7,9],[2,4,7,8,9],3,1,[6,7,9]],
            [9,[1,2,3,4,6,7,8],[1,3,5,6,7,8],[1,3,5,6,7,8],[2,4,5,6,7],[2,3,4,5,7,8],[4,7,8],[4,7,8],[6,7]],
            [8,[1,3,4,7,9],[1,3,7,9],[3,5,7,9],[2,5,7,9],6,[1,2,4,5,7,9],[2,4,7,9],[1,3,5,7,9]],
            [2,5,[1,3,6,7,9],4,[7,9],[3,7,9],[1,4,7,9],[7,9],8],
            [[3,4,7],[3,4,7,9],[3,7,9],[3,5,7,8,9],[2,5,7,9],1,6,[2,4,7,9],[3,5,7,9]]]
    obviousPairs(board,0,3,'box')
    //console.log(board)
    expect(board[0][3]).toStrictEqual([6])


})