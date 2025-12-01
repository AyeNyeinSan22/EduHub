export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center w-full py-10">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-orange-500 border-solid"></div>
    </div>
  );
}
