import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, ArrowLeft, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { ClassData } from "@/lib/types";

declare global {
  interface Window {
    JitsiMeetExternalAPI: any;
  }
}

export default function MeetingRoom() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cls, setCls] = useState<ClassData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const jitsiRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<any>(null);

  // Fetch class data
  useEffect(() => {
    const fetchClass = async () => {
      try {
        const res = await api.getClass(id!);
        setCls(res.data);
      } catch (err) {
        console.error("Failed to fetch class:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchClass();
  }, [id]);

  // Initialize JaaS embedded meeting
  useEffect(() => {
    if (!cls || !user) return;

    const roomName = `Ilmify_${cls._id}`;
    const isTeacher = user.role === "teacher";
    let cancelled = false;
    let scriptEl: HTMLScriptElement | null = null;

    const loadJitsiScript = (): Promise<void> => {
      // If the API is already available, resolve immediately
      if (window.JitsiMeetExternalAPI) return Promise.resolve();

      // Check if script tag already exists
      const existing = document.querySelector(
        'script[src*="8x8.vc/vpaas-magic-cookie"]'
      ) as HTMLScriptElement | null;

      if (existing) {
        return new Promise((resolve) => {
          if (window.JitsiMeetExternalAPI) return resolve();
          existing.addEventListener("load", () => resolve(), { once: true });
        });
      }

      const appId = import.meta.env.VITE_JAAS_APP_ID;

      return new Promise((resolve) => {
        scriptEl = document.createElement("script");
        scriptEl.src =
          `https://8x8.vc/${appId}/external_api.js`;
        scriptEl.async = true;
        scriptEl.onload = () => resolve();
        document.head.appendChild(scriptEl);
      });
    };

    const initMeeting = async () => {
      try {
        // If teacher is joining, mark class as live
        if (isTeacher && (cls.status === "scheduled" || cls.status === "live")) {
          try { await api.startClass(cls._id); } catch (e) { console.log("Could not start class:", e); }
        }

        // If student is joining, mark attendance
        if (!isTeacher) {
          try { await api.attendClass(cls._id); } catch (e) { console.log("Could not mark attendance:", e); }
        }

        // 1. Get JWT token from our backend
        const tokenRes = await api.getJitsiToken(roomName);
        const { token } = tokenRes.data;

        // 2. Load the JaaS external API script (only once)
        await loadJitsiScript();

        if (cancelled || !jitsiRef.current || !window.JitsiMeetExternalAPI) return;

        apiRef.current = new window.JitsiMeetExternalAPI("8x8.vc", {
          roomName: `${import.meta.env.VITE_JAAS_APP_ID}/${roomName}`,
          parentNode: jitsiRef.current,
          jwt: token,
          width: "100%",
          height: "100%",
          configOverwrite: {
            startWithAudioMuted: !isTeacher,
            startWithVideoMuted: false,
            prejoinPageEnabled: false,
            disableDeepLinking: true,
            subject: cls.title,
          },
          interfaceConfigOverwrite: {
            TOOLBAR_BUTTONS: [
              "microphone",
              "camera",
              "desktop",
              "chat",
              "raisehand",
              "fullscreen",
              "hangup",
              "participants-pane",
              "tileview",
              ...(isTeacher ? ["mute-everyone", "recording", "settings"] : []),
            ],
            SHOW_JITSI_WATERMARK: false,
            SHOW_WATERMARK_FOR_GUESTS: false,
            DEFAULT_BACKGROUND: "#1a1a2e",
          },
        });

        // When user hangs up, navigate back
        apiRef.current.addEventListener("readyToClose", async () => {
          // If teacher hangs up, mark class as completed
          if (isTeacher) {
            try { await api.endClass(cls._id); } catch (e) { console.log("Could not end class:", e); }
          }
          navigate(-1);
        });
      } catch (err) {
        console.error("Failed to initialize meeting:", err);
      }
    };

    initMeeting();

    return () => {
      cancelled = true;
      if (apiRef.current) {
        apiRef.current.dispose();
        apiRef.current = null;
      }
      // Remove script tag only if we created it in this effect
      if (scriptEl && scriptEl.parentNode) {
        scriptEl.parentNode.removeChild(scriptEl);
      }
    };
  }, [cls, user, navigate]);

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFSChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFSChange);
    return () => document.removeEventListener("fullscreenchange", handleFSChange);
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!cls) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-background">
        <p className="text-muted-foreground">Class not found.</p>
        <Button variant="outline" onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex h-screen flex-col bg-background">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-border bg-card px-4 py-2">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Leave
          </button>
          <div className="h-5 w-px bg-border" />
          <div>
            <h3 className="text-sm font-semibold text-foreground">{cls.title}</h3>
            <p className="text-xs text-muted-foreground">
              {user?.role === "teacher" ? "You are the host" : `Teacher: ${cls.teacher?.name}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-destructive/10 px-3 py-1 text-xs font-medium text-destructive">
            <span className="h-1.5 w-1.5 rounded-full bg-destructive animate-pulse" />
            Live
          </span>
          <Button size="icon" variant="ghost" onClick={toggleFullscreen} className="h-8 w-8">
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Jitsi JaaS Container — embedded, no time limit */}
      <div ref={jitsiRef} className="flex-1" />
    </div>
  );
}
