var gameStart = true;

var gameLog = [];

var positions = [];


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
    console.log(`Dragged from: ${$('#'+ev.target.id).closest('div').attr('id')}\n`)
    checkMove(ev.target.id, $('#'+ev.target.id).closest('div').attr('id'));
    console.log(`Found positions: ${positions}\n`);    
}

//Allows pieces to be dropped into new place
function drop(ev){
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    console.log(`Item dropped: ${data}`)
    console.log(`Square id: ${ev.target.id}\n`)

    //Check for valid move
    if (positions.includes(ev.target.id)){
        ev.target.appendChild(document.getElementById(data));
        positions = [];
        console.log(`Positions cleared: ${positions}`);
    } else{
        positions = [];
        console.log(`Positions cleared 1: ${positions}`);
        return;
    }
    positions = [];
    console.log(`Positions cleared 2: ${positions}`);
    
}

//Moves Pieces
function checkMove(piece, fromSquare){
    console.log(`Check move function:`)
    console.log(`Piece: ${piece}`);
    console.log(`From: ${fromSquare}`);
    if (piece.includes('p')){
        detect = piece.slice(-2)    
    } else{
        detect = parseInt(piece).toString();
    } 
    console.log(`Detect: ${detect}`)
    switch (detect){
        //White Rook
        case ("1"):
            console.log(`Case 1`);
            rook(fromSquare, 'w');
            break;
        //White Knight
        case ("2"):
            console.log(`Case 2`);
            knight(fromSquare, 'w');
            break;
        //White Bishop
        case ("3"):
            console.log(`Case 3`);
            bishop(fromSquare, 'w');
            break;
        //White Queen
        case ("4"):
            console.log(`Case 4`);
            bishop(fromSquare, 'w');
            rook(fromSquare, 'w');
            break;
        //White King    
        case("5"):
            console.log(`Case 5`);
            king(fromSquare, 'w');
            break;
        //Black Rook
        case("6"):
            console.log(`Case 6`);
            rook(fromSquare, 'b');
            break;  
        //Black Knight
        case("7"):
            console.log(`Case 7`);
            knight(fromSquare, 'b');
            break;
        //Black Bishop    
        case("8"):
            console.log(`Case 8`);
            bishop(fromSquare, 'b');
            break;
        //Black Queen   
        case ("9"):
            console.log(`Case 9`); 
            bishop(fromSquare, 'b');
            rook(fromSquare, 'b');           
            break;
        //Black King
        case ("10"):
            console.log(`Case 10`);
            king(fromSquare, 'b'); 
            break;
        //White Pawn
        case ("wp"):
            console.log(`Case WP`);
            pawn(fromSquare, 'w');
            break;
        //Black Pawn
        case ("bp"):
            console.log(`Case BP`);
            pawn(fromSquare, 'b')
            break;
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
        console.log(`Rook rankcheck: ${rankCheck}`)
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
        console.log(`Rook rankcheck: ${rankCheck}`)
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
        console.log(`Rook filecheck: ${fileCheck}`)
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
        console.log(`Rook filecheck: ${fileCheck}`)
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
    console.log(`Bishop function: `)
    console.log(`Bishop Color: ${color}`);
    console.log(`Bishop from: ${fromSquare}`);
    let squareSplit = fromSquare.split('');
    let bisRank = squareSplit[0].charCodeAt(0);
    let bisFile = parseInt(squareSplit[1]);
    let count = 0;
    let next = null;
    let update = null;
    while (count < 4){
        console.log(`Bishop Entered loop\n`);
        update = true;
        let checker = null;
        bisRank = squareSplit[0].charCodeAt(0);
        bisFile = parseInt(squareSplit[1])
        //Up to right
        if (count === 0){
            while (update){
                next = String.fromCharCode(bisRank + 1) + (bisFile + 1).toString();
                checker = checkSquare(next);
                console.log(`UR update loop next: ${next}`)
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
                console.log(`DR update loop next: ${next}`)
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
                console.log(`UL update loop next: ${next}`)
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
                console.log(`DL update loop next: ${next}`)
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

function updatePositions(check, square, color){
    console.log(`Update log:`);
    console.log(`Incoming check: ${check}`);
    console.log(`Incoming square: ${square}`);
    console.log(`Incoming color: ${color}`);
    if (check === false){
        positions.push(square)
        console.log(`Pushed incoming square\n`)
        return true;
    } else if (check === true) {
        console.log(`Invalid square\n`)
        return false;
    } else if (check.includes(color)){
        console.log(`Found color in square\n`)
        return false;
    } else {
        console.log(`Pushed opponent square\n`)
        positions.push(check);
        return false;
    }
}

placePieces();
//console.log($("#b7").closest("div").attr('id'));