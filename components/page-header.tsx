import type { ReactNode } from "react"
import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

type Crumb = {
  label: string
  href?: string
}

type Props = {
  title: string
  description?: string
  crumbs?: Crumb[]
  actions?: ReactNode
  tag?: string
}

export function PageHeader({ title, description, crumbs, actions, tag }: Props) {
  return (
    <div style={{
      background: "linear-gradient(90deg,#0b1629 0%,#0d2347 100%)",
      padding: "28px 0 32px",
      marginBottom: 32,
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        {/* Breadcrumbs */}
        {crumbs && crumbs.length > 0 && (
          <div style={{ marginBottom: 12 }}>
            <Breadcrumb>
              <BreadcrumbList>
                {crumbs.map((c, i) => {
                  const isLast = i === crumbs.length - 1
                  return (
                    <div key={i} className="flex items-center gap-2">
                      <BreadcrumbItem>
                        {isLast || !c.href ? (
                          <BreadcrumbPage style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>{c.label}</BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink asChild>
                            <Link href={c.href} style={{ color: "#00c2e0", fontSize: 13, textDecoration: "none" }}>{c.label}</Link>
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                      {!isLast && <BreadcrumbSeparator style={{ color: "rgba(255,255,255,0.3)" }} />}
                    </div>
                  )
                })}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        )}

        {tag && (
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "rgba(0,194,224,0.1)", border: "1px solid rgba(0,194,224,0.25)",
            borderRadius: 20, padding: "3px 12px", marginBottom: 12,
          }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#00c2e0" }} />
            <span style={{ color: "#00c2e0", fontSize: 10, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase" }}>{tag}</span>
          </div>
        )}

        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
          <div>
            <h1 style={{ color: "#fff", fontSize: 26, fontWeight: 800, marginBottom: 6, letterSpacing: -0.3 }}>{title}</h1>
            {description && (
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14 }}>{description}</p>
            )}
          </div>
          {actions && (
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10 }}>
              {actions}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
