import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, GripVertical, Image as ImageIcon, Code, Type, Heading2, Youtube, Save, Eye, LogOut, Upload, Loader2 } from "lucide-react";
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
  const { user, logout } = useAuth();

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false); // Track global upload state
  const [showPreview, setShowPreview] = useState(false);

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

    if (isEdit) {
      loadPost();
    }
  }, [user, navigate, isEdit, id]);

  const loadPost = async () => {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id)
        .single();

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

  // --- Image Upload Logic ---
  const handleImageUpload = async (file) => {
    if (!file) return null;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file (PNG, JPG, etc.)");
      return null;
    }

    setUploading(true);
    try {
      // 1. Create a unique file name
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      // 2. Upload to Supabase 'images' bucket
      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 3. Get the Public URL
      const { data } = supabase.storage.from("images").getPublicUrl(filePath);
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
  // --------------------------

  const addBlock = (type) => {
    const newBlock = {
      id: Date.now().toString(),
      type,
      content: "",
      language: type === "code" ? "python" : "",
      level: type === "heading" ? 2 : 2,
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

  const createSlug = (text) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[\s\W-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleSave = async (shouldPublish = published) => {
    if (!title.trim()) {
      alert("Title is required");
      return;
    }

    setSaving(true);
    try {
      const textContent = blocks.map(b => b.content).join(" ");
      const wordCount = textContent.split(/\s+/).length;
      const readingTime = Math.max(1, Math.ceil(wordCount / 200));

      const postData = {
        title,
        excerpt,
        category,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        featured_image: featuredImage,
        published: shouldPublish,
        featured,
        content: blocks.map(({ id, ...rest }) => rest),
        reading_time: readingTime,
        updated_at: new Date().toISOString(),
      };

      if (!isEdit) {
        postData.slug = createSlug(title) + "-" + Date.now().toString().slice(-4);
      }

      let result;
      if (isEdit) {
        result = await supabase
          .from("posts")
          .update(postData)
          .eq("id", id);
      } else {
        result = await supabase
          .from("posts")
          .insert([postData]);
      }

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

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link
                to="/admin/posts"
                className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                data-testid="back-to-posts"
              >
                <ArrowLeft size={20} />
              </Link>
              <h1 className="text-xl font-heading font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {isEdit ? "Edit Post" : "Create New Post"}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="hidden md:flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:text-blue-600 transition-colors font-semibold"
                data-testid="toggle-preview"
              >
                <Eye size={16} />
                {showPreview ? "Edit" : "Preview"}
              </button>
              <span className="hidden sm:inline text-sm text-gray-600 font-mono">
                {user?.email}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:text-red-600 transition-colors font-semibold"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Editor */}
          <div className="lg:col-span-2 space-y-6">
            {!showPreview ? (
              <>
                {/* Post Meta */}
                <Card className="p-6 bg-white shadow-sm border border-gray-200">
                  <h2 className="text-lg font-heading font-bold text-gray-900 mb-4">Post Details</h2>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title" className="text-sm font-semibold text-gray-700">
                        Title *
                      </Label>
                      <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter post title..."
                        className="mt-1"
                        data-testid="post-title-input"
                      />
                    </div>
                    <div>
                      <Label htmlFor="excerpt" className="text-sm font-semibold text-gray-700">
                        Excerpt
                      </Label>
                      <Textarea
                        id="excerpt"
                        value={excerpt}
                        onChange={(e) => setExcerpt(e.target.value)}
                        placeholder="Brief description of the post..."
                        rows={3}
                        className="mt-1"
                        data-testid="post-excerpt-input"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="category" className="text-sm font-semibold text-gray-700">
                          Category
                        </Label>
                        <Select value={category} onValueChange={setCategory}>
                          <SelectTrigger className="mt-1" data-testid="post-category-select">
                            <SelectValue />
                          </SelectTrigger>
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
                        <Label htmlFor="tags" className="text-sm font-semibold text-gray-700">
                          Tags (comma-separated)
                        </Label>
                        <Input
                          id="tags"
                          value={tags}
                          onChange={(e) => setTags(e.target.value)}
                          placeholder="VLSI, Physical Design, TCL"
                          className="mt-1"
                          data-testid="post-tags-input"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="featured-image" className="text-sm font-semibold text-gray-700">
                        Featured Image
                      </Label>
                      <div className="mt-2 space-y-3">
                        <div className="flex items-center gap-4">
                          {featuredImage && (
                            <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200">
                              <img src={featuredImage} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                          )}
                          <div className="flex-1">
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={handleFeaturedImageChange}
                              disabled={uploading}
                              className="cursor-pointer"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              {uploading ? "Uploading..." : "Upload a PNG or JPG file"}
                            </p>
                          </div>
                        </div>
                        {/* Fallback URL input if they still want to paste */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400 font-mono">OR</span>
                            <Input
                                value={featuredImage}
                                onChange={(e) => setFeaturedImage(e.target.value)}
                                placeholder="Paste image URL directly..."
                                className="text-xs h-8"
                            />
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Content Blocks */}
                <Card className="p-6 bg-white shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-heading font-bold text-gray-900">Content Blocks</h2>
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="outline" onClick={() => addBlock("paragraph")} className="text-xs">
                        <Type size={14} className="mr-1" /> Para
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => addBlock("heading")} className="text-xs">
                        <Heading2 size={14} className="mr-1" /> H2
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => addBlock("code")} className="text-xs">
                        <Code size={14} className="mr-1" /> Code
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => addBlock("image")} className="text-xs">
                        <ImageIcon size={14} className="mr-1" /> Img
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => addBlock("youtube")} className="text-xs">
                        <Youtube size={14} className="mr-1" /> Video
                      </Button>
                    </div>
                  </div>

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
                            className="border border-gray-200 rounded-lg p-4 bg-gray-50 shadow-sm hover:shadow-md transition-shadow"
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
                                  <Textarea
                                    value={block.content}
                                    onChange={(e) => updateBlock(index, "content", e.target.value)}
                                    placeholder="Write your paragraph..."
                                    rows={4}
                                    className="w-full"
                                  />
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
                                        <SelectItem value="vhdl">VHDL</SelectItem>
                                        <SelectItem value="javascript">JavaScript</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <Textarea
                                      value={block.content}
                                      onChange={(e) => updateBlock(index, "content", e.target.value)}
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
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleBlockImageChange(index, e)}
                                                disabled={uploading}
                                            />
                                        </div>
                                    </div>
                                    <Input
                                      value={block.caption}
                                      onChange={(e) => updateBlock(index, "caption", e.target.value)}
                                      placeholder="Image caption (optional)"
                                    />
                                    {/* Fallback URL input */}
                                    <Input
                                        value={block.url}
                                        onChange={(e) => updateBlock(index, "url", e.target.value)}
                                        placeholder="Or paste URL..."
                                        className="text-xs opacity-60 focus:opacity-100"
                                    />
                                  </div>
                                )}

                                {block.type === "youtube" && (
                                  <div className="space-y-2">
                                    <Input
                                      value={block.url}
                                      onChange={(e) => updateBlock(index, "url", e.target.value)}
                                      placeholder="YouTube URL (https://youtube.com/...)"
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        </Reorder.Item>
                      ))}
                    </Reorder.Group>
                  )}
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

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="p-6 bg-white shadow-sm border border-gray-200 sticky top-24">
              <h2 className="text-lg font-heading font-bold text-gray-900 mb-4">Publish Settings</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="published" className="text-sm font-semibold text-gray-700">
                    Published
                  </Label>
                  <Switch
                    id="published"
                    checked={published}
                    onCheckedChange={setPublished}
                    data-testid="post-published-switch"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="featured" className="text-sm font-semibold text-gray-700">
                    Featured
                  </Label>
                  <Switch
                    id="featured"
                    checked={featured}
                    onCheckedChange={setFeatured}
                    data-testid="post-featured-switch"
                  />
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <Button
                  onClick={() => handleSave(published)}
                  disabled={saving || uploading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg"
                  data-testid="save-post-button"
                >
                  <Save size={16} className="mr-2" />
                  {uploading ? "Uploading..." : saving ? "Saving..." : isEdit ? "Update Post" : "Create Post"}
                </Button>
                {!published && (
                  <Button
                    onClick={() => handleSave(true)}
                    disabled={saving || uploading}
                    variant="outline"
                    className="w-full"
                    data-testid="publish-post-button"
                  >
                    {saving ? "Publishing..." : "Save & Publish"}
                  </Button>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="text-xs text-gray-600 font-mono space-y-1">
                  <p>Blocks: {blocks.length}</p>
                  <p>Category: {category}</p>
                  <p>Tags: {tags.split(",").filter(Boolean).length}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}