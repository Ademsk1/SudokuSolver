# Sudoku Solver
## Introduction
This is a Javascript program written to solve Sudoku puzzles. There are no pre-requisites provided your runtime is up to date. 

---

## Inputs

The format of the input should be a 2 dimensional array, where the empty cells are denoted by 0's. For example:

	[[1,5,0,0,9,0,0,0,2],
	[0,0,0,2,1,0,7,4,0],
	[0,0,0,7,5,3,0,9,0],
	[0,6,0,1,0,0,0,0,9],
	[4,0,0,0,0,0,3,0,8],
	[9,0,0,0,7,0,5,0,1],
	[6,0,0,5,3,0,0,0,0],
	[0,0,0,0,2,0,6,1,0],
	[0,3,1,0,0,0,0,0,0]]

---
## More information

Two methods of insertion occurs at this current stage (07/02/2023)

1. Looking at a cell's row, column and box, what values can it be? If there is only one, insert this value into the cell.
2. Looking at a given box, are there any cells that can ONLY be one value (e.g. with five empty cells, and four of them unable to contain 3, the fifth one should be 3).
3. ...

This list is currently incomplete, and the following is hoping to be achieved in the near future:

1. Apply (2) from above to not only boxes, but rows and columns. 
2.  **Obvious Pairs/Obvious Triples**
3. **Hidden Pairs/Hidden Triples**

Further solving methodologies hope to implemented, but before this, I hope to achieve the following:

1. Using the Jest framework, assert the program can solve a variety of problems
2. Insert error-handling for invalid puzzle inputs
3. After (1), try to guage the "difficulty level" that this script can handle. 

Once the above is completed, and an assessment is made on the abilities of the script should advanced solving methods be applied. 

