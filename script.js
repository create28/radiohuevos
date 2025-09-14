// EGGS Radio playlist data
const playlists = [
    {
        id: 'eggs-60s-70s',
        title: 'EGGS • Songs from the 60s and 70s',
        description: 'Auto-generated playlist for theme: Songs from the 60s and 70s',
        songCount: 54,
        duration: 282, // 4 hours and 42 minutes
        spotifyId: '143907TltAKd9PESmnV8h9',
        coverImage: 'https://mosaic.scdn.co/300/ab67616d00001e0219dcd95d28b63d10164327f2ab67616d00001e02e7bfd1f47a4afd9b4b0caed5ab67616d00001e02f9e07e123e9695a913b50912ab67616d00001e02fb9dac3244b8486758058a81' // Replace with actual cover URL from Spotify
    },
    {
        id: 'eggs-old-gold',
        title: 'EGGS • Old Gold',
        description: 'A curated collection of classic tracks spanning multiple decades',
        songCount: 54,
        duration: 117, // 1 hour 57 minutes
        spotifyId: '4Mqcnk5dcq1LLG7pjhDWhw',
        coverImage: 'REPLACE_WITH_REAL_COVER_URL_2' // Replace with actual cover URL from Spotify
    }
];

// Utility function to format duration in minutes to hours and minutes
function formatDuration(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
        return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
}

// Create playlist card HTML
function createPlaylistCard(playlist) {
    const coverImage = playlist.coverImage || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=640&h=640&fit=crop&crop=center';
    
    return `
        <a href="playlist-detail.html?id=${playlist.id}" class="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-200">
            <div class="aspect-square overflow-hidden">
                <img src="${coverImage}" alt="${playlist.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200">
            </div>
            <div class="p-4">
                <h3 class="font-semibold text-gray-900 text-lg mb-2 line-clamp-2">${playlist.title}</h3>
                <p class="text-gray-600 text-sm mb-4 line-clamp-2">${playlist.description}</p>
                <div class="flex justify-between items-center text-sm text-gray-500 mb-4">
                    <span>${playlist.songCount} songs</span>
                    <span>${formatDuration(playlist.duration)}</span>
                </div>
                <div class="w-full bg-gray-900 text-white text-center py-2 px-4 rounded-md hover:bg-gray-800 transition-colors duration-200">
                    View Playlist
                </div>
            </div>
        </a>
    `;
}

// Render all playlist cards
function renderPlaylists() {
    const grid = document.getElementById('playlistsGrid');
    if (!grid) return;
    
    grid.innerHTML = playlists.map(playlist => createPlaylistCard(playlist)).join('');
}

// Get playlist by ID
function getPlaylistById(id) {
    return playlists.find(playlist => playlist.id === id);
}

// Get URL parameters
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the detail page
    const playlistId = getUrlParameter('id');
    
    if (playlistId && window.location.pathname.includes('playlist-detail.html')) {
        // This is a detail page - the detail page will handle its own rendering
        return;
    }
    
    // This is the main page - render playlists
    renderPlaylists();
});

// Export functions for use in detail page
window.EGGSRadio = {
    playlists,
    getPlaylistById,
    formatDuration
};
