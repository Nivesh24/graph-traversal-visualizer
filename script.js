let abortSignal = false;
let isRunning = false;
let drawMode="none";
function sleep(ms) {
    return new Promise(function(resolve) {
        setTimeout(function(){
            resolve();
        },ms)
    });
}
const container=document.getElementById("grid-container");
let isDrawing=false;

for(let row=0;row<20;row++){
    for(let col=0;col<50;col++){
        const cell = document.createElement("div");
        cell.classList.add("cell");

        cell.dataset.row = row;
        cell.dataset.col = col;

        cell.addEventListener("mousedown",function(e){
            e.preventDefault();
            if(isRunning) return;
            isDrawing=true;
            if(cell!==start&& cell!==target){
                if(drawMode==="wall") {
                    cell.classList.remove("weight");
                    cell.classList.add("wall");
                }
                else if(drawMode==="weight" && !cell.classList.contains("wall")) {
                    cell.classList.add("weight");
                }
            }
        })
        cell.addEventListener("mouseenter",function(){
            if(isRunning) return;
            if(isDrawing){ 
                if(cell!==start&& cell!==target){
                    if(drawMode==="wall") {
                        cell.classList.remove("weight");
                        cell.classList.add("wall");
                    }
                    else if(drawMode==="weight" && !cell.classList.contains("wall")) {
                        cell.classList.add("weight");
                    }
                }
            }
        })

        container.appendChild(cell);
    }
}
document.addEventListener("mouseup", function(){

    isDrawing = false;

});

const start=document.querySelector('[data-row="10"][data-col="10"]');
const target=document.querySelector('[data-row="10"][data-col="40"]');

start.classList.add("start-node");
target.classList.add("target-node");


let startRow=parseInt(start.dataset.row);
let startCol=parseInt(start.dataset.col);

let targetRow = parseInt(target.dataset.row);
let targetCol = parseInt(target.dataset.col);



async function startAlgorithm(){
    if(isRunning) return ;
    isRunning =true;

    abortSignal=false;
    clearPath();
    isRunning=true;
    document.getElementById("start-btn").disabled=true;
    document.getElementById("algo-select").disabled=true;
    document.getElementById("clear-path-btn").disabled=true;
    document.getElementById("clear-board-btn").disabled=true;
    abortSignal=false;
    let currentAlgo=document.getElementById("algo-select").value;
    let visited=[];
    for(let i =0;i<20;i++){
        visited.push(Array(50).fill(false));
    }

    let parent=[];
    for(let i=0;i<20;i++){
        parent.push(Array(50).fill(null));
    }
    parent[startRow][startCol]=null;

    let queue=[];
    queue.push([startRow,startCol]);
    visited[startRow][startCol]=true;

    let dr=[0,0,-1,1];
    let dc=[-1,1,0,0];
    while(queue.length>0){
        if(abortSignal) return;

        let x;
        if(currentAlgo==="bfs") {
            x=queue.shift(); 
        } 
        else{
            x=queue.pop();  
        }

        let i=x[0];
        let j=x[1];

        let currentCell=document.querySelector(`[data-row="${i}"][data-col="${j}"]`);

        if (currentCell && !currentCell.classList.contains("start-node") && !currentCell.classList.contains("target-node")) {
            currentCell.classList.add("visited");
        }

        await sleep(10);
        if (abortSignal) return;
        for(let k=0;k<4;k++){
            let nr=i+dr[k];
            let nc=j+dc[k];
            if(nr>=0&&nr<20&&nc>=0&&nc<50&&visited[nr][nc]===false){
                let neigh=document.querySelector(`[data-row="${nr}"][data-col="${nc}"]`)
                if(!neigh.classList.contains("wall")){
                    queue.push([nr,nc]);
                    visited[nr][nc]=true;
                    parent[nr][nc]=[i,j];

                    if(nr===targetRow && nc===targetCol){
                        await drawPath(parent);
                        isRunning=false;
                        document.getElementById("start-btn").disabled=false;
                        document.getElementById("algo-select").disabled=false;
                        document.getElementById("clear-path-btn").disabled=false;
                        document.getElementById("clear-board-btn").disabled=false;
                        return;
                    }
                }
            }
        }
    }
    document.getElementById("start-btn").disabled=false;
    document.getElementById("algo-select").disabled=false;
    document.getElementById("clear-path-btn").disabled=false;
    document.getElementById("clear-board-btn").disabled=false;
    isRunning=false;
}


async function executeDijkstras(){
    if(isRunning) return;
    isRunning=true;
    abortSignal=false;
    clearPath();
    isRunning=true;
    document.getElementById("start-btn").disabled=true;
    document.getElementById("algo-select").disabled=true;
    document.getElementById("clear-path-btn").disabled=true;
    document.getElementById("clear-board-btn").disabled=true;
    abortSignal=false;

    let distance=[];
    for(let i =0;i<20;i++){
        distance.push(Array(50).fill(Infinity));
    }

    let parent=[];
    for(let i=0;i<20;i++){
        parent.push(Array(50).fill(null));
    }

    parent[startRow][startCol]=null;
    let queue=[];
    queue.push([startRow,startCol,0]);
    distance[startRow][startCol]=0;

    let dr=[0,0,-1,1];
    let dc=[-1,1,0,0];
    
    while(queue.length>0){
        if(abortSignal) return;
        queue.sort((a,b)=>a[2]-b[2]);

        let x=queue.shift();
        let i=x[0];
        let j=x[1];
        let dist=x[2];

        if(i===targetRow && j===targetCol){
            await drawPath(parent);
            document.getElementById("start-btn").disabled = false;
            document.getElementById("algo-select").disabled = false;
            document.getElementById("clear-path-btn").disabled = false;
            document.getElementById("clear-board-btn").disabled = false;
            
            isRunning=false;
            return;
        }

        let currentCell=document.querySelector(`[data-row="${i}"][data-col="${j}"]`);

        if (currentCell && !currentCell.classList.contains("start-node") && !currentCell.classList.contains("target-node")) {
            currentCell.classList.add("visited");
        }

        await sleep(10);
        if(abortSignal) return;
        for(let k=0;k<4;k++){
            let nr=i+dr[k];
            let nc=j+dc[k];
            if(nr>=0&&nr<20&&nc>=0&&nc<50){
                let neigh=document.querySelector(`[data-row="${nr}"][data-col="${nc}"]`)
                let weight = 1; 
                if(neigh.classList.contains("weight")) {
                    weight=5; 
                }
                if(!neigh.classList.contains("wall")){
                    if(distance[nr][nc]>dist+weight){
                        distance[nr][nc]=dist+weight
                        parent[nr][nc]=[i,j];
                        queue.push([nr,nc,distance[nr][nc]]);
                    }

                    
                }
            }
        }
        
    }
    document.getElementById("start-btn").disabled=false;
    document.getElementById("algo-select").disabled=false;
    document.getElementById("clear-path-btn").disabled=false;
    document.getElementById("clear-board-btn").disabled=false;
    isRunning=false;
}



async function drawPath(parent){
    let curr=parent[targetRow][targetCol];
    
    while(curr!=null){
        let r=curr[0];
        let c=curr[1];
        if(r===startRow && c===startCol){
            break;
        }
        let cell = document.querySelector(`[data-row="${r}"][data-col="${c}"]`);
        cell.classList.add("path");
        await sleep(20);
        curr=parent[r][c];
    }
}

function clearPath(){
    let cells=document.querySelectorAll(".cell");
    abortSignal=true;
    isRunning =false;
    cells.forEach(cell => {
        cell.classList.remove("visited","path");
    });
}

function clearBoard(){
    let cells=document.querySelectorAll(".cell");
    abortSignal=true;
    isRunning=false;
    cells.forEach(function(cell){
        cell.classList.remove("visited","path","wall","weight")
    })
}

document.getElementById("start-btn").addEventListener("click",function(){
    let currentAlgo =document.getElementById("algo-select").value;
    if(currentAlgo==="dijkstra") {
        executeDijkstras();
    } 
    else{
        startAlgorithm();  
    }
});
document.getElementById("clear-path-btn").addEventListener("click", clearPath);
document.getElementById("clear-board-btn").addEventListener("click", clearBoard);


let algoSelect = document.getElementById("algo-select");
let startBtn = document.getElementById("start-btn");

algoSelect.addEventListener("change", function(){
    startBtn.textContent = "Start " + algoSelect.value.toUpperCase();
    
    let mudBtn = document.getElementById("mud-btn");
    
    if(algoSelect.value==="dijkstra") {
        mudBtn.disabled=false; 
    } 
    else {
        mudBtn.disabled = true;  
        drawMode = "none"; 
        document.getElementById("wall-btn")
        .classList.remove("active-tool");

        document.getElementById("mud-btn")  
        .classList.remove("active-tool");
    }
});
if (document.getElementById("algo-select").value !== "dijkstra") {
    document.getElementById("mud-btn").disabled = true;
}


document.getElementById("wall-btn").addEventListener("click",()=>{

    drawMode = "wall";

    document.getElementById("wall-btn")
            .classList.add("active-tool");

    document.getElementById("mud-btn")
            .classList.remove("active-tool");
});

document.getElementById("mud-btn").addEventListener("click",()=>{

    drawMode = "weight";

    document.getElementById("mud-btn")
            .classList.add("active-tool");

    document.getElementById("wall-btn")
            .classList.remove("active-tool");
});
