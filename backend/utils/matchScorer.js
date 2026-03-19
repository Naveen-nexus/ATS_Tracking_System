/**
 * Calculate match score between resume skills and job required skills
 * @param {Array<String>} resumeSkills - Skills extracted from resume
 * @param {Array<String>} jobSkills - Skills required for the job
 * @returns {Object} - Match score (0-100), missing skills, and matched skills
 */
const calculateMatchScore = (resumeSkills = [], jobSkills = []) => {
  if (!jobSkills || jobSkills.length === 0) {
    return { score: 100, matchedSkills: [], missingSkills: [] };
  }

  // Normalize skills to lowercase for better matching
  const normalizedResumeSkills = new Set(resumeSkills.map(s => s.toLowerCase()));
  const normalizedJobSkills = jobSkills.map(s => s.toLowerCase());

  const matchedSkills = [];
  const missingSkills = [];

  normalizedJobSkills.forEach((jobSkill, index) => {
    if (normalizedResumeSkills.has(jobSkill)) {
      matchedSkills.push(jobSkills[index]);
    } else {
      missingSkills.push(jobSkills[index]);
    }
  });

  const score = Math.round((matchedSkills.length / jobSkills.length) * 100);

  return {
    score,
    matchedSkills,
    missingSkills
  };
};

module.exports = {
  calculateMatchScore
};
