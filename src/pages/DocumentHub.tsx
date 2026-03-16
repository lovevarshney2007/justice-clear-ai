import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { FileText, Upload, BookOpen, Trash2, Eye, AlertTriangle, CheckCircle, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDropzone } from "react-dropzone";
import { processDocument } from "@/services/document";
import { uploadRAG, getBlogs, getBlog, deleteBlog } from "@/services/rag";
import { useToast } from "@/hooks/use-toast";
import AppLayout from "@/components/AppLayout";
import ReactMarkdown from "react-markdown";
import { useEffect } from "react";

const DocumentHub = () => {
  const [processResult, setProcessResult] = useState<any>(null);
  const [processLoading, setProcessLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [blogContent, setBlogContent] = useState<any>(null);
  const [blogsLoading, setBlogsLoading] = useState(false);
  const { toast } = useToast();

  const onDropProcess = useCallback(async (files: File[]) => {
    if (!files[0]) return;
    setProcessLoading(true);
    setProcessResult(null);
    try {
      const res: any = await processDocument(files[0]);
      setProcessResult(res.data);
      toast({ title: "Document processed!", description: `Risk level: ${res.data.risk_level}` });
    } catch {
      toast({ title: "Error", description: "Processing failed", variant: "destructive" });
    } finally {
      setProcessLoading(false);
    }
  }, [toast]);

  const onDropRAG = useCallback(async (files: File[]) => {
    if (!files[0]) return;
    setUploadLoading(true);
    try {
      const res: any = await uploadRAG(files[0]);
      toast({ title: "File uploaded!", description: res.data.message });
    } catch {
      toast({ title: "Error", description: "Upload failed", variant: "destructive" });
    } finally {
      setUploadLoading(false);
    }
  }, [toast]);

  const processDropzone = useDropzone({ onDrop: onDropProcess, accept: { "application/pdf": [".pdf"] }, maxFiles: 1 });
  const ragDropzone = useDropzone({ onDrop: onDropRAG, maxFiles: 1 });

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    setBlogsLoading(true);
    try {
      const res: any = await getBlogs();
      setBlogs(res.data);
    } finally {
      setBlogsLoading(false);
    }
  };

  const handleReadBlog = async (title: string) => {
    const res: any = await getBlog(title);
    setBlogContent(res.data);
  };

  const handleDeleteBlog = async (title: string) => {
    await deleteBlog(title);
    toast({ title: "Deleted", description: `Blog "${title}" removed` });
    setBlogs(blogs.filter(b => b.title !== title));
  };

  return (
    <AppLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-foreground flex items-center gap-3">
            <FileText className="h-8 w-8 text-accent" /> Document Hub
          </h1>
          <p className="text-muted-foreground mt-2">Process, upload, and manage your legal documents.</p>
        </div>

        <Tabs defaultValue="process">
          <TabsList className="mb-6">
            <TabsTrigger value="process" className="gap-2"><FileText className="h-4 w-4" />Process Document</TabsTrigger>
            <TabsTrigger value="upload" className="gap-2"><Upload className="h-4 w-4" />RAG Upload</TabsTrigger>
            <TabsTrigger value="blogs" className="gap-2"><BookOpen className="h-4 w-4" />Blog Manager</TabsTrigger>
          </TabsList>

          <TabsContent value="process">
            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="border-border">
                <CardContent className="p-6">
                  <div {...processDropzone.getRootProps()} className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-colors ${processDropzone.isDragActive ? "border-accent bg-accent/5" : "border-border hover:border-accent/50"}`}>
                    <input {...processDropzone.getInputProps()} />
                    {processLoading ? (
                      <div className="space-y-4">
                        <Loader2 className="h-12 w-12 mx-auto text-accent animate-spin" />
                        <p className="text-muted-foreground">Analyzing document...</p>
                      </div>
                    ) : (
                      <>
                        <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="font-medium text-foreground">Drop a PDF here or click to upload</p>
                        <p className="text-sm text-muted-foreground mt-1">PDF files only, max 10MB</p>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader><CardTitle className="font-display">Analysis Result</CardTitle></CardHeader>
                <CardContent>
                  {processResult ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                      <div className="flex items-center gap-3">
                        {processResult.risk_level === "High" ? <AlertTriangle className="h-6 w-6 text-destructive" /> : <CheckCircle className="h-6 w-6 text-green-600" />}
                        <Badge className={processResult.risk_level === "High" ? "bg-destructive/10 text-destructive" : processResult.risk_level === "Medium" ? "bg-accent/10 text-accent" : "bg-green-100 text-green-700"}>{processResult.risk_level} Risk</Badge>
                        <span className="text-sm text-muted-foreground">{processResult.page_count} pages</span>
                      </div>
                      <p className="text-sm text-foreground">{processResult.summary}</p>
                      <div><h4 className="text-sm font-medium mb-2">Key Clauses:</h4>
                        <ul className="space-y-1">{processResult.key_clauses.map((c: string, i: number) => <li key={i} className="text-sm text-muted-foreground flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-accent" />{c}</li>)}</ul>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="text-center text-muted-foreground py-12"><FileText className="h-16 w-16 mx-auto mb-4 opacity-20" /><p>Upload a document to see analysis</p></div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="upload">
            <Card className="border-border max-w-lg">
              <CardContent className="p-6">
                <div {...ragDropzone.getRootProps()} className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-colors ${ragDropzone.isDragActive ? "border-accent bg-accent/5" : "border-border hover:border-accent/50"}`}>
                  <input {...ragDropzone.getInputProps()} />
                  {uploadLoading ? (
                    <div className="space-y-4"><Loader2 className="h-12 w-12 mx-auto text-accent animate-spin" /><p className="text-muted-foreground">Uploading & indexing...</p></div>
                  ) : (
                    <><Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" /><p className="font-medium text-foreground">Drop files to add to RAG knowledge base</p><p className="text-sm text-muted-foreground mt-1">These will be available in the RAG chat assistant</p></>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="blogs">
            {blogContent ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Button variant="ghost" onClick={() => setBlogContent(null)} className="mb-4">← Back to blogs</Button>
                <Card className="border-border">
                  <CardContent className="p-8">
                    <div className="prose prose-sm max-w-none dark:prose-invert"><ReactMarkdown>{blogContent.content}</ReactMarkdown></div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {blogsLoading ? [1,2,3].map(i => <Card key={i} className="border-border"><CardContent className="p-6"><div className="h-5 w-2/3 bg-muted rounded animate-pulse mb-3" /><div className="h-4 w-1/3 bg-muted rounded animate-pulse" /></CardContent></Card>) :
                blogs.map((blog, i) => (
                  <motion.div key={blog.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                    <Card className="border-border hover:border-accent/30 transition-colors">
                      <CardContent className="p-6">
                        <h3 className="font-semibold text-foreground mb-2">{blog.title.replace(/_/g, " ")}</h3>
                        <p className="text-xs text-muted-foreground mb-4">{blog.created}</p>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleReadBlog(blog.title)} className="gap-1"><Eye className="h-3.5 w-3.5" />Read</Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDeleteBlog(blog.title)} className="text-destructive hover:text-destructive gap-1"><Trash2 className="h-3.5 w-3.5" />Delete</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>
    </AppLayout>
  );
};

export default DocumentHub;
