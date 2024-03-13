import React, { useState } from 'react';
import { Button, Col, Input, Row, Upload, Modal, Space } from 'antd';
import { UploadOutlined, LoadingOutlined } from '@ant-design/icons';

const SudokuInputForm = ({ onSubmit, setShowInput }) => {
    const [inputMatrix, setInputMatrix] = useState(Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => 0)));
    const [open, setOpen] = useState(false);
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const showModal = () => {
        setOpen(true);
    };

    const handleOk = () => {
        setOpen(false);
        handleUpload();
    };

    const handleCancel = () => {
        setOpen(false);
    };

    const handleChange = (row, col, newValue) => {
        const newMatrix = [...inputMatrix];
        newMatrix[row][col] = newValue !== '' ? parseInt(newValue) : '';
        setInputMatrix(newMatrix);
    };

    const handleSubmit = () => {
        // Kiểm tra tính hợp lệ của ma trận nhập vào ở đây nếu cần
        onSubmit(inputMatrix);
    };

    const handleUpload = () => {
        if (file) {
            setUploading(true);
            try {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const json = JSON.parse(e.target.result);
                    setInputMatrix(json.sudokuMatrix);
                };
                reader.readAsText(file);
            } catch (error) {
                console.error('Error reading file:', error);
            } finally {
                setUploading(false);
            }
        }
    };

    return (
        <div className="sudoku-input-form">
            <>
                <Space>
                    <Button className="new-game-button" type="primary" onClick={showModal}>
                        Tải file sẵn có
                    </Button>
                </Space>
                <Modal
                    visible={open}
                    title={<div>
                        {uploading ? <LoadingOutlined /> : null}
                        <span className='ms-2'>Vui lòng chọn file </span>
                    </div>}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    footer={(_, { OkBtn, CancelBtn }) => (
                        <>
                            <CancelBtn />
                            <OkBtn />
                        </>
                    )}>
                    <Upload
                        accept='.json'
                        beforeUpload={(file) => {
                            setFile(file);
                            return false;
                        }}>
                        <Button type="primary" className="new-game-button mt-4" icon={<UploadOutlined />}>Tải File JSON</Button>
                    </Upload>
                </Modal>
            </>
            <Button type="primary" className="new-game-button" onClick={handleSubmit}>Submit</Button>
            <Button type="primary" className="new-game-button" onClick={() => setShowInput(false)}>X</Button>
            <div className='sudoku-board'>
                {inputMatrix.map((row, rowIndex) => (
                    <Row key={rowIndex}>
                        {row.map((value, colIndex) => (
                            <Col
                                xs={{ flex: '100%' }}
                                sm={{ flex: '50%' }}
                                md={{ flex: '40%' }}
                                lg={{ flex: '20%' }}
                                xl={{ flex: '10%' }}
                                key={colIndex}>
                                <Input maxLength={1} value={value !== 0 ? value : ''} onChange={(e) => handleChange(rowIndex, colIndex, e.target.value)} />
                            </Col>
                        ))}
                    </Row>
                ))}
            </div>
        </div>
    );
}

export default SudokuInputForm;
