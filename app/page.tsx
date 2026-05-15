"use client"
import { useEffect, useMemo, useState } from "react"
import {
  AlertCircle,
  Bell,
  CheckCircle2,
  Clock3,
  Copy,
  Check,
  Loader2,
  Mail,
  RefreshCcw,
  Search,
  Shield,
  Sparkles,
  Zap,
} from "lucide-react"

type AppKey = "disney" | "chatgpt" | "netflix"

type AppItem = {
  key: AppKey
  name: string
  label: string
  hint: string
  color: string
  keywords: string[]
}

type MailItem = {
  id: string
  app: AppKey
  subject?: string
  intro?: string
  createdAt?: string
  from?: {
    address?: string
    name?: string
  }
}

const apps: AppItem[] = [
  {
    key: "disney",
    name: "Disney+",
    label: "Disney OTP",
    hint: "รหัสเข้าใช้งาน Disney+",
    color: "from-sky-300 to-blue-500",
    keywords: ["disney", "disney+"],
  },
  {
    key: "chatgpt",
    name: "ChatGPT",
    label: "ChatGPT OTP",
    hint: "รหัสยืนยัน OpenAI / ChatGPT",
    color: "from-emerald-300 to-teal-500",
    keywords: ["openai", "chatgpt"],
  },
  {
    key: "netflix",
    name: "Netflix",
    label: "ยืนยันครัวเรือน Netflix",
    hint: "รหัสยืนยันครัวเรือน Netflix",
    color: "from-red-400 to-rose-600",
    keywords: ["netflix", "household", "ครัวเรือน"],
  },
]

const demoMessages: MailItem[] = [
  {
    id: "demo-1",
    app: "disney",
    subject: "Disney+ verification code: 482913",
    intro: "Use 482913 to verify your Disney+ account. This code will expire soon.",
    createdAt: "เมื่อสักครู่",
    from: { address: "noreply@disneyplus.com", name: "Disney+" },
  },
  {
    id: "demo-2",
    app: "chatgpt",
    subject: "Your ChatGPT login code",
    intro: "Your OpenAI verification code is 739204. Do not share this code.",
    createdAt: "2 นาทีที่แล้ว",
    from: { address: "noreply@openai.com", name: "OpenAI" },
  },
  {
    id: "demo-3",
    app: "netflix",
    subject: "Netflix household verification",
    intro: "ยืนยันครัวเรือน Netflix ด้วยรหัส 615880 ภายในเวลาที่กำหนด",
    createdAt: "5 นาทีที่แล้ว",
    from: { address: "info@account.netflix.com", name: "Netflix" },
  },
]

function extractOtp(text: string) {
  const match = text.match(/\b\d{4,8}\b/)
  return match?.[0] ?? null
}

function detectApp(mail: Partial<MailItem>): AppKey {
  const text = `${mail.subject ?? ""} ${mail.intro ?? ""} ${mail.from?.address ?? ""}`.toLowerCase()
  return apps.find((app) => app.keywords.some((keyword) => text.includes(keyword)))?.key ?? "disney"
}

const sakuraPetals = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: `${(i * 37) % 100}%`,
  delay: `${(i * 0.7) % 10}s`,
  duration: `${10 + (i % 7) * 1.6}s`,
  scale: 0.6 + (i % 5) * 0.16,
}))

export default function TempMailDemo() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#160713] p-3 text-white md:p-6">
      <style>{`
        @keyframes sakura-fall {
          0% {
            transform: translate3d(0,-120px,0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.9;
          }
          100% {
            transform: translate3d(120px,110vh,0) rotate(360deg);
            opacity: 0;
          }
        }

        @keyframes sakura-sway {
          0%,100% {
            margin-left: 0px;
          }
          50% {
            margin-left: 30px;
          }
        }
      `}</style>

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {sakuraPetals.map((petal) => (
          <div
            key={petal.id}
            className="absolute top-[-120px]"
            style={{
              left: petal.left,
              animation: `sakura-fall ${petal.duration} linear infinite`,
              animationDelay: petal.delay,
            }}
          >
            <div
              className="h-4 w-3 rounded-[100%_0_100%_0] bg-pink-200/70 shadow-[0_0_12px_rgba(255,192,203,0.35)] backdrop-blur-sm"
              style={{
                transform: `rotate(${petal.id * 20}deg) scale(${petal.scale})`,
                animation: `sakura-sway 4s ease-in-out infinite`,
              }}
            />
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-pink-500/30 blur-3xl" />
      <div className="pointer-events-none absolute right-[-80px] top-28 h-80 w-80 rounded-full bg-fuchsia-400/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-120px] left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-rose-300/20 blur-3xl" />

      <div className="relative mx-auto max-w-6xl pb-28 md:pb-0">
        <header className="mb-6 flex flex-col justify-between gap-4 md:mb-8 md:flex-row md:items-center">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-pink-100 backdrop-blur">
              <Sparkles size={16} />
              Self-Service OTP Inbox
            </div>
            <h1 className="mb-2 text-4xl font-black tracking-tight md:text-6xl">
              BOUQUET<span className="text-pink-300"> OTP</span>
            </h1>
            <p className="text-base text-pink-100/70 md:text-lg">
              รับ OTP ด้วยตัวเอง เพียงใส่โค้ดที่ระบุไว้ในฟอร์ม
            </p>
          </div>

          <div className="hidden gap-3 md:flex">
            <InfoPill icon={<Shield size={18} />} text="Self Service" />
            <InfoPill icon={<Clock3 size={18} />} text="Auto Refresh" />
            <InfoPill icon={<Zap size={18} />} text="OTP Parser" />
          </div>
        </header>

        <TempMail />
      </div>
    </div>
  )
}

function InfoPill({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-5 py-3 text-pink-50 shadow-lg backdrop-blur-xl">
      {icon}
      <span className="text-sm font-semibold">{text}</span>
    </div>
  )
}

function TempMail() {
  const [email, setEmail] = useState("")
  const [messages, setMessages] = useState<MailItem[]>([])
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState("")
  const [showDemo, setShowDemo] = useState(false)
  const isConnected = Boolean(email.trim()) || showDemo

  async function connectInbox() {
    await refreshInbox()
  }

  async function refreshInbox() {
    if (!email.trim()) {
      setError("กรุณากรอกอีเมลก่อนเชื่อมต่อ Inbox")
      return
    }

    try {
      setRefreshing(true)
      setError("")

      const res = await fetch(`/api/inbox?code=${encodeURIComponent(email.trim())}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })

      const data = await res.json()

if (!res.ok) {
  const err = data

  throw new Error(
    err?.error ||
    err?.detail ||
    "โหลด Inbox ไม่สำเร็จ"
  )
}

      if (!res.ok) {
  const err = await res.json()

  throw new Error(
    err?.error ||
    err?.detail ||
    "โหลด Inbox ไม่สำเร็จ"
  )
}

      setShowDemo(false)
      setMessages(
        (data.items ?? []).map((mail: Partial<MailItem>) => ({
          ...mail,
          id: mail.id ?? crypto.randomUUID(),
          app: detectApp(mail),
        })) as MailItem[]
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด")
    } finally {
      setRefreshing(false)
    }
  }

  async function copyEmail() {
    if (!email.trim()) return
    await navigator.clipboard.writeText(email.trim())
  }

  useEffect(() => {
    if (showDemo || !email.trim()) return
    const intervalId = window.setInterval(refreshInbox, 5000)
    return () => window.clearInterval(intervalId)
  }, [email, showDemo])

  return (
    <div className="grid gap-4 md:gap-6 lg:grid-cols-[1.25fr_0.75fr]">
      <section className="overflow-hidden rounded-[34px] border border-white/10 bg-white/[0.08] shadow-2xl shadow-pink-950/50 backdrop-blur-2xl">
        <div className="border-b border-white/10 bg-white/[0.06] p-4 md:p-6">
          <div className="mb-6 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-pink-400 p-3 text-white shadow-lg shadow-pink-500/30">
                <Mail size={24} />
              </div>

              <div>
                <h2 className="text-2xl font-black">App Inbox Center</h2>
                <p className="text-sm text-pink-100/60">สามารถดู OTP ได้ภายใน 15 นาที หลังจากกดส่งรหัสเท่านั้น</p>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-xs font-bold text-emerald-200">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-300" />
              LIVE
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.07] p-4 shadow-inner">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-pink-100/70">อีเมลที่ต้องการตรวจสอบ</p>
              {showDemo && <span className="rounded-full bg-pink-300 px-3 py-1 text-xs font-black text-pink-950">DEMO MODE</span>}
            </div>

            <div className="flex flex-col gap-3 md:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-200/50" size={18} />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ใส่โค้ด 6 ตัว พิมพ์เล็ก ที่ระบุไว้ในฟอร์ม เช่น asd9ja"
                  className="w-full rounded-2xl border border-white/10 bg-black/20 px-11 py-4 text-base text-white outline-none placeholder:text-pink-100/30 focus:border-pink-300 md:text-lg"
                />
              </div>

              <button
                onClick={connectInbox}
                className="flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-4 font-black text-pink-700 transition hover:scale-[1.02] disabled:opacity-50"
                disabled={!email.trim()}
              >
                <Copy size={18} />
                ยืนยัน
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 md:p-6">
          {error && (
            <div className="mb-5 flex items-start gap-3 rounded-2xl border border-red-300/20 bg-red-500/10 p-4 text-red-100">
              <AlertCircle className="mt-0.5 shrink-0" size={18} />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <div className="mb-6 hidden flex-wrap gap-3 md:flex">
            <ActionButton onClick={connectInbox} disabled={loading} variant="primary">
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Shield size={18} />}
              {loading ? "กำลังเชื่อมต่อ..." : "เชื่อมต่อ Inbox จริง"}
            </ActionButton>

            <ActionButton onClick={refreshInbox} disabled={!isConnected || refreshing} variant="dark">
              <RefreshCcw className={refreshing ? "animate-spin" : ""} size={18} />
              รีเฟรช Inbox
            </ActionButton>
          </div>

          <InboxList messages={messages} isConnected={isConnected} />
        </div>
      </section>

      <aside className="hidden space-y-6 lg:block">
        <OtpHighlight messages={messages} />
        <FeaturesPanel />
        <PromoCard onClick={refreshInbox} disabled={!isConnected || refreshing} />
      </aside>

      <div className="fixed inset-x-0 bottom-0 z-20 flex gap-3 border-t border-white/10 bg-[#160713]/90 p-3 backdrop-blur-2xl md:hidden">
        <button
          onClick={connectInbox}
          disabled={loading}
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-pink-400 px-4 py-4 font-black text-white shadow-lg shadow-pink-500/30 disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : <Shield size={18} />}
          เชื่อมต่อ
        </button>

        <button
          onClick={refreshInbox}
          disabled={!isConnected || refreshing}
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-white px-4 py-4 font-black text-pink-700 disabled:opacity-50"
        >
          <RefreshCcw className={refreshing ? "animate-spin" : ""} size={18} />
          รีเฟรช
        </button>
      </div>
    </div>
  )
}

function ActionButton({
  children,
  disabled,
  onClick,
  variant = "primary",
}: {
  children: React.ReactNode
  disabled?: boolean
  onClick: () => void
  variant?: "primary" | "dark"
}) {
  const className =
    variant === "primary"
      ? "bg-pink-400 text-white shadow-lg shadow-pink-500/30 hover:bg-pink-300"
      : "bg-black/30 text-white border border-white/10 hover:bg-white/10"

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-2 rounded-2xl px-6 py-4 font-black transition disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  )
}

function InboxList({
  messages,
  isConnected,
}: {
  messages: MailItem[]
  isConnected: boolean
}) {
  if (messages.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-pink-200/20 bg-black/30 p-10 text-center text-white">
        <Mail className="mx-auto mb-4 text-pink-100/30" size={42} />
        <h3 className="mb-2 text-xl font-bold">ยังไม่มีอีเมล</h3>
        <p className="text-pink-100/50">
          {isConnected ? "ระบบจะตรวจ Inbox อัตโนมัติทุก 5 วินาที" : "ใส่โค้ดแล้วกดยืนยันเพื่อดูข้อความ"}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {messages.map((mail) => (
        <MailCard key={mail.id} mail={mail} />
      ))}
    </div>
  )
}

function MailCard({ mail }: { mail: MailItem }) {
  const [copied, setCopied] = useState(false)

  const otp = useMemo(
    () => extractOtp(`${mail.subject ?? ""} ${mail.intro ?? ""}`),
    [mail.subject, mail.intro]
  )

  const appInfo = apps.find((app) => app.key === mail.app) ?? apps[0]

  async function copyOtp() {
    if (!otp) return

    await navigator.clipboard.writeText(otp)
    setCopied(true)

    if ("vibrate" in navigator) {
      navigator.vibrate(80)
    }

    window.setTimeout(() => {
      setCopied(false)
    }, 1500)
  }

  return (
    <article
      onClick={copyOtp}
      className="group relative cursor-pointer overflow-hidden rounded-[28px] border border-white/10 bg-black/30 p-5 text-white shadow-xl transition hover:-translate-y-0.5 hover:border-pink-300/40 hover:bg-black/40"
    >
      <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-pink-400/10" />

      <div className="relative mb-4 flex items-start justify-between gap-4">
        <div className="flex min-w-0 gap-3">
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${appInfo.color} font-black text-white`}>
            D
          </div>

          <div className="min-w-0">
            <p className="mb-1 text-xs font-bold uppercase tracking-wider text-pink-200/50">
              DISNEY+
            </p>
            <p className="text-xs text-pink-100/40">
              {mail.createdAt ?? "ล่าสุด"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 rounded-full bg-pink-300 px-3 py-1 text-xs font-black text-pink-950">
          <Bell size={12} />
          NEW
        </div>
      </div>

      {otp && (
        <div className={`relative mt-5 overflow-hidden rounded-[24px] border border-pink-200/20 bg-gradient-to-r ${appInfo.color} p-5 text-center shadow-2xl shadow-pink-500/20`}>
          <p className="mb-2 text-xs font-black uppercase tracking-[4px] text-white/70">
            DETECTED OTP
          </p>

          <div className="text-4xl font-black tracking-[8px] text-white md:text-5xl">
            {otp}
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              copyOtp()
            }}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-sm font-black text-pink-700"
          >
            <Copy size={14} />
            {copied ? "คัดลอกแล้ว" : "คัดลอก OTP"}
          </button>
        </div>
      )}
    </article>
  )
}

function OtpHighlight({ messages }: { messages: MailItem[] }) {
  const latestOtp = messages.map((mail) => extractOtp(`${mail.subject ?? ""} ${mail.intro ?? ""}`)).find(Boolean)

  return (
    <div className="overflow-hidden rounded-[34px] border border-white/10 bg-white/[0.08] p-6 shadow-2xl backdrop-blur-2xl">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-pink-100/50">OTP ล่าสุด</p>
          <h3 className="text-2xl font-black">Quick Copy</h3>
        </div>
        <div className="rounded-2xl bg-emerald-400/15 p-3 text-emerald-200">
          <CheckCircle2 size={22} />
        </div>
      </div>

      <div className="rounded-[28px] bg-gradient-to-br from-pink-300 to-fuchsia-500 p-6 text-center shadow-xl shadow-pink-500/20">
        <p className="mb-3 text-xs font-black uppercase tracking-[4px] text-white/70">Code</p>
        <p className="text-5xl font-black tracking-[10px] text-white">{latestOtp ?? "------"}</p>
      </div>
    </div>
  )
}

function FeaturesPanel() {
  return (
    <div className="rounded-[34px] border border-white/10 bg-white/[0.08] p-6 shadow-2xl backdrop-blur-2xl">
      <h3 className="mb-4 text-2xl font-black">ฟีเจอร์</h3>

      <div className="space-y-4">
        <FeatureItem icon={<Shield size={18} />} title="Secure Inbox" desc="ระบบเชื่อมต่อ Inbox แบบปลอดภัย" />
        <FeatureItem icon={<Mail size={18} />} title="Realtime Messages" desc="รับข้อความและ OTP แบบเรียลไทม์" />
        <FeatureItem icon={<Sparkles size={18} />} title="OTP Parser" desc="แยกรหัส OTP อัตโนมัติจากข้อความ" />
      </div>
    </div>
  )
}

function FeatureItem({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="group flex items-center gap-4 rounded-[26px] border border-white/10 bg-black/20 p-4 transition hover:border-pink-300/20 hover:bg-white/[0.06]">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-pink-300/10 text-pink-100 shadow-[0_10px_30px_rgba(255,192,203,0.08)] backdrop-blur-xl transition group-hover:scale-105 group-hover:border-pink-200/30 group-hover:bg-pink-300/10">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black/20">
          {icon}
        </div>
      </div>

      <div className="min-w-0">
        <p className="mb-1 text-base font-black tracking-tight text-white">{title}</p>
        <p className="text-sm leading-6 text-pink-100/50">{desc}</p>
      </div>
    </div>
  )
}

function PromoCard({
  onClick,
  disabled,
}: {
  onClick: () => void
  disabled?: boolean
}) {
  return (
    <div className="rounded-[34px] bg-gradient-to-br from-pink-400 to-fuchsia-600 p-6 text-white shadow-2xl shadow-pink-500/30">
      <h3 className="mb-2 text-2xl font-black">ระบบรับ OTP</h3>
      <p className="mb-5 font-medium text-white/75">ตรวจข้อความและ OTP ล่าสุดอัตโนมัติ</p>
      <button
        onClick={onClick}
        disabled={disabled}
        className="w-full rounded-2xl bg-white px-5 py-4 font-black text-pink-700 transition hover:scale-[1.02] disabled:opacity-50"
      >
        รีเฟรช Inbox
      </button>
    </div>
  )
}