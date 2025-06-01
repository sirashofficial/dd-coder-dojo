#!/usr/bin/env node

/**
 * Navigation Update Script
 * Automatically updates navigation structure across all HTML files
 * 
 * Usage: node update-navigation.js
 */

const fs = require('fs');
const path = require('path');

// New navigation HTML structure
const navigationHTML = `    <!-- Navigation -->
    <nav class="navbar" aria-label="Main navigation">
        <a href="index.html" class="logo">
            <img src="images/logo.png" alt="Code with Ubuntu Logo" class="logo-img" />
            <span>Code with Ubuntu</span>
        </a>
        
        <button class="menu-toggle" id="menuToggle" aria-label="Toggle mobile menu" aria-expanded="false">
            <div class="bar"></div>
            <div class="bar"></div>
            <div class="bar"></div>
        </button>
        
        <ul class="nav-links">
            <li CLASS_PLACEHOLDER><a href="index.html">Home</a></li>
            <li CLASS_PLACEHOLDER><a href="about.html">About</a></li>
            <li class="dropdown">
                <a href="programs.html" class="dropdown-toggle">Programs</a>
                <ul class="dropdown-menu">
                    <li><a href="programs.html">All Programs</a></li>
                    <li><a href="resources.html">Resources</a></li>
                </ul>
            </li>
            <li class="dropdown">
                <a href="community.html" class="dropdown-toggle">Community</a>
                <ul class="dropdown-menu">
                    <li><a href="community.html">Events</a></li>
                    <li><a href="gallery.html">Gallery</a></li>
                </ul>
            </li>
            <li CLASS_PLACEHOLDER><a href="contact.html">Contact</a></li>
            <li><a href="register.html" class="btn btn-primary">Register</a></li>
        </ul>
    </nav>`;

// Files to update and their active page
const filesToUpdate = {
    'programs.html': 'programs',
    'community.html': 'community', 
    'gallery.html': 'gallery',
    'contact.html': 'contact',
    'register.html': 'register',
    'resources.html': 'resources'
};

// CSS to add to head section
const navigationCSS = '<link rel="stylesheet" href="css/navigation.css">';

// JavaScript to add before closing body tag
const navigationJS = '<script src="js/navigation.js"></script>';

function updateHTMLFile(filename, activePage) {
    const filePath = path.join(__dirname, filename);
    
    if (!fs.existsSync(filePath)) {
        console.log(`❌ File not found: ${filename}`);
        return;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace class placeholders with active states
    let updatedNavHTML = navigationHTML;
    
    // Set active class based on current page
    switch(activePage) {
        case 'programs':
        case 'resources':
            updatedNavHTML = updatedNavHTML
                .replace('CLASS_PLACEHOLDER><a href="index.html"', '><a href="index.html"')
                .replace('CLASS_PLACEHOLDER><a href="about.html"', '><a href="about.html"')
                .replace('CLASS_PLACEHOLDER><a href="contact.html"', '><a href="contact.html"')
                .replace('<li class="dropdown">', '<li class="dropdown active">');
            break;
        case 'community':
        case 'gallery':
            updatedNavHTML = updatedNavHTML
                .replace('CLASS_PLACEHOLDER><a href="index.html"', '><a href="index.html"')
                .replace('CLASS_PLACEHOLDER><a href="about.html"', '><a href="about.html"')
                .replace('CLASS_PLACEHOLDER><a href="contact.html"', '><a href="contact.html"')
                .replace('<li class="dropdown">\n                <a href="community.html"', '<li class="dropdown active">\n                <a href="community.html"');
            break;
        case 'contact':
            updatedNavHTML = updatedNavHTML
                .replace('CLASS_PLACEHOLDER><a href="index.html"', '><a href="index.html"')
                .replace('CLASS_PLACEHOLDER><a href="about.html"', '><a href="about.html"')
                .replace('CLASS_PLACEHOLDER><a href="contact.html"', 'class="active"><a href="contact.html"');
            break;
        case 'register':
            updatedNavHTML = updatedNavHTML
                .replace('CLASS_PLACEHOLDER><a href="index.html"', '><a href="index.html"')
                .replace('CLASS_PLACEHOLDER><a href="about.html"', '><a href="about.html"')
                .replace('CLASS_PLACEHOLDER><a href="contact.html"', '><a href="contact.html"');
            break;
        default:
            updatedNavHTML = updatedNavHTML
                .replace(/CLASS_PLACEHOLDER/g, '');
    }
    
    // Update navigation CSS if not already present
    if (!content.includes('css/navigation.css')) {
        content = content.replace(
            /<link rel="stylesheet" href="css\/main\.css">/,
            `${navigationCSS}\n    <link rel="stylesheet" href="css/main.css">`
        );
    }
    
    // Replace navigation section
    const navRegex = /<nav class="navbar"[\s\S]*?<\/nav>/;
    if (navRegex.test(content)) {
        content = content.replace(navRegex, updatedNavHTML);
    } else {
        console.log(`⚠️ Navigation section not found in ${filename}`);
        return;
    }
    
    // Add navigation JavaScript if not already present
    if (!content.includes('js/navigation.js')) {
        content = content.replace(
            /<\/body>/,
            `    ${navigationJS}\n</body>`
        );
    }
    
    // Write updated content back to file
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Updated ${filename}`);
}

function main() {
    console.log('🚀 Starting navigation update process...\n');
    
    // Update each file
    Object.entries(filesToUpdate).forEach(([filename, activePage]) => {
        updateHTMLFile(filename, activePage);
    });
    
    console.log('\n✨ Navigation update process complete!');
    console.log('\n📋 Manual steps still required:');
    console.log('1. Test navigation on all updated pages');
    console.log('2. Verify active page highlighting');
    console.log('3. Check mobile menu functionality');
    console.log('4. Validate accessibility features');
    console.log('5. Test keyboard navigation');
}

// Run the script
if (require.main === module) {
    main();
}

module.exports = { updateHTMLFile, navigationHTML };
