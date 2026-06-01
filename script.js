const container=document.getElementById("grid-container");

for(let row=0;row<20;row++){
    for(let col=0;col<50;col++){
        const cell = document.createElement("div");
        cell.classList.add("cell");

        cell.dataset.row = row;
        cell.dataset.col = col;

        container.appendChild(cell);
    }
}