import Head from 'next/head'
import Header from './../components/Header'
import { sanityClient, urlFor } from '../sanity'
import { Post } from '../types'
import { GetServerSideProps } from 'next'
import Link from 'next/link'

interface Props {
  posts: Post[]
}

export default function Home({ posts }: Props) {
  return (
    <div className="">
      <Head>
        <title>Medium Blog</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <main className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between border-y border-black bg-yellow-400 py-10 lg:py-0">
          <div className="mx-10 space-y-5">
            <h1 className="max-w-xl text-6xl">
              <span className="underline decoration-black decoration-4">
                Medium
              </span>{' '}
              is a place to write, read, and connect
            </h1>
            <h2>
              It's easy and free to post your thinking on any topic and connect
              with millions of readers
            </h2>
          </div>
          <img
            className="hidden h-44 md:inline-flex lg:h-full"
            src="https://amitshekhar.me/img/medium.png"
            alt=""
          />
        </div>

        {/* posts */}
        <div className="grid grid-cols-1 gap-3 p-2 md:grid-cols-2 md:gap-6 md:p-6 lg:grid-cols-3">
          {posts.map((post) => (
            <Link key={post._id} href={`/post/${post.slug.current}`}>
              <div className="group = cursor-pointer overflow-hidden rounded-lg border">
                {post.mainImage && (
                  <img
                    className="h-60 w-full transform object-cover transition duration-200 group-hover:scale-105 "
                    src={urlFor(post.mainImage).url()!}
                    alt=""
                  />
                )}
                <div className="flex justify-between bg-white p-5">
                  <p className="text-lg font-bold">{post.title}</p>
                  <p className="text-sm">
                    {post.description} by {post.author.name}
                  </p>
                </div>
                {post.author.image && (
                  <img
                    className="mx-4 my-3 h-12 rounded-full"
                    src={urlFor(post.author.image).url()!}
                    alt=""
                  />
                )}
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const query = `
      *[_type == 'post']{
        _id,
        title,
        slug,
        author -> {
        name,
        image
      },
      description,
      mainImage
      }
  `
  const posts = await sanityClient.fetch(query)

  return {
    props: {
      posts,
    },
  }
}
