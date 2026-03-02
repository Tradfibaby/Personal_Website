import HelloWorld from './hello-world.mdx'
import BuildingInPublic from './building-in-public.mdx'

export const posts = [
  {
    slug: 'hello-world',
    title: 'Hello, World',
    date: '2026-03-02',
    description: 'First post. What this site is and what to expect.',
    component: HelloWorld,
  },
  {
    slug: 'building-in-public',
    title: 'Building in Public',
    date: '2026-03-01',
    description: 'On shipping things early and the value of public building.',
    component: BuildingInPublic,
  },
]
