export const capitalizeAndFormat = (text) => {
    if (!text) return '';  // Return an empty string if text is not provided
    return text
        .replace(/-/g, ' ')  // Replace all hyphens with spaces
        .split(' ')  // Split the string at each space
        .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())  // Capitalize the first letter of each part and make sure the rest are lowercase
        .join(' ');  // Join the parts back together with spaces
};