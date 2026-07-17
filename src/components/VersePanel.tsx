"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchVerseDetails, getResourcesTafsirs, getResourcesTranslations, fetchTafsirsBulk, fetchNotesByVerse, addNote, updateNote, deleteNote } from "@/lib/qf/api";
import { getValidAccessToken } from "@/lib/qf/auth";
import type { VerseDetails, Hadith, Word, Tafsir } from "@/lib/qf/api";
import {
  Play,
  Pause,
  X,
  BookOpen,
  MessageCircle,
  List,
  Info,
  Volume2,
  ChevronLeft,
  ChevronRight,
  Plus,
  Pencil,
  Trash2,
  Send,
  Check,
  Sparkles
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getDb } from "@/lib/rxdb";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { CollectionPicker } from "./CollectionPicker";

const AUDIO_BASE = "https://verses.quran.com/";

export function VersePanelContent({ 
  verseData, 
  close 
}: { 
  verseData: { verseKey: string; surahName: string; ayaNumber: number; verseText: string; };
  close: () => void;
}) {
  const [details, setDetails] = useState<VerseDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [translationName, setTranslationName] = useState("");
  const [notes, setNotes] = useState<any[]>([]);
  const [noteText, setNoteText] = useState("");
  const [savingNote, setSavingNote] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [activeTab, setActiveTab] = useState("verse");

  const navigate = useNavigate();

  const handleOpenAsDocument = useCallback(async (noteBody: string) => {
    try {
      const slateContent = [
        {
          type: "h1",
          children: [{ text: `تأملات وكتابات: سورة ${verseData.surahName}` }]
        },
        {
          type: "p",
          children: [
            { text: `سورة ${verseData.surahName}، آية ${verseData.ayaNumber} ` },
            { text: `[${verseData.verseKey}]` }
          ]
        },
        {
          type: "p",
          children: [
            { text: `﴿${verseData.verseText || ""}﴾`, italic: true }
          ]
        },
        {
          type: "p",
          children: [{ text: "" }]
        },
        ...noteBody.split("\n").map(line => ({
          type: "p",
          children: [{ text: line }]
        }))
      ];

      const db = await getDb();
      const id = crypto.randomUUID();
      const now = new Date().toISOString();
      const token = await getValidAccessToken();
      let userId = "";
      if (token) {
        try { userId = JSON.parse(atob(token.split(".")[1])).sub || ""; } catch { userId = ""; }
      }
      await db.pages.insert({
        id,
        qf_user_id: userId,
        name: `تأملات الآية ${verseData.verseKey}`,
        title: `تأملات الآية ${verseData.verseKey}`,
        description: `سورة ${verseData.surahName}، آية ${verseData.ayaNumber}`,
        content: JSON.stringify(slateContent),
        created_at: now,
        updated_at: now,
        is_public: false,
        is_fork: false,
        fork_count: 0,
        forked_from: null,
        isPinned: false,
        _deleted: false,
        like_count: 0,
      });

      navigate(`/pages/${id}`);
      close();
      toast.success("تم فتح الملاحظة في المحرر المتقدم!");
    } catch (err) {
      console.error(err);
      toast.error("فشل فتح الملاحظة في المحرر المتقدم");
    }
  }, [verseData, navigate, close]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setIsPlaying(false);
    }
    setAudioProgress(0);
    setAudioDuration(0);
    setActiveTab("verse");
    setDetails(null);
    setError(null);
    setLoading(true);
    setNotes([]);
    setNoteText("");

    fetchVerseDetails(verseData.verseKey)
      .then((data) => {
        setDetails(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("فشل تحميل البيانات. يرجى التحقق من الاتصال بالإنترنت.");
        setLoading(false);
      });

    getResourcesTranslations().then((translations) => {
      const t = translations.find((tr: any) => tr.id === 85);
      if (t) {
        setTranslationName(t.translated_name?.name || t.name || t.author_name || "");
      }
    });

    fetchNotesByVerse(verseData.verseKey).then((res) => {
      if (res?.data) {
        setNotes(Array.isArray(res.data) ? res.data : []);
      }
    }).catch(() => {});

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [verseData]);

  const handleAddNote = useCallback(async () => {
    const text = noteText.trim();
    if (!text || savingNote) return;
    if (text.length < 6) {
      toast.error("يجب أن تحتوي الملاحظة على 6 أحرف على الأقل");
      return;
    }
    setSavingNote(true);
    try {
      await addNote({ verse_key: verseData.verseKey, text });
      setNoteText("");
      const res = await fetchNotesByVerse(verseData.verseKey);
      if (res?.data) setNotes(Array.isArray(res.data) ? res.data : []);
    } catch {
      toast.error("فشل حفظ الملاحظة. يرجى المحاولة مرة أخرى.");
    } finally {
      setSavingNote(false);
    }
  }, [noteText, savingNote, verseData.verseKey]);

  const handleDeleteNote = useCallback(async (noteId: string) => {
    try {
      await deleteNote(noteId);
      setNotes((prev) => prev.filter((n) => n.id !== noteId));
    } catch {}
  }, []);

  const handleStartEdit = useCallback((note: any) => {
    setEditingNoteId(note.id);
    setEditingText(note.body || "");
  }, []);

  const handleSaveEdit = useCallback(async () => {
    if (!editingNoteId || !editingText.trim() || savingEdit) return;
    setSavingEdit(true);
    try {
      await updateNote(editingNoteId, editingText.trim());
      setNotes((prev) => prev.map((n) => n.id === editingNoteId ? { ...n, body: editingText.trim() } : n));
      setEditingNoteId(null);
      setEditingText("");
    } catch {} finally {
      setSavingEdit(false);
    }
  }, [editingNoteId, editingText, savingEdit]);

  const toggleAudio = useCallback(() => {
    if (!details?.audio_url) return;

    const fullUrl = AUDIO_BASE + details.audio_url;

    if (!audioRef.current) {
      const audio = new Audio(fullUrl);
      audio.addEventListener("timeupdate", () => {
        setAudioProgress(audio.currentTime);
      });
      audio.addEventListener("loadedmetadata", () => {
        setAudioDuration(audio.duration);
      });
      audio.addEventListener("ended", () => {
        setIsPlaying(false);
        setAudioProgress(0);
      });
      audio.play().catch(console.error);
      audioRef.current = audio;
      setIsPlaying(true);
    } else {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().catch(console.error);
        setIsPlaying(true);
      }
    }
  }, [details?.audio_url, isPlaying]);

  const playSegment = useCallback(
    (startMs: number, endMs: number) => {
      if (!details?.audio_url) return;

      const fullUrl = AUDIO_BASE + details.audio_url;

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      const audio = new Audio(fullUrl);
      audio.currentTime = startMs / 1000;
      audio.addEventListener("timeupdate", () => {
        if (audio.currentTime >= endMs / 1000) {
          audio.pause();
          setIsPlaying(false);
        }
        setAudioProgress(audio.currentTime);
      });
      audio.addEventListener("loadedmetadata", () => {
        setAudioDuration(audio.duration);
      });
      audio.addEventListener("ended", () => {
        setIsPlaying(false);
        setAudioProgress(0);
      });
      audio.play().catch(console.error);
      audioRef.current = audio;
      setIsPlaying(true);
    },
    [details?.audio_url]
  );

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const progressPercent =
    audioDuration > 0 ? (audioProgress / audioDuration) * 100 : 0;

  return (
    <>
        <div className="flex items-center justify-between px-4 py-3 border-b border-sidebar-border flex-shrink-0">
          <div className="flex items-center gap-1">
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-sidebar-accent"
              onClick={close}
              aria-label="إغلاق"
            >
              <X className="h-4 w-4" />
            </Button>
            <CollectionPicker verseKey={verseData.verseKey} />
          </div>
          <h2 className="text-sm font-semibold truncate" dir="rtl">
            {verseData
              ? `${verseData.surahName} - ${verseData.ayaNumber}`
              : ""}
          </h2>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex-1 flex flex-col overflow-hidden"
        >
          <div className="px-3 py-2 border-b border-sidebar-border flex-shrink-0 overflow-x-auto scrollbar-hide">
            <TabsList className="w-full justify-start gap-0 bg-transparent p-0 h-auto flex-nowrap">
              <TabsTrigger
                value="verse"
                className="rounded-md data-[state=active]:bg-muted/70 data-[state=active]:text-foreground text-xs max-md:text-[10px] px-2 max-md:px-1.5 py-1.5 h-auto"
              >
                <BookOpen className="h-3.5 w-3.5 ml-1 max-md:h-3 max-md:w-3" />
                الآية
              </TabsTrigger>
              <TabsTrigger
                value="tafsir"
                className="rounded-md data-[state=active]:bg-muted/70 data-[state=active]:text-foreground text-xs max-md:text-[10px] px-2 max-md:px-1.5 py-1.5 h-auto"
              >
                <MessageCircle className="h-3.5 w-3.5 ml-1 max-md:h-3 max-md:w-3" />
                التفسير
              </TabsTrigger>
              <TabsTrigger
                value="words"
                className="rounded-md data-[state=active]:bg-muted/70 data-[state=active]:text-foreground text-xs max-md:text-[10px] px-2 max-md:px-1.5 py-1.5 h-auto"
              >
                <List className="h-3.5 w-3.5 ml-1 max-md:h-3 max-md:w-3" />
                الكلمات
              </TabsTrigger>
              <TabsTrigger
                value="info"
                className="rounded-md data-[state=active]:bg-muted/70 data-[state=active]:text-foreground text-xs max-md:text-[10px] px-2 max-md:px-1.5 py-1.5 h-auto"
              >
                <Info className="h-3.5 w-3.5 ml-1 max-md:h-3 max-md:w-3" />
                المعلومات
              </TabsTrigger>
              <TabsTrigger
                value="notes"
                className="rounded-md data-[state=active]:bg-muted/70 data-[state=active]:text-foreground text-xs max-md:text-[10px] px-2 max-md:px-1.5 py-1.5 h-auto flex-shrink-0"
              >
                <Pencil className="h-3.5 w-3.5 ml-1 max-md:h-3 max-md:w-3" />
                الملاحظات
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="relative flex-1 min-h-0">
            {loading ? (
              <div className="absolute inset-0">
                <LoadingSkeleton />
              </div>
            ) : error ? (
              <div className="absolute inset-0 p-4 text-destructive bg-destructive/10 m-3 rounded-md border border-destructive/20 text-sm h-fit">
                {error}
              </div>
            ) : !verseData ? (
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm px-4 text-center" dir="rtl">
                اضغط على آية في المحرر لعرض التفاصيل
              </div>
            ) : (
              <>
                <TabsContent value="verse" className="absolute inset-0">
                  <div className="h-full overflow-y-auto px-4 py-3 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-transparent [&::-webkit-scrollbar-track]:bg-transparent">
                    <VerseTab
                      verseText={verseData?.verseText || details?.text_uthmani || details?.text_imlaei || ""}
                      details={details}
                      translationName={translationName}
                      audioProgress={progressPercent}
                      audioDuration={audioDuration}
                      audioCurrent={audioProgress}
                      isPlaying={isPlaying}
                      formatTime={formatTime}
                      onToggleAudio={toggleAudio}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="tafsir" className="absolute inset-0">
                  <div className="h-full px-4 py-3">
                    <TafsirTab verseKey={verseData?.verseKey || null} />
                  </div>
                </TabsContent>

                <TabsContent value="words" className="absolute inset-0">
                  <div className="h-full overflow-y-auto px-4 py-3 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-transparent [&::-webkit-scrollbar-track]:bg-transparent">
                    <WordsTab
                      words={details?.words || []}
                      segments={(details as any)?.audio?.segments || undefined}
                      onPlaySegment={playSegment}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="info" className="absolute inset-0">
                  <div className="h-full overflow-y-auto px-4 py-3 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-transparent [&::-webkit-scrollbar-track]:bg-transparent">
                    <InfoTab details={details} />
                  </div>
                </TabsContent>
                <TabsContent value="notes" className="absolute inset-0">
                  <div className="h-full overflow-y-auto px-4 py-3 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-transparent [&::-webkit-scrollbar-track]:bg-transparent">
                    <NotesTab
                      notes={notes}
                      loading={false}
                      noteText={noteText}
                      onNoteTextChange={setNoteText}
                      onAddNote={handleAddNote}
                      onDeleteNote={handleDeleteNote}
                      savingNote={savingNote}
                      editingNoteId={editingNoteId}
                      editingText={editingText}
                      onEditingTextChange={setEditingText}
                      onStartEdit={handleStartEdit}
                      onSaveEdit={handleSaveEdit}
                      onCancelEdit={() => { setEditingNoteId(null); setEditingText(""); }}
                      savingEdit={savingEdit}
                      onOpenAsDocument={handleOpenAsDocument}
                    />
                  </div>
                </TabsContent>
              </>
            )}
          </div>
        </Tabs>
    </>
  );
}

function LoadingSkeleton() {
  return (
    <div className="p-4 space-y-3">
      <Skeleton className="h-12 w-full rounded-md" />
      <Skeleton className="h-3 w-3/4" />
      <Skeleton className="h-16 w-full rounded-md" />
      <Skeleton className="h-3 w-1/2" />
      <Skeleton className="h-24 w-full rounded-md" />
    </div>
  );
}

function VerseTab({
  verseText,
  details,
  translationName,
  audioProgress,
  audioDuration,
  audioCurrent,
  isPlaying,
  formatTime,
  onToggleAudio,
}: {
  verseText: string;
  details: VerseDetails | null;
  translationName: string;
  audioProgress: number;
  audioDuration: number;
  audioCurrent: number;
  isPlaying: boolean;
  formatTime: (s: number) => string;
  onToggleAudio: () => void;
}) {
  const fullAudioUrl = details?.audio_url
    ? AUDIO_BASE + details.audio_url
    : null;

  return (
    <div className="space-y-4" dir="rtl">
      <div className="bg-muted/30 p-4 rounded-lg border">
        <p className="text-2xl leading-[2] text-foreground text-center font-bold font-['Amiri']">
          ﴿{verseText}﴾
        </p>

        {fullAudioUrl && (
          <div className="mt-3 bg-background rounded-md p-2.5 border">
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="ghost"
                className="h-9 w-9 rounded-full bg-muted hover:bg-muted/80 text-foreground flex-shrink-0"
                onClick={onToggleAudio}
                aria-label={isPlaying ? "إيقاف" : "تشغيل"}
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4 mr-0.5" />
                )}
              </Button>

              <div className="flex-1">
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-foreground/30 rounded-full transition-all duration-200"
                    style={{ width: `${audioProgress}%` }}
                  />
                </div>
              </div>

              <span
                className="text-[11px] text-muted-foreground tabular-nums w-14 text-left"
                dir="ltr"
              >
                {audioDuration > 0
                  ? `${formatTime(audioCurrent)} / ${formatTime(audioDuration)}`
                  : "--:--"}
              </span>
            </div>
          </div>
        )}
      </div>

      {details?.translations && details.translations.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge
              variant="secondary"
              className="text-[10px] px-1.5 py-0"
            >
              الترجمة
            </Badge>
            <span className="text-[10px] text-muted-foreground">
              {translationName}
            </span>
          </div>
          <div className="bg-background rounded-md p-3 border text-sm leading-relaxed text-foreground/80" dir="ltr">
            {details.translations[0].text.replace(/<[^>]*>?/gm, "")}
          </div>
        </div>
      )}

      {details?.words && details.words.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge
              variant="secondary"
              className="text-[10px] px-1.5 py-0"
            >
              الكلمات
            </Badge>
          </div>
          <div className="bg-background rounded-md p-2.5 border">
            <div className="flex flex-wrap gap-1.5" dir="rtl">
              {details.words
                .filter((w) => w.char_type_name === "word")
                .map((word) => (
                  <span
                    key={word.id}
                    className="inline-flex flex-col items-center px-1.5 py-1 rounded bg-muted/30 border min-w-[40px]"
                  >
                    <span className="text-lg font-bold text-foreground leading-tight font-['Amiri']">
                      {word.code_v1 || word.text}
                    </span>
                    {word.translation && (
                      <span className="text-[9px] text-muted-foreground mt-0.5 leading-tight">
                        {word.translation.text}
                      </span>
                    )}
                    {word.transliteration?.text && (
                      <span
                        className="text-[9px] text-muted-foreground italic mt-0.5 leading-tight"
                        dir="ltr"
                      >
                        {word.transliteration.text}
                      </span>
                    )}
                  </span>
                ))}
            </div>
          </div>
        </div>
      )}

      {(details as VerseDetails)?.hadiths &&
        (details as VerseDetails).hadiths!.length > 0 && (
          <HadithSection hadiths={(details as VerseDetails).hadiths!} />
        )}
    </div>
  );
}

function TafsirTab({
  verseKey,
}: {
  verseKey: string | null;
}) {
  const [resources, setResources] = useState<any[]>([]);
  const [selectedLang, setSelectedLang] = useState("");
  const [selectedTafsirId, setSelectedTafsirId] = useState<number | null>(null);
  const [tafsirContents, setTafsirContents] = useState<Record<number, Tafsir>>({});
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const contentCache = useRef<Record<string, Record<number, Tafsir>>>({});

  useEffect(() => {
    getResourcesTafsirs("ar").then((list) => {
      setResources(list);
    });
  }, [verseKey]);

  const grouped = resources.reduce<Record<string, any[]>>((acc, r) => {
    const lang = (r.language_name || "unknown").toLowerCase();
    if (!acc[lang]) acc[lang] = [];
    acc[lang].push(r);
    return acc;
  }, {});

  const langKeys = Object.keys(grouped).sort();

  useEffect(() => {
    if (langKeys.length > 0 && (!selectedLang || !langKeys.includes(selectedLang))) {
      setSelectedLang(langKeys[0]);
    }
  }, [langKeys]);

  const tafsirsInLang = selectedLang ? grouped[selectedLang] || [] : [];

  useEffect(() => {
    if (!verseKey || tafsirsInLang.length === 0) return;

    const cacheKey = `${verseKey}_${selectedLang}`;
    if (contentCache.current[cacheKey]) {
      setTafsirContents(contentCache.current[cacheKey]);
      const ids = Object.keys(contentCache.current[cacheKey]).map(Number);
      if (!ids.includes(selectedTafsirId!)) {
        setSelectedTafsirId(ids[0]);
      }
      return;
    }

    setLoading(true);
    setLoadError(null);

    const ids = tafsirsInLang.map((t: any) => t.id);
    fetchTafsirsBulk(verseKey, ids)
      .then((data) => {
        contentCache.current[cacheKey] = data;
        setTafsirContents(data);
        const availableIds = Object.keys(data).map(Number);
        if (availableIds.length > 0) {
          setSelectedTafsirId((prev) =>
            prev && availableIds.includes(prev) ? prev : availableIds[0]
          );
        } else {
          setSelectedTafsirId(null);
          setLoadError("لا يتوفر تفسير لهذه الآية بهذه اللغة");
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setLoadError("فشل تحميل التفسير");
      });
  }, [verseKey, selectedLang]);

  const currentTafsir = selectedTafsirId ? tafsirContents[selectedTafsirId] : null;
  const isRtl = selectedLang === "arabic" || selectedLang === "urdu";

  if (!verseKey) {
    return (
      <div className="text-center py-10 text-muted-foreground text-sm" dir="rtl">
        لا تتوفر تفاسير لهذه الآية
      </div>
    );
  }

  if (resources.length === 0) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-5 w-28" />
      </div>
    );
  }

  const availableTafsirs = tafsirsInLang.filter((t: any) => tafsirContents[t.id]);

  return (
    <div className="flex flex-col h-full" dir="rtl">
      <div className="flex-shrink-0 space-y-3 pb-3">
        <Select value={selectedLang} onValueChange={setSelectedLang}>
          <SelectTrigger className="w-full h-8 text-xs capitalize">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {langKeys.map((lang) => (
              <SelectItem key={lang} value={lang} className="capitalize text-xs">
                {lang} ({grouped[lang].length})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-full rounded-md" />
            <Skeleton className="h-40 w-full rounded-md" />
          </div>
        ) : loadError ? (
          <div className="text-center py-8 text-muted-foreground text-sm">{loadError}</div>
        ) : availableTafsirs.length > 1 ? (
          <TafsirCarousel
            tafsirs={availableTafsirs}
            selectedId={selectedTafsirId}
            onSelect={setSelectedTafsirId}
          />
        ) : null}
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-transparent [&::-webkit-scrollbar-track]:bg-transparent">
        {currentTafsir ? (
          <div className="space-y-1">
            <div className="text-[11px] text-muted-foreground">
              {tafsirsInLang.find((t: any) => t.id === selectedTafsirId)?.translated_name?.name ||
                tafsirsInLang.find((t: any) => t.id === selectedTafsirId)?.name ||
                (currentTafsir as any).resource_name ||
                currentTafsir.name ||
                ""}
            </div>
            <div
              className="text-sm leading-relaxed text-foreground/85 text-justify [&_p]:mb-2"
              dir={isRtl ? "rtl" : "ltr"}
              dangerouslySetInnerHTML={{ __html: currentTafsir.text }}
            />
          </div>
        ) : !loading && !loadError ? (
          <div className="text-center py-8 text-muted-foreground text-sm" dir="rtl">
            اختر التفسير
          </div>
        ) : null}
      </div>
    </div>
  );
}

function TafsirCarousel({
  tafsirs,
  selectedId,
  onSelect,
}: {
  tafsirs: any[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 200;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <div className="flex items-center gap-0.5" dir="ltr">
      <button
        onClick={() => scroll("left")}
        className="shrink-0 w-5 h-5 rounded-full bg-background border border-sidebar-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
      >
        <ChevronLeft className="h-3 w-3" />
      </button>
      <div
        ref={scrollRef}
        className="flex gap-1 overflow-hidden rounded-lg bg-muted p-0.5 flex-1"
      >
        {tafsirs.map((tafsir: any) => (
          <button
            key={tafsir.id}
            onClick={() => onSelect(tafsir.id)}
            className={cn(
              "px-2.5 py-1 text-xs rounded-md transition-colors truncate max-w-[140px] shrink-0",
              selectedId === tafsir.id
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
            title={tafsir.translated_name?.name || tafsir.name}
          >
            {tafsir.translated_name?.name || tafsir.name}
          </button>
        ))}
      </div>
      <button
        onClick={() => scroll("right")}
        className="shrink-0 w-5 h-5 rounded-full bg-background border border-sidebar-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
      >
        <ChevronRight className="h-3 w-3" />
      </button>
    </div>
  );
}

function WordsTab({
  words,
  segments,
  onPlaySegment,
}: {
  words: Word[];
  segments?: number[][];
  onPlaySegment: (startMs: number, endMs: number) => void;
}) {
  const filteredWords = words.filter((w) => w.char_type_name === "word");

  if (filteredWords.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground text-sm" dir="rtl">
        لا تتوفر بيانات الكلمات
      </div>
    );
  }

  return (
    <div className="space-y-1.5" dir="rtl">
      {filteredWords.map((word) => {
        const segment = segments?.find(
          (s) => s[0] === word.position - 1
        );
        const hasAudio = !!word.audio_url || !!segments;
        return (
          <div
            key={word.id}
            className="flex items-center gap-2 p-2.5 rounded-md bg-background border hover:bg-accent/30 transition-colors"
          >
            <div className="flex-1 flex items-center gap-3 min-w-0">
              <span className="text-xl font-bold text-foreground min-w-[24px] text-center font-['Amiri']">
                {word.code_v1 || word.text}
              </span>
              <div className="flex flex-col gap-0.5 min-w-0">
                {word.translation && (
                  <span className="text-xs text-foreground/70 truncate">
                    {word.translation.text}
                  </span>
                )}
                {word.transliteration?.text && (
                  <span
                    className="text-[10px] text-muted-foreground italic truncate"
                    dir="ltr"
                  >
                    /{word.transliteration.text}/
                  </span>
                )}
              </div>
            </div>
            <span className="text-[10px] text-muted-foreground tabular-nums flex-shrink-0">
              #{word.position}
              {word.page_number && <span className="mr-1.5">| ص{word.page_number}</span>}
            </span>
            {hasAudio && (
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent flex-shrink-0"
                onClick={() => {
                  if (segment) {
                    onPlaySegment(segment[2], segment[3]);
                  }
                }}
                aria-label={`تشغيل كلمة ${word.position}`}
              >
                <Volume2 className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
}

function InfoTab({ details }: { details: VerseDetails | null }) {
  if (!details) {
    return (
      <div className="text-center py-10 text-muted-foreground text-sm" dir="rtl">
        لا تتوفر معلومات
      </div>
    );
  }

  const infoItems = [
    { label: "رقم الآية", value: details.verse_number },
    { label: "رقم السورة", value: details.chapter_id || parseInt(details.verse_key.split(":")[0]) },
    { label: "الجزء", value: details.juz_number },
    { label: "الحزب", value: details.hizb_number },
    { label: "ربع الحزب", value: details.rub_el_hizb_number },
    { label: "رقم الصفحة", value: details.page_number },
    { label: "الركوع", value: (details as any).ruku_number },
    { label: "المنزل", value: (details as any).manzil_number },
    { label: "السجدة", value: (details as any).sajdah_number ?? "—" },
  ];

  return (
    <div className="space-y-4" dir="rtl">
      <div className="grid grid-cols-2 gap-2">
        {infoItems.map((item) => (
          <div
            key={item.label}
            className="bg-background rounded-md p-2.5 border text-center"
          >
            <div className="text-[10px] text-muted-foreground mb-0.5">
              {item.label}
            </div>
            <div className="text-base font-semibold text-foreground">
              {item.value != null ? String(item.value) : "—"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GradeBadge({ grades }: { grades?: { graded_by: string; grade: string }[] }) {
  if (!grades || grades.length === 0) return null;
  const grade = grades[0].grade.toLowerCase();

  let colorClass: string;
  if (grade.includes("sahih")) {
    colorClass = "bg-primary/10 text-primary border-primary/20";
  } else if (grade.includes("hasan")) {
    colorClass = "bg-secondary/40 text-secondary-foreground border-secondary/50";
  } else if (grade.includes("da")) {
    colorClass = "bg-destructive/10 text-destructive border-destructive/20";
  } else {
    colorClass = "bg-muted text-muted-foreground border-border";
  }

  return (
    <span className={`inline-flex items-center rounded px-1 py-0 text-[10px] font-medium border ${colorClass}`}>
      {grades[0].grade}
    </span>
  );
}

function HadithSection({ hadiths }: { hadiths: Hadith[] }) {
  const handleInsert = (hadith: Hadith) => {
    const arBody = (hadith.hadith?.find(h => h.lang === "ar")?.body || hadith.hadith?.[0]?.body || "")
      .replace(/<[^>]*>?/gm, "")
      .replace(/\[quran[^\]]*\]/g, "")
      .replace(/[{}\[\]]/g, "")
      .trim();
    const enBody = (hadith.hadith?.find(h => h.lang === "en")?.body || "")
      .replace(/<[^>]*>?/gm, "")
      .trim();
    const grades = hadith.hadith?.find(h => h.lang === "ar")?.grades || hadith.hadith?.[0]?.grades || [];

    window.dispatchEvent(
      new CustomEvent("insert-hadith", {
        detail: {
          collection: hadith.collection,
          bookNumber: hadith.bookNumber,
          hadithNumber: hadith.hadithNumber,
          hadithText: arBody,
          hadithTextEn: enBody,
          grades,
          chapterTitle: hadith.name || "",
        },
      })
    );
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-1.5">
        <Badge
          variant="secondary"
          className="text-[10px] px-1.5 py-0"
        >
          أحاديث متعلقة
        </Badge>
      </div>
      <div className="space-y-2">
          {hadiths.slice(0, 3).map((hadith, i) => {
            const arItem = hadith.hadith?.find(h => h.lang === "ar") || hadith.hadith?.[0];
            const body = (arItem?.body || "")
              .replace(/<[^>]*>?/gm, "")
              .replace(/\[quran[^\]]*\]/g, "")
              .replace(/[{}\[\]]/g, "")
              .trim();
            const enBody = (hadith.hadith?.find(h => h.lang === "en")?.body || "")
              .replace(/<[^>]*>?/gm, "")
              .trim();
            return (
              <div
                key={i}
                className="bg-background p-2.5 rounded-md border-r-2 border-border border text-sm leading-relaxed text-foreground/80"
              >
                <div className="flex items-center gap-2 mb-1">
                  <GradeBadge grades={arItem?.grades} />
                  <span className="text-[10px] text-muted-foreground">
                    {hadith.name || hadith.collection}
                  </span>
                </div>
                <p className="mb-1">{body}</p>
                {enBody && (
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed" dir="ltr">
                    {enBody.slice(0, 200)}{enBody.length > 200 ? "…" : ""}
                  </p>
                )}
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-[10px] text-muted-foreground">
                    حديث رقم {hadith.hadithNumber}
                  </span>
                  <button
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      handleInsert(hadith);
                    }}
                    className="inline-flex items-center gap-1 text-[10px] text-amber-700 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 rounded px-1.5 py-0.5 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    إدراج
                  </button>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

function parseInlineStyles(text: string) {
  const regex = /(﴿[^﴾]+﴾|\*\*[^*]+\*\*|\*[^*]+\*|==[^=]+==)/g;
  const parts = text.split(regex);
  
  return parts.map((part, index) => {
    if (part.startsWith("﴿") && part.endsWith("﴾")) {
      return (
        <span key={index} className="font-amiri text-emerald-600 dark:text-emerald-400 font-semibold text-base px-0.5" dir="rtl">
          {part}
        </span>
      );
    }
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return (
        <em key={index} className="italic text-foreground/80">
          {part.slice(1, -1)}
        </em>
      );
    }
    if (part.startsWith("==") && part.endsWith("==")) {
      return (
        <mark key={index} className="bg-amber-100 dark:bg-amber-900/30 text-amber-950 dark:text-amber-100 rounded px-1 py-0.5 mx-0.5 font-medium">
          {part.slice(2, -2)}
        </mark>
      );
    }
    return part;
  });
}

function PreviewContent({ text }: { text: string }) {
  if (!text || !text.trim()) {
    return <p className="text-muted-foreground text-xs italic">لا يوجد محتوى لعرضه...</p>;
  }

  const lines = text.split("\n");
  return (
    <div className="space-y-1 text-sm leading-relaxed text-foreground/85 font-normal">
      {lines.map((line, idx) => {
        // Blockquote
        if (line.trim().startsWith(">")) {
          const content = line.trim().slice(1).trim();
          return (
            <blockquote key={idx} className="border-r-3 border-emerald-500 bg-emerald-500/5 dark:bg-emerald-950/10 px-3 py-1.5 rounded-l text-muted-foreground my-1 border-l-0">
              {parseInlineStyles(content)}
            </blockquote>
          );
        }
        // Bullet list
        if (line.trim().startsWith("-")) {
          const content = line.trim().slice(1).trim();
          return (
            <div key={idx} className="flex items-start gap-1.5 mr-2">
              <span className="text-emerald-500 mt-1 select-none font-bold">•</span>
              <span>{parseInlineStyles(content)}</span>
            </div>
          );
        }
        // Normal paragraph
        return (
          <p key={idx} className={line.trim() === "" ? "h-2" : ""}>
            {parseInlineStyles(line)}
          </p>
        );
      })}
    </div>
  );
}

function NotesTab({
  notes, loading, noteText, onNoteTextChange, onAddNote, onDeleteNote, savingNote,
  editingNoteId, editingText, onEditingTextChange, onStartEdit, onSaveEdit, onCancelEdit, savingEdit,
  onOpenAsDocument,
}: {
  notes: any[];
  loading: boolean;
  noteText: string;
  onNoteTextChange: (text: string) => void;
  onAddNote: () => void;
  onDeleteNote: (id: string) => void;
  savingNote: boolean;
  editingNoteId: string | null;
  editingText: string;
  onEditingTextChange: (t: string) => void;
  onStartEdit: (note: any) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  savingEdit: boolean;
  onOpenAsDocument: (body: string) => void;
}) {
  const noteTextRef = useRef<HTMLTextAreaElement>(null);
  const editTextRef = useRef<HTMLTextAreaElement>(null);

  // Auto-grow heights
  useEffect(() => {
    if (noteTextRef.current) {
      noteTextRef.current.style.height = "auto";
      noteTextRef.current.style.height = `${noteTextRef.current.scrollHeight}px`;
    }
  }, [noteText]);

  useEffect(() => {
    if (editTextRef.current) {
      editTextRef.current.style.height = "auto";
      editTextRef.current.style.height = `${editTextRef.current.scrollHeight}px`;
    }
  }, [editingText, editingNoteId]);

  return (
    <div className="space-y-4 font-sans" dir="rtl">
      {/* Premium Header */}
      <div className="flex items-center justify-between border-b border-border/40 pb-2">
        <span className="text-xs font-semibold text-foreground/80 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-muted-foreground" />
          ملاحظة
        </span>
      </div>

      {/* New note input */}
      <div className="flex flex-col rounded-lg border border-input bg-background overflow-hidden focus-within:ring-2 focus-within:ring-ring focus-within:border-transparent transition-all">
        <textarea
          ref={noteTextRef}
          value={noteText}
          onChange={(e) => onNoteTextChange(e.target.value)}
          placeholder="اكتب ملاحظة أو تأمل على هذه الآية..."
          rows={3}
          className="w-full resize-none bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground/60 focus:outline-none min-h-[80px]"
          dir="rtl"
        />
        <div className="flex items-center justify-between px-3 py-2 bg-muted/10 border-t border-border/20">
          <span className="text-[10px] text-muted-foreground">{noteText.length} حرف</span>
          <Button size="sm" className="h-7 gap-1.5 font-medium px-3 text-xs" onClick={onAddNote} disabled={!noteText.trim() || savingNote}>
            <Send className="h-3 w-3" />
            {savingNote ? "جاري الحفظ..." : "حفظ الملاحظة"}
          </Button>
        </div>
      </div>

      {notes.length === 0 && !loading && (
        <div className="text-center py-12 bg-muted/10 rounded-lg border border-dashed border-border/50">
          <Sparkles className="h-8 w-8 text-muted-foreground/20 mx-auto mb-2" />
          <p className="text-sm font-medium text-foreground/80">مفكرتك فارغة لهذه الآية</p>
          <p className="text-xs text-muted-foreground/60 mt-1">اكتب تأملاتك أو ملاحظاتك أعلاه لتبدأ</p>
        </div>
      )}

      <div className="space-y-3">
        {notes.map((note: any) => {
          const isEditing = editingNoteId === note.id;
          const date = note.createdAt
            ? new Date(note.createdAt).toLocaleDateString("ar-SA", { year: "numeric", month: "short", day: "numeric" })
            : "";
          return (
            <div key={note.id} className="bg-background rounded-lg p-3.5 border border-border/80 group shadow-2xs hover:border-border/100 hover:shadow-xs transition-all duration-150">
              {isEditing ? (
                <div className="space-y-2.5">
                  <textarea
                    ref={editTextRef}
                    value={editingText}
                    onChange={(e) => onEditingTextChange(e.target.value)}
                    rows={4}
                    className="w-full resize-none rounded-md border border-primary/40 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring min-h-[80px]"
                    dir="rtl"
                    autoFocus
                  />
                  <div className="flex items-center gap-2 justify-end">
                    <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={onCancelEdit}>إلغاء</Button>
                    <Button size="sm" className="h-7 text-xs gap-1" onClick={onSaveEdit} disabled={!editingText.trim() || savingEdit}>
                      <Check className="h-3 w-3" />
                      {savingEdit ? "جاري..." : "حفظ"}
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="text-sm leading-relaxed text-foreground/90 font-normal">
                    <PreviewContent text={note.body} />
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-border/30">
                    <span className="text-[9px] font-medium text-muted-foreground">{date}</span>
                    <div className="flex items-center gap-1 md:opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                      {/* Open as Document Button */}
                      <button
                        onClick={() => onOpenAsDocument(note.body)}
                        className="h-6 px-2 rounded flex items-center gap-1 text-[10px] text-muted-foreground bg-muted/50 hover:bg-muted transition-colors"
                        title="فتح كمستند كامل في المحرر المتقدم"
                        aria-label="افتح كمستند"
                      >
                        <BookOpen className="h-3 w-3" />
                        <span>افتح كمستند كامل</span>
                      </button>
                      <div className="w-[1px] h-3 bg-border mx-0.5" />
                      <button
                        onClick={() => onStartEdit(note)}
                        className="h-6 w-6 rounded flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                        title="تعديل"
                        aria-label="تعديل الملاحظة"
                      >
                        <Pencil className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => onDeleteNote(note.id)}
                        className="h-6 w-6 rounded flex items-center justify-center text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                        title="حذف"
                        aria-label="حذف الملاحظة"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

