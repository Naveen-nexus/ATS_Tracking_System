import { useState } from 'react';
import { Camera, Plus, X, Save, User, Mail, Phone, MapPin, Globe, Linkedin, Code2 } from 'lucide-react';
import { Card, CardHeader, CardBody, CardFooter } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Tag } from '../../components/ui/Tag';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const availableSkills = ['React', 'Node.js', 'Python', 'TypeScript', 'JavaScript', 'AWS', 'Docker', 'PostgreSQL', 'MongoDB', 'GraphQL', 'Vue.js', 'Angular', 'Java', 'Go'];

export const Profile = () => {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    title: 'Senior Frontend Developer',
    bio: 'Passionate frontend developer with 4+ years of experience building modern web applications. I love crafting pixel-perfect UIs and working on impactful products.',
    linkedin: 'linkedin.com/in/janesmith',
    github: 'github.com/janesmith',
    portfolio: 'janesmith.dev',
    skills: ['React', 'TypeScript', 'Node.js', 'JavaScript', 'CSS'],
    experience: '4 Years',
    education: "Bachelor's in Computer Science",
  });
  const [newSkill, setNewSkill] = useState('');

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    updateUser({ name: form.name, email: form.email });
    setEditing(false);
    setSaving(false);
    toast.success('Profile updated!');
  };

  const addSkill = (skill) => {
    if (!form.skills.includes(skill)) setForm(f => ({ ...f, skills: [...f.skills, skill] }));
  };

  const removeSkill = (skill) => setForm(f => ({ ...f, skills: f.skills.filter(s => s !== skill) }));

  const completionPct = 75;
  const fields = [
    { label: 'Name', value: form.name, icon: User, key: 'name' },
    { label: 'Email', value: form.email, icon: Mail, key: 'email' },
    { label: 'Phone', value: form.phone, icon: Phone, key: 'phone' },
    { label: 'Location', value: form.location, icon: MapPin, key: 'location' },
    { label: 'LinkedIn', value: form.linkedin, icon: Linkedin, key: 'linkedin' },
    { label: 'Portfolio', value: form.portfolio, icon: Globe, key: 'portfolio' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Manage your personal information and skills</p>
        </div>
        {!editing ? (
          <Button onClick={() => setEditing(true)} variant="secondary">Edit Profile</Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => setEditing(false)}>Cancel</Button>
            <Button loading={saving} onClick={handleSave}><Save size={14} /> Save Changes</Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-xl font-bold">
                    {form.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  {editing && (
                    <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors">
                      <Camera size={12} />
                    </button>
                  )}
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{form.name}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{form.title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{form.location}</p>
                </div>
              </div>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {fields.map(f => (
                  <div key={f.key}>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{f.label}</label>
                    <div className="relative">
                      <f.icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        value={form[f.key]}
                        onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                        disabled={!editing}
                        className="w-full pl-8 pr-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 disabled:bg-gray-50 dark:disabled:bg-gray-750 disabled:text-gray-500 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Bio</label>
                <textarea
                  value={form.bio}
                  onChange={e => setForm(p => ({ ...p, bio: e.target.value }))}
                  disabled={!editing}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 disabled:bg-gray-50 dark:disabled:bg-gray-750 disabled:text-gray-500 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h2 className="text-base font-semibold text-gray-900 dark:text-white">Skills</h2></CardHeader>
            <CardBody className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {form.skills.map(s => (
                  <Tag key={s} variant="blue" onRemove={editing ? () => removeSkill(s) : undefined}>{s}</Tag>
                ))}
              </div>
              {editing && (
                <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                  <p className="w-full text-xs text-gray-500 dark:text-gray-400 mb-1">Add skills:</p>
                  {availableSkills.filter(s => !form.skills.includes(s)).map(s => (
                    <button key={s} onClick={() => addSkill(s)} className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                      <Plus size={10} />{s}
                    </button>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><h2 className="text-base font-semibold text-gray-900 dark:text-white">Profile Strength</h2></CardHeader>
            <CardBody className="space-y-4">
              <ProgressBar value={completionPct} showValue color={completionPct >= 80 ? 'green' : 'yellow'} size="lg" />
              <p className="text-xs text-gray-500 dark:text-gray-400">Complete your profile to improve job matching accuracy.</p>
              <div className="space-y-2">
                {[{ label: 'Add phone number', done: true }, { label: 'Upload resume', done: true }, { label: 'Add LinkedIn URL', done: false }, { label: 'Add portfolio', done: false }].map(item => (
                  <div key={item.label} className={`flex items-center gap-2 text-xs ${item.done ? 'text-gray-400 dark:text-gray-500 line-through' : 'text-gray-600 dark:text-gray-400'}`}>
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${item.done ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-600'}`}>
                      {item.done && <X size={8} className="text-white" />}
                    </div>
                    {item.label}
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h2 className="text-base font-semibold text-gray-900 dark:text-white">Quick Stats</h2></CardHeader>
            <CardBody className="space-y-3">
              {[
                { label: 'Experience', value: form.experience },
                { label: 'Education', value: form.education },
                { label: 'Skills', value: `${form.skills.length} added` },
                { label: 'Applications', value: '5 total' },
              ].map(stat => (
                <div key={stat.label} className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</span>
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{stat.value}</span>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};
