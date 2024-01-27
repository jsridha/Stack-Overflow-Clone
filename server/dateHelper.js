// Date formatting utility

exports.formatDate = function (date) {
    const now = new Date();
    const diff = now - date;

    if (diff < 1000) {
        return '0 seconds ago';
    } else if (diff < 60000) {
        const seconds = Math.floor(diff / 1000);
        return `${seconds} second${seconds === 1 ? '' : 's'} ago`;
    } else if (diff < 3600000) {
        const minutes = Math.floor(diff / 60000);
        return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
    } else if (diff < 86400000) {
        const options = { year: 'numeric', month: 'short', day: '2-digit' };
        const formattedDate = date.toLocaleDateString('en-US', options);
        return `${formattedDate} at ${date.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }).substring(0, 5)}`;
    } else if (diff < 31536000000) {
        const options = { year: 'numeric', month: 'short', day: '2-digit' };
        const formattedDate = date.toLocaleDateString('en-US', options);
        return `${formattedDate} at ${date.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }).substring(0, 5)}`;
    } else {
        const options = { year: 'numeric', month: 'short', day: '2-digit' };
        const formattedDate = date.toLocaleDateString('en-US', options);
        return `${formattedDate} at ${date.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }).substring(0, 5)}`;
    }
}