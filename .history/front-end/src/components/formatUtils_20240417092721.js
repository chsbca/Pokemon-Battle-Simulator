// formatUtils.js

export const capitalizeAndFormat = (text) => {
    if (!text) return '';  // Return an empty string if text is not provided
    return text
        .split('-')  // Split the string at each hyphen
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))  // Capitalize the first letter of each part
        .join(' ');  // Join the parts back together with spaces
};
