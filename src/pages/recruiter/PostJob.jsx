import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, X, Eye, Save, Send, ChevronDown } from 'lucide-react';
import { Card, CardHeader, CardBody, CardFooter } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Tag } from '../../components/ui/Tag';
import { Modal } from '../../components/ui/Modal';
import toast from 'react-hot-toast';
import { jobService } from '../../services/jobService';

const skillSuggestions = ['React', 'Node.js', 'Python', 'JavaScript', 'TypeScript', 'AWS', 'Docker', 'PostgreSQL', 'MongoDB', 'GraphQL', 'Vue.js', 'Angular', 'Java', 'Go', 'Kubernetes', 'Terraform'];

export const PostJob = () => {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  // Default deadline 30 days from now
  const defaultDeadline = new Date();
  defaultDeadline.setDate(defaultDeadline.getDate() + 30);

  const [form, setForm] = useState({
    title: '',
    company: '',
    location: '',
    type: 'Remote',
    experience: [1, 5],
    salary: [60000, 120000],
    skills: [],
    description: '',
    deadline: defaultDeadline.toISOString().split('T')[0],
  });

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const addSkill = (s) => {
    const trimmed = s.trim();
    if (trimmed && !form.skills.includes(trimmed)) set('skills', [...form.skills, trimmed]);
    setSkillInput('');
  };

  const handleSkillKeyDown = (e) => { 
      if (e.key === 'Enter' || e.key === ',') { 
          e.preventDefault(); 
          if(skillInput) addSkill(skillInput); 
      } 
  };

  const handleDraft = async () => {
    setSaving(true);
    // TODO: Implement save draft API if available
    await new Promise(r => setTimeout(r, 800));
    setSaving(false);
    toast.success('Job saved as draft!');
  };

  const handlePublish = async () => {
    if (!form.title || !form.company || !form.description || !form.location) { 
        toast.error('Please fill in required fields'); 
        return; 
    }

    try {
        setPublishing(true);
        const jobData = {
            title: form.title,
            companyName: form.company,
            location: form.location,
            jobType: form.type,
            experienceMin: form.experience[0],
            experienceMax: form.experience[1],
            salaryMin: form.salary[0],
            salaryMax: form.salary[1],
            skillsRequired: form.skills,
            description: form.description,
            deadline: form.deadline
        };

        await jobService.createJob(jobData);
        toast.success('Job published successfully!');
        navigate('/recruiter/dashboard'); // Redirect to dashboard or jobs list
    } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.message || 'Failed to publish job');
    } finally {
        setPublishing(false);
    }
  };

  const fmtSalary = (n) => n >= 1000 ? `$${(n / 1000).toFixed(0)}k` : `$${n}`;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Post a New Job</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Fill in the details to attract the right candidates</p>
        </div>
        <Button variant="secondary" size="sm" onClick={() => setPreviewOpen(true)} className="flex items-center gap-1.5"><Eye size={14} /> Preview</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader><h2 className="text-base font-semibold text-gray-900 dark:text-white">Basic Information</h2></CardHeader>
            <CardBody className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Job Title <span className="text-red-500">*</span></label>
                  <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Senior Frontend Developer" className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company Name <span className="text-red-500">*</span></label>
                  <input value={form.company} onChange={e => set('company', e.target.value)} placeholder="Your company name" className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location <span className="text-red-500">*</span></label>
                  <input value={form.location} onChange={e => set('location', e.target.value)} placeholder="e.g. San Francisco, CA or Remote" className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Job Type</label>
                  <div className="relative">
                    <select value={form.type} onChange={e => set('type', e.target.value)} className="w-full appearance-none px-3 py-2.5 pr-8 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      {['Remote', 'Onsite', 'Hybrid'].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <ChevronDown size={16} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                 <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Deadline</label>
                  <input type="date" value={form.deadline} onChange={e => set('deadline', e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400" />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h2 className="text-base font-semibold text-gray-900 dark:text-white">Salary & Experience</h2></CardHeader>
            <CardBody className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Salary Range</label>
                  <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">{fmtSalary(form.salary[0])} – {fmtSalary(form.salary[1])}</span>
                </div>
                <div className="flex gap-4 items-center">
                  <input type="range" min={20000} max={300000} step={5000} value={form.salary[0]} onChange={e => set('salary', [+e.target.value, form.salary[1]])} className="flex-1 accent-blue-600" />
                  <input type="range" min={20000} max={300000} step={5000} value={form.salary[1]} onChange={e => set('salary', [form.salary[0], +e.target.value])} className="flex-1 accent-blue-600" />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Experience Range (years)</label>
                  <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">{form.experience[0]} – {form.experience[1]} yrs</span>
                </div>
                <div className="flex gap-4 items-center">
                  <input type="range" min={0} max={15} value={form.experience[0]} onChange={e => set('experience', [+e.target.value, form.experience[1]])} className="flex-1 accent-blue-600" />
                  <input type="range" min={0} max={15} value={form.experience[1]} onChange={e => set('experience', [form.experience[0], +e.target.value])} className="flex-1 accent-blue-600" />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h2 className="text-base font-semibold text-gray-900 dark:text-white">Required Skills</h2></CardHeader>
            <CardBody className="space-y-3">
              <div className="flex flex-wrap gap-2 min-h-8">
                {form.skills.map(s => <Tag key={s} variant="blue" onRemove={() => set('skills', form.skills.filter(sk => sk !== s))}>{s}</Tag>)}
              </div>
              <div className="flex gap-2">
                <input value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={handleSkillKeyDown} placeholder="Type skill and press Enter..." className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400" />
                <Button size="sm" variant="secondary" onClick={() => addSkill(skillInput)}><Plus size={14} /></Button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <p className="w-full text-xs text-gray-400 dark:text-gray-500">Quick add:</p>
                {skillSuggestions.filter(s => !form.skills.includes(s)).slice(0, 8).map(s => (
                  <button key={s} onClick={() => addSkill(s)} className="text-xs px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">{s}</button>
                ))}
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h2 className="text-base font-semibold text-gray-900 dark:text-white">Job Description & Details</h2></CardHeader>
            <CardBody className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Job Description <span className="text-red-500">*</span></label>
                <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={6} placeholder="Describe the role, responsibilities, and company culture..." className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Requirements</label>
                <textarea value={form.requirements} onChange={e => set('requirements', e.target.value)} rows={4} placeholder="List required qualifications, experience, and certifications..." className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Benefits & Perks</label>
                <textarea value={form.benefits} onChange={e => set('benefits', e.target.value)} rows={3} placeholder="Health insurance, equity, remote work policy..." className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 resize-none" />
              </div>
            </CardBody>
            <CardFooter className="flex items-center justify-between gap-3 flex-wrap">
              <Button variant="ghost" size="sm" loading={saving} onClick={handleDraft}><Save size={14} /> Save Draft</Button>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" onClick={() => setPreviewOpen(true)}><Eye size={14} /> Preview</Button>
                <Button size="sm" loading={publishing} onClick={handlePublish}><Send size={14} /> Publish Job</Button>
              </div>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-4">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">Job Preview</h3>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <p><strong className="text-gray-800 dark:text-gray-200">{form.title || 'Job Title'}</strong></p>
              <p>{form.company || 'Company Name'}</p>
              <p>{form.location || 'Location'}</p>
              <p>{form.type}</p>
              <p className="text-blue-600 dark:text-blue-400 font-medium">{fmtSalary(form.salary[0])} – {fmtSalary(form.salary[1])}</p>
              <p>{form.experience[0]}–{form.experience[1]} years exp.</p>
              {form.skills.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {form.skills.slice(0, 5).map(s => <span key={s} className="text-xs px-2 py-0.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full">{s}</span>)}
                </div>
              )}
            </div>
          </Card>
          <Card className="p-4">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">Tips for better results</h3>
            <ul className="space-y-2 text-xs text-gray-500 dark:text-gray-400">
              {['Add specific technical skills to attract matching candidates','Write a clear job description for better ATS scoring','Set competitive salary to attract top talent','Include info about your company culture'].map((tip, i) => (
                <li key={i} className="flex items-start gap-1.5"><span className="text-blue-500 font-bold mt-0.5">•</span>{tip}</li>
              ))}
            </ul>
          </Card>
        </div>
      </div>

      <Modal isOpen={previewOpen} onClose={() => setPreviewOpen(false)} title="Job Preview" size="lg">
        <div className="p-6 space-y-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{form.title || 'Job Title'}</h2>
            <p className="text-gray-500 dark:text-gray-400">{form.company} • {form.location} • {form.type}</p>
            <p className="text-blue-600 font-semibold mt-1">{fmtSalary(form.salary[0])} – {fmtSalary(form.salary[1])} / year</p>
          </div>
          {form.skills.length > 0 && <div className="flex flex-wrap gap-2">{form.skills.map(s => <Tag key={s} variant="blue">{s}</Tag>)}</div>}
          {form.description && <div><h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">Description</h3><p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{form.description}</p></div>}
          <div className="flex gap-2 pt-2">
            <Button onClick={handlePublish} loading={publishing}>Publish Now</Button>
            <Button variant="secondary" onClick={() => setPreviewOpen(false)}>Close Preview</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
