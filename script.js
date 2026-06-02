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
