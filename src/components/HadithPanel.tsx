"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fetchHadith } from "@/lib/hadith/api";
import type { Hadith } from "@/lib/hadith/types";
import { X, BookOpen, Info } from "lucide-react";

export function HadithPanelContent({ 
  hadithData, 
  close 
}: { 
  hadithData: { collection: string; bookNumber: string; hadithNumber: string; hadithText: string; hadithTextEn?: string; grades?: any[]; };
  close: () => void;
}) {
  const [details, setDetails] = useState<Hadith | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("hadith");

  useEffect(() => {
    setActiveTab("hadith");
    setDetails(null);
    setError(null);
    
    if (hadithData.collection && hadithData.bookNumber && hadithData.hadithNumber) {
      setLoading(true);
      fetchHadith(hadithData.collection, hadithData.bookNumber, hadithData.hadithNumber)
        .then((data) => {
          setDetails(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setError("فشل تحميل البيانات. يرجى التحقق من الاتصال بالإنترنت.");
          setLoading(false);
        });
    }
  }, [hadithData]);

  const collectionNames: Record<string, string> = {
    bukhari: "صحيح البخاري",
    muslim: "صحيح مسلم",
    nasai: "سنن النسائي",
    abudawud: "سنن أبي داود",
    tirmidhi: "جامع الترمذي",
    ibnmajah: "سنن ابن ماجه",
    malik: "موطأ مالك",
    ahmad: "مسند أحمد",
    darimi: "سنن الدارمي",
    riyadussalihin: "رياض الصالحين",
    adab: "الأدب المفرد",
    shamail: "الشمائل المحمدية",
    mishkat: "مشكاة المصابيح",
    bulugh: "بلوغ المرام",
    forty: "الأربعون النووية",
    hisn: "حصن المسلم",
    virtues: "فضائل القرآن",
  };

  return (
    <>
      <div className="flex items-center justify-between px-4 py-3 border-b border-sidebar-border flex-shrink-0">
        <Button
          size="icon"
          variant="ghost"
          className="h-7 w-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-sidebar-accent"
          onClick={close}
          aria-label="إغلاق"
        >
          <X className="h-4 w-4" />
        </Button>
        <h2 className="text-sm font-semibold truncate" dir="rtl">
          {hadithData
            ? `${collectionNames[hadithData.collection] || hadithData.collection} - حديث ${hadithData.hadithNumber}`
            : ""}
        </h2>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col overflow-hidden"
      >
        <div className="px-3 py-2 border-b border-sidebar-border flex-shrink-0">
          <TabsList className="w-full justify-start gap-0 bg-transparent p-0 h-auto">
            <TabsTrigger
              value="hadith"
              className="rounded-md data-[state=active]:bg-muted/70 data-[state=active]:text-foreground text-xs px-2 py-1.5 h-auto"
            >
              <BookOpen className="h-3.5 w-3.5 ml-1" />
              الحديث
            </TabsTrigger>
            <TabsTrigger
              value="info"
              className="rounded-md data-[state=active]:bg-muted/70 data-[state=active]:text-foreground text-xs px-2 py-1.5 h-auto"
            >
              <Info className="h-3.5 w-3.5 ml-1" />
              معلومات
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="relative flex-1 min-h-0">
          {!hadithData ? (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm px-4 text-center" dir="rtl">
              اضغط على حديث في المحرر لعرض التفاصيل
            </div>
          ) : (
            <>
              <TabsContent value="hadith" className="absolute inset-0">
                <div className="h-full overflow-y-auto px-4 py-3 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-transparent [&::-webkit-scrollbar-track]:bg-transparent">
                  <HadithTab
                    hadithText={hadithData.hadithText}
                    hadithTextEn={hadithData.hadithTextEn || details?.en?.body || ""}
                    grades={details?.ar?.grades || hadithData.grades || []}
                    loading={loading}
                    error={error}
                  />
                </div>
              </TabsContent>

              <TabsContent value="info" className="absolute inset-0">
                <div className="h-full overflow-y-auto px-4 py-3 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-transparent [&::-webkit-scrollbar-track]:bg-transparent">
                  <InfoTab 
                    details={details} 
                    collectionName={collectionNames[hadithData.collection] || hadithData.collection} 
                    loading={loading}
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

function HadithTab({
  hadithText,
  hadithTextEn,
  grades,
  loading,
  error,
}: {
  hadithText: string;
  hadithTextEn: string;
  grades: any[];
  loading: boolean;
  error: string | null;
}) {
  return (
    <div className="space-y-4" dir="rtl">
      {error && (
        <div className="p-3 text-destructive bg-destructive/10 rounded-md border border-destructive/20 text-sm">
          {error}
        </div>
      )}
      <div className="bg-muted/30 p-4 rounded-lg border">
        {grades && grades.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {grades.map((g, i) => (
              <Badge key={i} variant="outline" className="bg-background text-xs">
                {g.grade} {g.graded_by ? `(حكم ${g.graded_by})` : ""}
              </Badge>
            ))}
          </div>
        )}
        <p className="text-xl leading-[2] text-foreground font-medium font-['Amiri']" dangerouslySetInnerHTML={{ __html: hadithText }} />
      </div>

      {(hadithTextEn || loading) && (
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
              Translation
            </Badge>
          </div>
          <div className="bg-background rounded-md p-3 border text-sm leading-relaxed text-foreground/80" dir="ltr">
            {loading && !hadithTextEn ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
              </div>
            ) : (
              <div dangerouslySetInnerHTML={{ __html: hadithTextEn }} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function InfoTab({ details, collectionName, loading }: { details: Hadith | null, collectionName: string, loading: boolean }) {
  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    );
  }

  if (!details) {
    return (
      <div className="text-center py-10 text-muted-foreground text-sm" dir="rtl">
        لا توجد معلومات إضافية
      </div>
    );
  }

  return (
    <div className="space-y-4" dir="rtl">
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-muted/30 p-3 rounded border">
          <div className="text-[10px] text-muted-foreground mb-1">المصدر</div>
          <div className="text-sm font-medium">{collectionName}</div>
        </div>
        <div className="bg-muted/30 p-3 rounded border">
          <div className="text-[10px] text-muted-foreground mb-1">رقم الحديث</div>
          <div className="text-sm font-medium">{details.hadithNumber}</div>
        </div>
      </div>

      {details.chapterTitle && (
        <div className="bg-muted/30 p-3 rounded border">
          <div className="text-[10px] text-muted-foreground mb-1">الكتاب / الباب</div>
          <div className="text-sm font-medium leading-relaxed">
            {details.chapterTitle.ar}
          </div>
          {details.chapterTitle.en && (
            <div className="text-xs text-muted-foreground mt-1" dir="ltr">
              {details.chapterTitle.en}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
