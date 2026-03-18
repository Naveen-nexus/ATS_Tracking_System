const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const skillsList = require('../data/skills');

/**
 * Extracts text from a resume buffer (PDF or DOCX)
 * @param {Buffer} buffer - The file buffer
 * @param {String} mimetype - The mimetype of the file
 * @returns {Promise<String>} - The extracted text
 */
const parseResume = async (buffer, mimetype) => {
  try {
    let text = '';
    if (mimetype === 'application/pdf') {
      const data = await pdfParse(buffer);
      text = data.text;
    } else if (
      mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      mimetype === 'application/msword'
    ) {
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    } else {
      throw new Error('Unsupported file format. Please upload PDF or DOCX.');
    }
    return text;
  } catch (error) {
    console.error('Error parsing resume:', error);
    throw new Error('Failed to parse resume content');
  }
};

/**
 * Extracts skills from text based on a predefined list
 * @param {String} text - The resume text
 * @returns {Array} - Array of extracted skills
 */
const extractSkills = (text) => {
  if (!text) return [];
  
  const extractedSkills = new Set();
  
  skillsList.forEach(skill => {
    // Escape special regex characters in skill name (e.g., C++, C#)
    const escapedSkill = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escapedSkill}\\b`, 'i');
    
    if (regex.test(text)) {
      extractedSkills.add(skill);
    }
  });
  
  return Array.from(extractedSkills);
};

module.exports = {
  parseResume,
  extractSkills
};
