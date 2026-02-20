import { useEffect, useState } from "react";
import { useNavigate, useParams, Link, useLocation } from "react-router-dom"; 
import { 
  ArrowLeft, Plus, Trash2, GripVertical, Image as ImageIcon, 
  Code, Type, Heading2, Youtube, Save, Eye, LogOut, Upload, Loader2, List as ListIcon, Code2 
} from "lucide-react";
import { motion, Reorder } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import BlockRenderer from "@/components/shared/BlockRenderer";

export default function PostEditor() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const location = useLocation(); 
  const { user, logout } = useAuth();

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // --- NEW: Read URL parameters to see if we should open in preview mode ---
  const [showPreview, setShowPreview] = useState(() => {
    return new URLSearchParams(location.search).get("preview") === "true";
  });

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("tutorial");
  const [tags, setTags] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [published, setPublished] = useState(false);
  const [featured, setFeatured] = useState(false);
  const [blocks, setBlocks] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate("/admin/login");
      return;
    }
    if (isEdit) loadPost();
  }, [user, navigate, isEdit, id]);

  const loadPost = async () => {
    try {
      const { data, error } = await supabase.from("posts").select("*").eq("id", id).single();
      if (error) throw error;
      
      setTitle(data.title);
      setExcerpt(data.excerpt);
      setCategory(data.category);
      setTags(data.tags?.join(", ") || "");
      setFeaturedImage(data.featured_image || "");
      setPublished(data.published);
      setFeatured(data.featured);
      setBlocks(data.content || []);
    } catch (error) {
      console.error("Error loading post:", error);
      alert("Failed to load post");
      navigate("/admin/posts");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file) => {
    if (!file) return null;
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file (PNG, JPG, etc.)");
      return null;
    }
    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from("images").upload(fileName, file);
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from("images").getPublicUrl(fileName);
      return data.publicUrl;
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload image: " + error.message);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleFeaturedImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = await handleImageUpload(file);
      if (url) setFeaturedImage(url);
    }
  };

  const handleBlockImageChange = async (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const url = await handleImageUpload(file);
      if (url) updateBlock(index, "url", url);
    }
  };

  const addBlock = (type) => {
    const newBlock = {
      id: Date.now().toString(),
      type,
      content: "",
      language: type === "code" ? "python" : "",
      level: type === "heading" ? 2 : 2,
      listType: type === "list" ? "ul" : "", 
      caption: "",
      url: "",
    };
    setBlocks([...blocks, newBlock]);
  };

  const updateBlock = (index, field, value) => {
    const updated = [...blocks];
    updated[index] = { ...updated[index], [field]: value };
    setBlocks(updated);
  };

  const deleteBlock = (index) => {
    setBlocks(blocks.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e, index, field) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const value = e.target.value;
      const newValue = value.substring(0, start) + "    " + value.substring(end);
      
      updateBlock(index, field, newValue);
      
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 4;
      }, 0);
    }
  };

  const formatInlineCode = (index, blockId) => {
    const el = document.getElementById(`textarea-${blockId}`);
    if (!el) return;
    
    const start = el.selectionStart;
    const end = el.selectionEnd;
    if (start === end) {
      alert("Please highlight/select some text first to format it.");
      return;
    }

    const value = el.value;
    const selectedText = value.substring(start, end);
    const codeWrapper = `<code class="bg-blue-50 text-blue-600 font-mono px-1.5 py-0.5 rounded text-sm border border-blue-100">${selectedText}</code>`;
    const newValue = value.substring(0, start) + codeWrapper + value.substring(end);
    
    updateBlock(index, "content", newValue);
    
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + codeWrapper.length, start + codeWrapper.length);
    }, 0);
  };

  const createSlug = (text) => {
    return text.toString().toLowerCase().trim().replace(/[\s\W-]+/g, "-").replace(/^-+|-+$/g, "");
  };

  const handleSave = async (shouldPublish = published) => {
    if (!title.trim()) { alert("Title is required"); return; }
    setSaving(true);
    try {
      const textContent = blocks.map(b => b.content).join(" ");
      const wordCount = textContent.split(/\s+/).length;
      const readingTime = Math.max(1, Math.ceil(wordCount / 200));

      const postData = {
        title, excerpt, category,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        featured_image: featuredImage,
        published: shouldPublish, featured,
        content: blocks.map(({ id, ...rest }) => rest),
        reading_time: readingTime,
        updated_at: new Date().toISOString(),
      };

      if (!isEdit) postData.slug = createSlug(title) + "-" + Date.now().toString().slice(-4);

      let result = isEdit 
        ? await supabase.from("posts").update(postData).eq("id", id)
        : await supabase.from("posts").insert([postData]);

      if (result.error) throw result.error;

      alert(isEdit ? "Post updated successfully!" : "Post created successfully!");
      navigate("/admin/posts");
    } catch (error) {
      console.error("Error saving post:", error);
      alert("Failed to save post: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => { logout(); navigate("/admin/login"); };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600 font-mono">Loading post...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 pb-20">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link to="/admin/posts" className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
                <ArrowLeft size={20} />
              </Link>
              <h1 className="text-xl font-heading font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {isEdit ? "Edit Post" : "Create New Post"}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => setShowPreview(!showPreview)} className="hidden md:flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:text-blue-600 transition-colors font-semibold">
                <Eye size={16} /> {showPreview ? "Edit" : "Preview"}
              </button>
              <span className="hidden sm:inline text-sm text-gray-600 font-mono">{user?.email}</span>
              <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:text-red-600 transition-colors font-semibold">
                <LogOut size={16} /> <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {!showPreview ? (
              <>
                <Card className="p-6 bg-white shadow-sm border border-gray-200">
                  <h2 className="text-lg font-heading font-bold text-gray-900 mb-4">Post Details</h2>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-semibold text-gray-700">Title *</Label>
                      <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter post title..." className="mt-1" />
                    </div>
                    <div>
                      <Label className="text-sm font-semibold text-gray-700">Abstract</Label>
                      <Textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Brief description..." rows={3} className="mt-1" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-semibold text-gray-700">Category</Label>
                        <Select value={category} onValueChange={setCategory}>
                          <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="tutorial">Tutorial</SelectItem>
                            <SelectItem value="career">Career</SelectItem>
                            <SelectItem value="tools">Tools</SelectItem>
                            <SelectItem value="news">News</SelectItem>
                            <SelectItem value="opinion">Opinion</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-sm font-semibold text-gray-700">Tags (comma-separated)</Label>
                        <Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="VLSI, Physical Design, TCL" className="mt-1" />
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold text-gray-700">Featured Image</Label>
                      <div className="mt-2 space-y-3">
                        <div className="flex items-center gap-4">
                          {featuredImage && (
                            <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200">
                              <img src={featuredImage} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                          )}
                          <div className="flex-1">
                            <Input type="file" accept="image/*" onChange={handleFeaturedImageChange} disabled={uploading} className="cursor-pointer" />
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400 font-mono">OR</span>
                            <Input value={featuredImage} onChange={(e) => setFeaturedImage(e.target.value)} placeholder="Paste image URL directly..." className="text-xs h-8" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Content Blocks Card */}
                <Card className="bg-white shadow-sm border border-gray-200 overflow-visible relative">
                  
                  <div className="sticky top-16 z-40 bg-gray-50 border-b border-gray-200 p-4 flex items-center justify-between rounded-t-xl shadow-sm">
                    <h2 className="text-lg font-heading font-bold text-gray-900">Content Blocks</h2>
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="outline" onClick={() => addBlock("paragraph")} className="text-xs bg-white">
                        <Type size={14} className="mr-1" /> Para
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => addBlock("heading")} className="text-xs bg-white">
                        <Heading2 size={14} className="mr-1" /> H2
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => addBlock("list")} className="text-xs bg-white">
                        <ListIcon size={14} className="mr-1" /> List
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => addBlock("code")} className="text-xs bg-white">
                        <Code size={14} className="mr-1" /> Code
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => addBlock("image")} className="text-xs bg-white">
                        <ImageIcon size={14} className="mr-1" /> Img
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => addBlock("youtube")} className="text-xs bg-white">
                        <Youtube size={14} className="mr-1" /> Video
                      </Button>
                    </div>
                  </div>

                  <div className="p-6">
                    {blocks.length === 0 ? (
                      <div className="text-center py-12 text-gray-500 font-body">
                        <p className="mb-4">No content blocks yet.</p>
                        <Button onClick={() => addBlock("paragraph")} variant="outline" className="mx-auto">
                          <Plus size={16} className="mr-2" /> Add First Block
                        </Button>
                      </div>
                    ) : (
                      <Reorder.Group axis="y" values={blocks} onReorder={setBlocks} className="space-y-4">
                        {blocks.map((block, index) => (
                          <Reorder.Item key={block.id || index} value={block}>
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="border border-gray-200 rounded-lg p-4 bg-gray-50 shadow-sm hover:shadow-md transition-shadow relative"
                            >
                              <div className="flex items-start gap-3">
                                <div className="cursor-grab active:cursor-grabbing pt-2">
                                  <GripVertical size={18} className="text-gray-400" />
                                </div>
                                <div className="flex-1 space-y-3">
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs font-mono uppercase tracking-wider text-blue-600 font-semibold">
                                      {block.type}
                                    </span>
                                    <button onClick={() => deleteBlock(index)} className="text-gray-400 hover:text-red-600 transition-colors">
                                      <Trash2 size={16} />
                                    </button>
                                  </div>

                                  {block.type === "paragraph" && (
                                    <div className="space-y-2">
                                      <div className="flex justify-end">
                                        <button 
                                          onClick={() => formatInlineCode(index, block.id)}
                                          className="text-xs flex items-center gap-1 bg-white border border-gray-200 px-2 py-1 rounded text-gray-600 hover:text-blue-600 hover:border-blue-300 transition-colors"
                                          title="Highlight text and click to format as code"
                                        >
                                          <Code2 size={12} /> Format Selection as Code
                                        </button>
                                      </div>
                                      <Textarea
                                        id={`textarea-${block.id}`}
                                        value={block.content}
                                        onChange={(e) => updateBlock(index, "content", e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(e, index, "content")}
                                        placeholder="Write your paragraph... (Highlight text and click format above)"
                                        rows={4}
                                        className="w-full"
                                      />
                                    </div>
                                  )}

                                  {block.type === "list" && (
                                    <div className="space-y-2">
                                      <Select value={block.listType || "ul"} onValueChange={(v) => updateBlock(index, "listType", v)}>
                                        <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="ul">Bulleted List (•)</SelectItem>
                                          <SelectItem value="ol">Numbered List (1.)</SelectItem>
                                        </SelectContent>
                                      </Select>
                                      <Textarea
                                        value={block.content}
                                        onChange={(e) => updateBlock(index, "content", e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(e, index, "content")}
                                        placeholder="Enter items here. Each new line automatically becomes a new bullet point."
                                        rows={5}
                                        className="w-full"
                                      />
                                    </div>
                                  )}

                                  {block.type === "heading" && (
                                    <div className="space-y-2">
                                      <Input
                                        value={block.content}
                                        onChange={(e) => updateBlock(index, "content", e.target.value)}
                                        placeholder="Heading text..."
                                      />
                                      <Select value={block.level?.toString() || "2"} onValueChange={(v) => updateBlock(index, "level", parseInt(v))}>
                                        <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="2">H2</SelectItem>
                                          <SelectItem value="3">H3</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  )}

                                  {block.type === "code" && (
                                    <div className="space-y-2">
                                      <Select value={block.language || "python"} onValueChange={(v) => updateBlock(index, "language", v)}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="python">Python</SelectItem>
                                          <SelectItem value="tcl">TCL</SelectItem>
                                          <SelectItem value="bash">Bash</SelectItem>
                                          <SelectItem value="verilog">Verilog</SelectItem>
                                          <SelectItem value="systemverilog">SystemVerilog</SelectItem>
                                          <SelectItem value="c">C</SelectItem>
                                        </SelectContent>
                                      </Select>
                                      <Textarea
                                        value={block.content}
                                        onChange={(e) => updateBlock(index, "content", e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(e, index, "content")}
                                        placeholder="Paste code here..."
                                        rows={8}
                                        className="font-mono text-sm"
                                      />
                                    </div>
                                  )}

                                  {block.type === "image" && (
                                    <div className="space-y-3">
                                      <div className="flex items-center gap-4">
                                          {block.url && (
                                              <div className="w-32 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                                  <img src={block.url} alt="Preview" className="w-full h-full object-cover" />
                                              </div>
                                          )}
                                          <div className="flex-1">
                                              <Input type="file" accept="image/*" onChange={(e) => handleBlockImageChange(index, e)} disabled={uploading} />
                                          </div>
                                      </div>
                                      <Input value={block.caption} onChange={(e) => updateBlock(index, "caption", e.target.value)} placeholder="Image caption (optional)" />
                                      <Input value={block.url} onChange={(e) => updateBlock(index, "url", e.target.value)} placeholder="Or paste URL..." className="text-xs opacity-60" />
                                    </div>
                                  )}

                                  {block.type === "youtube" && (
                                    <Input value={block.url} onChange={(e) => updateBlock(index, "url", e.target.value)} placeholder="YouTube URL (https://youtube.com/...)" />
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          </Reorder.Item>
                        ))}
                      </Reorder.Group>
                    )}
                  </div>
                </Card>
              </>
            ) : (
              <Card className="p-8 bg-white shadow-sm border border-gray-200">
                <h1 className="text-4xl font-heading font-bold text-gray-900 mb-4">{title || "Untitled Post"}</h1>
                {excerpt && <p className="text-lg text-gray-600 font-body mb-6">{excerpt}</p>}
                {featuredImage && (
                  <div className="mb-8 rounded-lg overflow-hidden">
                    <img src={featuredImage} alt={title} className="w-full h-96 object-cover" />
                  </div>
                )}
                <BlockRenderer blocks={blocks} />
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card className="p-6 bg-white shadow-sm border border-gray-200 sticky top-24">
              <h2 className="text-lg font-heading font-bold text-gray-900 mb-4">Publish Settings</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold text-gray-700">Published</Label>
                  <Switch checked={published} onCheckedChange={setPublished} />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold text-gray-700">Featured</Label>
                  <Switch checked={featured} onCheckedChange={setFeatured} />
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <Button onClick={() => handleSave(published)} disabled={saving || uploading} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg">
                  <Save size={16} className="mr-2" />
                  {uploading ? "Uploading..." : saving ? "Saving..." : isEdit ? "Update Post" : "Create Post"}
                </Button>
                {!published && (
                  <Button onClick={() => handleSave(true)} disabled={saving || uploading} variant="outline" className="w-full">
                    {saving ? "Publishing..." : "Save & Publish"}
                  </Button>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}