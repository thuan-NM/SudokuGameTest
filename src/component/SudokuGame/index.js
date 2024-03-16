// SudokuGame.js
import React, { useState, useEffect } from 'react';
import SudokuBoard from '../SudokuBoard';
import generateSudoku from '../../utils/generateSudoku';
import suggestHighestCompletion from '../../utils/solve1turnSudoku';
import { solveSudoku } from '../../utils/solveSudoku';
import { QuestionCircleOutlined, OpenAIOutlined, SaveOutlined, DownOutlined, PlusCircleOutlined, SmileOutlined, MehOutlined, FrownOutlined, ExperimentOutlined } from '@ant-design/icons';
import { Button, Dropdown, Space } from 'antd';
import SudokuInputForm from '../SudokuInputForm';

function SudokuGame() {
  const [sudokuMatrix, setSudokuMatrix] = useState(JSON.parse(JSON.stringify(generateSudoku())));
  const [initialSudokuMatrix, setInitialSudokuMatrix] = useState();
  const [iscomplete, setIscomplete] = useState(false);

  const handleCellChange = (row, col, newValue) => {
    // Update the matrix
    const newMatrix = [...sudokuMatrix];
    newMatrix[row][col] = newValue !== '' ? parseInt(newValue) : 0;
    setSudokuMatrix(newMatrix);
    isSudokuComplete(sudokuMatrix);
  };

  const handleNewGame = (levelselected) => {
    const newSudokuMatrix = generateSudoku(levelselected);
    setSudokuMatrix(newSudokuMatrix);
    setInitialSudokuMatrix(JSON.parse(JSON.stringify(newSudokuMatrix)));
  };

  const handleSolveSudoku = () => {
    const newSudokuMatrix = solveSudoku(sudokuMatrix);
    isSudokuComplete(newSudokuMatrix);
    setSudokuMatrix(JSON.parse(JSON.stringify(newSudokuMatrix)));
  }

  const handlesolveHighestWinChance = () => {
    const suggestedBoard = suggestHighestCompletion(sudokuMatrix);
    const newSudokuMatrix = JSON.parse(JSON.stringify(suggestedBoard)); // Tạo một bản sao của ma trận để tránh thay đổi trực tiếp // Cập nhật ô tốt nhất với giá trị 1 hoặc giá trị khác tuỳ thuộc vào yêu cầu
    setSudokuMatrix(newSudokuMatrix); // Cập nhật ma trận Sudoku
    isSudokuComplete(sudokuMatrix);
  };

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
    setInitialSudokuMatrix(JSON.parse(JSON.stringify(submittedMatrix)));
    isSudokuComplete(submittedMatrix);
    setShowInput(false);
  };

  const isSudokuComplete = (board) => {
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board.length; j++) {
        if (board[i][j] == 0) {
          setIscomplete(false)
          return; // Thoát ngay khi tìm thấy một ô chưa được điền
        }
      }
    }
    setIscomplete(true) // Chỉ khi tất cả các ô đều được điền mới set iscomplete thành true
  }

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

  const items = [
    {
      label: <Button type="primary" onClick={handleShowInput} className="new-game-button w-100">Nhập Ma Trận Sudoku</Button>,
      key: '0',
    },
    {
      label: <Button type="primary" onClick={() => handleNewGame("easy")} className="new-game-button w-100"><SmileOutlined /><span>Easy</span></Button>,
      key: '1',
    },
    {
      label: <Button type="primary" onClick={() => handleNewGame("medium")} className="new-game-button w-100"><MehOutlined /><span>Medium</span></Button>,
      key: '2',
    },
    {
      label: <Button type="primary" onClick={() => handleNewGame("hard")} className="new-game-button w-100"><FrownOutlined /><span>Hard</span></Button>,
      key: '3',
    },
    {
      label: <Button type="primary" onClick={() => handleNewGame("epic")} className="new-game-button w-100"><ExperimentOutlined /><span>Epic</span></Button>,
      key: '4',
    },
  ];

  const handleFinishGame=()=>{
    setIscomplete(false);
    handleNewGame("easy");
  }

  return (
    <div className="sudoku-game d-flex justify-content-center flex-column align-items-center">
      <h1>Sudoku</h1>
      {!showInput && (
        <div>
          <Button type="primary" icon={<OpenAIOutlined />} className="new-game-button" onClick={handleSolveSudoku}>
            AI
          </Button>
          <Button type="primary" icon={<SaveOutlined />} className="new-game-button" onClick={handleSaveGame}>
            Save Game
          </Button>
          <Button type="primary" icon={<QuestionCircleOutlined />} className="new-game-button" onClick={handlesolveHighestWinChance}>
            Suggest
          </Button>
          <Button type="primary" className="new-game-button" ><Dropdown
            menu={{
              items,
            }}
            trigger={['click']}
          >
            <a onClick={(e) => e.preventDefault()}>
              <Space>
                <PlusCircleOutlined />
                New Game
                <DownOutlined />
              </Space>
            </a>
          </Dropdown></Button>
        </div>
      )}
      {showInput && <SudokuInputForm setShowInput={setShowInput} onSubmit={handleMatrixSubmit} />}
      {!showInput && <SudokuBoard sudokuMatrix={sudokuMatrix} onCellChange={handleCellChange} isCellReadOnly={isCellReadOnly} />}
      {!iscomplete ? "":(
      <div className={`${iscomplete?"overlay active":"overlay"}`}>
        <Button type="primary" className={`${iscomplete?"new-game-button active":"new-game-button"}`} onClick={handleFinishGame}>
        <h1>Chúc Mừng Bạn Đã Hoàn Thành Xuất Sắc Trò Chơi Này !!!!!</h1>
        Chơi tiếp</Button>
        </div>)}
    </div>
  );
}

export default SudokuGame;
