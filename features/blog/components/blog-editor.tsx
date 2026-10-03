"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import {
  AlertCircle,
  ArrowLeft,
  Camera,
  CheckCircle2,
  FileText,
  Globe,
  ImagePlus,
  Link2,
  Loader2,
  Plus,
  Tag,
  X,
} from "lucide-react";

import { ImageUpload } from "@/components/storage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { uploadImageAction } from "@/features/storage/actions";

import { createBlogPost, updateBlogPost } from "../actions";
import { generateSlug } from "../schema";

interface BlogEditorProps {
  mode: "create" | "edit";
  postId?: string;
  initialData?: {
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    coverImageUrl: string | null;
    images?: string[];
    tags: string[];
    status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
    linkedTripId: string | null;
  };
  userTrips?: { id: string; title: string; destination: string | null }[];
}

export function BlogEditor({ mode, postId, initialData, userTrips = [] }: BlogEditorProps) {
  const router = useRouter();

  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [coverImageUrl, setCoverImageUrl] = useState(initialData?.coverImageUrl || "");
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const [isUploadingPhotos, setIsUploadingPhotos] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [linkedTripId, setLinkedTripId] = useState(initialData?.linkedTripId || "");
  const [isSaving, startSaving] = useTransition();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleTitleBlur = () => {
    if (!slug && title) {
      setSlug(generateSlug(title));
    }
  };

  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (t && !tags.includes(t) && tags.length < 10) {
      setTags([...tags, t]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => setTags(tags.filter((t) => t !== tag));

  const handlePhotosUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    setIsUploadingPhotos(true);
    try {
      const uploadedUrls: string[] = [];
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", "stories");
        const res = await uploadImageAction(formData);
        if (res.success && res.url) {
          uploadedUrls.push(res.url);
        }
      }
      if (uploadedUrls.length > 0) {
        setImages((prev) => [...prev, ...uploadedUrls]);
        if (!coverImageUrl) {
          setCoverImageUrl(uploadedUrls[0]);
        }
      }
    } catch (err) {
      console.error("Failed uploading story photos:", err);
    } finally {
      setIsUploadingPhotos(false);
      e.target.value = "";
    }
  };

  const handleSetCover = (url: string) => {
    setCoverImageUrl(url);
  };

  const handleInsertIntoMarkdown = (url: string) => {
    const markdownImg = `\n\n![Trip photo](${url})\n\n`;
    setContent((prev) => prev + markdownImg);
  };

  const handleRemoveImage = (urlToRemove: string) => {
    const nextImages = images.filter((u) => u !== urlToRemove);
    setImages(nextImages);
    if (coverImageUrl === urlToRemove) {
      setCoverImageUrl(nextImages.length > 0 ? nextImages[0] : "");
    }
  };

  const handleSave = (status: "DRAFT" | "PUBLISHED") => {
    setMessage(null);
    startSaving(async () => {
      const data = {
        title,
        slug: slug || generateSlug(title),
        excerpt: excerpt || null,
        content,
        coverImageUrl: coverImageUrl || (images.length > 0 ? images[0] : null),
        images,
        tags,
        status,
        linkedTripId: linkedTripId || null,
      };

      const res =
        mode === "create"
          ? await createBlogPost(data)
          : await updateBlogPost(postId!, data);

      if (res.success && res.post) {
        setMessage({
          type: "success",
          text: status === "PUBLISHED" ? "Story published!" : "Draft saved.",
        });
        if (mode === "create") {
          router.push(`/stories/manage`);
        }
      } else {
        setMessage({ type: "error", text: res.error || "Failed to save." });
      }
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full pb-12">
      {/* Back Navigation */}
      <Link
        href="/stories"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Stories
      </Link>

      {/* Top Header Banner */}
      <div className="border-b border-border dark:border-zinc-800 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="font-sans text-[11px] font-semibold tracking-widest text-[#2D9BF0] uppercase block">
            {mode === "create" ? "Creator Studio" : "Story Revision"}
          </span>
          <h1 className="font-sans text-2xl sm:text-3xl font-light tracking-tight text-foreground dark:text-zinc-50">
            {mode === "create" ? (
              <>
                Write a Travel{" "}
                <span className="font-serif italic font-normal text-foreground dark:text-zinc-100">
                  Story
                </span>
              </>
            ) : (
              <>
                Edit{" "}
                <span className="font-serif italic font-normal text-foreground dark:text-zinc-100">
                  Story
                </span>
              </>
            )}
          </h1>
          <p className="font-sans text-xs sm:text-sm text-muted-foreground dark:text-zinc-400 font-normal leading-relaxed max-w-xl">
            Share your travel experiences, recommendations, and itinerary insights with the Prava community.
          </p>
        </div>

        {/* Top Quick Actions (Desktop & Mobile) */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 text-xs gap-1.5 cursor-pointer rounded-sm border-border dark:border-zinc-800 dark:hover:bg-zinc-800/60"
            onClick={() => handleSave("DRAFT")}
            disabled={isSaving || !title.trim() || !content.trim()}
          >
            {isSaving && <Loader2 className="h-3 w-3 animate-spin" />}
            Save Draft
          </Button>
          <Button
            type="button"
            size="sm"
            className="h-8 text-xs gap-1.5 shadow-xs cursor-pointer rounded-sm bg-[#2D9BF0] hover:bg-[#2085d3] text-white font-medium"
            onClick={() => handleSave("PUBLISHED")}
            disabled={isSaving || !title.trim() || !content.trim()}
          >
            {isSaving ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Globe className="h-3 w-3" />
            )}
            Publish Story
          </Button>
        </div>
      </div>

      {message && (
        <div
          className={`flex items-center gap-2 p-3 rounded-md text-xs ${
            message.type === "success"
              ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
              : "bg-destructive/10 border border-destructive/20 text-destructive"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0 text-destructive" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* 2-Column Responsive Layout: Left (Details & Markdown) | Right (Cover, Tags, Trip Link) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (Details, Description & Markdown Content) */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-5">
          <Card className="border border-border dark:border-zinc-800 bg-card dark:bg-[#0F131C] shadow-2xs rounded-md">
            <CardHeader className="pb-3 border-b border-border/60 dark:border-zinc-800/80">
              <CardTitle className="text-sm font-semibold flex items-center gap-1.5 text-foreground dark:text-zinc-100">
                <FileText className="h-3.5 w-3.5 text-primary" /> Story Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground dark:text-zinc-200">
                  Title *
                </label>
                <Input
                  type="text"
                  placeholder="e.g. 10 Days in Japan: A First-Timer's Complete Guide"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={handleTitleBlur}
                  className="h-9 text-xs bg-background dark:bg-[#121622] border-border dark:border-zinc-800 text-foreground dark:text-zinc-100 dark:placeholder:text-zinc-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground dark:text-zinc-200">
                  URL Slug
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground dark:text-zinc-500 text-[11px] font-mono select-none">
                    /stories/
                  </span>
                  <Input
                    type="text"
                    placeholder="auto-generated"
                    value={slug}
                    onChange={(e) =>
                      setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))
                    }
                    className="h-9 pl-16 text-xs font-mono bg-background dark:bg-[#121622] border-border dark:border-zinc-800 text-foreground dark:text-zinc-100"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground dark:text-zinc-200">
                  Excerpt / Summary
                </label>
                <Textarea
                  placeholder="A short summary that appears in discovery listings (max 500 characters)..."
                  rows={2}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  maxLength={500}
                  className="text-xs resize-none leading-relaxed bg-background dark:bg-[#121622] border-border dark:border-zinc-800 text-foreground dark:text-zinc-100 dark:placeholder:text-zinc-500"
                />
                <p className="text-[11px] text-muted-foreground dark:text-zinc-500 text-right">
                  {excerpt.length}/500
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-foreground dark:text-zinc-200">
                    Content * (Markdown supported)
                  </label>
                  <span className="text-[11px] text-muted-foreground dark:text-zinc-400">
                    {content.split(/\s+/).filter(Boolean).length} words
                  </span>
                </div>
                <Textarea
                  placeholder={`# Introduction\n\nWrite your travel story here. You can use **bold**, *italic*, ## headings, and - bullet lists.\n\n## Day 1: Arrival in Tokyo\n...`}
                  rows={18}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="text-xs font-mono resize-y leading-relaxed min-h-[360px] bg-background dark:bg-[#121622] border-border dark:border-zinc-800 text-foreground dark:text-zinc-100 dark:placeholder:text-zinc-500"
                />
                <p className="text-[11px] text-muted-foreground dark:text-zinc-400">
                  Markdown formatting is supported. Use ## for sections, - for bullet lists, and **text** for bold.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (Cover Image, Tags, Linked Trip, and Actions) */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-5 lg:sticky lg:top-20">
          {/* Cover Image Upload Card */}
          <Card className="border border-border dark:border-zinc-800 bg-card dark:bg-[#0F131C] shadow-2xs rounded-md overflow-hidden">
            <CardHeader className="pb-3 border-b border-border/60 dark:border-zinc-800/80">
              <CardTitle className="text-sm font-semibold text-foreground dark:text-zinc-100">Cover Image</CardTitle>
              <CardDescription className="text-xs text-muted-foreground dark:text-zinc-400">
                Visual header that will appear at the top of your story and in feeds.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <ImageUpload
                folder="stories"
                currentImageUrl={coverImageUrl || undefined}
                onUploaded={(url: string) => setCoverImageUrl(url)}
                onRemoved={() => setCoverImageUrl("")}
              />
            </CardContent>
          </Card>

          {/* Story Photos & Trip Gallery Card */}
          <Card className="border border-border dark:border-zinc-800 bg-card dark:bg-[#0F131C] shadow-2xs rounded-md overflow-hidden">
            <CardHeader className="pb-3 border-b border-border/60 dark:border-zinc-800/80">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold flex items-center gap-1.5 text-foreground dark:text-zinc-100">
                  <Camera className="h-3.5 w-3.5 text-primary" /> Trip Photos ({images.length})
                </CardTitle>
                <label className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline cursor-pointer">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handlePhotosUpload}
                    className="hidden"
                    disabled={isUploadingPhotos}
                  />
                  {isUploadingPhotos ? (
                    <span className="flex items-center gap-1 text-muted-foreground dark:text-zinc-400">
                      <Loader2 className="w-3 h-3 animate-spin" /> Uploading...
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Plus className="w-3 h-3" /> Add Photos
                    </span>
                  )}
                </label>
              </div>
              <CardDescription className="text-xs text-muted-foreground dark:text-zinc-400">
                Upload multiple snapshots of places visited. Readers can view them in the story gallery or lightbox.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-4">
              {images.length === 0 ? (
                <label className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-border dark:border-zinc-800 hover:border-primary/50 dark:hover:border-primary/50 rounded-md cursor-pointer bg-muted/20 dark:bg-zinc-900/30 hover:bg-muted/40 dark:hover:bg-zinc-900/60 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handlePhotosUpload}
                    className="hidden"
                    disabled={isUploadingPhotos}
                  />
                  {isUploadingPhotos ? (
                    <Loader2 className="h-6 w-6 text-primary animate-spin mb-1.5" />
                  ) : (
                    <ImagePlus className="h-6 w-6 text-muted-foreground dark:text-zinc-500 mb-1.5" />
                  )}
                  <span className="text-xs font-semibold text-foreground dark:text-zinc-200">
                    {isUploadingPhotos ? "Uploading photos..." : "Add trip photos"}
                  </span>
                  <span className="text-[10px] text-muted-foreground dark:text-zinc-400 mt-0.5">
                    Select multiple JPG, PNG, or WebP files
                  </span>
                </label>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {images.map((imgUrl, i) => {
                    const isCover = coverImageUrl === imgUrl;
                    return (
                      <div
                        key={imgUrl + i}
                        className={`group relative aspect-4/3 rounded-md overflow-hidden border bg-muted/30 dark:bg-zinc-900/50 ${
                          isCover ? "border-primary ring-1 ring-primary" : "border-border dark:border-zinc-800"
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={imgUrl}
                          alt={`Trip photo ${i + 1}`}
                          className="h-full w-full object-cover"
                        />
                        {isCover && (
                          <div className="absolute top-1 left-1 bg-primary text-primary-foreground text-[9px] font-bold px-1.5 py-0.5 rounded-sm shadow-xs">
                            Cover
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/65 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 p-1 text-white">
                          {!isCover && (
                            <button
                              type="button"
                              onClick={() => handleSetCover(imgUrl)}
                              className="text-[10px] font-medium bg-white/20 hover:bg-white/30 px-1.5 py-0.5 rounded-sm transition-colors cursor-pointer w-full text-center"
                            >
                              Make Cover
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleInsertIntoMarkdown(imgUrl)}
                            className="text-[10px] font-medium bg-primary/80 hover:bg-primary px-1.5 py-0.5 rounded-sm transition-colors cursor-pointer w-full text-center"
                          >
                            Insert in Text
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(imgUrl)}
                            className="text-[10px] font-medium bg-destructive/80 hover:bg-destructive px-1.5 py-0.5 rounded-sm transition-colors cursor-pointer w-full text-center"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tags & Trip Link Card */}
          <Card className="border border-border dark:border-zinc-800 bg-card dark:bg-[#0F131C] shadow-2xs rounded-md">
            <CardHeader className="pb-3 border-b border-border/60 dark:border-zinc-800/80">
              <CardTitle className="text-sm font-semibold flex items-center gap-1.5 text-foreground dark:text-zinc-100">
                <Tag className="h-3.5 w-3.5 text-primary" /> Tags & Trip Link
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              {/* Tags */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground dark:text-zinc-200">Tags</label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="e.g. japan, solo-travel"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                    className="h-8 text-xs bg-background dark:bg-[#121622] border-border dark:border-zinc-800 text-foreground dark:text-zinc-100 dark:placeholder:text-zinc-500"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs px-3 cursor-pointer border-border dark:border-zinc-800 dark:hover:bg-zinc-800/60"
                    onClick={addTag}
                    disabled={tags.length >= 10}
                  >
                    Add
                  </Button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="text-[11px] gap-1 cursor-pointer hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => removeTag(tag)}
                      >
                        #{tag} <X className="h-2.5 w-2.5" />
                      </Badge>
                    ))}
                  </div>
                )}
                <p className="text-[11px] text-muted-foreground dark:text-zinc-400">
                  {tags.length}/10 tags · Press Enter or click Add
                </p>
              </div>

              {/* Linked Trip */}
              {userTrips.length > 0 && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold flex items-center gap-1.5 text-foreground dark:text-zinc-200">
                    <Link2 className="h-3 w-3 text-primary" /> Link Workspace Trip
                  </label>
                  <Select
                    value={linkedTripId || "none"}
                    onValueChange={(val) => setLinkedTripId(val === "none" ? "" : val)}
                  >
                    <SelectTrigger className="w-full h-9 rounded-md border border-input dark:border-zinc-800 bg-background dark:bg-[#121622] px-3 text-xs text-foreground dark:text-zinc-100 cursor-pointer">
                      <SelectValue placeholder="— No linked trip —" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover dark:bg-[#0F131C] border-border dark:border-zinc-800">
                      <SelectItem value="none" className="text-xs cursor-pointer text-muted-foreground dark:text-zinc-400">
                        — No linked trip —
                      </SelectItem>
                      {userTrips.map((t) => (
                        <SelectItem key={t.id} value={t.id} className="text-xs cursor-pointer dark:hover:bg-zinc-800/60">
                          <span className="font-medium text-foreground dark:text-zinc-200">{t.title}</span>
                          {t.destination && (
                            <span className="text-muted-foreground dark:text-zinc-400 text-[11px] ml-1.5">
                              · {t.destination}
                            </span>
                          )}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-[11px] text-muted-foreground dark:text-zinc-400">
                    Readers can 1-click clone this trip itinerary directly into their workspace.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
