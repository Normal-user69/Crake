
    let moneyDisplay = document.getElementById("money");
    let money = parseFloat(window.localStorage.getItem("money"))
    moneyDisplay.textContent = "Balance: " + money;

    let popup = document.querySelector(".popup");

    function closeMore() {
        window.localStorage.money = 100;
        updateBalance();
        popup.classList.remove("open-popup");
    }

document.getElementById("addNameButton").addEventListener("click", function () {

    if (money > 2){
    var nameInput = document.getElementById("name").value;
    if (nameInput.trim() !== "") {
        addNameToTable(nameInput);
    }
} else{
    popup.classList.add("open-popup");
}
});

function addNameToTable(name) {
    var table = document.getElementById("scoreboard");
    var newRow = table.insertRow();
    var idCell = newRow.insertCell(0);
    var nameCell = newRow.insertCell(1);
    var wonCell = newRow.insertCell(2);

    var newId = table.rows.length - 2;
    var wonStatus = Math.random() < 0.1 ? "Yes" : "No";
    if(wonStatus === "Yes"){
        var temp = money*100;
        window.localStorage.money = Math.round(money + temp);
        updateBalance();
    }else{
        var temp = money*0.5;
        window.localStorage.money = Math.round(money - temp);
        updateBalance();
    }

    var wonSpan = document.createElement("span");
    wonSpan.innerText = wonStatus;
    wonSpan.style.backgroundColor = wonStatus === "Yes" ? "green" : "red";

    idCell.innerHTML = `<span>${newId}</span>`;
    nameCell.innerHTML = `<span>${name}</span>`;
    wonCell.appendChild(wonSpan);

    updateFooter();
}

function updateFooter() {
    var footer = document.getElementById("footer");
    var footerContent = document.getElementById("footerContent");
    var table = document.getElementById("scoreboard");
    var lastRow = table.rows[table.rows.length - 1];

    // Clear previous footer content
    footerContent.innerHTML = "";

    // Create and append new row
    var newRow = document.createElement("tr");
    for (var i = 0; i < lastRow.cells.length; i++) {
        var newCell = document.createElement("td");
        newCell.innerHTML = lastRow.cells[i].innerHTML;
        newRow.appendChild(newCell);
    }
    footerContent.appendChild(newRow);

    // Update footer visibility and color
    if (document.body.scrollHeight > window.innerHeight) {
        var wonStatus = lastRow.cells[2].innerText.trim();
        footer.style.display = "block";
    } else {
        footer.style.display = "none";
    }
}

function checkScrollPosition() {
    var footer = document.getElementById("footer");
    if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight) {
        footer.style.display = "none";
    } else {
        updateFooter();
    }
}

function updateBalance(){
    money = parseFloat(window.localStorage.getItem("money"))
    moneyDisplay.textContent = "Balance: " + money;
}

// Initial check if the page is loaded with scrollbar
window.addEventListener("load", updateFooter);

// Check scroll position
window.addEventListener("scroll", checkScrollPosition);