import BlogCard, { type BlogCardData } from "./BlogCard";

interface ConseilsListProps {
  posts: BlogCardData[];
  standalone?: boolean;
}

export default function ConseilsList({ posts, standalone }: ConseilsListProps) {
  if (!posts?.length) {
    return (
      <section className={standalone ? "" : "bg-gray-50 px-4 py-16 sm:px-6"}>
        <div className={standalone ? "" : "mx-auto max-w-6xl"}>
          {!standalone && (
            <h2 className="font-heading text-2xl font-bold text-primary sm:text-3xl">
              Conseils
            </h2>
          )}
          <p className={standalone ? "text-gray-text" : "mt-4 text-gray-text"}>
            Aucun conseil pour le moment.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className={standalone ? "" : "bg-gray-50 px-4 py-16 sm:px-6"}>
      <div className={standalone ? "" : "mx-auto max-w-6xl"}>
        {!standalone && (
          <>
            <h2 className="font-heading text-2xl font-bold text-primary sm:text-3xl">
              Conseils
            </h2>
            <p className="mt-2 text-gray-text">
              Entretien et bonnes pratiques pour éviter pannes et remplacements inutiles.
            </p>
          </>
        )}
        <div className={standalone ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3" : "mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"}>
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} baseHref="/conseils" />
          ))}
        </div>
      </div>
    </section>
  );
}
