var gameStart = true;

var gameLog = [];

var positions = [];

var kingVision = [];

var turn = true;

var turnNum = 0;

var wKing = false;

var bKing = false;


//Place pieces in starting positions
function placePieces(){
    for (let x = 0; x < 8; x++) {
        //Places pawns
        $("#" + String.fromCharCode((97 + x)) + "7").html('<img src="./assets/images/11.png" class="piece" draggable="true" ondragstart="drag(event)" id="'+ x.toString() +'bp"></img>');
        $("#" + String.fromCharCode((97 + x)) + "2").html('<img src="./assets/images/12.png" class="piece" draggable="true" ondragstart="drag(event)" id="' + x.toString() + 'wp"></img>');
        
        //Places first 5 pieces
        if (x < 5) {
            var black = x + 6;
            var white = x + 1
            $("#" + String.fromCharCode((97 + x)) + "8").html('<img src="./assets/images/' + black + '.png" class="piece" draggable="true" ondragstart="drag(event)" id="' + black.toString() +'bl"></img>');
            $("#" + String.fromCharCode((97 + x)) + "1").html('<img src="./assets/images/' + white + '.png" class="piece" draggable="true" ondragstart="drag(event)" id="' + white.toString() + 'wl"></img>');
        
        //Places last 5 pieces
        } else {
            var black = x + 1;
            var white = x - 4;
            $("#" + String.fromCharCode((109 - x)) + "8").html('<img src="./assets/images/' + black + '.png" class="piece" draggable="true" ondragstart="drag(event)" id="' + black.toString() +'br"></img>');
            $("#" + String.fromCharCode((109 - x)) + "1").html('<img src="./assets/images/' + white + '.png" class="piece" draggable="true" ondragstart="drag(event)" id="' + white.toString() + 'wr"></img>');
        }
    }
    turnNum = 1;
    gameLog = [];
}

//Allows space to accept piece
function allowDrop(ev){
    ev.preventDefault();
}

//Allows dragging pieces to move
function drag(ev){
    ev.dataTransfer.clearData();
    ev.dataTransfer.setData("text", ev.target.id);
    console.log(`Drag function`)
    console.log(`Picked up: ${ev.target.id}`);
    console.log(`Dragged from: ${$('#'+ev.target.id).closest('div').attr('id')}`)
    checkMove(ev.target.id, $('#'+ev.target.id).closest('div').attr('id'));
    console.log(`Found positions: ${positions}\n`);    
}

//Allows pieces to be dropped into new place
function drop(ev){
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    console.log(`Item dropped: ${data}`);
    console.log(`Square id: ${ev.target.id}\n`);
    if (data === ev.target.id){
        return;
    } else{
        movePiece(data, ev.target.id);
    }    
}


//Begins move validation
function checkMove(piece, fromSquare){
    console.log(`Check move function:`)
    console.log(`Piece: ${piece}`);
    console.log(`From: ${fromSquare}`);
    pColor = piece.slice(-2,-1)
    if (piece.includes('p')){
        detect = piece.slice(-2)    
    } else{
        detect = parseInt(piece).toString();
    } 
    console.log(`Detect: ${detect}`)
    console.log(`Piece color: ${pColor}`)
    if (pColor ==='b' && turn){
        console.log(`Not blacks turn: turn is ${turn}`)
        return;
    } else if (pColor ==='w' &! turn){
        console.log(`Not whites turn: turn is ${turn}`)
        return;
    }
    switch (detect){
        //White Rook
        case ("1"):
            console.log(`Case 1\n`);
            rook(fromSquare, 'w');
            break;
        //White Knight
        case ("2"):
            console.log(`Case 2\n`);
            knight(fromSquare, 'w');
            break;
        //White Bishop
        case ("3"):
            console.log(`Case 3\n`);
            bishop(fromSquare, 'w');
            break;
        //White Queen
        case ("4"):
            console.log(`Case 4\n`);
            bishop(fromSquare, 'w');
            rook(fromSquare, 'w');
            break;
        //White King    
        case("5"):
            console.log(`Case 5\n`);
            king(fromSquare, 'w');
            break;
        //Black Rook
        case("6"):
            console.log(`Case 6\n`);
            rook(fromSquare, 'b');
            break;  
        //Black Knight
        case("7"):
            console.log(`Case 7\n`);
            knight(fromSquare, 'b');
            break;
        //Black Bishop    
        case("8"):
            console.log(`Case 8\n`);
            bishop(fromSquare, 'b');
            break;
        //Black Queen   
        case ("9"):
            console.log(`Case 9\n`); 
            bishop(fromSquare, 'b');
            rook(fromSquare, 'b');           
            break;
        //Black King
        case ("10"):
            console.log(`Case 10\n`);
            king(fromSquare, 'b'); 
            break;
        //White Pawn
        case ("wp"):
            console.log(`Case WP\n`);
            pawn(fromSquare, 'w');
            break;
        //Black Pawn
        case ("bp"):
            console.log(`Case BP\n`);
            pawn(fromSquare, 'b')
            break;
        }

        
            
}

//Moves piece if move is valid
function movePiece(piece, square){
    console.log(`Incoming Square: ${square}`)
    console.log(`Incoming Piece: ${piece}`)
    pColor = piece.slice(-2, -1);
    console.log(`White king in check: ${wKing}`);
    console.log(`Black king in check: ${bKing}`);
    console.log(`Entrance positions: ${positions}`)
    if (turn && pColor === 'b'){
        return;
    }
    if (!turn && pColor === 'w'){
        return;
    }
    let parent = $('#'+piece).closest('div').attr('id');
    if (piece === '5wl' || piece === '10bl'){
        inCheck()
        //pass
    } else{
        console.log(`Piece seen not a king.  Saw: ${piece}\n`)
        let checker = $('#'+piece).detach();
        console.log(`Parent: ${parent}`)
        inCheck();
        checker.appendTo($('#'+parent));
        if(pColor === 'w' && wKing){
            inCheck()
        }
        if (pColor === 'b' && bKing){
            inCheck()
        }
        checker = null;
        console.log(`Positions after inCheck: ${positions}`)
        console.log(`Kings vision after incheck: ${kingVision}`)
    }
    
    if (turn && !wKing){
        let canCap = capture(square)
        console.log(`White turn not in check\n`);
        console.log(`Cancap returned: ${$(canCap).attr('id')}`)
        if (positions.includes($(canCap).attr('id'))){
            canCap.append(document.getElementById(piece));
            logMoves(piece, canCap);
            turn = !turn;
            positions = [];
        } else{
            return;
        }
            
        
    } else if(turn && wKing){
        let canCap = capture(square)
        console.log(`White turn in check\n`);
        if (piece === '5wl'){
            canCap.append(document.getElementById(piece));
            inCheck();
            if (wKing){
                checker = ($('#5wl')).detach();
                checker.appendTo('#' + parent);
                return;
            } else if (kingVision.includes($(canCap).attr('id'))){
                canCap.append(document.getElementById(piece));
                logMoves(piece, canCap)
                turn = !turn;
                positions =[];
                }
            }
        
        if (kingVision.includes($(canCap).attr('id'))){
            canCap.append(document.getElementById(piece));
            logMoves(piece, canCap)
            turn = !turn;
            positions =[];
        } else{
            return;
        }
    }else if (!turn && !bKing){
        let canCap = capture(square)
        console.log(`Black turn not in check\n`);
        if (positions.includes($(canCap).attr('id'))){
            canCap.append(document.getElementById(piece));
            logMoves(piece, canCap);
            turn = !turn;
            positions = [];
            turnNum++;
        } else{
            return;
        }
        
    } else if(!turn && bKing){
        let canCap = capture(square)
        console.log(`Black turn in check`);
        if (kingVision.includes($(canCap).attr('id'))){
            canCap.append(document.getElementById(piece))
            logMoves(piece, canCap)
            turn = !turn;
            positions = [];
            turnNum++
        } else{
            return;
        }
    }
    

}

//Rook Movement Logic
function rook(fromSquare, color){
    let checker = null;
    let update = true;
    let nextRank = parseInt(fromSquare[1]);
    let nextFile = fromSquare[0].charCodeAt(0);

    //Check ranks going up
    while(nextRank < 8){
        nextRank++;
        let rankCheck = fromSquare[0] + nextRank.toString();
        if (rankCheck === fromSquare){
            continue;
        }
        checker = checkSquare(rankCheck)
        update = updatePositions(checker, rankCheck, color);
        if (update){
            continue;
        } else{
            break;
        }
    }
    update = true;

    //Check ranks going down
    while(nextRank > 1){
        nextRank--;
        let rankCheck = fromSquare[0] + nextRank.toString();
        if (rankCheck === fromSquare){
            continue;
        }
        checker = checkSquare(rankCheck)
        update = updatePositions(checker, rankCheck, color);
        if (update){
            continue;
        } else{
            break;
        }
    }
    update = true;

    //Check files right
    while(nextFile < 105){
        nextFile++;
        let fileCheck = String.fromCharCode(nextFile) + fromSquare[1];
        if (fileCheck === fromSquare){
            continue;
        }
        checker = checkSquare(fileCheck);
        update = updatePositions(checker, fileCheck, color);
        if (update){
            continue;
        } else{
            break;
        }
    }
    update = true;
    
    //check files right
    while(nextFile > 96){
        nextFile--;
        let fileCheck = String.fromCharCode(nextFile) + fromSquare[1];
        if (fileCheck === fromSquare){
            continue;
        }
        checker = checkSquare(fileCheck);
        update = updatePositions(checker, fileCheck, color); 
        if (update){
            continue;
        } else{
            break;
        }
    }

        


}

//Knight Movement Logic
function knight(fromSquare, color){
    console.log(`Knight incoming square: ${fromSquare}`)
    let squareSplit = fromSquare.split('')
    let ranks = [];
    let files = [];
    let checker = null;
    //Create arrays with possible directions
    for (let i = 1; i < 3; i++) {
        ranks.push((
            String.fromCharCode((squareSplit[0].charCodeAt(0) + i)) 
        ));

        ranks.push((
            String.fromCharCode((squareSplit[0].charCodeAt(0) - i))
        ));
        
        files.push((
            (parseInt(squareSplit[1]) + i).toString()
        ));

        files.push((
            (parseInt(squareSplit[1]) - i).toString()
        ));
        
        console.log(`Files: ${files}`);
    }
    
    ranks.reverse();
    console.log(`Ranks sorted: ${ranks}`);
    //Combine arrays into actual board locations    
    for (let i = 0; i < files.length; i++){
        
        if (i < 2 ){
            for (let x = 0; x < 2; x++){
                let move = ranks[i] + files [x];
                checker = checkSquare(move);
                updatePositions(checker, move, color);
            } 
        } else{
            
            for (let x = 2; x < 4; x++){
                let move2 = ranks[i] + files[x];
                checker = checkSquare(move2);
                updatePositions(checker, move2, color);

            }
        }
        update = true;
                                
    }
}

//Bishop Movement Logic
function bishop(fromSquare, color){

    let squareSplit = fromSquare.split('');
    let bisRank = squareSplit[0].charCodeAt(0);
    let bisFile = parseInt(squareSplit[1]);
    let count = 0;
    let next = null;
    let update = null;
    while (count < 4){

        update = true;
        let checker = null;
        bisRank = squareSplit[0].charCodeAt(0);
        bisFile = parseInt(squareSplit[1])
        //Up to right
        if (count === 0){
            while (update){
                next = String.fromCharCode(bisRank + 1) + (bisFile + 1).toString();
                checker = checkSquare(next);
                update = updatePositions(checker, next, color)
                bisRank++;
                bisFile++;
                if (bisRank >= 104 || bisFile >= 8){   
                    update = false;
                }
            }   
            count++;
            continue;       
        }

        //Down and right
        if (count === 1){
            while (update){
                next = String.fromCharCode(bisRank + 1) + (bisFile -1).toString()
                checker = checkSquare(next)
                update = updatePositions(checker, next, color);
                bisRank++;
                bisFile--;
                if (bisRank >= 104 || bisFile <= 1){
                    update = false;
                }
            }
            count++; 
            continue;
        }

        //Up and left    
        if (count == 2){
            while(update){
                next = String.fromCharCode(bisRank - 1) + (bisFile + 1).toString()
                checker = checkSquare(next)
                update = updatePositions(checker, next, color);
                bisRank--;
                bisFile++;
                if (bisRank <= 97 || bisFile >= 8){
                    update = false;
                }
            }
            count++;
            continue;
        }

        //Down and left
        if (count === 3){
            while(update){
                next = String.fromCharCode(bisRank - 1) + (bisFile - 1).toString()
                checker = checkSquare(next)
                update = updatePositions(checker, next, color)
                bisRank--;
                bisFile--;
                if (bisRank <= 97 || bisFile <= 1){
                    update = false;
                }
            }
            count++;    
        }                   
    } 
}

//King Movement Logic
function king(fromSquare, color){
    let ranks = [];
    let files = [];
    let possible = [];
    let checker = null;
    let squareSplit = fromSquare.split('');
    ranks.push(squareSplit[0]);
    files.push(squareSplit[1]);
    ranks.push(String.fromCharCode((squareSplit[0].charCodeAt(0) + 1)));
    ranks.push(String.fromCharCode((squareSplit[0].charCodeAt(0) - 1)));
    files.push((parseInt(squareSplit[1]) + 1).toString());
    files.push((parseInt(squareSplit[1]) - 1).toString());
    for (let i = 0; i < 3; i++){
        possible.push((ranks[i] + files[0]));
        possible.push((ranks[i] + files[1]));
        possible.push((ranks[i] + files[2]));
    }
    for (let i = 0; i < possible.length; i++){
        checker = checkSquare(possible[i]);
        update = updatePositions(checker, possible[i] ,color);
    }
}

//Pawn Movement Logic
function pawn(fromSquare, color){
    let checker = null;
    let move = null;
    if (color === "b"){
        move = fromSquare[0] + (parseInt(fromSquare[1]) - 1);
        checker = checkSquare(move);
        updatePositions(checker, move, color)
    }

    if (color === "w"){
        move = fromSquare[0] + (parseInt(fromSquare[1]) + 1);
        checker = checkSquare(move);
        updatePositions(checker, move, color);
    }

}

//Checks square for piece.  If found returns piece id, otherwise returns false. Returns true if square invalid.
function checkSquare(square){
    let alpha = square[0].charCodeAt(0);
    let num = square[1];
    if (alpha < 97 || alpha > 104){
        return true;
    }
    if (num < 1 || num > 8){
        return true;
    }
    square = "div#" + square + " img:last-child";
    if ($(square).length > 0){
        return $(square).attr("id");
    } else{
        return false;
    }
}

//Updates piece for viable positions
function updatePositions(check, square, color){

    if (check === false){
        positions.push(square)

        return true;
    } else if (check === true) {

        return false;
    } else if (check.includes(color)){

        return false;
    } else {

        positions.push(check);
        return false;
    }
}

//Allows capturing pieces
function capture(square){    
    let squareSlice = square.slice(-2, -1);
    let parent = $('#'+square).closest('div').attr('id')
    if (square.length > 2){
        if (squareSlice === 'b'){
            let emptyCap = $('div.wcap:empty:first');
            emptyCap.append(document.getElementById(square));
            return $('#'+parent);
        } else{
            let capTray = $('div.bcap:empty:first');
            capTray.append(document.getElementById(square));
            return $('#'+parent);
        }
    }
    return $('#'+square);
}

//Updates current moves
function logMoves(piece, square){
    if (turn){
        gameLog.push(turnNum.toString() +". " + piece + $(square).attr('id'));
        console.log(`Current game log: ${gameLog}\n`);
    } else{
        addTurn = gameLog[(turnNum-1)] + " " + piece + $(square).attr('id');
        gameLog[(turnNum-1)] = addTurn;
        console.log(`Current game log: ${gameLog}\n`);
    }
}

//Disallow moves if king in check
function inCheck(){
    console.log(`Start incheck`);
    let store = positions;
    console.log(`Initial positions: ${positions}`);
    console.log(`Initial store: ${store}`);
    positions = [];
    let checkKnights = [];
    console.log(`Positions cleared: ${positions}`)
    //Needs to check if an enemy piece has vision on king
    if(turn){
        let k = $('#5wl').closest('div').attr('id');

        // Check for knights threatening
        knight(k, 'w');
        checkKnights = positions;
        positions = store;

        //If knight found update positions for knights position
        for (let i = 0; i < checkKnights.length; i++){
            if (checkKnights[i].includes('7')){
                console.log(`King saw a knight at ${checkKnights[i]}`)
                king(k, 'w');
                kingVision = [];
                kingVision.push(positions);
                kingVision.push(checkKnights[i]);
                console.log(`King checked by knight positions: ${kingVision}`)
                wKing = true;
                break;
            } else{
                wKing = false;
            }
        }

        // Get all positions in ranks and filesq      
        store = positions;
        positions = [];
        bishop(k, 'w');
        rook(k, 'w');
        kingVision = positions;
        positions = store;
        
        //Check current positions for ranks and files
        for (let i = 0; i < kingVision.length; i++){
            if (kingVision[i].includes('bl') || kingVision[i].includes('br') || kingVision[i].includes('bp')){
                
                //Ignore pawns greater than 1 space away
                if (kingVision[i].includes('bp')){
                    console.log(`King saw a pawn`);
                    let kLoc = $('#5wl').closest('div').attr('id');
                    let pLoc = $('#' + kingVision[i]).closest('div').attr('id');
                    console.log(`Pawn location at: ${pLoc}`);
                    if ((parseInt(kLoc[1])) === (parseInt(pLoc[1])-1) ){
                        console.log(`King file location: ${kLoc[1]}`);
                        console.log(`Pawn space ahead location: ${(parseInt(pLoc[1])-1)}`)
                        let capZones = [(pLoc[0].charCodeAt(0) -1), (pLoc[0].charCodeAt(0) + 1)]
                        if ( capZones.includes(parseInt(kLoc[0].charCodeAt(0)))){
                            wKing = true;
                            break;
                        }
                    } else{
                        continue;
                    }
                }

                //Ignore knights in rank/file
                if (kingVision[i].includes('7')){
                    continue;
                }
                console.log(`White king now in check due to : ${kingVision[i]}`);
                wKing = true;
                break;
            } else{
                wKing = false;
            }
        }

        console.log(`White king vision: ${kingVision}`);
        console.log(`Positiosn after king check: ${positions}`);
        console.log(`Stored positions: ${store}`);
    } else{
        let k = $('#10bl').closest('div').attr('id');

        // Check for knights threatening
        knight(k, 'b');
        checkKnights = positions;
        positions = store;

        //If knight found update positions for knights position
        for (let i = 0; i < checkKnights.length; i++){
            if (checkKnights[i].includes('2')){
                console.log(`King saw a knight at ${checkKnights[i]}`)
                king(k, 'b');
                kingVision = [];
                kingVision.push(positions);
                kingVision.push(checkKnights[i]);
                console.log(`King checked by knight positions: ${kingVision}`)
                wKing = true;
                return;
            } else{
                wKing = false;
            }
        }

        // Get all positions in ranks and filesq      
        store = positions;
        positions = [];
        bishop(k, 'b');
        rook(k, 'b');
        kingVision = positions;
        positions = store;
        
        //Check current positions for ranks and files
        for (let i = 0; i < kingVision.length; i++){
            if (kingVision[i].includes('wl') || kingVision[i].includes('wr') || kingVision[i].includes('wp')){
                
                //Ignore pawns greater than 1 space away
                if (kingVision[i].includes('wp')){
                    console.log(`King saw a pawn`);
                    let kLoc = $('#10bl').closest('div').attr('id');
                    let pLoc = $('#' + kingVision[i]).closest('div').attr('id');
                    console.log(`Pawn location at: ${pLoc}`);
                    if ((parseInt(kLoc[1])) === (parseInt(pLoc[1])+1) ){
                        console.log(`King file location: ${kLoc[1]}`);
                        console.log(`Pawn space ahead location: ${(parseInt(pLoc[1])-1)}`)
                        let capZones = [(pLoc[0].charCodeAt(0) -1), (pLoc[0].charCodeAt(0) + 1)]
                        if ( capZones.includes(parseInt(kLoc[0].charCodeAt(0)))){
                            bKing = true;
                            return;
                        }
                    } else{
                        continue;
                    }
                }

                //Ignore knights in rank/file
                if (kingVision[i].includes('2')){
                    continue;
                }
                console.log(`Black king now in check due to : ${kingVision[i]}`);
                bKing = true;
                return;
            } else{
                bKing = false;
            }
        }
    }
}

placePieces();
//console.log($("#b7").closest("div").attr('id'));