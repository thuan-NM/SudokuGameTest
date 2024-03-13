function solveSingleCell(matrix) {
    const size = 9; // Kích thước của ma trận Sudoku (9x9)

    // Tạo một danh sách chứa các số từ 1 đến 9
    const numbers = [...Array(9).keys()].map(x => x + 1);

    // Xáo trộn hàng và cột để chọn một ô ngẫu nhiên trong ma trận
    const shuffledIndexes = shuffleArray([...Array(size).keys()]);

    // Lặp qua từng ô trong ma trận
    for (const rowIndex of shuffledIndexes) {
        for (const colIndex of shuffledIndexes) {
            if (matrix[rowIndex][colIndex] === 0) { // Nếu ô này chưa được điền
                // Xáo trộn các số để chọn một số ngẫu nhiên từ danh sách
                const shuffledNumbers = shuffleArray(numbers);

                // Thử từng số một từ danh sách ngẫu nhiên
                for (const num of shuffledNumbers) {
                    if (isValidMove(matrix, rowIndex, colIndex, num)) { // Kiểm tra nếu số num có thể điền vào ô này
                        matrix[rowIndex][colIndex] = num; // Đặt giá trị num vào ô
                        return matrix; // Trả về ma trận với ô đã được giải
                    }
                }
            }
        }
    }

    // Nếu không có ô nào để giải, trả về ma trận không thay đổi
    return matrix;
}

// Hàm kiểm tra xem một giá trị có hợp lệ để điền vào một ô trong ma trận Sudoku không
function isValidMove(matrix, row, col, num) {
    // Kiểm tra hàng và cột
    for (let i = 0; i < 9; i++) {
        if (matrix[i][col] === num || matrix[row][i] === num) {
            return false;
        }
    }
    // Kiểm tra ô 3x3
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = startRow; i < startRow + 3; i++) {
        for (let j = startCol; j < startCol + 3; j++) {
            if (matrix[i][j] === num) {
                return false;
            }
        }
    }
    return true;
}

// Hàm xáo trộn một mảng ngẫu nhiên
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

export default solveSingleCell;
