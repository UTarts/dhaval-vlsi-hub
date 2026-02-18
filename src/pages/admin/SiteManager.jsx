import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Plus, Trash2, Edit, Loader2, Image as ImageIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

export default function SiteManager() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // State for Pages
  const [homeData, setHomeData] = useState({ stats: [] });
  const [aboutData, setAboutData] = useState({ bio_paragraphs: [], experiences: [], skills: [], education: [] });
  const [contactData, setContactData] = useState({ social_links: [] });

  // State for DB Tables
  const [projects, setProjects] = useState([]);
  const [resources, setResources] = useState([]);
  
  // Editor States
  const [editingProject, setEditingProject] = useState(null);
  const [editingResource, setEditingResource] = useState(null);

  useEffect(() => {
    if (!user) { navigate("/admin/login"); return; }
    fetchAllData();
  }, [user, navigate]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      // Fetch Settings
      const { data: settings } = await supabase.from("site_settings").select("*");
      if (settings) {
        settings.forEach(setting => {
          if (setting.id === 'home_page') setHomeData(setting.value);
          if (setting.id === 'about_page') setAboutData(setting.value);
          if (setting.id === 'contact_page') setContactData(setting.value);
        });
      }
      // Fetch Projects & Resources
      const { data: proj } = await supabase.from("projects").select("*").order('display_order');
      const { data: res } = await supabase.from("resources").select("*").order('display_order');
      if (proj) setProjects(proj);
      if (res) setResources(res);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePage = async (id, data) => {
    setSaving(true);
    try {
      const { error } = await supabase.from("site_settings").upsert({ id, value: data, updated_at: new Date() });
      if (error) throw error;
      alert("Saved successfully!");
    } catch (error) {
      alert("Error saving: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (file) => {
    if (!file) return null;
    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from("images").upload(fileName, file);
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from("images").getPublicUrl(fileName);
      return data.publicUrl;
    } catch (error) {
      alert("Upload failed: " + error.message);
      return null;
    } finally {
      setUploading(false);
    }
  };

  // --- PROJECT CRUD ---
  const saveProject = async () => {
    setSaving(true);
    try {
      // Convert comma-separated string to array if needed
      if (typeof editingProject.tech_stack === 'string') {
        editingProject.tech_stack = editingProject.tech_stack.split(',').map(s => s.trim()).filter(Boolean);
      }
      
      if (editingProject.id) {
        await supabase.from("projects").update(editingProject).eq("id", editingProject.id);
      } else {
        await supabase.from("projects").insert([editingProject]);
      }
      setEditingProject(null);
      fetchAllData();
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteProject = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    await supabase.from("projects").delete().eq("id", id);
    fetchAllData();
  };

  // --- RESOURCE CRUD ---
  const saveResource = async () => {
    setSaving(true);
    try {
      if (editingResource.id) {
        await supabase.from("resources").update(editingResource).eq("id", editingResource.id);
      } else {
        await supabase.from("resources").insert([editingResource]);
      }
      setEditingResource(null);
      fetchAllData();
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteResource = async (id) => {
    if (!window.confirm("Delete this resource?")) return;
    await supabase.from("resources").delete().eq("id", id);
    fetchAllData();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/admin" className="p-2 text-gray-600 hover:text-blue-600">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-xl font-heading font-bold text-gray-900">Site Content Manager</h1>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <Tabs defaultValue="home" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="home">Home Page</TabsTrigger>
            <TabsTrigger value="about">About Page</TabsTrigger>
            <TabsTrigger value="contact">Contact Page</TabsTrigger>
            <TabsTrigger value="projects">Projects DB</TabsTrigger>
            <TabsTrigger value="resources">Resources DB</TabsTrigger>
          </TabsList>

          {/* HOME TAB */}
          <TabsContent value="home">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Home Page Settings</h2>
              <div className="space-y-4">
                <div>
                  <Label>Hero Title</Label>
                  <Input value={homeData.hero_title || ""} onChange={e => setHomeData({...homeData, hero_title: e.target.value})} />
                </div>
                <div>
                  <Label>Hero Subtitle</Label>
                  <Input value={homeData.hero_subtitle || ""} onChange={e => setHomeData({...homeData, hero_subtitle: e.target.value})} />
                </div>
                <div>
                  <Label>Hero Description</Label>
                  <Textarea value={homeData.hero_description || ""} onChange={e => setHomeData({...homeData, hero_description: e.target.value})} rows={3} />
                </div>
                <div>
                  <Label>Hero Image URL</Label>
                  <div className="flex gap-2 mt-1">
                    <Input value={homeData.hero_image || ""} onChange={e => setHomeData({...homeData, hero_image: e.target.value})} />
                    <Input type="file" className="w-64" onChange={async (e) => {
                      const url = await handleImageUpload(e.target.files[0]);
                      if (url) setHomeData({...homeData, hero_image: url});
                    }} disabled={uploading}/>
                  </div>
                </div>
                
                <div className="pt-6 border-t">
                  <div className="flex justify-between items-center mb-4">
                    <Label className="text-lg">Statistics Bar</Label>
                    <Button variant="outline" size="sm" onClick={() => setHomeData({...homeData, stats: [...(homeData.stats || []), {label: "", value: "", icon: "Eye"}]})}>
                      <Plus size={16} className="mr-2"/> Add Stat
                    </Button>
                  </div>
                  {(homeData.stats || []).map((stat, i) => (
                    <div key={i} className="flex gap-2 mb-2 items-center">
                      <Input placeholder="Label (e.g. Total Views)" value={stat.label} onChange={e => { const newStats = [...homeData.stats]; newStats[i].label = e.target.value; setHomeData({...homeData, stats: newStats}); }} />
                      <Input placeholder="Value (e.g. 10K+)" value={stat.value} onChange={e => { const newStats = [...homeData.stats]; newStats[i].value = e.target.value; setHomeData({...homeData, stats: newStats}); }} />
                      <Input placeholder="Icon Name (e.g. Eye)" value={stat.icon} onChange={e => { const newStats = [...homeData.stats]; newStats[i].icon = e.target.value; setHomeData({...homeData, stats: newStats}); }} />
                      <Button variant="destructive" size="icon" onClick={() => { const newStats = [...homeData.stats]; newStats.splice(i, 1); setHomeData({...homeData, stats: newStats}); }}>
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-6" onClick={() => handleSavePage('home_page', homeData)} disabled={saving}>
                  <Save size={16} className="mr-2"/> {saving ? "Saving..." : "Save Home Page"}
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* ABOUT TAB */}
          <TabsContent value="about">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">About Page Settings</h2>
              <div className="space-y-6">
                <div>
                  <Label>Page Title</Label>
                  <Input value={aboutData.title || ""} onChange={e => setAboutData({...aboutData, title: e.target.value})} />
                </div>
                <div>
                  <Label>Subtitle</Label>
                  <Textarea value={aboutData.subtitle || ""} onChange={e => setAboutData({...aboutData, subtitle: e.target.value})} />
                </div>
                
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center mb-2">
                    <Label className="text-lg">Bio Paragraphs</Label>
                    <Button variant="outline" size="sm" onClick={() => setAboutData({...aboutData, bio_paragraphs: [...(aboutData.bio_paragraphs || []), ""]})}>
                      <Plus size={16} /> Add Paragraph
                    </Button>
                  </div>
                  {(aboutData.bio_paragraphs || []).map((para, i) => (
                    <div key={i} className="flex gap-2 mb-2">
                      <Textarea value={para} onChange={e => { const arr = [...aboutData.bio_paragraphs]; arr[i] = e.target.value; setAboutData({...aboutData, bio_paragraphs: arr}); }} />
                      <Button variant="destructive" onClick={() => { const arr = [...aboutData.bio_paragraphs]; arr.splice(i, 1); setAboutData({...aboutData, bio_paragraphs: arr}); }}><Trash2 size={16}/></Button>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center mb-2">
                    <Label className="text-lg">Work Experience</Label>
                    <Button variant="outline" size="sm" onClick={() => setAboutData({...aboutData, experiences: [...(aboutData.experiences || []), {title:"", company:"", location:"", period:"", description:""}]})}>
                      <Plus size={16} /> Add Job
                    </Button>
                  </div>
                  {(aboutData.experiences || []).map((exp, i) => (
                    <div key={i} className="p-4 bg-gray-50 border rounded-lg mb-3 space-y-2 relative">
                      <Button variant="ghost" className="absolute top-2 right-2 text-red-500" onClick={() => { const arr = [...aboutData.experiences]; arr.splice(i, 1); setAboutData({...aboutData, experiences: arr}); }}><Trash2 size={16}/></Button>
                      <Input placeholder="Job Title" value={exp.title} onChange={e => { const arr = [...aboutData.experiences]; arr[i].title = e.target.value; setAboutData({...aboutData, experiences: arr}); }} />
                      <div className="grid grid-cols-3 gap-2">
                        <Input placeholder="Company" value={exp.company} onChange={e => { const arr = [...aboutData.experiences]; arr[i].company = e.target.value; setAboutData({...aboutData, experiences: arr}); }} />
                        <Input placeholder="Location" value={exp.location} onChange={e => { const arr = [...aboutData.experiences]; arr[i].location = e.target.value; setAboutData({...aboutData, experiences: arr}); }} />
                        <Input placeholder="Period (e.g. 2020 - Present)" value={exp.period} onChange={e => { const arr = [...aboutData.experiences]; arr[i].period = e.target.value; setAboutData({...aboutData, experiences: arr}); }} />
                      </div>
                      <Textarea placeholder="Description" value={exp.description} onChange={e => { const arr = [...aboutData.experiences]; arr[i].description = e.target.value; setAboutData({...aboutData, experiences: arr}); }} />
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center mb-2">
                    <Label className="text-lg">Education</Label>
                    <Button variant="outline" size="sm" onClick={() => setAboutData({...aboutData, education: [...(aboutData.education || []), {degree:"", institution:"", period:""}]})}>
                      <Plus size={16} /> Add Education
                    </Button>
                  </div>
                  {(aboutData.education || []).map((edu, i) => (
                    <div key={i} className="flex gap-2 mb-2 items-center">
                      <Input placeholder="Degree" value={edu.degree} onChange={e => { const arr = [...aboutData.education]; arr[i].degree = e.target.value; setAboutData({...aboutData, education: arr}); }} />
                      <Input placeholder="Institution" value={edu.institution} onChange={e => { const arr = [...aboutData.education]; arr[i].institution = e.target.value; setAboutData({...aboutData, education: arr}); }} />
                      <Input placeholder="Period" value={edu.period} onChange={e => { const arr = [...aboutData.education]; arr[i].period = e.target.value; setAboutData({...aboutData, education: arr}); }} />
                      <Button variant="destructive" size="icon" onClick={() => { const arr = [...aboutData.education]; arr.splice(i, 1); setAboutData({...aboutData, education: arr}); }}><Trash2 size={16}/></Button>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center mb-2">
                    <Label className="text-lg">Skills Categories</Label>
                    <Button variant="outline" size="sm" onClick={() => setAboutData({...aboutData, skills: [...(aboutData.skills || []), {category:"", items:[]}]})}>
                      <Plus size={16} /> Add Category
                    </Button>
                  </div>
                  {(aboutData.skills || []).map((skill, i) => (
                    <div key={i} className="flex gap-2 mb-2 items-center">
                      <Input placeholder="Category (e.g. EDA Tools)" className="w-1/3" value={skill.category} onChange={e => { const arr = [...aboutData.skills]; arr[i].category = e.target.value; setAboutData({...aboutData, skills: arr}); }} />
                      <Input placeholder="Comma separated skills..." className="w-2/3" value={Array.isArray(skill.items) ? skill.items.join(", ") : skill.items} onChange={e => { const arr = [...aboutData.skills]; arr[i].items = e.target.value.split(',').map(s=>s.trim()); setAboutData({...aboutData, skills: arr}); }} />
                      <Button variant="destructive" size="icon" onClick={() => { const arr = [...aboutData.skills]; arr.splice(i, 1); setAboutData({...aboutData, skills: arr}); }}><Trash2 size={16}/></Button>
                    </div>
                  ))}
                </div>

                <Button className="w-full mt-6" onClick={() => handleSavePage('about_page', aboutData)} disabled={saving}>
                  <Save size={16} className="mr-2"/> {saving ? "Saving..." : "Save About Page"}
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* CONTACT TAB */}
          <TabsContent value="contact">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Contact & Social Links</h2>
              <div className="space-y-4">
                <Button variant="outline" size="sm" onClick={() => setContactData({...contactData, social_links: [...(contactData.social_links || []), {platform: "", url: "", color: "bg-blue-600"}]})}>
                  <Plus size={16} className="mr-2"/> Add Social Link
                </Button>
                
                {(contactData.social_links || []).map((social, i) => (
                  <div key={i} className="flex gap-2 items-center p-3 border rounded-lg bg-gray-50">
                    <Input placeholder="Platform (e.g. LinkedIn, WhatsApp)" value={social.platform} onChange={e => { const arr = [...contactData.social_links]; arr[i].platform = e.target.value; setContactData({...contactData, social_links: arr}); }} />
                    <Input placeholder="URL" value={social.url} onChange={e => { const arr = [...contactData.social_links]; arr[i].url = e.target.value; setContactData({...contactData, social_links: arr}); }} />
                    <Input placeholder="Tailwind Color (e.g. bg-blue-600)" value={social.color} onChange={e => { const arr = [...contactData.social_links]; arr[i].color = e.target.value; setContactData({...contactData, social_links: arr}); }} />
                    <Button variant="destructive" size="icon" onClick={() => { const arr = [...contactData.social_links]; arr.splice(i, 1); setContactData({...contactData, social_links: arr}); }}>
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ))}
                <Button className="w-full mt-6" onClick={() => handleSavePage('contact_page', contactData)} disabled={saving}>
                  <Save size={16} className="mr-2"/> {saving ? "Saving..." : "Save Contact Page"}
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* PROJECTS TAB */}
          <TabsContent value="projects">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Projects Database</h2>
                {!editingProject && (
                  <Button onClick={() => setEditingProject({ title: "", description: "", tech_stack: "", image: "", year: "", display_order: projects.length + 1, link: "", github: "" })}>
                    <Plus size={16} className="mr-2"/> Add New Project
                  </Button>
                )}
              </div>

              {editingProject ? (
                <div className="space-y-4 bg-gray-50 p-6 rounded-lg border">
                  <h3 className="font-bold text-lg mb-4">{editingProject.id ? "Edit Project" : "New Project"}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label>Title</Label><Input value={editingProject.title} onChange={e => setEditingProject({...editingProject, title: e.target.value})} /></div>
                    <div><Label>Year</Label><Input value={editingProject.year} onChange={e => setEditingProject({...editingProject, year: e.target.value})} /></div>
                  </div>
                  <div><Label>Description</Label><Textarea value={editingProject.description} onChange={e => setEditingProject({...editingProject, description: e.target.value})} /></div>
                  <div><Label>Tech Stack (Comma Separated)</Label><Input value={Array.isArray(editingProject.tech_stack) ? editingProject.tech_stack.join(", ") : editingProject.tech_stack} onChange={e => setEditingProject({...editingProject, tech_stack: e.target.value})} /></div>
                  
                  <div>
                    <Label>Image URL</Label>
                    <div className="flex gap-2 mt-1">
                      <Input value={editingProject.image || ""} onChange={e => setEditingProject({...editingProject, image: e.target.value})} />
                      <Input type="file" className="w-64" onChange={async (e) => {
                        const url = await handleImageUpload(e.target.files[0]);
                        if (url) setEditingProject({...editingProject, image: url});
                      }} disabled={uploading}/>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div><Label>Live Link</Label><Input value={editingProject.link || ""} onChange={e => setEditingProject({...editingProject, link: e.target.value})} /></div>
                    <div><Label>GitHub Link</Label><Input value={editingProject.github || ""} onChange={e => setEditingProject({...editingProject, github: e.target.value})} /></div>
                    <div><Label>Display Order</Label><Input type="number" value={editingProject.display_order} onChange={e => setEditingProject({...editingProject, display_order: parseInt(e.target.value)})} /></div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <Button onClick={saveProject} disabled={saving}>{saving ? "Saving..." : "Save Project"}</Button>
                    <Button variant="outline" onClick={() => setEditingProject(null)}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <div className="divide-y border rounded-lg">
                  {projects.map(p => (
                    <div key={p.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                      <div>
                        <div className="font-bold">{p.title} <span className="text-gray-400 text-sm font-normal ml-2">Order: {p.display_order}</span></div>
                        <div className="text-sm text-gray-500 truncate w-96">{p.description}</div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setEditingProject(p)}><Edit size={14}/></Button>
                        <Button variant="destructive" size="sm" onClick={() => deleteProject(p.id)}><Trash2 size={14}/></Button>
                      </div>
                    </div>
                  ))}
                  {projects.length === 0 && <div className="p-8 text-center text-gray-500">No projects yet.</div>}
                </div>
              )}
            </Card>
          </TabsContent>

          {/* RESOURCES TAB */}
          <TabsContent value="resources">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Resources Database</h2>
                {!editingResource && (
                  <Button onClick={() => setEditingResource({ title: "", description: "", url: "", category: "course", icon: "BookOpen", display_order: resources.length + 1 })}>
                    <Plus size={16} className="mr-2"/> Add Resource
                  </Button>
                )}
              </div>

              {editingResource ? (
                <div className="space-y-4 bg-gray-50 p-6 rounded-lg border">
                  <h3 className="font-bold text-lg mb-4">{editingResource.id ? "Edit Resource" : "New Resource"}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label>Title</Label><Input value={editingResource.title} onChange={e => setEditingResource({...editingResource, title: e.target.value})} /></div>
                    <div><Label>URL</Label><Input value={editingResource.url} onChange={e => setEditingResource({...editingResource, url: e.target.value})} /></div>
                  </div>
                  <div><Label>Description</Label><Textarea value={editingResource.description} onChange={e => setEditingResource({...editingResource, description: e.target.value})} /></div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Category (color)</Label>
                      <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={editingResource.category} onChange={e => setEditingResource({...editingResource, category: e.target.value})}>
                        <option value="course">Course (Blue)</option>
                        <option value="tool">Tool (Pink)</option>
                        <option value="book">Book (Green)</option>
                        <option value="documentation">Documentation (Orange)</option>
                        <option value="video">Video (Red)</option>
                      </select>
                    </div>
                    <div>
                      <Label>Icon Name</Label>
                      <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={editingResource.icon} onChange={e => setEditingResource({...editingResource, icon: e.target.value})}>
                        <option value="BookOpen">Book</option>
                        <option value="Video">Video</option>
                        <option value="Wrench">Tool/Wrench</option>
                        <option value="FileText">Document</option>
                        <option value="Users">Community/Users</option>
                        <option value="GraduationCap">Graduation Cap</option>
                      </select>
                    </div>
                    <div><Label>Display Order</Label><Input type="number" value={editingResource.display_order} onChange={e => setEditingResource({...editingResource, display_order: parseInt(e.target.value)})} /></div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <Button onClick={saveResource} disabled={saving}>{saving ? "Saving..." : "Save Resource"}</Button>
                    <Button variant="outline" onClick={() => setEditingResource(null)}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <div className="divide-y border rounded-lg">
                  {resources.map(r => (
                    <div key={r.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                      <div>
                        <div className="font-bold flex items-center gap-2">
                          <span className="text-xs px-2 py-1 bg-gray-200 rounded uppercase">{r.category}</span>
                          {r.title} 
                        </div>
                        <div className="text-sm text-gray-500 mt-1">{r.url}</div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setEditingResource(r)}><Edit size={14}/></Button>
                        <Button variant="destructive" size="sm" onClick={() => deleteResource(r.id)}><Trash2 size={14}/></Button>
                      </div>
                    </div>
                  ))}
                  {resources.length === 0 && <div className="p-8 text-center text-gray-500">No resources yet.</div>}
                </div>
              )}
            </Card>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
}