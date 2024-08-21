// Global state for current search query, category, subcategory, and filters
let currentQuery = '';
let currentCategory = 'all';
let currentSubcategory = '';
let inventory = [];
let filters = {
    minPrice: 0,
    maxPrice: Infinity,
    dateAdded: '',
    year: '',
    sortOrder: 'newest'
};

// Helper function to format details
function formatDetails(details) {
    if (!details || typeof details !== 'object') return '';
    return Object.entries(details).map(([key, value]) => `${capitalizeFirstLetter(key)}: ${value}`).join(' | ');
}

// Capitalize the first letter of a string
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Helper function to format prices with commas
function formatPrice(price) {
    return `$${parseFloat(price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// Debounce function to limit the rate at which the search function is called
function debounce(func, delay) {
    let debounceTimer;
    return function(...args) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(this, args), delay);
    };
}

// Fetch inventory data from localStorage
function fetchInventoryData() {
    inventory = JSON.parse(localStorage.getItem('inventory')) || [];
    updateResults();
}

// Save new item to localStorage
function saveInventoryData(newItem) {
    inventory.push(newItem);
    localStorage.setItem('inventory', JSON.stringify(inventory));
}

// Search function to filter inventory based on query, category, subcategory, and filters
function searchInventory() {
    return inventory.filter(item => {
        const matchesCategory = currentCategory === 'all' || item.category === currentCategory;
        const matchesSubcategory = !currentSubcategory || item.subcategory === currentSubcategory || !item.subcategory;
        const matchesQuery = item.name.toLowerCase().includes(currentQuery.toLowerCase()) ||
                             JSON.stringify(item.details).toLowerCase().includes(currentQuery.toLowerCase());
        const matchesPrice = parseFloat(item.price) >= filters.minPrice && parseFloat(item.price) <= filters.maxPrice;
        const matchesDate = !filters.dateAdded || new Date(item.dateAdded).toISOString().split('T')[0] === filters.dateAdded;
        const matchesYear = !filters.year || parseInt(item.year) === parseInt(filters.year);

        return matchesCategory && matchesSubcategory && matchesQuery && matchesPrice && matchesDate && matchesYear;
    }).sort((a, b) => {
        const dateA = new Date(a.dateAdded);
        const dateB = new Date(b.dateAdded);
        return filters.sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
}

// Function to display search results
function displayResults(results) {
    const featuredItemsList = document.getElementById('featured-items-list');
    const inventoryList = document.getElementById('inventory-list');

    featuredItemsList.innerHTML = '';
    inventoryList.innerHTML = '';

    results.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('inventory-item');
        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="inventory-image">
            <div class="inventory-details">
                <h3>${item.name}</h3>
                <p>${formatDetails(item.details)}</p>
                <p class="price">${formatPrice(item.price)}</p>
            </div>
        `;

        (item.featured ? featuredItemsList : inventoryList).appendChild(itemElement);
    });

    if (results.length === 0) {
        inventoryList.innerHTML = '<p>No items found</p>';
    }

    // Add event listeners for image click
    addImageClickListeners();
}

// Add event listeners for image click
function addImageClickListeners() {
    document.querySelectorAll('#featured-items-list .inventory-image, #inventory-list .inventory-image').forEach(image => {
        image.addEventListener('click', handleImageClick);
    });
}

// Handle image click to enlarge
function handleImageClick(event) {
    const imageSrc = event.target.src;
    const overlay = document.createElement('div');
    overlay.id = 'image-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.zIndex = '1000';
    
    const enlargedImage = document.createElement('img');
    enlargedImage.src = imageSrc;
    enlargedImage.style.maxWidth = '90%';
    enlargedImage.style.maxHeight = '90%';
    enlargedImage.style.border = '5px solid #fff';
    enlargedImage.style.borderRadius = '10px';

    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '20px';
    closeButton.style.right = '20px';
    closeButton.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '5px';
    closeButton.style.padding = '10px';
    closeButton.style.cursor = 'pointer';

    closeButton.addEventListener('click', () => {
        document.body.removeChild(overlay);
    });

    overlay.appendChild(enlargedImage);
    overlay.appendChild(closeButton);

    document.body.appendChild(overlay);

    // Close overlay when clicking outside the image
    overlay.addEventListener('click', (event) => {
        if (event.target === overlay) {
            document.body.removeChild(overlay);
        }
    });
}

// Update results based on current state
function updateResults() {
    const results = searchInventory();
    displayResults(results);
}

// Event listener functions
function handleSearch(event) {
    currentQuery = event.target.value;
    updateResults();
}

function handleCategoryClick(event) {
    currentCategory = event.target.getAttribute('data-category');
    currentSubcategory = ''; // Reset subcategory when changing main category
    document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    toggleSubcategoryVisibility();
    updateResults();
}

function handleSubcategoryClick(event) {
    currentSubcategory = event.target.getAttribute('data-category');
    document.querySelectorAll('.subcategory-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    updateResults();
}

function handleFilter() {
    filters.minPrice = parseFloat(document.getElementById('min-price').value) || 0;
    filters.maxPrice = parseFloat(document.getElementById('max-price').value) || Infinity;
    filters.year = document.getElementById('year').value;
    filters.sortOrder = document.getElementById('sort-order').value;
    updateResults();
}

function handleClearFilters() {
    filters = { minPrice: 0, maxPrice: Infinity, dateAdded: '', year: '', sortOrder: 'newest' };
    document.getElementById('min-price').value = '';
    document.getElementById('max-price').value = '';
    document.getElementById('year').value = '';
    document.getElementById('sort-order').value = 'newest';
    updateResults();
}

// Toggle subcategory visibility based on selected category
function toggleSubcategoryVisibility() {
    document.getElementById('subcategory-buttons').style.display = currentCategory === 'parts' ? 'flex' : 'none';
}

// Initialize event listeners for the menu toggle
function initMenuToggle() {
    const menuToggleButton = document.querySelector('.menu-toggle'); // Updated class name
    const fullPageMenu = document.querySelector('.full-page-menu'); // Updated class name
    
    if (menuToggleButton && fullPageMenu) {
        menuToggleButton.addEventListener('click', () => {
            fullPageMenu.classList.toggle('active'); // Toggle 'active' class to show/hide the menu
        });

        const closeMenuButton = document.querySelector('.close-menu'); // Updated class name
        if (closeMenuButton) {
            closeMenuButton.addEventListener('click', () => {
                fullPageMenu.classList.remove('active');
            });
        }
    }
}

// Initialize event listeners
function initEventListeners() {
    const navbarSearchInput = document.querySelector('#navbar-search');
    const mainSearchInput = document.querySelector('#main-search');
    const categoryButtons = document.querySelectorAll('.category-btn');
    const subcategoryButtons = document.querySelectorAll('.subcategory-btn');
    const filterButton = document.querySelector('#filter-btn');
    const clearFilterButton = document.querySelector('#clear-filter-btn');
    
    if (navbarSearchInput) {
        navbarSearchInput.addEventListener('input', debounce(handleSearch, 300));
    }

    if (mainSearchInput) {
        mainSearchInput.addEventListener('input', debounce(handleSearch, 300));
    }

    categoryButtons.forEach(button => button.addEventListener('click', handleCategoryClick));
    subcategoryButtons.forEach(button => button.addEventListener('click', handleSubcategoryClick));
    if (filterButton) {
        filterButton.addEventListener('click', handleFilter);
    }
    if (clearFilterButton) {
        clearFilterButton.addEventListener('click', handleClearFilters);
    }

    initMenuToggle(); // Initialize the menu toggle functionality
}

// Call functions to initialize the inventory and event listeners
document.addEventListener('DOMContentLoaded', () => {
    fetchInventoryData();
    initEventListeners();
});
