// Search functionality
const searchBox = document.querySelector('.search-box input');
if (searchBox) {
    searchBox.addEventListener('input', debounce(handleSearch, 500));
}

// Debounce function to limit API calls
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Handle search
async function handleSearch(e) {
    const searchTerm = e.target.value.trim();
    if (searchTerm.length < 2) return;

    try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(searchTerm)}`);
        const data = await response.json();
        displaySearchResults(data);
    } catch (error) {
        console.error('Search error:', error);
    }
}

// Display search results
function displaySearchResults(results) {
    // Implementation will be added later
}

// Slider functionality
let currentSlide = 0;
const slides = document.querySelectorAll('.slider-item');
const totalSlides = slides.length;

function showSlide(n) {
    if (!slides.length) return;
    
    currentSlide = (n + totalSlides) % totalSlides;
    const offset = -currentSlide * 100;
    document.querySelector('.slider-container').style.transform = `translateX(${offset}%)`;
}

// Auto advance slider
setInterval(() => {
    showSlide(currentSlide + 1);
}, 5000);

// Player source selection
const sourceButtons = document.querySelectorAll('.source-button');
sourceButtons.forEach(button => {
    button.addEventListener('click', () => {
        const source = button.dataset.source;
        const player = document.querySelector('#video-player');
        if (player) {
            player.src = source;
            player.play();
        }
    });
});
