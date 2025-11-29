/**
 * /src/scripts/componentLoader.js
 * * Fetches and injects an HTML component into a specified placeholder element.
 * Handles client-side component fetching for static sites (e.g., python -m http.server).
 * * @param {string} placeholderId - The ID of the element where the component will be inserted (e.g., 'navbar-placeholder').
 * @param {string} componentPath - The relative path to the component's HTML file (e.g., '../components/Navbar.html').
 * @returns {Promise<void>}
 */
function loadComponent(placeholderId, componentPath) {
    const placeholder = document.getElementById(placeholderId);

    if (!placeholder) {
        console.error(`ComponentLoader: Placeholder element not found: #${placeholderId}`);
        return Promise.reject(new Error(`Placeholder #${placeholderId} not found.`));
    }

    // Set aria-busy while loading for accessibility
    placeholder.setAttribute('aria-busy', 'true');

    return fetch(componentPath)
        .then(response => {
            if (!response.ok) {
                // Log the error but still resolve the promise to prevent blocking other loads
                console.error(`ComponentLoader: Failed to fetch ${componentPath}. Status: ${response.status}`);
                placeholder.removeAttribute('aria-busy');
                placeholder.innerHTML = `<p style="color:red;">Error loading component: ${componentPath}</p>`;
                return;
            }
            return response.text();
        })
        .then(html => {
            if (html) {
                placeholder.innerHTML = html;
            }
        })
        .catch(error => {
            console.error('ComponentLoader: Network error during fetch:', error);
        })
        .finally(() => {
            // Remove aria-busy regardless of success/failure
            placeholder.removeAttribute('aria-busy');
        });
}

// Optionally, expose the function globally so it can be called from HTML
window.loadComponent = loadComponent;