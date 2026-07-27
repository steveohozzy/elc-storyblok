"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";

import Link from "next/link";
import Image from "next/image";

export default function BlogFilters({ posts }) {
  const searchParams = useSearchParams();
  const filterRef = useRef(null);
  const postsRef = useRef(null);

  // initial state from URL only once
  const [selected, setSelected] = useState(
    () => searchParams.get("category") || "All"
  );

  const [currentPage, setCurrentPage] = useState(1);

  const POSTS_PER_PAGE = 12;

  // scroll only
  useEffect(() => {
    const category =
      searchParams.get("category") || "All";

    if (
      category !== "All" &&
      filterRef.current
    ) {
      setTimeout(() => {
        filterRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  }, [searchParams]);

  const categories = [
    "All",
    ...new Set(
      posts.flatMap(
        p => p.content.category || []
      )
    )
  ];

  const filtered =
    selected === "All"
      ? posts
      : posts.filter(
          p =>
            p.content.category?.includes(
              selected
            )
        );

  const totalPages = Math.ceil(
    filtered.length / POSTS_PER_PAGE
  );

  const paginatedPosts = filtered.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  const changePage = (page) => {
    setCurrentPage(page);

    setTimeout(() => {
      postsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 50);
  };

  return (
    <>
      <div
        ref={filterRef}
        className="mb-8 flex flex-wrap gap-3 scroll-mt-28"
      >
        {categories.map(category => (
          <button
            key={category}
            onClick={() => {
              setSelected(category);
              setCurrentPage(1);
            }}
            className={`
              rounded-full
              px-4
              py-2
              transition-all
              cursor-pointer
              ${
                selected === category
                  ? "bg-primary text-white"
                  : "border hover:bg-muted"
              }
            `}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Blog cards */}
      <div
      ref={postsRef}
      className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {paginatedPosts.map((post) => (
          <article
            key={post.uuid}
            className="
              group overflow-hidden
              rounded-[2rem]
              border border-border
              bg-card
              transition-all
              hover:-translate-y-1
              hover:shadow-xl
            "
          >
            <Link href={`/${post.full_slug}`}>
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={
                    post.content.featuredImage?.filename ||
                    "/images/placeholder.jpg"
                  }
                  alt={
                    post.content.title ||
                    "Blog image"
                  }
                  fill
                  sizes="(max-width:768px) 100vw, 33vw"
                  className="
                    object-cover
                    transition-transform
                    duration-500
                    group-hover:scale-105
                  "
                />

                {post.content.category?.[0] && (
                  <span
                    className="
                      absolute left-4 top-4
                      rounded-full
                      bg-background/90
                      px-3 py-1
                      text-xs font-semibold
                      backdrop-blur
                    "
                  >
                    {post.content.category[0]}
                  </span>
                )}
              </div>

              <div className="flex flex-col p-6">
                <div>
                  <h3 className="font-heading text-xl font-semibold">
                    {post.content.title}
                  </h3>

                  {post.content.excerpt && (
                    <p className="mt-3 line-clamp-3 text-muted-foreground">
                      {post.content.excerpt}
                    </p>
                  )}
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                  <span className="text-sm text-muted-foreground">
                    {post.content.readLength || "5 min"} read
                  </span>

                  <span
                    className="
                      flex size-9 items-center justify-center
                      rounded-full
                      bg-muted
                      transition-colors
                      group-hover:bg-primary
                      group-hover:text-primary-foreground
                    "
                  >
                    →
                  </span>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
      <div className="mt-10 flex justify-center gap-2">
        {Array.from(
          { length: totalPages },
          (_, i) => i + 1
        ).map(page => (
          <button
            key={page}
            onClick={() => changePage(page)}
            className={`rounded-full px-4 py-2 cursor-pointer transition-all ${
              currentPage === page
                ? "bg-primary text-white"
                : "border"
            }`}
          >
            {page}
          </button>
        ))}
      </div>
    </>
  );
}