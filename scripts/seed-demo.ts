import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error("❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment.")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  db: { schema: 'public' }
})

async function getOrCreateUser(email: string, role: string, fullName: string) {
  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()
  if (listError) throw listError
  
  const existing = users?.find(u => u.email === email)
  if (existing) {
    console.log(`👤 User already exists: ${email}`)
    return existing.id
  }
  
  const { data: { user }, error: createError } = await supabase.auth.admin.createUser({
    email,
    password: 'password',
    email_confirm: true,
    user_metadata: { role, full_name: fullName }
  })
  if (createError) throw createError
  console.log(`✨ Created user: ${email}`)
  return user!.id
}

async function run() {
  console.log("🌱 Starting demo data seeding...")

  try {
    // 1. Get or Create Users
    const adminId = await getOrCreateUser('admin@polaris.com', 'admin', 'Admin User')
    const founderId = await getOrCreateUser('founder@polaris.com', 'founder', 'Founder User')
    const mentorId = await getOrCreateUser('mentor@polaris.com', 'mentor', 'Mentor User')
    const investorId = await getOrCreateUser('investor@polaris.com', 'investor', 'Investor User')
    const managerId = await getOrCreateUser('manager@polaris.com', 'manager', 'Manager User')

    // 2. Programs
    const programData = {
      name: "Cohort 2025 — Spring",
      cohort: "2025-spring",
      start_date: "2025-01-15",
      end_date: "2025-06-30",
      demo_day_date: "2025-06-28T18:00:00Z",
      max_startups: 10,
      manager_id: managerId
    }

    const { data: existingProg } = await supabase.from('programs').select('id').eq('cohort', '2025-spring')
    let programId: string
    if (existingProg && existingProg.length > 0) {
      programId = existingProg[0].id
      await supabase.from('programs').update(programData).eq('id', programId)
      console.log(`📅 Updated Program: ${programData.name}`)
    } else {
      const { data: newProg, error } = await supabase.from('programs').insert(programData).select('id').single()
      if (error) throw error
      programId = (newProg as any).id
      console.log(`📅 Created Program: ${programData.name}`)
    }

    // 3. Startups
    const startupsToSeed = [
      { name: "AgriSense", sector: "AgriTech", stage: "seed", status: "active", target_market: "Small-scale Indian farmers", revenue_model: "SaaS subscription + data licensing", founder_id: founderId },
      { name: "MedLoop", sector: "HealthTech", stage: "pre-seed", status: "active", target_market: "Tier-2 city clinics", revenue_model: "Per-patient transaction fee", founder_id: founderId },
      { name: "EduBridge", sector: "EdTech", stage: "mvp", status: "active", target_market: "First-generation college students", revenue_model: "Freemium + institutional licensing", founder_id: founderId }
    ]

    const startupIds: Record<string, string> = {}
    for (const s of startupsToSeed) {
      const { data: existingS } = await supabase.from('startups').select('id').eq('name', s.name)
      if (existingS && existingS.length > 0) {
        const id = existingS[0].id
        await supabase.from('startups').update(s).eq('id', id)
        startupIds[s.name] = id
        console.log(`🚀 Updated Startup: ${s.name}`)
      } else {
        const { data: newS, error } = await supabase.from('startups').insert(s).select('id').single()
        if (error) throw error
        const id = (newS as any).id
        startupIds[s.name] = id
        console.log(`🚀 Created Startup: ${s.name}`)
      }
    }

    // 4. Milestones
    const milestoneTemplates = [
      { title: "MVP Launch", status: "completed", due_date: "2025-02-15", completed_at: "2025-02-14T10:00:00Z" },
      { title: "First 10 Users", status: "completed", due_date: "2025-03-15", completed_at: "2025-03-12T15:00:00Z" },
      { title: "Investor Pitch Deck", status: "in_progress", due_date: "2025-04-30" },
      { title: "Demo Day Ready", status: "pending", due_date: "2025-06-15" }
    ]

    for (const [sName, sId] of Object.entries(startupIds)) {
      for (const temp of milestoneTemplates) {
        const mData = { ...temp, startup_id: sId }
        const { data: existingM } = await supabase.from('milestones').select('id').eq('startup_id', sId).eq('title', temp.title)
        if (existingM && existingM.length > 0) {
          await supabase.from('milestones').update(mData).eq('id', existingM[0].id)
          console.log(`🎯 Updated Milestone: ${temp.title} for ${sName}`)
        } else {
          const { error } = await supabase.from('milestones').insert(mData)
          if (error) throw error
          console.log(`🎯 Created Milestone: ${temp.title} for ${sName}`)
        }
      }
    }

    // 5. Mentors
    const mentorData = { 
      user_id: mentorId, 
      expertise: "SaaS, Scaling, Product Development", 
      bio: "Serial entrepreneur and investor with 15+ years of experience." 
    }
    const { data: existingMentor } = await supabase.from('mentors').select('id').eq('user_id', mentorId)
    let dbMentorId: string
    if (existingMentor && existingMentor.length > 0) {
      dbMentorId = existingMentor[0].id
      await supabase.from('mentors').update(mentorData).eq('id', dbMentorId)
      console.log(`👥 Updated Mentor Profile`)
    } else {
      const { data: newMentor, error } = await supabase.from('mentors').insert(mentorData).select('id').single()
      if (error) throw error
      dbMentorId = (newMentor as any).id
      console.log(`👥 Created Mentor Profile`)
    }

    // 6. Sessions
    const sessionTemplates = [
      { notes: "Reviewed current tech stack and scalability plans.", feedback: "Great foundation, focus on caching and DB indexes.", rating: 5, status: "completed", action_items: "1. Add Redis caching\n2. Optimize query indexes\n3. Set up load testing" },
      { notes: "Refined target customer personas and marketing channels.", feedback: "Clear value proposition, but narrow down the initial market segment.", rating: 4, status: "completed", action_items: "1. Launch landing page MVP\n2. Run target Linkedin ads\n3. Schedule 5 feedback calls" }
    ]

    for (const [sName, sId] of Object.entries(startupIds)) {
      for (const temp of sessionTemplates) {
        const sessData = {
          ...temp,
          startup_id: sId,
          mentor_id: dbMentorId,
          scheduled_at: "2025-03-10T11:00:00Z"
        }
        const { data: existingSess } = await supabase.from('sessions').select('id').eq('startup_id', sId).eq('notes', temp.notes)
        if (existingSess && existingSess.length > 0) {
          await supabase.from('sessions').update(sessData).eq('id', existingSess[0].id)
          console.log(`📞 Updated Session for ${sName}`)
        } else {
          const { error } = await supabase.from('sessions').insert(sessData)
          if (error) throw error
          console.log(`📞 Created Session for ${sName}`)
        }
      }
    }

    // 7. Funding
    const fundingTemplates: Record<string, { type: string, amount: number, status: string, date: string, source: string }[]> = {
      "AgriSense": [
        { type: "Government Grant", amount: 500000, status: "received", date: "2025-01-20", source: "Ministry of Agriculture" },
        { type: "Seed Round", amount: 1500000, status: "pending", date: "2025-05-15", source: "Venture Fund A" }
      ],
      "MedLoop": [
        { type: "Innovation Grant", amount: 300000, status: "received", date: "2025-02-10", source: "Health Innovation Hub" }
      ],
      "EduBridge": [
        { type: "Angel Round", amount: 750000, status: "received", date: "2025-03-01", source: "Angel Network" }
      ]
    }

    for (const [sName, sId] of Object.entries(startupIds)) {
      const rounds = fundingTemplates[sName] || []
      for (const r of rounds) {
        const fundData = { ...r, startup_id: sId }
        const { data: existingFund } = await supabase.from('funding').select('id').eq('startup_id', sId).eq('type', r.type)
        if (existingFund && existingFund.length > 0) {
          await supabase.from('funding').update(fundData).eq('id', existingFund[0].id)
          console.log(`💰 Updated Funding Round: ${r.type} for ${sName}`)
        } else {
          const { error } = await supabase.from('funding').insert(fundData)
          if (error) throw error
          console.log(`💰 Created Funding Round: ${r.type} for ${sName}`)
        }
      }
    }

    // 8. Events
    const eventsToSeed = [
      { title: "Mid-Cohort Review", type: "review", date: "2025-03-20T10:00:00Z", program_id: programId },
      { title: "Demo Day 2025", type: "demo_day", date: "2025-06-28T14:00:00Z", program_id: programId }
    ]

    for (const ev of eventsToSeed) {
      const { data: existingEv } = await supabase.from('events').select('id').eq('title', ev.title)
      if (existingEv && existingEv.length > 0) {
        await supabase.from('events').update(ev).eq('id', existingEv[0].id)
        console.log(`🎉 Updated Event: ${ev.title}`)
      } else {
        const { error } = await supabase.from('events').insert(ev)
        if (error) throw error
        console.log(`🎉 Created Event: ${ev.title}`)
      }
    }

    console.log("✅ Seed complete")
  } catch (error) {
    console.error("❌ Seeding failed with error:", error)
    process.exit(1)
  }
}

run()
