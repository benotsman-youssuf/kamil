import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2, AlertCircle } from "lucide-react";

export type SaveState = "idle" | "saving" | "saved" | "error";

interface SaveStatusProps {
    state: SaveState;
}

export function SaveStatus({ state }: SaveStatusProps) {
    return (
        <AnimatePresence mode="wait">
            {state !== "idle" && (
                <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-1.5 text-xs"
                >
                    {state === "saving" && (
                        <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-500" />
                            <span className="text-muted-foreground">حفظ تلقائي...</span>
                        </>
                    )}
                    {state === "saved" && (
                        <>
                            <Check className="w-3.5 h-3.5 text-green-500" />
                            <span className="text-green-600">تم الحفظ</span>
                        </>
                    )}
                    {state === "error" && (
                        <>
                            <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                            <span className="text-red-600">فشل الحفظ</span>
                        </>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
