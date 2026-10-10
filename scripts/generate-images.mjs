import { GoogleGenAI } from '@google/genai'
import { mkdir, writeFile } from 'node:fs/promises'

const client = new GoogleGenAI({
  apiKey: process.env.NETLIFY_AI_GATEWAY_KEY,
  httpOptions: { baseUrl: process.env.NETLIFY_AI_GATEWAY_BASE_URL?.replace(/\/$/, '') },
})

const scenes = [
  ['table', 'Wide editorial photograph, overhead three-quarter view of an abundant private chef dinner on an ivory linen tablecloth. A big handmade ivory ceramic platter of fresh burrata, red heirloom tomatoes and basil in the center foreground; plates of green herb salad, golden focaccia, hummus with olive oil, roasted aubergines, olives, small bowl of pomegranate, and a bottle of olive oil around it. Linen napkins, elegant stemmed glasses, silver cutlery, warm natural afternoon sunlight coming from left, subtle soft shadows, relaxed Mediterranean luxury. The food fills the frame edge to edge, food magazine photography, earthy authentic styling, landscape 16:9 composition. No people, no text, no letters, no watermark.'],
  ['israeli', 'Editorial food photograph, close overhead view of an ivory ceramic shallow bowl of creamy hummus with a generous golden olive oil swirl, paprika, fresh parsley and whole chickpeas, on a light beige stone surface, with charred pita and a small dish of olives at the edge. Warm directional natural light, sophisticated rustic styling, real appetizing textures, restrained olive and cream palette, square composition, no text, no people.'],
  ['italian', 'Editorial food photograph of handmade ribbon pasta with cherry tomatoes, basil and shaved parmesan in a rustic white ceramic shallow bowl, ivory linen table with a silver fork, small basil sprig. Close overhead view, rich warm natural afternoon light, real appetizing textures, sophisticated Italian slow-living food magazine styling, square composition, no text, no people.'],
  ['azerbaijani', 'Editorial food photograph of authentic Azerbaijani saffron rice plov with golden crispy gazmag crust pieces, dried apricots, raisins and chestnuts on an ivory ceramic platter, fresh herbs and pomegranate seeds to the side, beige linen backdrop. Overhead close view, warm natural window light, real appetizing textures, refined rustic food magazine styling, square composition, no text, no people.'],
]

await mkdir('public/img', { recursive: true })
await Promise.all(scenes.map(async ([name, prompt]) => {
  try {
    const response = await client.models.generateContent({
      model: 'gemini-3.1-flash-image',
      contents: prompt,
      config: { responseModalities: ['IMAGE'], imageConfig: { aspectRatio: name === 'table' ? '16:9' : '1:1' } },
    })
    const image = response.candidates?.[0]?.content?.parts?.find(part => part.inlineData?.data)?.inlineData
    if (!image?.data) throw new Error('Image was not returned')
    const extension = image.mimeType === 'image/jpeg' ? 'jpg' : 'png'
    await writeFile(`public/img/${name}.${extension}`, Buffer.from(image.data, 'base64'))
    console.log(`Saved ${name}.${extension}`)
  } catch {
    console.error(`Image generation failed for ${name}`)
    process.exitCode = 1
  }
}))
