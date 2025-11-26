# Web-bai-tin
Đây là trang web giúp mọi người có thể gửi gắm những thông điệp mà mình muốn nhân nhủ cho mọi người hoặc ghi lại kỉ niệm của bản thân hiện tại cho tương lai.
// Public version plan (Supabase + Next.js)
// File 1: next.config.js
module.exports = {
  reactStrictMode: true,
}

// File 2: utils/supabase.js
import { createClient } from '@supabase/supabase-js'
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// File 3: pages/index.js (Home: list entries)
import { supabase } from '../utils/supabase'
import Link from 'next/link'

export async function getServerSideProps() {
  const { data } = await supabase.from('memories').select('*').order('created_at', { ascending: false })
  return { props: { entries: data || [] } }
}

export default function Home({ entries }) {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-sky-700">Kỉ niệm thời học sinh</h1>
      <Link href="/new" className="text-sky-600 underline">Tạo kỉ niệm mới</Link>

      <div className="mt-6 space-y-4">
        {entries.map(e => (
          <div key={e.id} className="p-4 bg-white shadow rounded-xl">
            <h2 className="text-xl font-semibold">{e.name}</h2>
            <div className="text-sm text-slate-500">Tuổi: {e.age} • {new Date(e.created_at).toLocaleString()}</div>
            <p className="mt-2 whitespace-pre-wrap">{e.text}</p>
            {e.image_url && <img src={e.image_url} className="mt-3 rounded" />}
          </div>
        ))}
      </div>
    </div>
  )
}

// File 4: pages/new.js (Create entry)
import { useState } from 'react'
import { supabase } from '../utils/supabase'
import { useRouter } from 'next/router'

export default function NewEntry() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [text, setText] = useState('')
  const [file, setFile] = useState(null)

  async function submit() {
    let image_url = null
    if (file) {
      const fileName = `${Date.now()}-${file.name}`
      const { data } = await supabase.storage.from('images').upload(fileName, file)
      const publicURL = supabase.storage.from('images').getPublicUrl(fileName).data.publicUrl
      image_url = publicURL
    }

    await supabase.from('memories').insert({ name, age, text, image_url })
    router.push('/')
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-sky-700">Thêm kỉ niệm</h1>

      <div className="mt-4 space-y-3">
        <input className="border p-2 w-full" placeholder="Tên" value={name} onChange={e => setName(e.target.value)} />
        <input className="border p-2 w-full" placeholder="Tuổi" value={age} onChange={e => setAge(e.target.value)} />
        <textarea className="border p-2 w-full" rows={6} placeholder="Nội dung" value={text} onChange={e => setText(e.target.value)} />
        <input type="file" onChange={e => setFile(e.target.files[0])} />
        <button onClick={submit} className="px-4 py-2 bg-sky-600 text-white rounded">Lưu</button>
      </div>
    </div>
  )
}

// File 5: SQL for Supabase
/*
create table memories (
  id bigint generated always as identity primary key,
  name text,
  age text,
  text text,
  image_url text,
  created_at timestamp default now()
);
*/
