// generateSudoku.js

function generateSudoku() {
  // Hàm tạo ra một ma trận Sudoku mới
  const matrix = [];

  // Tạo ma trận 9x9 với tất cả các ô là 0
  for (let i = 0; i < 9; i++) {
    matrix[i] = [];
    for (let j = 0; j < 9; j++) {
      matrix[i][j] = 0;
    }
  }

  // Điền các số vào ma trận sao cho Sudoku có thể giải được
  // (Trong trường hợp này, ta sẽ chỉ điền ngẫu nhiên một số vào mỗi ô)

  for (let i = 0; i < 20; i++) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    const num = Math.floor(Math.random() * 9) + 1;
    matrix[row][col] = num;
  }

  // Áp dụng ràng buộc: không có hai số giống nhau trong cùng một hàng hoặc cột
  for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
          const num = matrix[i][j];
          if (num !== 0) {
              for (let k = 0; k < 9; k++) {
                  if (k !== j && matrix[i][k] === num) {
                      // Trùng số trong cùng một hàng
                      matrix[i][k] = 0;
                  }
                  if (k !== i && matrix[k][j] === num) {
                      // Trùng số trong cùng một cột
                      matrix[k][j] = 0;
                  }
              }
          }
      }
  }

  // Áp dụng ràng buộc: không có hai số giống nhau trong cùng một cụm ô
  for (let i = 0; i < 9; i += 3) {
      for (let j = 0; j < 9; j += 3) {
          const cluster = [];
          for (let x = i; x < i + 3; x++) {
              for (let y = j; y < j + 3; y++) {
                  if (matrix[x][y] !== 0) {
                      if (cluster.includes(matrix[x][y])) {
                          // Trùng số trong cùng một cụm ô
                          matrix[x][y] = 0;
                      } else {
                          cluster.push(matrix[x][y]);
                      }
                  }
              }
          }
      }
  }

  return matrix;
}

export default generateSudoku;
