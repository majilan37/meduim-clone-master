import { GetStaticProps } from 'next'
import { useState } from 'react'
import Header from '../../components/Header'
import { sanityClient, urlFor } from '../../sanity'
import { Post } from '../../types'
import PortableText from 'react-portable-text'
import { useForm, SubmitHandler } from 'react-hook-form'

interface PostProps {
  post: Post
}

interface IFormInput {
  _id: string
  name: string
  email: string
  message: string
  comment: string
}

export default function PostSlug({ post }: PostProps) {
  const [submitted, setSubmitted] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>()

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    fetch('/api/createComment', {
      method: 'POST',
      body: JSON.stringify(data),
    })
      .then(() => setSubmitted(true))
      .then(() => {
        setTimeout(() => {
          setSubmitted(false)
        }, 5000)
      })
      .catch((errs) => console.log(errs))
  }
  return (
    <main>
      <Header />
      {post.mainImage && (
        <img
          className="h-40 w-full object-cover"
          src={urlFor(post.mainImage).url()!}
          alt=""
        />
      )}
      <article className="mx-auto max-w-3xl p-5">
        <h1 className="mt-10 mb-3 text-3xl">{post.title}</h1>
        <h2 className="mb-2 text-xl font-light text-gray-500">
          {post.description}
        </h2>
        <div className="flex items-center space-x-2">
          {post.author.image && (
            <img
              className="h-10 w-10 rounded-full"
              src={urlFor(post.author.image).url()!}
              alt=""
            />
          )}
          <p className="text-xs font-extralight">
            Blog by{' '}
            <span className="font-medium text-green-600">
              {post.author.name}
            </span>{' '}
            - Published at {new Date(post._createdAt).toLocaleString()}
          </p>
        </div>
        <div className="mt-10">
          <PortableText
            className=""
            dataset={process.env.NEXT_PUBLIC_SANITY_DATASET}
            projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}
            content={post.body}
            serializers={{
              h1: (props: any) => (
                <h1 className="my-3 text-2xl font-bold" {...props} />
              ),
              h2: ({ children }: any) => (
                <h2 className="my-3 text-2xl font-bold">{children}</h2>
              ),
              li: ({ children }: any) => (
                <li className="ml-4 list-disc">{children}</li>
              ),
              link: ({ href, children }: any) => (
                <a href={href} className="text-blue-500">
                  {children}
                </a>
              ),
            }}
          />
        </div>
      </article>
      <hr className="my-5 mx-auto max-w-lg border-yellow-500" />
      {submitted && (
        <div className="mx-auto flex max-w-2xl flex-col bg-yellow-500 p-10 text-white">
          <h1 className="text-3xl">Thank you for submitting</h1>
          <p>Once it has been approved it will show below </p>
        </div>
      )}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="my-10 mx-auto mb-10 flex max-w-2xl flex-col p-5"
      >
        <input type="hidden" {...register('_id')} name="_id" value={post._id} />
        <h3 className="text-sm text-yellow-500">Enjoyed this article ?</h3>
        <h4 className="text-3xl font-bold">Leave a comment below!</h4>
        <hr className="mt-2 py-3" />
        <label className="mb-5 block">
          <span className="text-gray-700">Name</span>
          <input
            {...register('name', { required: true })}
            name="name"
            type="text"
            className="form-input mt-1 block w-full rounded border py-2 px-3 shadow-sm outline-none ring-yellow-500 transition-all duration-200 focus:ring"
            placeholder="Name"
          />
        </label>
        <label className="mb-5 block">
          <span className="text-gray-700">Email</span>
          <input
            {...register('email', { required: true })}
            name="email"
            type="text"
            className="form-input mt-1 block w-full rounded border py-2 px-3 shadow-sm outline-none ring-yellow-500 transition-all duration-200 focus:ring"
            placeholder="Email"
          />
        </label>
        <label className="mb-5 block">
          <span className="text-gray-700">Comment</span>
          <textarea
            {...register('comment', { required: true })}
            name="comment"
            className="form-textarea mt-1 block w-full rounded border py-2 px-3 shadow-sm outline-none ring-yellow-500 transition-all duration-200 focus:ring"
            rows={8}
          ></textarea>
        </label>
        <div className="flex flex-col p-5">
          {errors.name && (
            <span className="text-red-500">The Name Field is required</span>
          )}
          {errors.email && (
            <span className="text-red-500">The Email Field is required</span>
          )}
          {errors.comment && (
            <span className="text-red-500">The Comment Field is required</span>
          )}
        </div>
        <input
          type="submit"
          className="cursor-pointer rounded bg-yellow-500 py-2 px-4 font-bold text-white shadow outline-none hover:bg-yellow-400 focus:shadow-sm"
          value={'Submit'}
        />
      </form>
      <div className="my-10 mx-auto flex max-w-2xl flex-col space-y-2  p-10 shadow shadow-yellow-400">
        <h3 className="text-4xl">Comments</h3>
        <hr className="pb-2" />
        {post.comments.map((comment) => (
          <div key={comment._id} className="">
            <p>
              <span className="text-yellow-500">{comment.name}</span>:
              {comment.comment}
            </p>
          </div>
        ))}
      </div>
    </main>
  )
}

export async function getStaticPaths() {
  const query = `
    *[_type == 'post']{
      _id,
      slug{
      current
      }
    }
  `

  const posts = await sanityClient.fetch(query)

  const paths = posts.map((post: Post) => ({
    params: {
      slug: post.slug.current,
    },
  }))

  return {
    paths,
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  // 'comments': *[
  //   _type:'comment' &&
  //   post._ref == ^._id &&
  //   approved == true
  // ],
  const query = `
    *[_type == 'post' && slug.current == $slug ][0]{
      _id,
      _createdAt,
      title,
      author -> {
      name,
      image
    },
    'comments': *[
      _type =='comment' && 
      post._ref == ^._id && 
      approved == true
    ],
    description,
    mainImage,
    slug,
    body
    }
  `
  const post = await sanityClient.fetch(query, {
    slug: params?.slug,
  })

  if (!post)
    return {
      notFound: true,
    }

  return {
    props: {
      post,
    },
    revalidate: 60,
  }
}
