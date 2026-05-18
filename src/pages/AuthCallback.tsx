import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { handleCallback } from "@/lib/qf/auth";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const errorParam = searchParams.get("error");

    if (errorParam) {
      setError(searchParams.get("error_description") || "تم رفض الطلب");
      return;
    }

    if (code && state) {
      handleCallback(code, state)
        .then(() => {
          navigate("/", { replace: true });
        })
        .catch((err) => {
          setError(err.message || "فشل تسجيل الدخول");
        });
    } else {
      navigate("/", { replace: true });
    }
  }, [searchParams, navigate]);

  if (error) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center gap-4" dir="rtl">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <p className="text-xl font-bold text-red-600 font-amiri">فشل تسجيل الدخول</p>
        <p className="text-muted-foreground">{error}</p>
        <Button variant="outline" onClick={() => navigate("/")}>
          العودة للصفحة الرئيسية
        </Button>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center gap-4 font-amiri" dir="rtl">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <p className="text-xl font-bold text-muted-foreground">جاري تسجيل الدخول...</p>
    </div>
  );
}
