// Helper function to safely read JSON from a response
export async function readJson(response) {
    const contentType = response.headers.get('Content-Type') || '';

    if (!contentType.toLowerCase().includes('application/json')) {
        return {};
    }

    try {
        return await response.json();
    } catch (error) {
        return {};
    }
}

export function encodeHTML(str) {
    return String(str ?? '').replace(/[&<>"'`=\/]/g, s => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
    }[s]));
}