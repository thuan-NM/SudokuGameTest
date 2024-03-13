// SudokuGame.js
import React, { useState, useEffect } from 'react';
import SudokuBoard from '../SudokuBoard';
import generateSudoku from '../../utils/generateSudoku';
import { solveSudoku } from '../../utils/solveSudoku';
import { ReloadOutlined, OpenAIOutlined, SaveOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import SudokuInputForm from '../SudokuInputForm';

function SudokuGame() {
  const [sudokuMatrix, setSudokuMatrix] = useState(JSON.parse(JSON.stringify(generateSudoku())));
  const [initialSudokuMatrix, setInitialSudokuMatrix] = useState();
  const [isValid, setIsValid] = useState(true)

  const handleCellChange = (row, col, newValue) => {
    // Update the matrix
    const newMatrix = [...sudokuMatrix];
    newMatrix[row][col] = newValue !== '' ? parseInt(newValue) : 0;
    setSudokuMatrix(newMatrix);
  };
  
  const handleNewGame = () => {
    const newSudokuMatrix = generateSudoku();
    setSudokuMatrix(newSudokuMatrix);
    setInitialSudokuMatrix(JSON.parse(JSON.stringify(newSudokuMatrix)));
  };

  const handleSolveSudoku = () => {
    const newSudokuMatrix = solveSudoku(sudokuMatrix);
    setSudokuMatrix(JSON.parse(JSON.stringify(newSudokuMatrix)));
  }

  useEffect(() => {
    setInitialSudokuMatrix(JSON.parse(JSON.stringify(sudokuMatrix)));
  }, []);

  const isCellReadOnly = (row, col) => {
    return (initialSudokuMatrix?.[row]?.[col] ?? 0) !== 0;
  };

  const [showInput, setShowInput] = useState(false);

  const handleShowInput = () => {
    setShowInput(true);
  };

  const handleMatrixSubmit = (submittedMatrix) => {
    setSudokuMatrix(submittedMatrix);
    setInitialSudokuMatrix(JSON.parse(JSON.stringify(submittedMatrix)))
    setShowInput(false);
  };
  console.log(initialSudokuMatrix)

  const handleSaveGame = () => {
    const gameData = {
      sudokuMatrix: sudokuMatrix,
      initialSudokuMatrix: initialSudokuMatrix
    };

    const jsonData = JSON.stringify(gameData);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sudoku_game.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="sudoku-game d-flex justify-content-center flex-column align-items-center">
      <h1>Sudoku</h1>
      {!showInput && (
        <div>
          <Button type="primary" onClick={handleShowInput} className="new-game-button">Nhập Ma Trận Sudoku</Button>
          <Button type="primary" icon={<ReloadOutlined />} className="new-game-button" onClick={handleNewGame}>
            New Game
          </Button>
          <Button type="primary" icon={<OpenAIOutlined />} className="new-game-button" onClick={handleSolveSudoku}>
            AI
          </Button>
          <Button type="primary" icon={<SaveOutlined />} className="new-game-button" onClick={handleSaveGame}>
            Save Game
          </Button>
        </div>
      )}
      {showInput && <SudokuInputForm setShowInput={setShowInput} onSubmit={handleMatrixSubmit} />}
      {!showInput && <SudokuBoard sudokuMatrix={sudokuMatrix} onCellChange={handleCellChange} isCellReadOnly={isCellReadOnly} />}
    </div>
  );
}

export default SudokuGame;
