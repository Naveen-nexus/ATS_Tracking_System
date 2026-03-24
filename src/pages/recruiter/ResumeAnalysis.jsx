import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, FileText, CheckCircle, XCircle, ChevronDown, Save } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Tag } from '../../components/ui/Tag';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Avatar } from '../../components/ui/Avatar';
import { applicationService } from '../../services/applicationService';
import toast from 'react-hot-toast';

// Helper for color from initials
const colorPalette = ['#3b82f6','#8b5cf6','#10b981','#f59e0b','#ef4444','#ec4899'];

// Mock breakdown logic since backend only gives total score
const getMatchBreakdown = (score) => [
  { label: 'Technical Skills', score: Math.min(100, score + 5), weight: '40%' },
  { label: 'Experience Level', score: Math.max(0, score - 5), weight: '30%' },
  { label: 'Education', score: score, weight: '15%' },
  { label: 'Keywords Match', score: Math.max(0, score - 10), weight: '15%' },
];

export const ResumeAnalysis = () => {
  const { id } = useParams(); // application ID
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('Applied');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchApp = async () => {
        try {
            const data = await applicationService.getApplicationById(id);
            setApplication(data);
            setStatus(data.status);
            setNotes(data.notes || '');
        } catch (err) {
            toast.error('Failed to load application details');
            navigate('/recruiter/applicants');
        } finally {
            setLoading(false);
        }
    };
    fetchApp();
  }, [id, navigate]);

  const handleSave = async () => {
    try {
        setSaving(true);
        await applicationService.updateStatus(id, status, notes);
        toast.success('Candidate notes and status saved!');
    } catch(err) {
        toast.error('Failed to save changes');
    } finally {
        setSaving(false);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading analysis...</div>;
  if (!application) return null;

  const candidate = application.candidateId;
  const job = application.jobId;
  const matchBreakdown = getMatchBreakdown(application.matchScore || 0);
  const reqSkills = job.requiredSkills || [];
  const matchedSkills = reqSkills.filter(s => (candidate.skills || []).some(cs => cs.toLowerCase() === s.toLowerCase()));
  const missingSkills = reqSkills.filter(s => !(candidate.skills || []).some(cs => cs.toLowerCase() === s.toLowerCase()));

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
        <ArrowLeft size={16} /> Back to Applicants
      </button>

      <Card className="p-6">
        <div className="flex items-start gap-4 flex-wrap">
          <Avatar initials={candidate.avatar || candidate.name[0]} color={colorPalette[0]} size="xl" />
          <div className="flex-1">
            <div className="flex justify-between items-start flex-wrap gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{candidate.name}</h1>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 dark:text-gray-400 mt-1">
                  <span>{candidate.email}</span>
                  <span>•</span>
                  <span>{candidate.experienceYears || 0} years exp</span>
                  <span>•</span>
                  <span>{candidate.location || 'Location N/A'}</span>
                </div>
                <div className="mt-2 text-sm text-blue-600 dark:text-blue-400 font-medium">
                  Applied for: {job.title}
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="gap-2">
                  <Download size={16} /> Resume
                </Button>
                <Button className="gap-2" onClick={handleSave} isLoading={saving}>
                  <Save size={16} /> Save Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Analysis Breakdown */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">AI Match Score</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-3xl font-bold ${application.matchScore >= 80 ? 'text-green-600' : application.matchScore >= 60 ? 'text-yellow-600' : 'text-red-500'}`}>
                  {application.matchScore}%
                </span>
                <span className="text-sm text-gray-500">Overall Match</span>
              </div>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                {matchBreakdown.map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700 dark:text-gray-300">{item.label}</span>
                      <span className="text-gray-500">{item.score}% (Weight: {item.weight})</span>
                    </div>
                    <ProgressBar value={item.score} color={item.score >= 80 ? 'green' : item.score >= 60 ? 'yellow' : 'red'} size="md" />
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Skills Analysis */}
          <Card>
            <CardHeader><h3 className="text-lg font-semibold text-gray-900 dark:text-white">Skills Analysis</h3></CardHeader>
            <CardBody>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-green-700 dark:text-green-400 mb-2 flex items-center gap-2">
                    <CheckCircle size={16} /> Matched Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {matchedSkills.length > 0 ? matchedSkills.map(skill => (
                      <Tag key={skill} variant="success">{skill}</Tag>
                    )) : <span className="text-sm text-gray-500">No direct skill matches found.</span>}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-red-700 dark:text-red-400 mb-2 flex items-center gap-2">
                    <XCircle size={16} /> Missing / Unlisted Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {missingSkills.length > 0 ? missingSkills.map(skill => (
                      <Tag key={skill} variant="error">{skill}</Tag>
                    )) : <span className="text-sm text-gray-500">All required skills present!</span>}
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Action Card */}
          <Card>
            <CardHeader><h3 className="text-base font-semibold text-gray-900 dark:text-white">Application Action</h3></CardHeader>
            <CardBody className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Status</label>
                <div className="relative">
                  <select 
                    value={status} 
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full appearance-none pl-3 pr-10 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                   {['Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Rejected', 'Selected'].map(s => (
                       <option key={s} value={s}>{s}</option>
                   ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Recruiter Notes</label>
                <textarea 
                  rows={6} 
                  placeholder="Add private notes about this candidate..." 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
                />
              </div>

              <Button fullWidth onClick={handleSave} isLoading={saving}>Save Updates</Button>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{candidate.name}</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{candidate.email}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">{candidate.experience} experience</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className={`text-2xl font-bold px-4 py-2 rounded-xl ${candidate.matchScore >= 80 ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' : 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400'}`}>
                  {candidate.matchScore}%
                </div>
                <span className="text-xs text-gray-400 dark:text-gray-500">Match Score</span>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {candidate.skills.map(s => <Tag key={s} variant="blue">{s}</Tag>)}
            </div>
          </div>
        </div>
        <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex-wrap">
          <Button size="sm" variant="secondary" className="flex items-center gap-1.5"><Download size={14} /> Download Resume</Button>
          <Button size="sm" variant="secondary" className="flex items-center gap-1.5"><FileText size={14} /> View PDF</Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* PDF Viewer Placeholder */}
          <Card>
            <CardHeader><h2 className="text-base font-semibold text-gray-900 dark:text-white">Resume</h2></CardHeader>
            <div className="mx-6 mb-6 bg-gray-50 dark:bg-gray-700/30 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-600 h-80 flex items-center justify-center">
              <div className="text-center">
                <FileText size={32} className="text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-sm text-gray-400 dark:text-gray-500">Resume PDF Viewer</p>
                <p className="text-xs text-gray-300 dark:text-gray-600 mt-1">{candidate.name}_Resume.pdf</p>
              </div>
            </div>
          </Card>

          {/* Match Breakdown */}
          <Card>
            <CardHeader>
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">Match Score Breakdown</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Detailed analysis of candidate fit</p>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Overall Match:</span>
                <div className="flex-1">
                  <ProgressBar value={candidate.matchScore} color={candidate.matchScore >= 80 ? 'green' : 'yellow'} size="lg" showValue />
                </div>
              </div>
              {matchBreakdown.map(item => (
                <div key={item.label} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">{item.label} <span className="text-xs text-gray-400 dark:text-gray-500">({item.weight})</span></span>
                    <span className={`font-semibold ${item.score >= 80 ? 'text-green-600' : 'text-yellow-600'}`}>{item.score}%</span>
                  </div>
                  <ProgressBar value={item.score} color={item.score >= 80 ? 'green' : 'yellow'} size="sm" />
                </div>
              ))}
            </CardBody>
          </Card>

          {/* Skill Analysis */}
          <Card>
            <CardHeader><h2 className="text-base font-semibold text-gray-900 dark:text-white">Skill Analysis</h2></CardHeader>
            <CardBody className="space-y-4">
              {matchedSkills.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1.5"><CheckCircle size={15} className="text-green-500" />Matched Required Skills ({matchedSkills.length}/{reqSkills.length})</p>
                  <div className="flex flex-wrap gap-2">{matchedSkills.map(s => <Tag key={s} variant="green">{s}</Tag>)}</div>
                </div>
              )}
              {missingSkills.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1.5"><XCircle size={15} className="text-red-500" />Missing Required Skills ({missingSkills.length})</p>
                  <div className="flex flex-wrap gap-2">{missingSkills.map(s => <Tag key={s} variant="red">{s}</Tag>)}</div>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Additional Skills</p>
                <div className="flex flex-wrap gap-2">{candidate.skills.filter(s => !reqSkills.includes(s)).map(s => <Tag key={s} variant="gray">{s}</Tag>)}</div>
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><h2 className="text-base font-semibold text-gray-900 dark:text-white">Update Status</h2></CardHeader>
            <CardBody className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Application Status</label>
                <div className="relative">
                  <select value={status} onChange={e => setStatus(e.target.value)} className="w-full appearance-none px-3 py-2.5 pr-8 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {['Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected'].map(s => <option key={s}>{s}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Internal Notes</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={5} placeholder="Add notes about this candidate..." className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
              </div>
              <Button loading={saving} onClick={handleSave} className="w-full"><Save size={14} /> Save Changes</Button>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h2 className="text-base font-semibold text-gray-900 dark:text-white">Experience Summary</h2></CardHeader>
            <CardBody className="space-y-3">
              {[
                { label: 'Total Experience', value: candidate.experience },
                { label: 'Skills Count', value: `${candidate.skills.length} skills` },
                { label: 'Match Score', value: `${candidate.matchScore}%` },
                { label: 'Applied Date', value: new Date(candidate.appliedDate || '2024-01-17').toLocaleDateString() },
              ].map(item => (
                <div key={item.label} className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">{item.label}</span>
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{item.value}</span>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};
