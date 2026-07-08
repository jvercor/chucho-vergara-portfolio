import React from 'react'
import type { Certification } from '@/payload-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCertificate } from '@fortawesome/free-solid-svg-icons'

export function CertificationList({ certifications }: { certifications: Certification[] }) {
  if (certifications.length === 0) return null

  return (
    <div className="glass-card border border-border/40 bg-card/80 rounded-xl p-8">
      <h2 className="font-label-caps text-label-caps text-foreground mb-6">CERTIFICATIONS</h2>

      <div className="space-y-4">
        {certifications.map((cert) => (
          <div key={cert.id} className="flex items-start gap-4">
            <FontAwesomeIcon icon={faCertificate} className="w-4 h-4 mt-1 text-neon-pink shrink-0" />
            <div>
              <p className="text-body-sm font-bold text-foreground">{cert.title}</p>
              <p className="text-body-sm text-muted-foreground">{cert.institution}</p>
              {cert.note && (
                <p className="text-body-sm text-muted-foreground">{cert.note}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
