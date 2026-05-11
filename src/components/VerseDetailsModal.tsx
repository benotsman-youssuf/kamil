import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { VerseRef } from "@/lib/qf-api";

type VerseDetailsModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  verse: VerseRef | null;
  details: any;
  loading: boolean;
  error: string | null;
  onBookmark: () => Promise<void>;
};

export function VerseDetailsModal({
  open,
  onOpenChange,
  verse,
  details,
  loading,
  error,
  onBookmark,
}: VerseDetailsModalProps) {
  const translation = details?.translations?.translations?.[0] ?? details?.translations?.translation;
  const tafsir = details?.tafsir?.tafsirs?.[0] ?? details?.tafsir?.tafsir;
  const verseText = details?.verse?.text_uthmani ?? verse?.text;
  const audioUrl = details?.audio?.audio_file?.url ?? details?.audio?.audio_file?.audio_url ?? details?.audio?.audio_url;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl" className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {verse ? `${verse.surah} ${verse.ayah} (${verse.verseKey})` : "تفاصيل الآية"}
          </DialogTitle>
        </DialogHeader>

        {loading && <p className="text-sm text-muted-foreground">جاري تحميل التفسير والترجمة والصوت...</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}

        {!loading && !error && verse && (
          <div className="space-y-4">
            {verseText && <p className="text-xl leading-9">﴿{verseText}﴾</p>}

            <section>
              <h4 className="font-semibold mb-1">الترجمة</h4>
              <p className="text-sm leading-7">{translation?.text ?? "لا توجد ترجمة متاحة"}</p>
            </section>

            <section>
              <h4 className="font-semibold mb-1">التفسير</h4>
              <p className="text-sm leading-7 max-h-40 overflow-auto">{tafsir?.text ?? "لا يوجد تفسير متاح"}</p>
            </section>

            <section>
              <h4 className="font-semibold mb-1">الصوت</h4>
              <audio controls className="w-full">
                <source src={audioUrl ?? ""} />
              </audio>
            </section>

            <div className="flex justify-end">
              <Button onClick={() => void onBookmark()}>إضافة إلى Bookmarks</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
