'use client'

import { Mail, Phone, Globe, Shield, Clock, MapPin } from 'lucide-react'

export default function SupportPage() {
  const contactInfo = [
    {
      icon: Mail,
      label: 'Email Support',
      value: 'success@polarisventure.com',
      description: 'Typical response time: < 2 hours',
      color: 'bg-blue-500/10 text-blue-600'
    },
    {
      icon: Phone,
      label: 'Priority Line',
      value: '+1 (888) POLARIS',
      description: 'For urgent capital inquiries',
      color: 'bg-purple-500/10 text-purple-600'
    }
  ]

  return (
    <div className="max-w-3xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
          <Shield className="w-3 h-3" />
          Polaris Priority Support
        </div>
        <h1 className="text-5xl font-extrabold text-foreground tracking-tight">How can we help your venture?</h1>
        <p className="text-lg text-muted-foreground font-medium max-w-2xl mx-auto">
          Our Success Team is dedicated to helping you navigate the funding landscape and maximize your growth velocity.
        </p>
      </div>

      {/* Contact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {contactInfo.map((item, i) => (
          <div key={i} className="bg-card border border-border rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
            <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              <item.icon className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-black text-muted-foreground uppercase tracking-widest mb-2">{item.label}</h3>
            <p className="text-lg font-bold text-foreground mb-2">{item.value}</p>
            <p className="text-xs text-muted-foreground font-medium">{item.description}</p>
          </div>
        ))}
      </div>

      {/* Additional Details Section */}
      <div className="bg-card border border-border rounded-[3rem] p-10 shadow-sm space-y-12">
        <div className="space-y-6">
          <h2 className="text-3xl font-black text-foreground tracking-tight">Venture Success Hub</h2>
          <div className="space-y-4">
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-foreground" />
              </div>
              <div>
                <p className="font-bold text-foreground">Global Coverage</p>
                <p className="text-sm text-muted-foreground font-medium">24/7 Monitoring for critical infrastructure and funding gateways.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-foreground" />
              </div>
              <div>
                <p className="font-bold text-foreground">Headquarters</p>
                <p className="text-sm text-muted-foreground font-medium">Innovation Plaza, 500 Silicon Way, Palo Alto, CA.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center shrink-0">
                <Globe className="w-5 h-5 text-foreground" />
              </div>
              <div>
                <p className="font-bold text-foreground">Knowledge Base</p>
                <p className="text-sm text-muted-foreground font-medium">Access our extensive library of fundraising playbooks and legal templates.</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Footer Note */}
      <p className="text-center text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] opacity-50">
        Polaris Platform v2.4 • Enterprise Support Active
      </p>
    </div>
  )
}
