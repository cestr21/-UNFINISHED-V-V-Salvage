document.addEventListener('DOMContentLoaded', () => {
    const categorySelect = document.getElementById('item-category');
    
    // Update details visibility based on the selected category on page load
    updateDetailsVisibility(categorySelect.value);
    
    // Attach event listener for category change
    categorySelect.addEventListener('change', function() {
        updateDetailsVisibility(this.value);
    });

    // Attach event listener for form submission
    document.getElementById('inventory-form').addEventListener('submit', function(event) {
        event.preventDefault();
        
        const name = document.getElementById('item-name').value;
        const price = document.getElementById('item-price').value;
        const category = document.getElementById('item-category').value;
        const featured = document.getElementById('item-featured').checked;
        const imageFile = document.getElementById('item-image').files[0];
        const subcategory = document.getElementById('item-subcategory') ? document.getElementById('item-subcategory').value : '';

        let details = {};
        
        if (category === 'cars') {
            details = {
                make: document.getElementById('car-make').value,
                model: document.getElementById('car-model').value,
                year: document.getElementById('car-year').value,
                color: document.getElementById('car-color').value,
                moreDetails: document.getElementById('car-details-text').value
            };
        } else if (category === 'parts') {
            details = {
                make: document.getElementById('part-make').value,
                model: document.getElementById('part-model').value,
                year: document.getElementById('part-year').value,
                partType: document.getElementById('part-type').value
            };
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            const item = {
                name,
                price,
                category,
                subcategory,  // Include subcategory in item object
                featured,
                image: e.target.result,
                details,
                dateAdded: new Date().toISOString()
            };
            
            addItemToInventory(item);
            alert('Item added successfully!');
            document.getElementById('inventory-form').reset();
            updateDetailsVisibility(categorySelect.value); // Update details visibility after form reset
            displayInventory(); // Refresh the displayed inventory
        };
        
        reader.readAsDataURL(imageFile);
    });

    // Function to update the visibility of details sections based on category
    function updateDetailsVisibility(category) {
        const carDetails = document.getElementById('car-details');
        const partDetails = document.getElementById('part-details');
        const subcategorySelect = document.getElementById('item-subcategory');

        if (category === 'cars') {
            carDetails.style.display = 'block';
            partDetails.style.display = 'none';
            subcategorySelect.style.display = 'none'; // Hide subcategory when Cars is selected
        } else if (category === 'parts') {
            carDetails.style.display = 'none';
            partDetails.style.display = 'block';
            subcategorySelect.style.display = 'block'; // Show subcategory when Parts is selected
        } else {
            carDetails.style.display = 'none';
            partDetails.style.display = 'none';
            subcategorySelect.style.display = 'none'; // Hide subcategory for any other category
        }
    }
    
    // Function to display the current inventory
    function displayInventory() {
        const inventoryContainer = document.getElementById('current-inventory-list');
        let inventory = JSON.parse(localStorage.getItem('inventory')) || [];
        
        // Sort inventory alphabetically by item name
        inventory.sort((a, b) => a.name.localeCompare(b.name));
        
        inventoryContainer.innerHTML = ''; // Clear previous content

        inventory.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('inventory-item');
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="inventory-image">
                <div class="inventory-details">
                    <h3>${item.name}</h3>
                    <p>${item.details.make ? 'Make: ' + item.details.make : ''}</p>
                    <p>${item.details.model ? 'Model: ' + item.details.model : ''}</p>
                    <p>${item.details.year ? 'Year: ' + item.details.year : ''}</p>
                    <p>${item.details.color ? 'Color: ' + item.details.color : ''}</p>
                    <p>${item.details.partType ? 'Part Type: ' + item.details.partType : ''}</p>
                    <p class="price">$${item.price}</p>
                    <button class="delete-btn" data-index="${index}">Delete</button>
                </div>
            `;
            inventoryContainer.appendChild(itemElement);
        });

        // Attach delete button event listeners
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', function() {
                const index = this.getAttribute('data-index');
                deleteItemFromInventory(index);
                displayInventory(); // Refresh the displayed inventory
            });
        });
    }

    // Function to add an item to inventory
    function addItemToInventory(item) {
        let inventory = JSON.parse(localStorage.getItem('inventory')) || [];
        inventory.push(item);
        localStorage.setItem('inventory', JSON.stringify(inventory));
    }

    // Function to delete an item from inventory
    function deleteItemFromInventory(index) {
        let inventory = JSON.parse(localStorage.getItem('inventory')) || [];
        inventory.splice(index, 1);
        localStorage.setItem('inventory', JSON.stringify(inventory));
    }

    displayInventory(); // Call this function to display current inventory on page load
});
