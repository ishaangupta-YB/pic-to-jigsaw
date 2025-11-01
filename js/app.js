class JigsawPuzzle {
    constructor() {
        this.canvas = document.getElementById('puzzleCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.uploadArea = document.getElementById('uploadArea');
        this.fileInput = document.getElementById('fileInput');
        this.startBtn = document.getElementById('startBtn');
        this.shuffleBtn = document.getElementById('shuffleBtn');
        this.hintBtn = document.getElementById('hintBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.difficultySelect = document.getElementById('difficultySelect');
        this.piecesPlacedElement = document.getElementById('piecesPlaced');
        this.timerElement = document.getElementById('timer');
        this.progressFill = document.getElementById('progressFill');
        this.hintOverlay = document.getElementById('hintOverlay');
        this.welcomeMessage = document.getElementById('welcomeMessage');

        this.image = null;
        this.pieces = [];
        this.puzzleSize = 8;
        this.totalPieces = 0;
        this.placedPieces = 0;
        this.isDragging = false;
        this.draggedPiece = null;
        this.offsetX = 0;
        this.offsetY = 0;
        this.pieceWidth = 0;
        this.pieceHeight = 0;
        this.timerInterval = null;
        this.startTime = null;
        this.showingHint = false;

        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // File upload events
        this.uploadArea.addEventListener('click', () => this.fileInput.click());
        this.uploadArea.addEventListener('dragover', (e) => this.handleDragOver(e));
        this.uploadArea.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        this.uploadArea.addEventListener('drop', (e) => this.handleDrop(e));
        this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));

        // Button events
        this.startBtn.addEventListener('click', () => this.startPuzzle());
        this.shuffleBtn.addEventListener('click', () => this.shufflePieces());
        this.hintBtn.addEventListener('click', () => this.toggleHint());
        this.resetBtn.addEventListener('click', () => this.resetPuzzle());

        // Canvas events
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        this.canvas.addEventListener('mouseleave', (e) => this.handleMouseUp(e));

        // Touch events for mobile
        this.canvas.addEventListener('touchstart', (e) => this.handleTouchStart(e));
        this.canvas.addEventListener('touchmove', (e) => this.handleTouchMove(e));
        this.canvas.addEventListener('touchend', (e) => this.handleTouchEnd(e));

        // Difficulty change
        this.difficultySelect.addEventListener('change', (e) => {
            this.puzzleSize = parseInt(e.target.value);
            if (this.image) {
                this.generatePieces();
            }
        });
    }

    handleDragOver(e) {
        e.preventDefault();
        this.uploadArea.classList.add('dragover');
    }

    handleDragLeave(e) {
        e.preventDefault();
        this.uploadArea.classList.remove('dragover');
    }

    handleDrop(e) {
        e.preventDefault();
        this.uploadArea.classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            this.loadImage(files[0]);
        }
    }

    handleFileSelect(e) {
        const files = e.target.files;
        if (files.length > 0) {
            this.loadImage(files[0]);
        }
    }

    loadImage(file) {
        if (!file.type.match('image.*')) {
            alert('Please select a valid image file.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                this.image = img;
                this.welcomeMessage.style.display = 'none';
                this.startBtn.disabled = false;
                this.shuffleBtn.disabled = true;
                this.hintBtn.disabled = true;
                this.generatePieces();
                this.drawPreview();
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    generatePieces() {
        this.puzzleSize = parseInt(this.difficultySelect.value);
        this.totalPieces = this.puzzleSize * this.puzzleSize;
        this.placedPieces = 0;
        this.pieces = [];

        this.pieceWidth = this.canvas.width / this.puzzleSize;
        this.pieceHeight = this.canvas.height / this.puzzleSize;

        for (let row = 0; row < this.puzzleSize; row++) {
            for (let col = 0; col < this.puzzleSize; col++) {
                this.pieces.push({
                    id: row * this.puzzleSize + col,
                    correctRow: row,
                    correctCol: col,
                    currentRow: -1,
                    currentCol: -1,
                    x: Math.random() * (this.canvas.width - this.pieceWidth),
                    y: Math.random() * (this.canvas.height - this.pieceHeight),
                    placed: false,
                    isDragging: false
                });
            }
        }

        this.updateStats();
        this.drawPuzzle();
    }

    startPuzzle() {
        if (!this.image) {
            alert('Please upload an image first.');
            return;
        }

        this.startTime = Date.now();
        this.startTimer();
        this.shuffleBtn.disabled = false;
        this.hintBtn.disabled = false;
        this.startBtn.disabled = true;
        this.generatePieces();
        this.showMessage('Puzzle Started! Good luck!', 2000);
    }

    shufflePieces() {
        this.pieces.forEach(piece => {
            if (!piece.placed) {
                piece.x = Math.random() * (this.canvas.width - this.pieceWidth);
                piece.y = Math.random() * (this.canvas.height - this.pieceHeight);
            }
        });
        this.drawPuzzle();
        this.showMessage('Pieces Shuffled!', 1000);
    }

    toggleHint() {
        this.showingHint = !this.showingHint;
        this.hintBtn.textContent = this.showingHint ? 'Hide Hint' : 'Show Hint';
        this.hintOverlay.style.display = this.showingHint ? 'block' : 'none';
    }

    resetPuzzle() {
        this.stopTimer();
        this.timerElement.textContent = '00:00';
        this.image = null;
        this.pieces = [];
        this.startBtn.disabled = true;
        this.shuffleBtn.disabled = true;
        this.hintBtn.disabled = true;
        this.welcomeMessage.style.display = 'block';
        this.progressFill.style.width = '0%';
        this.piecesPlacedElement.textContent = '0';
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.showMessage('Puzzle Reset!', 1000);
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            const elapsed = Date.now() - this.startTime;
            const minutes = Math.floor(elapsed / 60000);
            const seconds = Math.floor((elapsed % 60000) / 1000);
            this.timerElement.textContent =
                `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    updateStats() {
        this.piecesPlacedElement.textContent = this.placedPieces;
        const progress = (this.placedPieces / this.totalPieces) * 100;
        this.progressFill.style.width = `${progress}%`;
    }

    showMessage(text, duration = 2000) {
        const message = document.createElement('div');
        message.className = 'message';
        message.textContent = text;
        document.body.appendChild(message);

        setTimeout(() => {
            message.remove();
        }, duration);
    }

    getMousePos(e) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;

        if (e.touches) {
            return {
                x: (e.touches[0].clientX - rect.left) * scaleX,
                y: (e.touches[0].clientY - rect.top) * scaleY
            };
        } else {
            return {
                x: (e.clientX - rect.left) * scaleX,
                y: (e.clientY - rect.top) * scaleY
            };
        }
    }

    findPieceAt(x, y) {
        for (let i = this.pieces.length - 1; i >= 0; i--) {
            const piece = this.pieces[i];
            if (!piece.placed &&
                x >= piece.x && x <= piece.x + this.pieceWidth &&
                y >= piece.y && y <= piece.y + this.pieceHeight) {
                return piece;
            }
        }
        return null;
    }

    handleMouseDown(e) {
        const pos = this.getMousePos(e);
        const piece = this.findPieceAt(pos.x, pos.y);

        if (piece) {
            this.isDragging = true;
            this.draggedPiece = piece;
            piece.isDragging = true;
            this.offsetX = pos.x - piece.x;
            this.offsetY = pos.y - piece.y;
            this.canvas.classList.add('dragging');

            // Bring dragged piece to front
            this.pieces = this.pieces.filter(p => p !== piece);
            this.pieces.push(piece);

            this.drawPuzzle();
        }
    }

    handleMouseMove(e) {
        if (!this.isDragging || !this.draggedPiece) return;

        const pos = this.getMousePos(e);
        this.draggedPiece.x = pos.x - this.offsetX;
        this.draggedPiece.y = pos.y - this.offsetY;

        // Keep piece within canvas bounds
        this.draggedPiece.x = Math.max(0, Math.min(this.canvas.width - this.pieceWidth, this.draggedPiece.x));
        this.draggedPiece.y = Math.max(0, Math.min(this.canvas.height - this.pieceHeight, this.draggedPiece.y));

        this.drawPuzzle();
    }

    handleMouseUp(e) {
        if (!this.isDragging || !this.draggedPiece) return;

        this.isDragging = false;
        this.canvas.classList.remove('dragging');

        const piece = this.draggedPiece;
        piece.isDragging = false;

        // Check if piece is close to correct position
        const targetX = piece.correctCol * this.pieceWidth;
        const targetY = piece.correctRow * this.pieceHeight;
        const distance = Math.sqrt(
            Math.pow(piece.x - targetX, 2) + Math.pow(piece.y - targetY, 2)
        );

        if (distance < this.pieceWidth * 0.3) {
            // Snap to correct position
            piece.x = targetX;
            piece.y = targetY;
            piece.placed = true;
            this.placedPieces++;
            this.updateStats();

            // Check if puzzle is complete
            if (this.placedPieces === this.totalPieces) {
                this.completePuzzle();
            }
        }

        this.draggedPiece = null;
        this.drawPuzzle();
    }

    handleTouchStart(e) {
        e.preventDefault();
        this.handleMouseDown(e);
    }

    handleTouchMove(e) {
        e.preventDefault();
        this.handleMouseMove(e);
    }

    handleTouchEnd(e) {
        e.preventDefault();
        this.handleMouseUp(e);
    }

    completePuzzle() {
        this.stopTimer();
        this.shuffleBtn.disabled = true;
        this.hintBtn.disabled = true;
        this.startBtn.disabled = false;

        const time = this.timerElement.textContent;
        this.showMessage(`Congratulations! Puzzle completed in ${time}!`, 3000);
    }

    drawPuzzle() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.showingHint) {
            this.drawHintOverlay();
        }

        this.pieces.forEach(piece => {
            this.drawPiece(piece);
        });
    }

    drawPiece(piece) {
        if (!this.image) return;

        this.ctx.save();

        if (piece.placed) {
            // Draw piece in correct position
            this.ctx.drawImage(
                this.image,
                piece.correctCol * this.pieceWidth,
                piece.correctRow * this.pieceHeight,
                this.pieceWidth,
                this.pieceHeight,
                piece.correctCol * this.pieceWidth,
                piece.correctRow * this.pieceHeight,
                this.pieceWidth,
                this.pieceHeight
            );
        } else {
            // Draw piece in current position
            this.ctx.drawImage(
                this.image,
                piece.correctCol * this.pieceWidth,
                piece.correctRow * this.pieceHeight,
                this.pieceWidth,
                this.pieceHeight,
                piece.x,
                piece.y,
                this.pieceWidth,
                this.pieceHeight
            );
        }

        // Draw piece border
        this.ctx.strokeStyle = piece.isDragging ? '#00BCD4' : '#42A5F5';
        this.ctx.lineWidth = piece.isDragging ? 3 : 2;
        this.ctx.strokeRect(piece.placed ? piece.correctCol * this.pieceWidth : piece.x,
                          piece.placed ? piece.correctRow * this.pieceHeight : piece.y,
                          this.pieceWidth, this.pieceHeight);

        this.ctx.restore();
    }

    drawHintOverlay() {
        this.ctx.save();
        this.ctx.strokeStyle = '#42A5F5';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([5, 5]);

        for (let row = 0; row < this.puzzleSize; row++) {
            for (let col = 0; col < this.puzzleSize; col++) {
                const x = col * this.pieceWidth;
                const y = row * this.pieceHeight;
                this.ctx.strokeRect(x, y, this.pieceWidth, this.pieceHeight);
            }
        }

        this.ctx.restore();
    }

    drawPreview() {
        // Draw a small preview of the uploaded image
        if (this.image) {
            const maxSize = 100;
            const scale = Math.min(maxSize / this.image.width, maxSize / this.image.height);
            const width = this.image.width * scale;
            const height = this.image.height * scale;

            // This could be used for image preview if needed
        }
    }
}

// Initialize the puzzle when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new JigsawPuzzle();
});
