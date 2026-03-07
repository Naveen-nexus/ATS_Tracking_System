import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, CheckCircle, Trash2, Download, Eye, AlertCircle, User, Mail, Phone, MapPin, Code } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Tag } from '../../components/ui/Tag';
import { Badge } from '../../components/ui/Badge';
import toast from 'react-hot-toast';

const extractedSkills = ['React', 'TypeScript', 'Node.js', 'JavaScript', 'CSS', 'Git', 'REST APIs', 'PostgreSQL'];

const profileFields = [
  { label: 'Full Name', filled: true, icon: User },
  { label: 'Email Address', filled: true, icon: Mail },
  { label: 'Phone Number', filled: true, icon: Phone },
  { label: 'Location', filled: false, icon: MapPin },
  { label: 'LinkedIn URL', filled: false, icon: Code },
  { label: 'Portfolio URL', filled: false, icon: Code },
];

const uploadHistory = [
  { name: 'Resume_v3_Jan2024.pdf', size: '245 KB', date: '2024-01-15', current: true },
  { name: 'Resume_v2_Dec2023.pdf', size: '238 KB', date: '2023-12-01', current: false },
];

export const Resume = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentResume, setCurrentResume] = useState(uploadHistory[0]);

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;
    if (file.type !== 'application/pdf') { toast.error('Please upload a PDF file only'); return; }
    setUploading(true);
    setUploadProgress(0);
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(r => setTimeout(r, 80));
      setUploadProgress(i);
    }
    setCurrentResume({ name: file.name, size: `${Math.round(file.size / 1024)} KB`, date: new Date().toISOString().split('T')[0], current: true });
    setUploading(false);
    toast.success('Resume uploaded successfully!');
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'application/pdf': ['.pdf'] }, maxFiles: 1 });
  const completedFields = profileFields.filter(f => f.filled).length;
  const completionPct = Math.round((completedFields / profileFields.length) * 100);

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
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">PDF format only, max 5MB</p>
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
                    <p className="text-sm font-medium text-blue-600">Drop your PDF here...</p>
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
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <ProgressBar value={uploadProgress} color="blue" size="md" />
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
                    <p className="text-xs text-gray-500 dark:text-gray-400">{currentResume.size} • Uploaded {currentResume.date}</p>
                  </div>
                </div>
                <Badge variant="green" dot>Current</Badge>
              </CardHeader>
              <div className="bg-gray-50 dark:bg-gray-700/30 mx-6 mb-6 rounded-xl h-64 flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-600">
                <div className="text-center">
                  <Eye size={24} className="text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-400 dark:text-gray-500">PDF Preview</p>
                  <p className="text-xs text-gray-300 dark:text-gray-600 mt-1">Preview will display here</p>
                </div>
              </div>
              <div className="flex gap-2 px-6 pb-6">
                <Button size="sm" variant="secondary" className="flex items-center gap-1.5"><Eye size={14} /> Preview</Button>
                <Button size="sm" variant="secondary" className="flex items-center gap-1.5"><Download size={14} /> Download</Button>
                <Button size="sm" variant="danger" className="flex items-center gap-1.5 ml-auto"><Trash2 size={14} /> Remove</Button>
              </div>
            </Card>
          )}

          {/* Upload History */}
          <Card>
            <CardHeader><h2 className="text-base font-semibold text-gray-900 dark:text-white">Upload History</h2></CardHeader>
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {uploadHistory.map((f, i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-3.5">
                  <FileText size={16} className="text-red-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{f.name}</p>
                    <p className="text-xs text-gray-400">{f.size} • {f.date}</p>
                  </div>
                  {f.current ? <Badge variant="green" dot>Active</Badge> : <button className="text-xs text-blue-600 hover:underline">Restore</button>}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">Profile Completion</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <ProgressBar value={completedFields} max={profileFields.length} showValue color={completionPct >= 80 ? 'green' : 'yellow'} size="lg" />
              <p className="text-xs text-gray-500 dark:text-gray-400">{completedFields}/{profileFields.length} fields completed</p>
              <div className="space-y-2.5">
                {profileFields.map(f => (
                  <div key={f.label} className="flex items-center gap-2">
                    {f.filled ? <CheckCircle size={15} className="text-green-500 flex-shrink-0" /> : <AlertCircle size={15} className="text-yellow-500 flex-shrink-0" />}
                    <span className={`text-sm ${f.filled ? 'text-gray-700 dark:text-gray-300' : 'text-yellow-600 dark:text-yellow-400'}`}>{f.label}</span>
                    {!f.filled && <span className="ml-auto text-xs text-blue-600 dark:text-blue-400 cursor-pointer hover:underline">Add</span>}
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h2 className="text-base font-semibold text-gray-900 dark:text-white">Extracted Skills</h2></CardHeader>
            <CardBody>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Skills detected from your resume</p>
              <div className="flex flex-wrap gap-2">
                {extractedSkills.map(s => <Tag key={s} variant="blue">{s}</Tag>)}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};
