var gameStart = true;

var gameLog = [];

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
    console.log(`Picked up: ${ev.target.id}`)    
}

//Allows pieces to be dropped into new place
function drop(ev){
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    console.log(`Item dropped: ${data}`)
    console.log(`Square id: ${ev.target.id}`)

    //Check for valid move
    if (checkMove(data, ev.target.id)){
        ev.target.appendChild(document.getElementById(data));
    } else{
        return;
    }
    
}

//Starts movement algorithm
function checkMove(piece, square){
    console.log(`Moving: ${piece}`)
    console.log(`from: ${$("#"+piece).closest("div").attr('id')}`)
    console.log(`to: ${square}\n`)
    let detect = piece.slice(1);
    let moving = piece.slice(0,-2);
    console.log(`Piece detect: ${detect}`)
    let currentSquare = $("#"+piece).closest("div").attr('id');
    switch (detect) {
        //Handle pawns
        case ("bp"):
            return pawn("down", currentSquare, square)
        
        case("wp"):
            return pawn("up", currentSquare, square)
            
        default:
            return movePiece(moving, currentSquare, square);
                
    }
}

//Moves Pieces
function movePiece(piece, fromSquare, toSquare){
    console.log(`Piece: ${piece}`);
    console.log(`From: ${fromSquare}`);
    console.log(`To: ${toSquare}`);
    let diags = null;
    let lines = null;
    switch (piece){
        //White Rook
        case ("1"):
            return rook(fromSquare, toSquare, 'w');

        //White Knight
        case ("2"):
            return knight(fromSquare, toSquare, 'w');

        //White Bishop
        case ("3"):
            return bishop(fromSquare, toSquare, 'w');
        
        //White Queen
        case ("4"):
            diags = bishop(fromSquare, toSquare, 'w');
            lines = rook(fromSquare, toSquare, 'w');
            if (diags === true || lines ===true){
                return true;
            } else{
                return false;         
            }
        
        //White King    
        case("5"):
            return king(fromSquare, toSquare, 'w');

        //Black Rook
        case("6"):
            return rook(fromSquare, toSquare, 'b');
                  
        //Black Knight
        case("7"):            
            return knight(fromSquare, toSquare, 'b');
            
        //Black Bishop    
        case("8"):
            return bishop(fromSquare, toSquare, 'b');
        
        //Black Queen   
        case ("9"): 
            diags = bishop(fromSquare, toSquare, 'b');
            lines = rook(fromSquare, toSquare, 'b');
            if (diags === true || lines ===true){
                return true;
            } else{
                return false;         
            }
        
        //Black King
        case ("10"):
            return king(fromSquare, toSquare, 'b');    
        }

            
    }

//Rook Movement Logic
function rook(fromSquare, toSquare, color){
    let vision = checkVision("r", fromSquare);
    vision.sort();
    let visionCheck = [];
    console.log(`Rook from: ${fromSquare}`)
    console.log(`Rook vision: ${vision}`);
    for (let i = 0; i < vision.length; i++){
        let splitter = vision[i].split(" ");
        visionCheck.push(splitter[0]);
        visionCheck.push(splitter[1]);
    }
    checker = visionCheck.indexOf(fromSquare);
    console.log(`Rook visioncheck: ${visionCheck} Check index: ${visionCheck[checker]}  Checker: ${checker}`);
    if(toSquare[0] == fromSquare[0]){
        for (let i = 0; i < Math.abs((parseInt(toSquare[1]) - parseInt(fromSquare[1]))); i++){
            continue;
        }
        return true;
    } else if(toSquare[1] == fromSquare[1]){
        return true;
    } else {
        return false;
    }
}

//Knight Movement Logic
function knight(fromSquare, toSquare){
    let squareSplit = fromSquare.split('')
    let ranks = [];
    let files = [];
    let possible = [];
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
                possible.push(move);
            } 
        } else{
            for (let x = 2; x < 4; x++){
                let move2 = ranks[i] + files[x]
                possible.push(move2);
            }
        }
        
                                
    }
    console.log(`Possible Knight Moves: ${possible}`)
    console.log(`Moved deemed possible: ${possible.includes(toSquare)}`)
    return possible.includes(toSquare);
}

//Bishop Movement Logic
function bishop(fromSquare, toSquare){
    let squareSplit = fromSquare.split('');
    let bisRank = squareSplit[0].charCodeAt(0);
    let bisFile = parseInt(squareSplit[1]);
    let count = 0;
    let adder = 1;
    let possible = [];
    while (count < 4){
        console.log(`Bishop count: ${count}`);
        console.log(`Loopstart bisrank: ${bisRank}`);
        console.log(`Loopstart bisfile: ${bisFile}\n`);
        //Up to right
        if (count === 0){
            if (bisRank >= 104 || bisFile >= 8){
                bisRank = squareSplit[0].charCodeAt(0);
                bisFile = parseInt(squareSplit[1])
                adder = 1;
                count++;
                continue;
                }
            possible.push(
            (String.fromCharCode(bisRank + adder) + (bisFile + adder).toString())
            )
            bisRank = bisRank + adder;
            bisFile = bisFile + adder;
            console.log(`Up-Right Bisrank ASCII: ${bisRank}`)
            console.log(`Up-Right Bisrank char: ${String.fromCharCode(bisRank)}`)
            console.log(`Up-Right Bisfile: ${bisFile}`)
            console.log(`Up-Right Count: ${count} Adder: ${adder} Current Possible: ${possible}\n`)
            continue;
        }
        //Down and right
        if (count === 1){
            if (bisRank >= 104 || bisFile <= 1){
                bisRank = squareSplit[0].charCodeAt(0);
                bisFile = parseInt(squareSplit[1])
                adder = 1;
                count++;
                continue;
            }
            possible.push(
                (String.fromCharCode(bisRank + adder) + (bisFile - adder).toString())
            )
            bisRank = bisRank + adder;
            bisFile = bisFile - adder;
            console.log(`Down-Right Bisrank ASCII: ${bisRank}`)
            console.log(`Down-Right Bisrank char: ${String.fromCharCode(bisRank)}`)
            console.log(`Down-Right Bisfile: ${bisFile}`)
            console.log(`Down-Right Count: ${count} Adder: ${adder} Current Possible: ${possible}\n`)
            continue;
        }
        //Up and left    
        if (count == 2){
            if (bisRank <= 97 || bisFile >= 8){
                bisRank = squareSplit[0].charCodeAt(0);
                bisFile = parseInt(squareSplit[1])
                adder = 1;
                count++;
                continue;
            }
            possible.push(
                String.fromCharCode(bisRank - adder) + (bisFile + adder).toString()
            )
            bisRank = bisRank - adder;
            bisFile = bisFile + adder;
            console.log(`Up-Left Bisrank ASCII: ${bisRank}`)
            console.log(`Up-Left Bisrank char: ${String.fromCharCode(bisRank)}`)
            console.log(`Up-Left Bisfile: ${bisFile}`)
            console.log(`Up-Left Count: ${count} Adder: ${adder} Current Possible: ${possible}\n`)
            continue;
        }
        //Down and left
        if (count === 3){
            if (bisRank <= 97 || bisFile <= 1){
                bisRank = squareSplit[0].charCodeAt(0);
                bisFile = parseInt(squareSplit[1])
                adder = 1;
                count++;
                continue;
            }
            possible.push(
                String.fromCharCode(bisRank - adder) + (bisFile - adder).toString()
            )
            bisRank = bisRank - adder;
            bisFile = bisFile - adder;
            console.log(`Down-Left Bisrank ASCII: ${bisRank}`)
            console.log(`Down-Left Bisrank char: ${String.fromCharCode(bisRank)}`)
            console.log(`Down-Left Bisfile: ${bisFile}`)
            console.log(`Down-Left Count: ${count} Adder: ${adder} Current Possible: ${possible}`)
            continue;
        }
                     
    }
    console.log(`Bishop moves: ${possible}`)
    return possible.includes(toSquare);  
}

//King Movement Logic
function king(fromSquare, toSquare){
    let possible = [];
    let ranks = [];
    let files = [];
    let squareSplit = fromSquare.split('');
    ranks.push(squareSplit[0]);
    files.push(squareSplit[1]);
    ranks.push(String.fromCharCode((squareSplit[0].charCodeAt(0) + 1)));
    ranks.push(String.fromCharCode((squareSplit[0].charCodeAt(0) - 1)));
    files.push((parseInt(squareSplit[1]) + 1).toString());
    files.push((parseInt(squareSplit[1]) - 1).toString());
    console.log(`Kings ranks: ${ranks}  Length: ${ranks.length}`);
    console.log(`Kings files: ${files} Length: ${files.length}`);
    for (let i = 0; i < 3; i++){
        possible.push((ranks[i] + files[0]));
        possible.push((ranks[i] + files[1]));
        possible.push((ranks[i] + files[2]));
        console.log(`Kings possible: ${possible}`); 
    }
    return possible.includes(toSquare);
}

//Pawn Movement Logice
function pawn(direction, fromSquare, toSquare){
    if (direction === "down"){
        if ((parseInt(fromSquare[1]) - parseInt(toSquare[1])) != 1){
            return false;
        } else{
            return true;
        }
    }

    if (direction === "up"){
        if((parseInt(fromSquare[1]) + 1) != parseInt(toSquare[1])){
            return false;
        } else{
            return true;
        }
    }

}

function checkVision(piece, fromSquare){
    let squareSplit = fromSquare.split('');
    let occupied = [];
    switch(piece){
        case("r"):
            for (let i = 0; i < 8 ; i++){
                let childCheck = 'div#'+ squareSplit[0] + i.toString() + " img:last-child";
                let foundParent = 'div#'+ squareSplit[0] + i.toString()
                if ($(childCheck).length > 0){
                    if($(childCheck).attr("id") === "#"+fromSquare){
                        continue;
                    } else{
                        occupied.push($(foundParent).attr("id") + " " + $(childCheck).attr("id") )
                    }
                    
                }
                childCheck = 'div#' + String.fromCharCode(97 + i) + squareSplit[1] + ' img:last-child';
                foundParent = 'div#' + String.fromCharCode(97 + i) + squareSplit[1]
                if ($(childCheck).length > 0){
                    if($(childCheck).attr("id") === "#"+fromSquare){
                        continue;
                    } else{
                        occupied.push($(foundParent).attr("id") + " " + $(childCheck).attr("id") )
                    }
                    
                }
            }
            return occupied;
    }
}

placePieces();
//console.log($("#b7").closest("div").attr('id'));