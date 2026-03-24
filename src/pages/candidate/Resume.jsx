import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, CheckCircle, Trash2, Download, Eye, AlertCircle, User, Mail, Phone, MapPin, Code } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Tag } from '../../components/ui/Tag';
import { Badge } from '../../components/ui/Badge';
import toast from 'react-hot-toast';
import { resumeService } from '../../services/resumeService';

export const Resume = () => {
  const [uploading, setUploading] = useState(false);
  const [currentResume, setCurrentResume] = useState(null);
  const [extractedSkills, setExtractedSkills] = useState([]);
  
  // Dummy profile fields for now (could come from user profile API)
  const profileFields = [
    { label: 'Full Name', filled: true },
    { label: 'Email Address', filled: true },
    { label: 'Phone Number', filled: true },
  ];
  const completedFields = profileFields.filter(f => f.filled).length;

  // Fetch resume on mount
  useEffect(() => {
      const fetchResume = async () => {
          try {
              const data = await resumeService.getMyResume();
              if (data && data.resume) {
                  // data.resume contains fileUrl, fileName (maybe?), skillsExtracted
                  setCurrentResume({
                      name: 'My Resume', // Backend might not store original filename, check model
                      url: data.resume.fileUrl,
                      date: new Date(data.resume.createdAt).toLocaleDateString(),
                      skills: data.resume.skillsExtracted
                  });
                  setExtractedSkills(data.resume.skillsExtracted || []);
              }
          } catch (error) {
              // It's okay if no resume found initially
              console.log('No resume found');
          }
      };
      fetchResume();
  }, []);

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;
    if (file.type !== 'application/pdf' && file.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') { 
        toast.error('Please upload a PDF or DOCX file'); 
        return; 
    }
    
    setUploading(true);
    try {
        const response = await resumeService.uploadResume(file);
        
        // Backend returns { message, resume: { ... } }
        const newResume = response.resume;
        
        setCurrentResume({ 
            name: file.name, 
            url: newResume.fileUrl,
            date: new Date().toLocaleDateString(),
            skills: newResume.skillsExtracted 
        });
        setExtractedSkills(newResume.skillsExtracted || []);
        toast.success('Resume uploaded and parsed successfully!');
    } catch (error) {
        console.error('Upload failed:', error);
        toast.error('Resume upload failed.');
    } finally {
        setUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
      onDrop, 
      accept: { 
          'application/pdf': ['.pdf'],
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] 
      }, 
      maxFiles: 1 
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Resume Management</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Upload and manage your resume for job applications</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Upload Zone */}
          <Card>
            <CardHeader>
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">Upload Resume</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">PDF or DOCX format, max 5MB</p>
            </CardHeader>
            <CardBody>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${isDragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10' : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700/30'}`}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center gap-3">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center ${isDragActive ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-gray-100 dark:bg-gray-700'}`}>
                    <Upload size={22} className={isDragActive ? 'text-blue-600' : 'text-gray-400'} />
                  </div>
                  {isDragActive ? (
                    <p className="text-sm font-medium text-blue-600">Drop your file here...</p>
                  ) : (
                    <>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Drag & drop your resume here</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">or <span className="text-blue-600 dark:text-blue-400 font-medium">click to browse</span></p>
                    </>
                  )}
                </div>
              </div>
              {uploading && (
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>Uploading & Parsing...</span>
                    {/* Indeterminate progress since we don't have real upload progress event hooked up easily with simple fetch wrapper */}
                  </div>
                  <ProgressBar value={50} color="blue" size="md" /> 
                </div>
              )}
            </CardBody>
          </Card>

          {/* Current Resume Preview */}
          {currentResume && (
            <Card>
              <CardHeader className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-xl flex items-center justify-center">
                    <FileText size={18} className="text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{currentResume.name}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Uploaded {currentResume.date}</p>
                  </div>
                </div>
                <Badge variant="green" dot>Current</Badge>
              </CardHeader>
              
              <div className="flex gap-2 px-6 pb-6 pt-4">
                 {currentResume.url && (
                    <a href={currentResume.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 rounded text-sm hover:bg-gray-200 text-gray-700">
                        <Download size={14} /> Download/View
                    </a>
                 )}
              </div>
            </Card>
          )}

        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader><h2 className="text-base font-semibold text-gray-900 dark:text-white">Extracted Skills</h2></CardHeader>
            <CardBody>
              {extractedSkills.length > 0 ? (
                  <>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Skills detected from your resume</p>
                    <div className="flex flex-wrap gap-2">
                        {extractedSkills.map((s, i) => <Tag key={i} variant="blue">{s}</Tag>)}
                    </div>
                  </>
              ) : (
                  <p className="text-sm text-gray-500">No skills extracted yet. Upload a resume to see AI analysis.</p>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};
