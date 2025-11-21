document.addEventListener("DOMContentLoaded", loadItems);

// LOST FORM
const lostForm = document.getElementById("lostForm");
lostForm.addEventListener("submit", function(e){
    e.preventDefault();
    addItem("lost");
});

// FOUND FORM
const foundForm = document.getElementById("foundForm");
foundForm.addEventListener("submit", function(e){
    e.preventDefault();
    addItem("found");
});

// Add Lost or Found Item
function addItem(type){
    const name = document.getElementById(type + "Name").value;
    const desc = document.getElementById(type + "Desc").value;
    const person = document.getElementById(type + "Person").value;
    const contact = document.getElementById(type + "Contact").value;
    const imageInput = document.getElementById(type + "Image");

    let imageURL = "";

    if(imageInput.files.length > 0){
        const reader = new FileReader();
        reader.onload = function(){
            imageURL = reader.result;
            saveItem(type, name, desc, person, contact, imageURL);
        };
        reader.readAsDataURL(imageInput.files[0]);
    } else {
        saveItem(type, name, desc, person, contact, "");
    }
}

function saveItem(type, name, desc, person, contact, imageURL){
    const item = {
        id: Date.now(),
        type,
        name,
        desc,
        person,
        contact,
        imageURL
    };

    let items = JSON.parse(localStorage.getItem("lostFoundItems")) || [];
    items.push(item);
    localStorage.setItem("lostFoundItems", JSON.stringify(items));

    document.getElementById(type + "Form").reset();
    loadItems();
}

// Load all items
function loadItems(){
    const itemsList = document.getElementById("itemsList");
    itemsList.innerHTML = "";

    const items = JSON.parse(localStorage.getItem("lostFoundItems")) || [];

    if(items.length === 0){
        itemsList.innerHTML = "<p>No lost or found items reported yet.</p>";
        return;
    }

    items.forEach(item => {
        const card = document.createElement("div");
        card.classList.add("item-card");

        card.innerHTML = `
            <img src="${item.imageURL || 'https://via.placeholder.com/120'}" />
            <div>
                <h3>${item.name} (${item.type.toUpperCase()})</h3>
                <p>${item.desc}</p>
                <small>Reported by: <b>${item.person}</b></small><br>

                <button class="contact" onclick="showContact('${item.contact}')">
                    Contact ${item.type === 'lost' ? 'Owner' : 'Reporter'}
                </button>

                <button class="returned-btn" onclick="deleteItem(${item.id})">
                    Item Returned ✔
                </button>
            </div>
        `;

        itemsList.appendChild(card);
    });
}

// Show contact info
function showContact(contact){
    alert("Contact: " + contact);
}

// Delete item
function deleteItem(id){
    if(!confirm("Are you sure this item has been returned?")) return;

    let items = JSON.parse(localStorage.getItem("lostFoundItems")) || [];
    items = items.filter(item => item.id !== id);
    localStorage.setItem("lostFoundItems", JSON.stringify(items));
    loadItems();
}