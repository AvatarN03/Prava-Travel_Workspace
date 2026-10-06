"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

import {
  AlertCircle,
  ArrowLeft,
  ArrowUp,
  Calendar,
  Check,
  ChevronRight,
  CloudSun,
  Coins,
  Copy,
  CornerDownLeft,
  Cpu,
  History,
  Loader2,
  Maximize2,
  Minimize2,
  Pencil,
  Plus,
  ThumbsDown,
  ThumbsUp,
  Trash2,
  X,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { UpgradeDialog } from "@/features/pricing";
import { AiProposalCard } from "./ai-proposal-card";

import { useWorkspaceAi } from "../../context/workspace-ai-context";

import { cn } from "@/lib/utils";
import {
  createTripConversationThread,
  deleteTripConversationThread,
  getTripConversation,
  getTripConversationThreads,
  sendTripMessage,
  updateTripConversationTitle,
} from "../actions";

import type { ConversationThreadDTO, MessageDTO } from "../actions";
import type { AiProposalDTO } from "../schema";

const MAX_MESSAGES_LIMIT = 15;

function formatModelName(model?: string): string | null {
  if (!model) return null;
  if (model.includes("3.8")) return "Gemini 3.8 Flash";
  if (model.includes("3.7")) return "Gemini 3.7 Flash";
  if (model.includes("3.6")) return "Gemini 3.6 Flash";
  if (model.includes("3.1-flash-lite") || model.includes("flash-lite")) return "Gemini 3.1 Flash Lite";
  if (model.includes("nex-n2.5")) return "Nex N2.5 Pro (Free)";
  if (model.includes("nemotron")) return "Nemotron 3.5 (Free)";
  if (model.includes("openrouter/free")) return "OpenRouter Free";
  if (model.includes("gemini")) return "Gemini Flash";
  return model.split("/").pop() || model;
}

function renderInlineSpans(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
    const italicMatch = remaining.match(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/);
    const codeMatch = remaining.match(/`([^`]+)`/);
    const linkMatch = remaining.match(/\[(.+?)\]\((.+?)\)/);

    let earliestIdx = Infinity;
    let type: "bold" | "italic" | "code" | "link" | null = null;
    let match: RegExpMatchArray | null = null;

    if (boldMatch && boldMatch.index !== undefined && boldMatch.index < earliestIdx) {
      earliestIdx = boldMatch.index;
      type = "bold";
      match = boldMatch;
    }
    if (italicMatch && italicMatch.index !== undefined && italicMatch.index < earliestIdx) {
      earliestIdx = italicMatch.index;
      type = "italic";
      match = italicMatch;
    }
    if (codeMatch && codeMatch.index !== undefined && codeMatch.index < earliestIdx) {
      earliestIdx = codeMatch.index;
      type = "code";
      match = codeMatch;
    }
    if (linkMatch && linkMatch.index !== undefined && linkMatch.index < earliestIdx) {
      earliestIdx = linkMatch.index;
      type = "link";
      match = linkMatch;
    }

    if (!type || !match || earliestIdx === Infinity) {
      parts.push(remaining);
      break;
    }

    if (earliestIdx > 0) {
      parts.push(remaining.substring(0, earliestIdx));
    }

    if (type === "bold") {
      parts.push(
        <strong key={`b-${key++}`} className="font-semibold text-white dark:text-slate-900">
          {match[1]}
        </strong>
      );
    } else if (type === "italic") {
      parts.push(
        <em key={`i-${key++}`} className="italic text-slate-300 dark:text-slate-600">
          {match[1]}
        </em>
      );
    } else if (type === "code") {
      parts.push(
        <code
          key={`c-${key++}`}
          className="rounded px-1.5 py-0.5 text-[11px] font-mono bg-[#1E2B45] text-blue-200 border border-[#2D3F63] dark:bg-slate-200 dark:text-blue-800 dark:border-slate-300 font-medium"
        >
          {match[1]}
        </code>
      );
    } else if (type === "link") {
      const label = match[1];
      const url = match[2];
      const isInternalTool = url.startsWith("/travel-essentials");

      if (isInternalTool) {
        parts.push(
          <a
            key={`tool-btn-${key++}`}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1 my-1.5 text-xs font-semibold rounded-md bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white shadow-xs border border-white/10 dark:border-black/15 transition-all cursor-pointer no-underline"
          >
            {label}
            <span aria-hidden="true">&rarr;</span>
          </a>
        );
      } else {
        parts.push(
          <a
            key={`a-${key++}`}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#2D9BF0] underline hover:text-[#5ab1f5] font-medium cursor-pointer"
          >
            {label}
          </a>
        );
      }
    }

    remaining = remaining.substring(earliestIdx + match[0].length);
  }

  return parts.length > 0 ? parts : text;
}

function FormattedMessageContent({
  content,
  isUser,
}: {
  content: string;
  isUser: boolean;
}) {
  if (isUser) {
    return <div className="break-words [overflow-wrap:anywhere]">{content}</div>;
  }

  // Strip any accidental proposal code blocks, developer JSON dumps, thinking traces, or citations
  const sanitized = content
    .replace(/<think>[\s\S]*?<\/think>/gi, "")
    .replace(/<thought>[\s\S]*?<\/thought>/gi, "")
    .replace(/(?:^|\n)(?:Here's a thinking process:?|Thinking Process:?|Thinking:?)\s*[\s\S]*?(?=(?:\n\s*\n(?:[A-Z#*]|Hey|Hello|Hi|Current|The))|$)/gi, "")
    .replace(/(?:^|\n)\d+\.\s+(?:Analyze User Input|Check Available Data|Identify Constraints|Gap Identification):[\s\S]*?(?=(?:\n\s*\n(?:[A-Z#*]|Hey|Hello|Hi|Current|The))|$)/gi, "")
    .replace(/```(?:json:proposal|proposal|json)[\s\S]*?(?:```|$)/gi, "")
    .replace(/(?:\*{0,2}Live Data Citation:?\*{0,2}\s*)?```(?:json)?\s*\{[\s\S]*?(?:```|$)/gi, "")
    .replace(/```json[\s\S]*?(?:```|$)/gi, "")
    .trim();

  const lines = sanitized.split("\n");
  const nodes: React.ReactNode[] = [];
  let currentList: string[] = [];

  const flushList = () => {
    if (currentList.length > 0) {
      nodes.push(
        <ul key={`ul-${nodes.length}`} className="my-1.5 space-y-1 pl-4 list-disc list-outside text-slate-200 dark:text-slate-800">
          {currentList.map((item, i) => (
            <li key={i} className="leading-relaxed">
              {renderInlineSpans(item)}
            </li>
          ))}
        </ul>
      );
      currentList = [];
    }
  };

  lines.forEach((rawLine, idx) => {
    const line = rawLine.trimEnd();
    if (!line.trim()) {
      flushList();
      return;
    }

    // List item
    if (/^[-*+]\s+/.test(line.trim())) {
      currentList.push(line.trim().replace(/^[-*+]\s+/, ""));
      return;
    }

    // Flush any pending list
    flushList();

    // Headers
    if (line.startsWith("### ")) {
      nodes.push(
        <h5 key={`h5-${idx}`} className="font-semibold text-xs text-white dark:text-slate-900 mt-2 mb-1">
          {renderInlineSpans(line.replace("### ", ""))}
        </h5>
      );
    } else if (line.startsWith("## ")) {
      nodes.push(
        <h4 key={`h4-${idx}`} className="font-bold text-xs text-white dark:text-slate-900 mt-2.5 mb-1">
          {renderInlineSpans(line.replace("## ", ""))}
        </h4>
      );
    } else if (line.startsWith("# ")) {
      nodes.push(
        <h3 key={`h3-${idx}`} className="font-bold text-sm text-white dark:text-slate-900 mt-3 mb-1.5">
          {renderInlineSpans(line.replace("# ", ""))}
        </h3>
      );
    } else if (line.startsWith("> ")) {
      nodes.push(
        <blockquote key={`bq-${idx}`} className="pl-2.5 border-l-2 border-[#2D9BF0] italic text-slate-300 dark:text-slate-700 bg-white/5 dark:bg-slate-200/50 py-0.5 rounded-r my-1.5">
          {renderInlineSpans(line.replace(/^>\s*/, ""))}
        </blockquote>
      );
    } else {
      nodes.push(
        <p key={`p-${idx}`} className="my-1 text-slate-200 dark:text-slate-800 leading-relaxed">
          {renderInlineSpans(line)}
        </p>
      );
    }
  });

  flushList();

  return <div className="space-y-1 break-words [overflow-wrap:anywhere] overflow-hidden">{nodes}</div>;
}

interface WorkspaceAiPanelProps {
  tripId: string;
  tripTitle: string;
  destination?: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function WorkspaceAiPanel({
  tripId,
  tripTitle,
  destination,
  isOpen,
  onClose,
}: WorkspaceAiPanelProps) {
  const { userQuota, setUserQuota, pendingPrompt, clearPendingPrompt } = useWorkspaceAi();
  const [messages, setMessages] = useState<MessageDTO[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [activeConversationTitle, setActiveConversationTitle] = useState<string>("");
  const [threads, setThreads] = useState<ConversationThreadDTO[]>([]);
  const [activeTab, setActiveTab] = useState<"chat" | "history">("chat");
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingThread, setIsCreatingThread] = useState(false);
  const [editingThreadId, setEditingThreadId] = useState<string | null>(null);
  const [editingThreadTitle, setEditingThreadTitle] = useState<string>("");
  const [isEditingHeaderTitle, setIsEditingHeaderTitle] = useState(false);
  const [headerTitleInput, setHeaderTitleInput] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);
  const [aiAutoPropose, setAiAutoPropose] = useState<boolean>(true);
  const [userCurrency, setUserCurrency] = useState<string>("INR");
  const [isInitialized, setIsInitialized] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [reasoningExpanded, setReasoningExpanded] = useState<Record<string, boolean>>({});
  const [feedback, setFeedback] = useState<Record<string, "up" | "down">>({});
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatScrollContainerRef = useRef<HTMLDivElement>(null);
  const isInitialLoadRef = useRef(true);

  useEffect(() => {
    if (isOpen) {
      setIsInitialized(false);
      loadInitialConversation();
      loadThreadsList();
    }
  }, [isOpen, tripId]);

  useEffect(() => {
    if (isOpen && isInitialized && pendingPrompt && !isLoading) {
      const promptToDispatch = pendingPrompt;
      clearPendingPrompt();
      setActiveTab("chat");
      handleSend(promptToDispatch);
    }
  }, [isOpen, isInitialized, pendingPrompt, isLoading]);

  useEffect(() => {
    if (activeTab === "chat" && chatScrollContainerRef.current) {
      if (isInitialLoadRef.current) {
        chatScrollContainerRef.current.scrollTop = chatScrollContainerRef.current.scrollHeight;
        isInitialLoadRef.current = false;
      } else {
        chatScrollContainerRef.current.scrollTo({
          top: chatScrollContainerRef.current.scrollHeight,
          behavior: "smooth",
        });
      }
    }
  }, [messages, isLoading, activeTab]);

  const loadInitialConversation = async (targetId?: string) => {
    setError(null);
    const res = await getTripConversation(tripId, targetId);
    if (res.success && res.messages) {
      setMessages(res.messages);
      setActiveConversationId(res.conversationId || null);
      setActiveConversationTitle(res.conversationTitle || "Ichinose");
      if (res.userQuota) {
        setUserQuota(res.userQuota);
      }
      if ((res as unknown as { aiAutoPropose?: boolean }).aiAutoPropose !== undefined) {
        setAiAutoPropose((res as unknown as { aiAutoPropose?: boolean }).aiAutoPropose ?? true);
      }
      if ((res as unknown as { userCurrency?: string }).userCurrency) {
        setUserCurrency((res as unknown as { userCurrency?: string }).userCurrency || "INR");
      }
    }
    setIsInitialized(true);
  };

  const loadThreadsList = async () => {
    const res = await getTripConversationThreads(tripId);
    if (res.success && res.threads) {
      setThreads(res.threads);
    }
  };

  const handleSelectThread = async (threadId: string) => {
    isInitialLoadRef.current = true;
    setActiveTab("chat");
    setEditingThreadId(null);
    await loadInitialConversation(threadId);
  };

  const handleNewChat = async () => {
    // If the currently open chat is already empty, no need to create another new chat
    if (messages.length === 0) {
      setActiveTab("chat");
      textareaRef.current?.focus();
      return;
    }

    setIsCreatingThread(true);
    setError(null);
    const res = await createTripConversationThread(tripId);
    setIsCreatingThread(false);
    if (res.success && res.conversationId) {
      isInitialLoadRef.current = true;
      setActiveTab("chat");
      setEditingThreadId(null);
      await loadInitialConversation(res.conversationId);
      await loadThreadsList();
      setTimeout(() => textareaRef.current?.focus(), 50);
    } else {
      setError(res.error || "Failed to create new chat session");
    }
  };

  const handleDeleteThread = async (e: React.MouseEvent, threadId: string) => {
    e.stopPropagation();
    if (!confirm("Delete this conversation thread from history?")) return;
    await deleteTripConversationThread(threadId);
    await loadThreadsList();
    if (activeConversationId === threadId) {
      await loadInitialConversation();
    }
  };

  const handleStartEditThread = (e: React.MouseEvent, thread: ConversationThreadDTO) => {
    e.stopPropagation();
    setEditingThreadId(thread.id);
    setEditingThreadTitle(thread.title);
  };

  const handleSaveThreadTitle = async (threadId: string) => {
    const trimmed = editingThreadTitle.trim();
    if (!trimmed) {
      setEditingThreadId(null);
      return;
    }
    setThreads((prev) =>
      prev.map((t) => (t.id === threadId ? { ...t, title: trimmed } : t))
    );
    if (activeConversationId === threadId) {
      setActiveConversationTitle(trimmed);
    }
    setEditingThreadId(null);

    const res = await updateTripConversationTitle(threadId, trimmed);
    if (res.success) {
      toast.success("Chat renamed");
    } else {
      toast.error(res.error || "Failed to rename chat");
      await loadThreadsList();
    }
  };

  const handleStartEditHeader = () => {
    if (!activeConversationId) return;
    setIsEditingHeaderTitle(true);
    setHeaderTitleInput(activeConversationTitle || "Ichinose");
  };

  const handleSaveHeaderTitle = async () => {
    if (!activeConversationId) {
      setIsEditingHeaderTitle(false);
      return;
    }
    const trimmed = headerTitleInput.trim();
    if (!trimmed || trimmed === activeConversationTitle) {
      setIsEditingHeaderTitle(false);
      return;
    }
    setActiveConversationTitle(trimmed);
    setThreads((prev) =>
      prev.map((t) => (t.id === activeConversationId ? { ...t, title: trimmed } : t))
    );
    setIsEditingHeaderTitle(false);

    const res = await updateTripConversationTitle(activeConversationId, trimmed);
    if (res.success) {
      toast.success("Chat renamed");
    } else {
      toast.error(res.error || "Failed to rename chat");
      if (res.title) setActiveConversationTitle(res.title);
    }
  };

  const handleProposalResolved = (updatedProposal: AiProposalDTO) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.proposal && msg.proposal.id === updatedProposal.id
          ? { ...msg, proposal: updatedProposal }
          : msg
      )
    );
  };

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend ?? input).trim();
    if (!query || isLoading) return;

    if (messages.length >= MAX_MESSAGES_LIMIT) {
      setError(`Thread limit reached (${MAX_MESSAGES_LIMIT} messages). Please start a new chat session.`);
      return;
    }

    setInput("");
    setError(null);

    const tempUserMsg: MessageDTO = {
      id: "temp-" + Date.now(),
      role: "user",
      content: query,
      createdAt: new Date().toISOString(),
      proposal: null,
    };

    setMessages((prev) => [...prev, tempUserMsg]);
    setIsLoading(true);

    const res = await sendTripMessage(tripId, query, activeConversationId || undefined);

    setIsLoading(false);

    if (res.success && res.assistantMessage) {
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== tempUserMsg.id),
        res.userMessage!,
        res.assistantMessage!,
      ]);
      if (res.userQuota) {
        setUserQuota(res.userQuota);
      }
      if ((res as unknown as { userCurrency?: string }).userCurrency) {
        setUserCurrency((res as unknown as { userCurrency?: string }).userCurrency || "INR");
      }
      if (messages.length === 0) {
        loadThreadsList();
      }
    } else {
      setError(res.error || "Failed to generate AI response");
      if (res.limitReached) {
        setUpgradeDialogOpen(true);
      }
    }
  };

  const toggleReasoning = (msgId: string) => {
    setReasoningExpanded((prev) => ({
      ...prev,
      [msgId]: !prev[msgId],
    }));
  };

  const handleCopyMessage = (msgId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMessageId(msgId);
    toast.success("Copied to clipboard");
    setTimeout(() => {
      setCopiedMessageId(null);
    }, 2000);
  };

  const handleFeedback = (msgId: string, type: "up" | "down") => {
    setFeedback((prev) => {
      const next = { ...prev };
      if (next[msgId] === type) {
        delete next[msgId];
      } else {
        next[msgId] = type;
        toast.success(type === "up" ? "Thanks for your feedback!" : "Feedback recorded");
      }
      return next;
    });
  };

  const quickPrompts = [
    `Check live weather forecast for ${destination || tripTitle}`,
    `Convert 150 USD to INR (live ECB exchange rates)`,
    `Summarize my current itinerary and scheduled activities`,
    `Add an activity: "Morning Zen Meditation" on Day 1 at 08:00 AM`,
  ];

  const isThreadLimitReached = messages.length >= MAX_MESSAGES_LIMIT;
  const isCreditDepleted = Boolean(userQuota && userQuota.remaining <= 0);

  return (
    <TooltipProvider delayDuration={150}>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={onClose}
        />
      )}

      {/* Main Right Sidebar AI Assistant Panel */}
      <aside
        onWheel={(e) => {
          e.stopPropagation();
        }}
        className={cn(
          "shrink-0 flex flex-col h-full select-none overscroll-contain transition-all duration-300 ease-in-out",
          // Opposite-theme styling: In light mode, panel is dark; in dark mode, panel is light (strictly matching Sidebar)
          "bg-[#090E1A] text-slate-200 border-l border-[#152033] dark:bg-slate-100 dark:text-slate-900 dark:border-slate-300 md:border-l md:border-[#152033] dark:md:border-slate-300",
          // Mobile fixed overlay drawer:
          "fixed inset-y-0 right-0 z-40 w-full sm:w-[460px]",
          // Desktop: static flex child that smoothly expands from width 0
          "md:static md:z-auto",
          isOpen
            ? isExpanded
              ? "translate-x-0 md:w-[620px] lg:w-[680px] xl:w-[740px] md:opacity-100"
              : "translate-x-0 md:w-[440px] lg:w-[470px] xl:w-[500px] md:opacity-100"
            : "translate-x-full md:translate-x-0 md:w-0 md:opacity-0 md:overflow-hidden md:pointer-events-none"
        )}
        style={{ overscrollBehavior: "contain" }}
        aria-hidden={!isOpen}
      >
        <div
          className={cn(
            "h-full flex flex-col min-w-0 transition-all duration-300",
            isExpanded
              ? "w-full md:w-[620px] lg:w-[680px] xl:w-[740px]"
              : "w-full md:w-[440px] lg:w-[470px] xl:w-[500px]"
          )}
        >
          {/* Header - Sleek Supabase Style (Opposite-theme synchronized) */}
          <div className="flex h-14 items-center justify-between px-3.5 border-b border-[#152033] bg-[#090E1A] dark:border-slate-300 dark:bg-slate-100 shrink-0 gap-2">
            {/* Left: Chat Title (Double Click to Rename) */}
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              {isEditingHeaderTitle ? (
                <div className="min-w-0 flex-1">
                  <input
                    type="text"
                    value={headerTitleInput}
                    onChange={(e) => setHeaderTitleInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleSaveHeaderTitle();
                      } else if (e.key === "Escape") {
                        e.preventDefault();
                        setIsEditingHeaderTitle(false);
                        setHeaderTitleInput(activeConversationTitle || "Ichinose");
                      }
                    }}
                    onBlur={handleSaveHeaderTitle}
                    autoFocus
                    className="h-7 w-full max-w-[240px] rounded-sm border border-[#2D9BF0] bg-[#0E1729] dark:bg-white px-2.5 py-0.5 text-xs font-semibold text-white dark:text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#2D9BF0] shadow-xs"
                  />
                </div>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      onDoubleClick={handleStartEditHeader}
                      className="flex items-center gap-2 min-w-0 cursor-pointer select-none group"
                    >
                      <span className="text-sm font-semibold text-white dark:text-slate-900 group-hover:text-[#2D9BF0] transition-colors truncate">
                        {activeConversationTitle || "Ichinose"}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" align="start">
                    Double-click to rename chat
                  </TooltipContent>
                </Tooltip>
              )}
            </div>

            {/* Right: Supabase Action Bar (History, New Chat, Expand, 3-Dots, Close) */}
            <div className="flex items-center gap-1 shrink-0">
              {/* History / Threads Toggle Button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setActiveTab(activeTab === "history" ? "chat" : "history")}
                    className={cn(
                      "h-8 w-8 rounded-md transition-colors cursor-pointer",
                      activeTab === "history"
                        ? "bg-[#2D9BF0]/20 text-[#2D9BF0]"
                        : "text-slate-400 hover:text-white hover:bg-white/10 dark:text-slate-600 dark:hover:text-slate-950 dark:hover:bg-slate-200"
                    )}
                    aria-label="Chat history"
                  >
                    <History className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Chat history ({threads.length})</TooltipContent>
              </Tooltip>

              {/* New Chat Button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleNewChat}
                    disabled={isCreatingThread}
                    className="h-8 w-8 rounded-md text-slate-400 hover:text-white hover:bg-white/10 dark:text-slate-600 dark:hover:text-slate-950 dark:hover:bg-slate-200 cursor-pointer transition-colors"
                    aria-label="New chat"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">New chat</TooltipContent>
              </Tooltip>

              {/* Expand / Maximize Toggle */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="hidden sm:inline-flex h-8 w-8 rounded-md text-slate-400 hover:text-white hover:bg-white/10 dark:text-slate-600 dark:hover:text-slate-950 dark:hover:bg-slate-200 cursor-pointer transition-colors"
                    aria-label={isExpanded ? "Collapse width" : "Expand width"}
                  >
                    {isExpanded ? (
                      <Minimize2 className="h-4 w-4" />
                    ) : (
                      <Maximize2 className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  {isExpanded ? "Collapse width" : "Expand width"}
                </TooltipContent>
              </Tooltip>

              {/* Close Button (Always visible on all screens like Supabase) */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="h-8 w-8 rounded-md text-slate-400 hover:text-white hover:bg-white/10 dark:text-slate-600 dark:hover:text-slate-950 dark:hover:bg-slate-200 cursor-pointer transition-colors"
                    aria-label="Close assistant"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Close assistant</TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* VIEW 1: DEDICATED THREADS / HISTORY PANEL */}
          {activeTab === "history" && (
            <div
              className="flex-1 overflow-y-auto overscroll-contain p-3.5 space-y-2 bg-[#090E1A] dark:bg-slate-100 thin-scrollbar"
              style={{ overscrollBehavior: "contain" }}
            >
              <div className="flex items-center justify-between pb-2 border-b border-[#152033] dark:border-slate-300">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveTab("chat")}
                  className="h-7 px-2 text-xs gap-1.5 text-slate-300 hover:text-white hover:bg-white/10 dark:text-slate-600 dark:hover:text-slate-900 dark:hover:bg-slate-200 cursor-pointer transition-colors"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Back to Chat</span>
                </Button>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                  {threads.length} threads · max {MAX_MESSAGES_LIMIT} msgs
                </span>
              </div>

              {threads.length === 0 ? (
                <div className="p-8 text-center border border-dashed border-[#152033] dark:border-slate-300 rounded-lg bg-[#0E1729]/50 dark:bg-white/70 space-y-3">
                  <History className="w-7 h-7 text-slate-500/60 dark:text-slate-400 mx-auto" />
                  <p className="text-xs text-slate-400 dark:text-slate-600">
                    No conversation threads yet.
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs gap-1 border-[#1E2B45] text-[#2D9BF0] hover:bg-[#2D9BF0]/15 dark:border-slate-300 dark:hover:bg-blue-50 rounded-md cursor-pointer"
                    onClick={handleNewChat}
                    disabled={isCreatingThread}
                  >
                    <Plus className="h-3 w-3" /> Start First Chat
                  </Button>
                </div>
              ) : (
                <div className="space-y-1.5 pt-1">
                  {threads.map((thread) => {
                    const isEditing = editingThreadId === thread.id;
                    const isActive = activeConversationId === thread.id;

                    return (
                      <div
                        key={thread.id}
                        onClick={() => {
                          if (!isEditing) handleSelectThread(thread.id);
                        }}
                        className={cn(
                          "group relative flex flex-col p-3 rounded-lg border transition-all cursor-pointer",
                          isActive
                            ? "border-[#2D9BF0] bg-[#2D9BF0]/10 shadow-xs dark:bg-blue-50/80 dark:border-blue-400"
                            : "border-[#152033] bg-[#0E1729] hover:border-slate-700 hover:bg-[#15223D] dark:border-slate-200 dark:bg-white dark:hover:border-slate-300 dark:hover:bg-slate-50"
                        )}
                      >
                        <div className="flex items-center justify-between gap-2 min-w-0">
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            {isEditing ? (
                              <div
                                className="flex items-center gap-1 min-w-0 flex-1"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <input
                                  type="text"
                                  value={editingThreadTitle}
                                  onChange={(e) => setEditingThreadTitle(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault();
                                      handleSaveThreadTitle(thread.id);
                                    } else if (e.key === "Escape") {
                                      e.preventDefault();
                                      setEditingThreadId(null);
                                    }
                                  }}
                                  onBlur={() => handleSaveThreadTitle(thread.id)}
                                  autoFocus
                                  className="h-6 w-full rounded border border-[#2D9BF0] bg-[#0E1729] dark:bg-white px-1.5 text-xs text-white dark:text-slate-900 focus:outline-none"
                                />
                                <button
                                  type="button"
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                    handleSaveThreadTitle(thread.id);
                                  }}
                                  className="text-[#2D9BF0] p-0.5 rounded cursor-pointer shrink-0"
                                  title="Save title"
                                >
                                  <Check className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                    setEditingThreadId(null);
                                  }}
                                  className="text-slate-400 hover:text-white dark:text-slate-500 dark:hover:text-slate-900 p-0.5 rounded cursor-pointer shrink-0"
                                  title="Cancel"
                                >
                                  <X className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            ) : (
                              <span
                                className={cn(
                                  "text-xs truncate font-medium",
                                  isActive
                                    ? "text-[#2D9BF0] font-semibold"
                                    : "text-slate-200 dark:text-slate-800"
                                )}
                              >
                                {thread.title}
                              </span>
                            )}
                          </div>

                          {!isEditing && (
                            <div className="flex items-center gap-1 shrink-0">
                              {isActive && (
                                <Badge
                                  variant="secondary"
                                  className="text-[9px] px-1.5 py-0 h-4 bg-[#2D9BF0]/20 text-[#2D9BF0] border-[#2D9BF0]/30 font-semibold rounded"
                                >
                                  Active
                                </Badge>
                              )}
                              <button
                                type="button"
                                onClick={(e) => handleStartEditThread(e, thread)}
                                className="text-slate-400 hover:text-[#2D9BF0] dark:text-slate-500 dark:hover:text-blue-600 p-1 rounded transition-colors opacity-60 group-hover:opacity-100 cursor-pointer"
                                title="Rename chat"
                              >
                                <Pencil className="h-3 w-3" />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => handleDeleteThread(e, thread.id)}
                                className="text-slate-400 hover:text-red-400 dark:text-slate-500 dark:hover:text-red-600 p-1 rounded transition-colors opacity-60 group-hover:opacity-100 cursor-pointer"
                                title="Delete thread"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 pt-1.5 border-t border-[#152033] dark:border-slate-100 mt-1.5">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-2.5 h-2.5 opacity-70" />
                            {new Date(thread.updatedAt).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                          <span
                            className={cn(
                              "font-medium",
                              thread.messageCount >= MAX_MESSAGES_LIMIT && "text-amber-400 font-semibold"
                            )}
                          >
                            {thread.messageCount}/{MAX_MESSAGES_LIMIT} messages
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* VIEW 2: ACTIVE CHAT FEED & CONVERSATION */}
          {activeTab === "chat" && (
            <>
              {/* Depleted Credits Notice Banner */}
              {isCreditDepleted && (
                <div className="mx-3.5 mt-2 p-2.5 rounded-lg bg-rose-500/15 border border-rose-500/30 text-[11px] text-rose-300 dark:bg-rose-50 dark:border-rose-200 dark:text-rose-800 flex items-start gap-1.5 shrink-0">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                  <div className="flex-1 leading-tight">
                    <span className="font-semibold">Monthly Credits Depleted: </span>
                    You have used all {userQuota?.quota}/{userQuota?.quota} AI assistant credits for this month.
                    <button
                      type="button"
                      onClick={() => setUpgradeDialogOpen(true)}
                      className="ml-1 font-bold underline hover:text-white dark:hover:text-rose-950 cursor-pointer"
                    >
                      Upgrade to Pro (150 Credits)
                    </button>
                  </div>
                </div>
              )}

              {/* Messages Feed */}
              <div
                ref={chatScrollContainerRef}
                className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-4 text-xs bg-[#090E1A] dark:bg-slate-100 thin-scrollbar"
                style={{ overscrollBehavior: "contain" }}
              >
                {messages.length === 0 ? (
                  <div className="space-y-4 py-8 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full overflow-hidden ring-2 ring-[#2D9BF0]/60 shadow-md bg-[#0E1729] dark:bg-white">
                      <Image
                        src="/avatars/ichinose.png"
                        alt="Ichinose"
                        width={56}
                        height={56}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="space-y-1.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <h4 className="text-base font-bold text-white dark:text-slate-900 tracking-tight">
                          Ichinose
                        </h4>
                        <Badge
                          variant="outline"
                          className="text-[10px] px-2 py-0.5 font-semibold text-[#2D9BF0] border-[#2D9BF0]/30 bg-[#2D9BF0]/15 rounded-md"
                        >
                          Prava Assistant
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-400 dark:text-slate-600 max-w-xs mx-auto leading-relaxed">
                        Your Prava workspace assistant. Ask questions, explore live weather and exchange rates, or request <span className="font-semibold text-white dark:text-slate-900">structured proposals</span> to update your trip.
                      </p>
                    </div>

                    {/* Quick Prompt Chips */}
                    <div className="pt-3 space-y-1.5 text-left max-w-sm mx-auto">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400/80 dark:text-slate-500 block px-1 select-none">
                        Suggested prompts:
                      </span>
                      {quickPrompts.map((prompt, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleSend(prompt)}
                          className="w-full text-left p-2.5 rounded-lg border border-[#152033] bg-[#0E1729] hover:border-[#2D9BF0]/50 hover:bg-[#15223D] text-slate-300 hover:text-white dark:border-slate-200 dark:bg-white dark:hover:border-blue-400 dark:hover:bg-blue-50/50 dark:text-slate-700 dark:hover:text-slate-950 transition-colors text-xs flex items-center justify-between group cursor-pointer shadow-xs"
                        >
                          <span className="line-clamp-1">{prompt}</span>
                          <CornerDownLeft className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-1.5" />
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div key={msg.id} className="space-y-2">
                      {msg.role === "user" ? (
                        /* User Message (Right-aligned bubble) */
                        <div className="flex flex-col items-end gap-1">
                          <div className="rounded-xl px-3.5 py-2.5 max-w-[85%] text-xs leading-relaxed bg-[#2D9BF0] text-white font-medium shadow-xs break-words [overflow-wrap:anywhere]">
                            {msg.content}
                          </div>
                          {msg.creditsCost !== undefined && msg.creditsCost > 0 && (
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono pr-1 select-none">
                              -{msg.creditsCost} {msg.creditsCost === 1 ? "credit" : "credits"}
                            </span>
                          )}
                        </div>
                      ) : (
                        /* Assistant Message (Supabase Clean Style) */
                        <div className="space-y-2 max-w-[95%]">
                          {/* Supabase Execution Status & Reasoning Toggle */}
                          <div className="space-y-1">
                            <div className="text-[11px] text-slate-400 dark:text-slate-500 font-mono flex items-center gap-2">
                              <span>{msg.creditsCost ? `${msg.creditsCost} credits consumed` : "AI query"}</span>
                              <span className="flex items-center gap-1 text-emerald-400 dark:text-emerald-600 font-medium">
                                <Check className="h-3 w-3" />
                                {msg.toolBadge ? `${msg.toolBadge} executed` : "Query executed"}
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => toggleReasoning(msg.id)}
                              className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 dark:text-slate-500 dark:hover:text-slate-800 font-mono transition-colors cursor-pointer select-none py-0.5"
                            >
                              <ChevronRight
                                className={cn(
                                  "h-3 w-3 transition-transform",
                                  reasoningExpanded[msg.id] && "rotate-90"
                                )}
                              />
                              <span>Reasoned</span>
                            </button>

                            {reasoningExpanded[msg.id] && (
                              <div className="p-2.5 rounded-md border border-[#1E2B45] bg-[#0E1729]/80 text-[11px] text-slate-400 font-mono leading-relaxed space-y-1 dark:border-slate-200 dark:bg-white dark:text-slate-600">
                                <div>• Evaluated user intent against active trip schedule and budget</div>
                                <div>• Grounded response in persisted workspace entities</div>
                                <div>• Formatted structured output for workspace planning</div>
                              </div>
                            )}
                          </div>

                          {/* Live Travel Essential Tool Badge if present */}
                          {msg.toolBadge && (
                            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#152542] border border-[#1E3A6B] text-blue-300 dark:bg-blue-50 dark:border-blue-200 dark:text-blue-800 text-[10px] font-medium w-fit not-italic">
                              {msg.toolBadge.toLowerCase().includes("weather") ? (
                                <CloudSun className="w-3 h-3 text-blue-400 shrink-0" />
                              ) : msg.toolBadge.toLowerCase().includes("free") ? (
                                <Zap className="w-3 h-3 text-amber-400 shrink-0" />
                              ) : (
                                <Coins className="w-3 h-3 text-amber-400 shrink-0" />
                              )}
                              <span>{msg.toolBadge}</span>
                            </div>
                          )}

                          {/* Message Content */}
                          <div className="text-slate-200 dark:text-slate-800 text-xs sm:text-[13px] leading-relaxed break-words [overflow-wrap:anywhere]">
                            <FormattedMessageContent
                              content={msg.content}
                              isUser={false}
                            />
                          </div>

                          {/* Model attribution badge */}
                          {msg.modelUsed && (
                            <div className="pt-0.5 flex items-center gap-1 text-[9px] text-slate-500 dark:text-slate-400 font-mono select-none">
                              <Cpu className="w-2.5 h-2.5" />
                              <span>{formatModelName(msg.modelUsed)}</span>
                            </div>
                          )}

                          {/* Supabase Action Toolbar (Thumbs Up, Thumbs Down, Copy) */}
                          <div className="flex items-center gap-1 pt-1 text-slate-400 dark:text-slate-500">
                            <button
                              type="button"
                              onClick={() => handleFeedback(msg.id, "up")}
                              className={cn(
                                "p-1 rounded hover:bg-white/10 hover:text-white dark:hover:bg-slate-200 dark:hover:text-slate-900 transition-colors cursor-pointer",
                                feedback[msg.id] === "up" && "text-[#2D9BF0] bg-[#2D9BF0]/15 dark:bg-blue-50"
                              )}
                              title="Helpful response"
                              aria-label="Helpful response"
                            >
                              <ThumbsUp className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleFeedback(msg.id, "down")}
                              className={cn(
                                "p-1 rounded hover:bg-white/10 hover:text-white dark:hover:bg-slate-200 dark:hover:text-slate-900 transition-colors cursor-pointer",
                                feedback[msg.id] === "down" && "text-rose-400 bg-rose-500/15 dark:bg-rose-50"
                              )}
                              title="Unhelpful response"
                              aria-label="Unhelpful response"
                            >
                              <ThumbsDown className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleCopyMessage(msg.id, msg.content)}
                              className="p-1 rounded hover:bg-white/10 hover:text-white dark:hover:bg-slate-200 dark:hover:text-slate-900 transition-colors cursor-pointer"
                              title="Copy response"
                              aria-label="Copy response"
                            >
                              {copiedMessageId === msg.id ? (
                                <Check className="h-3.5 w-3.5 text-emerald-400 dark:text-emerald-600" />
                              ) : (
                                <Copy className="h-3.5 w-3.5" />
                              )}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Render Structured Proposal Card if attached */}
                      {msg.proposal && (
                        <div className="pl-1 pr-1 pt-1">
                          <AiProposalCard
                            proposal={msg.proposal}
                            tripId={tripId}
                            userCurrency={userCurrency}
                            onProposalResolved={handleProposalResolved}
                          />
                        </div>
                      )}
                    </div>
                  ))
                )}

                {isLoading && (
                  <div className="flex items-start gap-2.5 text-xs py-2 animate-in fade-in duration-150">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full overflow-hidden ring-1 ring-[#2D9BF0]/40 bg-[#0E1729] dark:bg-white mt-0.5">
                      <Image
                        src="/avatars/ichinose.png"
                        alt="Ichinose"
                        width={24}
                        height={24}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <span className="text-xs text-slate-300 dark:text-slate-700 font-medium">
                        Analyzing trip details...
                      </span>
                      <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#2D9BF0] animate-pulse">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2D9BF0] opacity-75" />
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#2D9BF0]" />
                        </span>
                        <span>Thinking...</span>
                      </div>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-2.5 text-xs text-red-400 dark:text-red-700 dark:bg-red-50 dark:border-red-200 flex flex-col gap-1.5">
                    <div className="flex items-start gap-1.5">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span className="leading-snug">{error}</span>
                    </div>
                    {(error.includes("limit") || error.includes("quota") || error.includes("depleted")) && (
                      <button
                        type="button"
                        onClick={() => setUpgradeDialogOpen(true)}
                        className="text-xs font-bold text-[#2D9BF0] hover:underline text-left pl-5 cursor-pointer"
                      >
                        Upgrade to Pro Wanderer for unlimited AI messages &rarr;
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Ceiling Warning & Start New Chat prompt */}
              {isThreadLimitReached && (
                <div className="mx-3.5 mb-2 p-2 rounded-lg bg-amber-500/15 border border-amber-500/30 text-xs text-amber-300 dark:bg-amber-50 dark:border-amber-200 dark:text-amber-800 flex items-center justify-between gap-2 shrink-0">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-400 dark:text-amber-600" />
                    <span className="text-[11px] font-medium truncate">
                      Chat limit reached ({MAX_MESSAGES_LIMIT}/{MAX_MESSAGES_LIMIT} msgs).
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="default"
                    className="h-6 text-[11px] px-2 gap-1 cursor-pointer shrink-0 rounded-md"
                    onClick={handleNewChat}
                    disabled={isCreatingThread}
                  >
                    <Plus className="w-3 h-3" />
                    New Chat
                  </Button>
                </div>
              )}

              {/* Input Form & AI Disclaimer (Large Input Box Supabase Style) */}
              <div className="p-3.5 border-t border-[#152033] bg-[#090E1A] dark:border-slate-300 dark:bg-slate-100 shrink-0 space-y-2">
                {/* Supabase Disclaimer right above the input box */}
                <p className="text-[11px] text-center text-slate-400/80 dark:text-slate-500 select-none leading-none">
                  The Assistant can make mistakes. Double check responses.
                </p>

                {/* Large Rounded Input Box */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                  className="rounded-xl border border-[#1E2B45] bg-[#0E1729] focus-within:border-[#2D9BF0] focus-within:ring-1 focus-within:ring-[#2D9BF0]/40 dark:border-slate-300 dark:bg-white dark:focus-within:border-[#2D9BF0] transition-all p-3 shadow-xs space-y-2"
                >
                  <textarea
                    ref={textareaRef}
                    rows={3}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder={
                      isCreditDepleted
                        ? `Monthly credits exhausted (${userQuota?.quota}/${userQuota?.quota}). Upgrade to Pro.`
                        : isThreadLimitReached
                        ? "Thread limit reached. Start a new chat session."
                        : "Ask a follow up question..."
                    }
                    disabled={isLoading || isThreadLimitReached || isCreditDepleted}
                    className="w-full resize-none border-0 bg-transparent p-0 text-xs sm:text-sm text-white dark:text-slate-900 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-0 leading-relaxed min-h-[72px] max-h-[160px] disabled:opacity-50"
                  />

                  {/* Bottom Controls Row inside input box */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2 select-none min-w-0">
                      {userQuota && (
                        <div
                          className="flex items-center gap-1.5 px-2 py-0.5 rounded-sm bg-[#121E36] border border-[#1E2B45] text-slate-300 dark:bg-slate-100 dark:border-slate-200 dark:text-slate-700 font-sans text-[10px] font-medium shadow-2xs shrink-0"
                          title={`${userQuota.remaining} credits remaining out of ${userQuota.quota}`}
                        >
                          <Zap className="h-2.5 w-2.5 text-amber-400 fill-amber-400 shrink-0" />
                          <span>
                            {userQuota.used}/{userQuota.quota} used
                          </span>
                        </div>
                      )}
                      <span className="hidden sm:inline text-[10px] text-slate-500 dark:text-slate-400 truncate">
                        ↵ to send · Shift+↵ for new line
                      </span>
                    </div>

                    {isCreditDepleted ? (
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => setUpgradeDialogOpen(true)}
                        className="h-7 px-2.5 text-xs font-semibold rounded-md bg-amber-500 hover:bg-amber-600 text-slate-950 cursor-pointer shadow-xs gap-1"
                      >
                        <Zap className="h-3 w-3 fill-current" />
                        Upgrade
                      </Button>
                    ) : (
                      <button
                        type="submit"
                        disabled={isLoading || !input.trim() || isThreadLimitReached}
                        className="h-7 w-7 rounded-full bg-slate-800 text-slate-400 hover:bg-[#2D9BF0] hover:text-white dark:bg-slate-200 dark:text-slate-600 dark:hover:bg-[#2D9BF0] dark:hover:text-white disabled:opacity-20 disabled:pointer-events-none flex items-center justify-center transition-all cursor-pointer shadow-xs shrink-0"
                        aria-label="Send message"
                      >
                        {isLoading ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <ArrowUp className="h-4 w-4" />
                        )}
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </>
          )}

          {/* Upgrade Dialog (Only displayed when credits are actually exhausted) */}
          <UpgradeDialog
            open={upgradeDialogOpen}
            onOpenChange={setUpgradeDialogOpen}
            title="Upgrade for Unlimited Ichinose AI Assistant"
            description="Free Explorer accounts include 30 AI credits per month. Upgrade to Pro Wanderer for 150 AI credits, priority Gemini generation, and unlimited workspace planning."
          />
        </div>
      </aside>
    </TooltipProvider>
  );
}
