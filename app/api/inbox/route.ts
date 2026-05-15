import { NextResponse } from "next/server"

const rateLimitMap = new Map<
  string,
  { count: number; resetAt: number }
>()

function getClientIp(req: Request) {
  const forwarded =
    req.headers.get("x-forwarded-for")

  return (
    forwarded?.split(",")[0]?.trim() ||
    "unknown"
  )
}

function isRateLimited(ip: string) {
  const now = Date.now()
  const limit = 10
  const windowMs = 60 * 1000

  const record = rateLimitMap.get(ip)

  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, {
      count: 1,
      resetAt: now + windowMs,
    })

    return false
  }

  if (record.count >= limit) {
    return true
  }

  record.count += 1

  return false
}

export async function GET(req: Request) {
  const apiKey = process.env.MAILY_API_KEY
  const ip = getClientIp(req)

  if (isRateLimited(ip)) {
    return NextResponse.json(
      {
        error:
          "กรุณารอสักครู่ แล้วลองใหม่อีกครั้ง",
      },
      { status: 429 }
    )
  }

  const { searchParams } = new URL(req.url)

  const code =
    searchParams.get("code")?.trim()

  if (!apiKey) {
    return NextResponse.json(
      {
        error: "ระบบยังไม่พร้อมใช้งาน",
      },
      { status: 500 }
    )
  }

  if (!code) {
    return NextResponse.json(
      {
        error: "กรุณากรอก code ก่อน",
      },
      { status: 400 }
    )
  }

  const email = `bqst-${code}@lico.moe`

  try {
    const res = await fetch(
      "https://api.maily.space/v1/mails",
      {
        method: "POST",
        headers: {
  "Content-Type": "application/json",
  "User-Agent": "Mozilla/5.0",
  "Accept": "application/json",
},
        body: JSON.stringify({
          apiKey,
          email,
          size: 20,
          page: 1,
        }),
      }
    )

    if (!res.ok) {
  return NextResponse.json(
    { error: "Maily error", status: res.status, detail: await res.text() },
    { status: 502 }
  )
}

    const data = await res.json()

    const mails =
      data?.data?.mails ?? []

    const fifteenMinutesAgo =
      Date.now() - 15 * 60 * 1000

    const disneyMails = mails.filter(
      (mail: any) => {
        const text =
          `${mail.subject ?? ""} ${mail.from ?? ""} ${mail.text ?? ""}`.toLowerCase()

        if (!mail.createdAt) {
          return false
        }

        const mailTime = new Date(
          mail.createdAt
        ).getTime()

        if (Number.isNaN(mailTime)) {
          return false
        }

        const isDisney =
          text.includes("disney") ||
          text.includes("disneyplus") ||
          text.includes("disney+")

        const isRecent =
          mailTime >= fifteenMinutesAgo

        return isDisney && isRecent
      }
    )

    return NextResponse.json({
      items: disneyMails.map(
        (mail: any) => ({
          id: mail.id,
          subject: mail.subject,
          intro: mail.text || "",
          createdAt:
            mail.createdAt,
          from: {
            address: mail.from,
            name: "Disney+",
          },
        })
      ),
    })
  } catch {
    return NextResponse.json(
      {
        error:
          "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
      },
      { status: 500 }
    )
  }
}