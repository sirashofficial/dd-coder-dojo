#!/usr/bin/env node

/**
 * DD Coder Dojo - Content Synchronization Script
 * 
 * This script helps automate content updates across the website.
 * Run with: node scripts/sync-content.js
 * 
 * Features:
 * - Validates JSON data files
 * - Optimizes images
 * - Updates statistics
 * - Generates backups
 */

const fs = require('fs').promises;
const path = require('path');

class ContentSyncManager {
    constructor() {
        this.config = {
            dataDir: 'data',
            backupDir: 'backups',
            imageDir: 'images',
            maxImageSize: 500 * 1024, // 500KB
            requiredFields: {
                team: ['name', 'role', 'bio'],
                projects: ['title', 'student', 'description'],
                programs: ['name', 'ageRange', 'description']
            }
        };
        
        this.errors = [];
        this.warnings = [];
        this.stats = {
            filesProcessed: 0,
            imagesOptimized: 0,
            errorsFixed: 0
        };
    }

    async run() {
        console.log('🚀 Starting DD Coder Dojo content sync...\n');
        
        try {
            await this.createBackup();
            await this.validateDataFiles();
            await this.checkImages();
            await this.updateStatistics();
            
            this.showSummary();
            
        } catch (error) {
            console.error('❌ Content sync failed:', error);
            process.exit(1);
        }
    }

    async createBackup() {
        console.log('📦 Creating backup...');
        
        const timestamp = new Date().toISOString().split('T')[0];
        const backupPath = path.join(this.config.backupDir, `backup-${timestamp}`);
        
        try {
            await fs.mkdir(this.config.backupDir, { recursive: true });
            await fs.mkdir(backupPath, { recursive: true });
            
            // Backup data files
            const dataFiles = await fs.readdir(this.config.dataDir);
            for (const file of dataFiles) {
                if (file.endsWith('.json')) {
                    const srcPath = path.join(this.config.dataDir, file);
                    const destPath = path.join(backupPath, file);
                    await fs.copyFile(srcPath, destPath);
                }
            }
            
            console.log(`✅ Backup created: ${backupPath}\n`);
            
        } catch (error) {
            console.warn('⚠️ Backup failed:', error.message);
        }
    }

    async validateDataFiles() {
        console.log('🔍 Validating data files...');
        
        const dataFiles = ['team.json', 'projects.json', 'programs.json'];
        
        for (const fileName of dataFiles) {
            const filePath = path.join(this.config.dataDir, fileName);
            
            try {
                const fileContent = await fs.readFile(filePath, 'utf8');
                const data = JSON.parse(fileContent);
                
                const fileType = fileName.replace('.json', '');
                await this.validateDataStructure(data, fileType, fileName);
                
                console.log(`✅ ${fileName} - Valid`);
                this.stats.filesProcessed++;
                
            } catch (error) {
                if (error.code === 'ENOENT') {
                    console.log(`⚠️ ${fileName} - File not found, creating template...`);
                    await this.createTemplateFile(fileName);
                } else {
                    this.errors.push(`${fileName}: ${error.message}`);
                    console.log(`❌ ${fileName} - ${error.message}`);
                }
            }
        }
        
        console.log('');
    }

    async validateDataStructure(data, type, fileName) {
        if (!Array.isArray(data)) {
            throw new Error('Data must be an array');
        }

        const requiredFields = this.config.requiredFields[type] || [];
        
        data.forEach((item, index) => {
            // Check required fields
            for (const field of requiredFields) {
                if (!item[field] || item[field].trim() === '') {
                    this.warnings.push(`${fileName}[${index}]: Missing or empty '${field}'`);
                }
            }
            
            // Type-specific validations
            if (type === 'team') {
                this.validateTeamMember(item, index, fileName);
            } else if (type === 'projects') {
                this.validateProject(item, index, fileName);
            }
        });
    }

    validateTeamMember(member, index, fileName) {
        // Check image file exists
        if (member.image && !member.image.includes('placeholder')) {
            this.checkImageExists(member.image, `${fileName}[${index}]`);
        }
        
        // Validate social links
        if (member.social) {
            Object.entries(member.social).forEach(([platform, url]) => {
                if (url && url !== '#' && !this.isValidUrl(url)) {
                    this.warnings.push(`${fileName}[${index}]: Invalid ${platform} URL`);
                }
            });
        }
        
        // Check active status
        if (member.active === undefined) {
            member.active = true; // Default to active
            this.stats.errorsFixed++;
        }
    }

    validateProject(project, index, fileName) {
        // Check required age range
        if (project.age && (project.age < 7 || project.age > 17)) {
            this.warnings.push(`${fileName}[${index}]: Age ${project.age} outside 7-17 range`);
        }
        
        // Validate status
        const validStatuses = ['completed', 'in-progress', 'archived'];
        if (project.status && !validStatuses.includes(project.status)) {
            this.warnings.push(`${fileName}[${index}]: Invalid status '${project.status}'`);
        }
    }

    async checkImageExists(imagePath, context) {
        try {
            await fs.access(imagePath);
        } catch {
            this.warnings.push(`${context}: Image not found - ${imagePath}`);
        }
    }

    isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch {
            return false;
        }
    }

    async checkImages() {
        console.log('🖼️ Checking images...');
        
        const imageDirectories = ['mentors', 'projects', 'programs', 'events'];
        
        for (const dir of imageDirectories) {
            const dirPath = path.join(this.config.imageDir, dir);
            
            try {
                const files = await fs.readdir(dirPath);
                
                for (const file of files) {
                    if (this.isImageFile(file)) {
                        await this.checkImageSize(path.join(dirPath, file));
                    }
                }
                
                console.log(`✅ ${dir}/ - ${files.length} images checked`);
                
            } catch (error) {
                if (error.code === 'ENOENT') {
                    console.log(`⚠️ ${dir}/ - Directory not found`);
                    await fs.mkdir(dirPath, { recursive: true });
                } else {
                    this.warnings.push(`Error checking ${dir}: ${error.message}`);
                }
            }
        }
        
        console.log('');
    }

    async checkImageSize(imagePath) {
        try {
            const stats = await fs.stat(imagePath);
            
            if (stats.size > this.config.maxImageSize) {
                this.warnings.push(
                    `Large image: ${imagePath} (${Math.round(stats.size / 1024)}KB > 500KB)`
                );
            }
            
        } catch (error) {
            this.warnings.push(`Error checking ${imagePath}: ${error.message}`);
        }
    }

    isImageFile(filename) {
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
        return imageExtensions.some(ext => 
            filename.toLowerCase().endsWith(ext)
        );
    }

    async updateStatistics() {
        console.log('📊 Updating statistics...');
        
        try {
            // Load data files to calculate stats
            const teamData = await this.loadJsonFile('team.json');
            const projectsData = await this.loadJsonFile('projects.json');
            
            const currentStats = {
                totalTeamMembers: teamData.filter(m => m.active !== false).length,
                totalProjects: projectsData.length,
                completedProjects: projectsData.filter(p => p.status === 'completed').length,
                activePrograms: 3, // Junior, Intermediate, Senior
                lastUpdated: new Date().toISOString()
            };
            
            // Save statistics file
            const statsPath = path.join(this.config.dataDir, 'statistics.json');
            await fs.writeFile(statsPath, JSON.stringify(currentStats, null, 2));
            
            console.log('✅ Statistics updated:', currentStats);
            console.log('');
            
        } catch (error) {
            this.warnings.push(`Statistics update failed: ${error.message}`);
        }
    }

    async loadJsonFile(fileName) {
        try {
            const filePath = path.join(this.config.dataDir, fileName);
            const content = await fs.readFile(filePath, 'utf8');
            return JSON.parse(content);
        } catch (error) {
            console.warn(`⚠️ Could not load ${fileName}:`, error.message);
            return [];
        }
    }

    async createTemplateFile(fileName) {
        const templates = {
            'team.json': [
                {
                    "id": 1,
                    "name": "Sample Team Member",
                    "role": "Peer Mentor",
                    "bio": "Description of team member goes here.",
                    "image": "images/mentors/placeholder.jpg",
                    "email": "",
                    "social": {
                        "linkedin": "#",
                        "github": "#",
                        "twitter": "#"
                    },
                    "featured": true,
                    "active": true,
                    "joinDate": new Date().toISOString().split('T')[0]
                }
            ],
            'projects.json': [
                {
                    "id": 1,
                    "title": "Sample Project",
                    "student": "Student Name",
                    "age": 12,
                    "program": "Code Explorers",
                    "description": "Description of the project goes here.",
                    "technologies": ["Scratch", "Logic"],
                    "category": "scratch",
                    "image": "images/projects/placeholder.jpg",
                    "difficulty": "Beginner",
                    "likes": 0,
                    "views": 0,
                    "completionDate": new Date().toISOString().split('T')[0],
                    "featured": false,
                    "status": "completed"
                }
            ],
            'programs.json': [
                {
                    "id": "junior",
                    "name": "Junior Ninjas",
                    "ageRange": "7-10",
                    "description": "Start your coding adventure with visual programming!",
                    "level": "Beginner",
                    "technologies": ["Scratch", "Basic Computer Skills"],
                    "schedule": {
                        "days": ["Thursday", "Friday"],
                        "times": ["14:00-15:00", "13:00-15:00"]
                    },
                    "active": true
                }
            ]
        };

        const template = templates[fileName];
        if (template) {
            const filePath = path.join(this.config.dataDir, fileName);
            await fs.writeFile(filePath, JSON.stringify(template, null, 2));
            console.log(`✅ Created template: ${fileName}`);
            this.stats.errorsFixed++;
        }
    }

    showSummary() {
        console.log('📋 Content Sync Summary');
        console.log('========================');
        console.log(`Files processed: ${this.stats.filesProcessed}`);
        console.log(`Images checked: ${this.stats.imagesOptimized}`);
        console.log(`Issues auto-fixed: ${this.stats.errorsFixed}`);
        console.log('');

        if (this.errors.length > 0) {
            console.log('❌ Errors (need manual fix):');
            this.errors.forEach(error => console.log(`  • ${error}`));
            console.log('');
        }

        if (this.warnings.length > 0) {
            console.log('⚠️ Warnings (should review):');
            this.warnings.forEach(warning => console.log(`  • ${warning}`));
            console.log('');
        }

        if (this.errors.length === 0 && this.warnings.length === 0) {
            console.log('✅ All content is valid and up to date!');
        }

        console.log('🚀 Content sync completed!\n');
    }
}

// Run the script
if (require.main === module) {
    const syncManager = new ContentSyncManager();
    syncManager.run().catch(error => {
        console.error('Fatal error:', error);
        process.exit(1);
    });
}

module.exports = ContentSyncManager;