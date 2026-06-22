const SKELETON_CARD_COUNT = 5;

export default function CategoryCardsSkeleton() {
  return (
    <>
      {Array.from({ length: SKELETON_CARD_COUNT }, (_, index) => (
        <div key={index} className="category-card-skeleton" aria-hidden />
      ))}
    </>
  );
}
