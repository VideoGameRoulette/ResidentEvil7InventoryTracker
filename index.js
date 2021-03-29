const JSON_ADDRESS = "127.0.0.1";
const JSON_PORT = 7190;
const POLLING_RATE = 10000;

const JSON_ENDPOINT = `http://${JSON_ADDRESS}:${JSON_PORT}/`;

var json;

var InventoryCount;
var PlayerInventory;
var SortedInventory = [];
var newData = [];

const defaultItemObject = {
	_DebuggerDisplay: "[#-1] Empty Slot",
	SlotPosition: -1,
	SlotCount: -1,
	DebugItemName: null,
	ItemName: null,
	Quantity: -1,
	IsItem: false,
	IsWeapon: false,
	IsEmptySlot: true
}

window.onload = function () {
	resetInventory();
	getData();
	setInterval(getData, POLLING_RATE);
};

var Asc = function (a, b) {
	if (a > b) return +1;
	if (a < b) return -1;
	return 0;
};

var Desc = function (a, b) {
	if (a > b) return -1;
	if (a < b) return +1;
	return 0;
};

function getData() {
	fetch(JSON_ENDPOINT)
		.then(function (response) {
			return response.json();
		})
		.then(function (data) {
			appendData(data);
		})
		.catch(function (err) {
			clearData();
			console.log("Error: " + err);
		});
}

function appendData(data) {
	resetInventory();

	var mainContainer = document.getElementById("srtQueryData");
	mainContainer.innerHTML = "";
	if (data.PlayerInventory[0].SlotPosition == -1) {
		mainContainer.innerHTML = `<div class="emptyslot" id="slot${i}"></div>`;
		return;
	}
	PlayerInventory = data.PlayerInventory;
	PlayerInventory.sort(function (a, b) {
		if (a.SlotPosition > b.SlotPosition) {
			return 1;
		}

		if (a.SlotPosition < b.SlotPosition) {
			return -1;
		}
		return 0;
	});

	PlayerInventory.map(item => {
		if (item.SlotPosition != -1)
		{
			SortedInventory[item.SlotPosition] = item;
		}
	});

	//console.log(PlayerInventory);
	InventoryCount = data.PlayerInventorySlots;
	for (var i = 0; i < InventoryCount; i++) {
		var previousItem = SortedInventory[i - 1];
		//if (previousItem !== "undefined") console.log("Previous Item Index: ", previousItem.SlotPosition);
		var previousItemExists = typeof previousItem !== "undefined";
		var previousItemIsDouble =
			previousItemExists &&
			typeof newData[previousItem.SlotPosition] !== "undefined" &&
			newData[previousItem.SlotPosition].includes("inventoryslot2");
		var aboveItem = SortedInventory[i - 4];
		//if (aboveItem !== "undefined") console.log("Above Item Index: ", aboveItem.SlotPosition);
		var aboveItemExists = typeof aboveItem !== "undefined";
		var aboveItemIsDouble =
			aboveItemExists &&
			typeof newData[aboveItem.SlotPosition] !== "undefined" &&
			newData[aboveItem.SlotPosition].includes("inventoryslot2");
		console.log(SortedInventory[i].ItemName, previousItemIsDouble, aboveItemIsDouble, i);
		if (SortedInventory[i].IsEmptySlot) {
			if (previousItem.SlotPosition > 3 && previousItemIsDouble || aboveItemIsDouble) {
				newData[i] = ``;
			}
			else {
				newData[i] = `<div class="emptyslot" id="slot${i}"></div>`;
			}
		}
		else if (SortedInventory[i].IsItem) {
			if (SortedInventory[i].SlotCount == 2 && SortedInventory[i].SlotPosition > 3) {
				newData[SortedInventory[i].SlotPosition] = `<div class="inventoryslot2" id="slot${i}"><img src="./Items/${SortedInventory[i].ItemName}.png" alt=${SortedInventory[i].ItemName}/><div class="quantity">${SortedInventory[i].Quantity}</div></div>`;
			}
			else if (SortedInventory[i].SlotCount == 2 && SortedInventory[i].SlotPosition <= 3) {
				newData[SortedInventory[i].SlotPosition] = `<div class="inventoryslot2H" id="slot${i}"><img src="./Items/${SortedInventory[i].ItemName}.png" alt=${SortedInventory[i].ItemName}/><div class="quantity">${SortedInventory[i].Quantity}</div></div>`;
			}
			else {
				newData[SortedInventory[i].SlotPosition] = `<div class="inventoryslot" id="slot${i}"><img src="./Items/${SortedInventory[i].ItemName}.png"/><div class="quantity">${SortedInventory[i].Quantity}</div></div>`;
			}
		}
		else if (SortedInventory[i].IsWeapon) {
			if (SortedInventory[i].SlotCount == 2 && SortedInventory[i].SlotPosition > 3) {
			newData[SortedInventory[i].SlotPosition] = `<div class="inventoryslot2" id="slot${i}"><img src="./Items/${SortedInventory[i].ItemName}.png" alt=${SortedInventory[i].ItemName}/></div>`;
			}
			else if (SortedInventory[i].SlotCount == 2 && SortedInventory[i].SlotPosition <= 3) {
				newData[SortedInventory[i].SlotPosition] = `<div class="inventoryslot2H" id="slot${i}"><img src="./Items/${SortedInventory[i].ItemName}H.png" alt=${SortedInventory[i].ItemName}/></div>`;
			}
			else {
				newData[SortedInventory[i].SlotPosition] = `<div class="inventoryslot" id="slot${i}"><img src="./Items/${SortedInventory[i].ItemName}.png"/></div>`;
			}
		}
		
		//console.log(newData);
		mainContainer.innerHTML = newData.join("\n");
	}
	mainContainer.innerHTML = newData.join("\n");
}

function resetInventory() {
	for (var i = 0; i < 24; i++) 
	{
		SortedInventory[i] = defaultItemObject;
		SortedInventory[i].SlotPosition = i;
	}
}

function clearData() {
	var mainContainer = document.getElementById("srtQueryData");
	mainContainer.innerHTML = "";
}

//`<div class="inventoryslot"><img src="Items/FirstAidSpray.png" alt="First Aid Spray"/></div>`