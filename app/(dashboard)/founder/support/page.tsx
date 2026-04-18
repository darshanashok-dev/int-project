'use client'

import { HelpCircle, MessageCircle, FileText, Search, Mail, ArrowRight } from 'lucide-react'

const SUPPORT_TOPICS = [
  { name: 'Documentation', desc: 'Read guides and platform documentation.', icon: FileText },
  { name: 'Community', desc: 'Discuss with other founders and mentors.', icon: MessageCircle },
  { name: 'Contact Support', desc: 'Get in touch with our help desk.', icon: Mail },
]

export default function SupportPage() {
  return (
    <div className="max-w-4xl space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-extrabold text-[#202124] tracking-tight italic">How can we assist you, Alex?</h1>
        <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
          Access specialized support resources or reach out to our team of incubation experts.
        </p>
      </div>

      <div className="relative max-w-2xl mx-auto">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground" />
        <input 
          type="text" 
          placeholder="Search for answers or resources..." 
          className="w-full h-16 pl-16 pr-6 bg-white rounded-[2rem] border border-border shadow-sm focus:ring-4 focus:ring-black/5 text-lg font-medium transition-all"
        />
      </div>

      <div className="grid grid-cols-3 gap-8">
        {SUPPORT_TOPICS.map((topic) => (
          <div 
            key={topic.name}
            className="bg-white border border-border rounded-[2.5rem] p-10 text-center hover:shadow-xl transition-all cursor-pointer group"
          >
            <div className="w-16 h-16 bg-[#f1f3f4] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:bg-black group-hover:text-white transition-all">
              <topic.icon className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-extrabold text-[#202124] mb-2">{topic.name}</h4>
            <p className="text-xs font-medium text-muted-foreground leading-relaxed">{topic.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#202124] text-white rounded-[3rem] p-12 flex items-center justify-between relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-3xl font-black italic mb-4">Urgent Inquiry?</h3>
          <p className="text-gray-400 font-medium max-w-md">Our premium support team is available 24/7 for Series A+ ventures.</p>
          <button className="mt-8 px-10 py-4 bg-white text-black rounded-2xl font-black text-sm hover:bg-gray-200 transition-all flex items-center gap-2">
            Priority Access
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
        <HelpCircle className="absolute -bottom-10 -right-10 w-64 h-64 text-white/5 -rotate-12" />
      </div>
    </div>
  )
}
