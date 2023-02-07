const {cellsPossibleValues, eliminatePossibility,eliminateBoxPossibles,sudokuSolver} = require('./solver.js')
const cpv = cellsPossibleValues
const eP = eliminatePossibility
const eBoxP = eliminateBoxPossibles
const solve = sudokuSolver
const medium = [[1,5,0,0,9,0,0,0,2],
                [0,0,0,2,1,0,7,4,0],
                [0,0,0,7,5,3,0,9,0],
                [0,6,0,1,0,0,0,0,9],
                [4,0,0,0,0,0,3,0,8],
                [9,0,0,0,7,0,5,0,1],
                [6,0,0,5,3,0,0,0,0],
                [0,0,0,0,2,0,6,1,0],
                [0,3,1,0,0,0,0,0,0]]

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
    expect(cpv(evil,1,0).sort()).toStrictEqual(cell10P)
    expect(cpv(evil,5,5).sort()).toStrictEqual(cell55P)
    expect(cpv(evil,8,7).sort()).toStrictEqual(cell87P)
})

test('Solution is found for medium and is correct',()=> {
    expect(solve(medium)).toStrictEqual(mediumSolution)
    //soluton found using https://www.sudoku-puzzles-online.com/sudoku/enter-a-sudoku-puzzle-solution.php
})

test('Possibilities on rows/cols/boxes eliminated',()=> {
    
})