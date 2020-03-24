function Tetris(container, playgroundWidth, playgroundHeight, timeoutValue) {
    var playground = [];

    var elWidth = 100/playgroundWidth;
    var elHeight = 100/playgroundHeight;
    container.empty();
    for (row=0; row<playgroundHeight; row++) {
        playground[row] = [];
        for (col=0; col<playgroundWidth; col++) {
            var el = $('<div></div>').css({
                top:  (row*elHeight)+'%',
                left:  (col*elWidth)+'%'
            });
            playground[row][col] = 0;
            container.append(el);
        };
    }
    var playgroundEl = container.children();

        
    var blockDefs = [ 
        [
            {mask: [[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,1,1,1]], boundaryLeft: 0, boundaryRight: 0},
            {mask: [[1,0,0,0],[1,0,0,0],[1,0,0,0],[1,0,0,0]], boundaryLeft: 0, boundaryRight: 3},
            {mask: [[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,1,1,1]], boundaryLeft: 0, boundaryRight: 0},
            {mask: [[1,0,0,0],[1,0,0,0],[1,0,0,0],[1,0,0,0]], boundaryLeft: 0, boundaryRight: 3}
        ],
        [
            {mask: [[0,0,0,0],[0,0,0,0],[0,1,1,0],[0,1,1,0]], boundaryLeft: 1, boundaryRight: 1},
            {mask: [[0,0,0,0],[0,0,0,0],[0,1,1,0],[0,1,1,0]], boundaryLeft: 1, boundaryRight: 1},
            {mask: [[0,0,0,0],[0,0,0,0],[0,1,1,0],[0,1,1,0]], boundaryLeft: 1, boundaryRight: 1},
            {mask: [[0,0,0,0],[0,0,0,0],[0,1,1,0],[0,1,1,0]], boundaryLeft: 1, boundaryRight: 1}
        ],
        [
            {mask: [[0,0,0,0],[0,0,0,0],[0,1,0,0],[1,1,1,0]], boundaryLeft: 0, boundaryRight: 1},
            {mask: [[0,0,0,0],[1,0,0,0],[1,1,0,0],[1,0,0,0]], boundaryLeft: 0, boundaryRight: 2},
            {mask: [[0,0,0,0],[0,0,0,0],[1,1,1,0],[0,1,0,0]], boundaryLeft: 0, boundaryRight: 1},
            {mask: [[0,0,0,0],[0,1,0,0],[1,1,0,0],[0,1,0,0]], boundaryLeft: 0, boundaryRight: 2}
        ],
        [
            {mask: [[0,0,0,0],[1,0,0,0],[1,0,0,0],[1,1,0,0]], boundaryLeft: 0, boundaryRight: 2},
            {mask: [[0,0,0,0],[0,0,0,0],[1,1,1,0],[1,0,0,0]], boundaryLeft: 0, boundaryRight: 1},
            {mask: [[0,0,0,0],[1,1,0,0],[0,1,0,0],[0,1,0,0]], boundaryLeft: 0, boundaryRight: 2},
            {mask: [[0,0,0,0],[0,0,0,0],[0,0,1,0],[1,1,1,0]], boundaryLeft: 0, boundaryRight: 1}
        ],
        [
            {mask: [[0,0,0,0],[0,1,0,0],[0,1,0,0],[1,1,0,0]], boundaryLeft: 0, boundaryRight: 2},
            {mask: [[0,0,0,0],[0,0,0,0],[1,0,0,0],[1,1,1,0]], boundaryLeft: 0, boundaryRight: 1},
            {mask: [[0,0,0,0],[1,1,0,0],[1,0,0,0],[1,0,0,0]], boundaryLeft: 0, boundaryRight: 2},
            {mask: [[0,0,0,0],[0,0,0,0],[1,1,1,0],[0,0,1,0]], boundaryLeft: 0, boundaryRight: 1},
        ]
    ];
          
    function canMove(item, aRow, aCol) {
        if (aCol < -item.boundaryLeft || aCol+3 > playgroundWidth-1+item.boundaryRight)
            return false;
        if (aRow + 3 > playgroundHeight-1)
            return false;
        for (row=0; row<4; row++)
            for (col=item.boundaryLeft; col<4-item.boundaryRight; col++)
                if (playground[aRow+row][aCol+col] == 1 && item.mask[row][col] == 1)
                    return false;    
        return true;
    }
        
    function storeObject(item, aRow, aCol) {
        for (row=0; row<4; row++)
            for (col=item.boundaryLeft; col<4-item.boundaryRight; col++)
                if (item.mask[row][col] == 1)
                    playground[aRow+row][aCol+col] = item.mask[row][col];    
    }

    function isFullRow(aRow) {
        for (col=0; col<playgroundWidth; col++)  
            if (playground[aRow][col]==0)
                return false;
        return true;
    }
        
    function removeFullRow(aRow) {
        for (row=aRow; row>0; row--)
            for (col=0; col<playgroundWidth; col++)
                playground[row][col] = playground[row-1][col]; 
        for (col=0; col<playgroundWidth; col++)
            playground[0][col] = 0; 
    }
        

    /* drawing functions */

    function drawObject(item, aRow, aCol) {
        for (row=0; row<4; row++)
            for (col=item.boundaryLeft; col<4-item.boundaryRight; col++)
                if (item.mask[row][col] == 1)
                    playgroundEl.eq((aRow+row)*playgroundWidth+(aCol+col)).addClass('set');    
    }

    function eraseObject(item, aRow, aCol) {
        for (row=0; row<4; row++)
            for (col=item.boundaryLeft; col<4-item.boundaryRight; col++)
                if (item.mask[row][col] == 1)
                    playgroundEl.eq((aRow+row)*playgroundWidth+(aCol+col)).removeClass('set');
    }
    
    function redrawPlayground(toRow) {
        for (r = toRow; r>=0; r--)
            for (c = 0; c<playgroundWidth; c++)
                if (playground[r][c] == 1)
                    playgroundEl.eq(r*playgroundWidth + c).addClass('set');
                else 
                    playgroundEl.eq(r*playgroundWidth + c).removeClass('set');       
    }
    
    /* begin game */

    var score = 0;
    var blockNr = Math.floor(Math.random() * 5);
    var currentRot = Math.floor(Math.random() * 4);
    var currentCol = Math.floor((playgroundWidth - 4)/2);
    var currentRow = 0;
            
    drawObject(blockDefs[blockNr][currentRot], currentRow, currentCol);

    var handler = null;
    var disable = false;

    $('body').keypress(function(e) {
        e.stopPropagation();
        e.preventDefault();
        if (disable)
            return;
        disable = true;
                
        var nextCol = currentCol;
        var nextRow = currentRow;
        var nextRot = currentRot;
                
        if (e.key == ',') {
            nextCol = currentCol-1;
        } else if (e.key == '.') {
            nextCol = currentCol+1;
        } else if (e.key == 'A' || e.key == 'a') {
            nextRot = (currentRot+1)%4;
        } else if (e.key == ' ') {
            while(canMove(blockDefs[blockNr][currentRot], nextRow, currentCol)) {
                nextRow += 1;
            }
            nextRow = nextRow-1;
        }
                   
        if (canMove(blockDefs[blockNr][nextRot], nextRow, nextCol)) {
            eraseObject(blockDefs[blockNr][currentRot], currentRow, currentCol);
            drawObject(blockDefs[blockNr][nextRot], nextRow, nextCol);
            currentRow = nextRow;
            currentCol = nextCol;
            currentRot = nextRot;
        }
                
        disable = false;
    });
            
    handler = setInterval(function() {
        if (disable)
            return;
        disable = true;

        nextRow = currentRow+1;
        if (!canMove(blockDefs[blockNr][currentRot], nextRow, currentCol)) {
            storeObject(blockDefs[blockNr][currentRot], currentRow, currentCol);
                    
            var localScore = 0;
            for (r= currentRow+3; r>=currentRow; r--)
                if (isFullRow(r+localScore)) {
                    removeFullRow(r+localScore);
                    localScore++     ;
                }
        
            score += localScore;
            document.title = 'Tetris '+score;
            redrawPlayground(currentRow+3);
                            
            currentCol = Math.floor((playgroundWidth - 4)/2);
            currentRow = 0;
            blockNr = Math.floor(Math.random() * 5);
            currentRot = Math.floor(Math.random() * 4);
            if (!canMove(blockDefs[blockNr][currentRot], currentRow, currentCol)) {
                // end game;
                clearInterval(handler);
                alert('Score: '+score);
                return;
            } else {
                drawObject(blockDefs[blockNr][currentRot], currentRow, currentCol);
            }
        } else {
            eraseObject(blockDefs[blockNr][currentRot], currentRow, currentCol);
            drawObject(blockDefs[blockNr][currentRot], nextRow, currentCol);
            currentRow = nextRow;
        }

        disable = false;
    }, timeoutValue);

}
