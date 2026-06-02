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

        cell.addEventListener("mousedown",function(){
            isDrawing=true;
            if(cell!==start&& cell!==target){
                cell.classList.add("wall");
            }
        })
        cell.addEventListener("mouseenter",function(){
            if(isDrawing==true){ 
                if(cell!==start&& cell!==target){
                    cell.classList.add("wall");
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

async function executeBFS(){
    let startRow=parseInt(start.dataset.row);
    let startCol=parseInt(start.dataset.col);

    let targetRow = parseInt(target.dataset.row);
    let targetCol = parseInt(target.dataset.col);


    let visited=[];
    for(let i =0;i<20;i++){
        visited.push(Array(50).fill(false));
    }
    let queue=[];
    queue.push([startRow,startCol]);
    visited[startRow][startCol]=true;

    let dr=[0,0,-1,1];
    let dc=[-1,1,0,0];
    while(queue.length>0){
        let x=queue[0];
        queue.shift();
        let i=x[0];
        let j=x[1];

        let currentCell=document.querySelector(`[data-row="${i}"][data-col="${j}"]`);

        if (currentCell && !currentCell.classList.contains("start-node") && !currentCell.classList.contains("target-node")) {
            currentCell.classList.add("visited");
        }

        await sleep(100);

        for(let k=0;k<4;k++){
            let nr=i+dr[k];
            let nc=j+dc[k];
            if(nr>=0&&nr<20&&nc>=0&&nc<50&&visited[nr][nc]===false){
                let neigh=document.querySelector(`[data-row="${nr}"][data-col="${nc}"]`)
                if(nr==targetRow&&nc==targetCol) return;
                if(!neigh.classList.contains("wall")){queue.push([nr,nc]);
                visited[nr][nc]=true;}
            }
        }
    }
}